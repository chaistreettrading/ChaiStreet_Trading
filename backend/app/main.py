import os
from pathlib import Path
from dotenv import load_dotenv

# # 🔥 LOAD ENV FIRST
# env_path = Path(__file__).resolve().parents[1] / ".env"
# load_dotenv(env_path)

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
import uuid


from sqlalchemy.orm import Session
from .db import engine, get_db
from .models import Base, User
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

# ---------- ENV ----------

# print("ENV CHECK CLIENT ID:", os.getenv("DISCORD_CLIENT_ID"))


# print("DISCORD_CLIENT_ID:", repr(os.getenv("DISCORD_CLIENT_ID")))
# print("DISCORD_REDIRECT_URI:", repr(os.getenv("DISCORD_REDIRECT_URI")))

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

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

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
def signup(data: SignupIn, db: Session = Depends(get_db)):
    email = data.email.lower().strip()

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        id=str(uuid.uuid4()),
        email=email,
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        age_group=data.age_group,
        trading_expertise=data.trading_expertise,
        focus_areas=",".join(data.focus_areas),
        tier="FREE",
        created_at=datetime.now(timezone.utc).isoformat(),
    )

    db.add(user)
    db.commit()

    return {"token": create_token(user.id)}

@app.post("/auth/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    email = data.email.lower().strip()

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"token": create_token(user.id)}

@app.get("/me")
def me(user=Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = user.get("sub")

    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": db_user.id,
        "email": db_user.email,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "age_group": db_user.age_group,
        "trading_expertise": db_user.trading_expertise,
        "focus_areas": db_user.focus_areas,
        "tier": db_user.tier,
        "discord_user_id": db_user.discord_user_id,
        "discord_username": db_user.discord_username,
    }

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

    # 3️⃣ ADD USER TO SERVER  ✅ (BUG 3 FIX)
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

    # 6️⃣ redirect back to frontend
    return RedirectResponse(url=f"{FRONTEND_URL}/dashboard")
