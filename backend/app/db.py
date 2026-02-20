import sqlite3
import os
from pathlib import Path

DB_PATH = Path(os.getenv("DB_PATH", "./data.db"))


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    conn = get_conn()
    cur = conn.cursor()
    
    cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    first_name TEXT,
    last_name TEXT,
    age_group TEXT,
    trading_expertise TEXT,

    focus_areas TEXT,   -- comma separated

    tier TEXT NOT NULL DEFAULT 'FREE',
    created_at TEXT NOT NULL,

    discord_user_id TEXT,
    discord_username TEXT
)
""")


    conn.commit()
    conn.close()
