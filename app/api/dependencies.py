from fastapi import Depends,HTTPException
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_access_token
from app.models import User
bearer=HTTPBearer()
def get_current_user(c:HTTPAuthorizationCredentials=Depends(bearer),db:Session=Depends(get_db)):
    # JWT token inamtambulisha user
    try: uid=decode_access_token(c.credentials)
    except Exception: raise HTTPException(401,"Invalid or expired token")
    u=db.get(User,uid)
    if not u or not u.is_active: raise HTTPException(401,"User not found or inactive")
    return u
def require_admin(user=Depends(get_current_user)):
    if user.role!="ADMIN": raise HTTPException(403,"Admin access required")
    return user
