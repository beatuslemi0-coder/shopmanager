from datetime import datetime, timedelta, timezone
import jwt
from pwdlib import PasswordHash
from app.core.config import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    # Hash password kabla ya kuihifadhi
    return password_hash.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)


def create_access_token(user_id: int) -> str:
    # JWT ina user id na muda wa ku-expire
    exp = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return jwt.encode(
        {"sub": str(user_id), "exp": exp}, settings.SECRET_KEY, algorithm="HS256"
    )


def decode_access_token(token: str) -> int:
    return int(jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])["sub"])
