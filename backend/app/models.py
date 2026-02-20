# backend/app/models.py

from sqlalchemy import Column, String, Text
from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    first_name = Column(String)
    last_name = Column(String)
    age_group = Column(String)
    trading_expertise = Column(String)
    focus_areas = Column(Text)

    tier = Column(String, default="FREE")
    created_at = Column(String, nullable=False)

    discord_user_id = Column(String)
    discord_username = Column(String)