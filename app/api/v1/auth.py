from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.core.security import hash_password, verify_password, create_access_token
from app.models import User
from app.schemas.schemas import *

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenOut)
def register(d: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == d.email).first():
        raise HTTPException(400, "Email already registered")
    u = User(
        full_name=d.full_name, email=d.email, password_hash=hash_password(d.password)
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"access_token": create_access_token(u.id), "user": u}


@router.post("/login", response_model=TokenOut)
def login(d: LoginIn, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == d.email).first()
    if not u or not verify_password(d.password, u.password_hash):
        raise HTTPException(401, "Email or password is incorrect")
    if not u.is_active:
        raise HTTPException(403, "Account inactive")
    return {"access_token": create_access_token(u.id), "user": u}


@router.get("/me", response_model=UserOut)
def me(u=Depends(get_current_user)):
    return u


@router.put("/me/profile-image", response_model=UserOut)
def update_profile_image(data: ProfileImageUpdate, u=Depends(get_current_user), db: Session = Depends(get_db)):
    u.profile_image_url = data.profile_image_url
    db.commit()
    db.refresh(u)
    return u
