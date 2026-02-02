from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
import uuid

from .db import init_db, get_conn
from .security import hash_password, verify_password, create_token, decode_token
from .config import FRONTEND_URL
from .discord_api import (
    oauth_url,
    exchange_code,
    get_user as discord_get_user,
    role_for_tier,
    add_role,
    add_to_guild,
)

# ---------- APP ----------
app = FastAPI(title="Chaistreet API")

print("CORS FRONTEND_URL =", FRONTEND_URL)  # debug (remove later)

# ---------- CORS (FINAL FIX) ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # ✅ allow all
    allow_credentials=False,    # ✅ required with "*"
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- AUTH ----------
# 🔥 IMPORTANT: auto_error=False to allow OPTIONS (preflight)
auth_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(auth_scheme),
) -> dict:
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        return decode_token(creds.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------- STARTUP ----------
@app.on_event("startup")
def _startup():
    init_db()

@app.get("/health")
def health():
    return {"ok": True}

# ---------- MODELS ----------
class SignupIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)
    age_group: str
    trading_expertise: str
    focus_areas: list[str]

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)

# ---------- AUTH ROUTES ----------
@app.post("/auth/signup")
def signup(data: SignupIn):
    email = data.email.lower().strip()

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    cur.execute(
        """
        INSERT INTO users (
            id, email, password_hash,
            first_name, last_name,
            age_group, trading_expertise,
            focus_areas, tier, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'FREE', ?)
        """,
        (
            user_id,
            email,
            hash_password(data.password),
            data.first_name,
            data.last_name,
            data.age_group,
            data.trading_expertise,
            ",".join(data.focus_areas),
            now,
        ),
    )

    conn.commit()
    conn.close()

    return {"token": create_token(user_id)}

@app.post("/auth/login")
def login(data: LoginIn):
    email = data.email.lower().strip()

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    conn.close()

    if not row or not verify_password(data.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"token": create_token(row["id"])}

@app.get("/me")
def me(user=Depends(get_current_user)):
    user_id = user["sub"]

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT
            id, email, first_name, last_name,
            age_group, trading_expertise,
            focus_areas, tier,
            discord_user_id, discord_username
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return dict(row)

# ---------- DISCORD ----------
@app.get("/discord/oauth/url")
def discord_oauth_start(user=Depends(get_current_user)):
    return {"url": oauth_url(user["sub"])}

@app.get("/discord/callback")
def discord_callback(code: str, state: str):
    user_id = state

    # 1️⃣ exchange code
    token_json = exchange_code(code)
    access_token = token_json["access_token"]

    # 2️⃣ get discord user
    duser = discord_get_user(access_token)
    discord_user_id = duser["id"]
    discord_username = (
        f'{duser["username"]}#{duser["discriminator"]}'
        if duser.get("discriminator")
        else duser["username"]
    )

    # 3️⃣ add to guild
    add_to_guild(discord_user_id, access_token)

    # 4️⃣ update DB
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT tier FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid state")

    tier = row["tier"]

    cur.execute(
        "UPDATE users SET discord_user_id=?, discord_username=? WHERE id=?",
        (discord_user_id, discord_username, user_id),
    )
    conn.commit()
    conn.close()

    # 5️⃣ assign role
    try:
        add_role(discord_user_id, role_for_tier(tier))
    except Exception as e:
        print("Discord role error:", e)

    # 6️⃣ redirect to frontend
    return RedirectResponse(url=f"{FRONTEND_URL}/dashboard")
