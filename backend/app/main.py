import uuid
from datetime import datetime, timezone

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://chai-street-trading-ten.vercel.app",
        "https://chaistreet.ai",
        "https://www.chaistreet.ai",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_scheme = HTTPBearer()


# ---------- STARTUP ----------
@app.on_event("startup")
def _startup():
    init_db()


# ---------- HEALTH ----------
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


# ---------- AUTH ----------
def get_current_user(creds: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> dict:
    try:
        return decode_token(creds.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


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
    user_id = user.get("sub")

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
    user_id = state.strip()

    print("DISCORD CALLBACK HIT")
    print("CODE:", repr(code))
    print("STATE:", repr(state))

    # 1️⃣ Exchange code for access token
    try:
        token_json = exchange_code(code)
    except Exception as e:
        print("Discord exchange error:", e)
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?discord=exchange_failed")

    access_token = token_json.get("access_token")
    if not access_token:
        print("No access_token returned:", token_json)
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?discord=no_access_token")

    # 2️⃣ Get discord user info
    try:
        duser = discord_get_user(access_token)
    except Exception as e:
        print("Discord get_user error:", e)
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?discord=user_failed")

    discord_user_id = duser.get("id")
    if not discord_user_id:
        print("Discord user missing ID:", duser)
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?discord=no_user_id")

    discord_username = (
        f'{duser["username"]}#{duser["discriminator"]}'
        if duser.get("discriminator")
        else duser["username"]
    )

    # 3️⃣ Add user to guild
    try:
        add_to_guild(discord_user_id, access_token)
    except Exception as e:
        print("Discord add_to_guild error:", e)
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?discord=guild_join_failed")

    # 4️⃣ Update DB
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT tier FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()

    if not row:
        conn.close()
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?discord=invalid_state")

    tier = row["tier"]

    cur.execute(
        "UPDATE users SET discord_user_id=?, discord_username=? WHERE id=?",
        (discord_user_id, discord_username, user_id),
    )

    conn.commit()
    conn.close()

    # 5️⃣ Assign role
    try:
        add_role(discord_user_id, role_for_tier(tier))
    except Exception as e:
        print("Discord role error:", e)

    # 6️⃣ Redirect back to frontend
    return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?discord=success")
