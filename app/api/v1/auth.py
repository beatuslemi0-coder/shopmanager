from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import (
    TRIAL_DAYS,
    get_current_user,
    require_active_subscription,
)
from app.core.security import hash_password, verify_password, create_access_token
from app.models import User
from app.schemas.schemas import *
import secrets
import hashlib
from datetime import datetime, timedelta, timezone
from app.models import PasswordResetToken
from app.schemas.schemas import ResetPasswordIn
from app.core.email_service import send_otp_email
import logging


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenOut)
def register(d: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == d.email).first():
        raise HTTPException(400, "Email already registered")
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    u = User(
        full_name=d.full_name,
        email=d.email,
        password_hash=hash_password(d.password),
        trial_expires_at=now + timedelta(days=TRIAL_DAYS),
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
def update_profile_image(
    data: ProfileImageUpdate,
    u=Depends(require_active_subscription),
    db: Session = Depends(get_db),
):
    u.profile_image_url = data.profile_image_url
    db.commit()
    db.refresh(u)
    return u

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordIn,
    db: Session = Depends(get_db),
):
    # Tafuta akaunti inayohusishwa na email
    user = db.query(User).filter(User.email == data.email).first()

    # Tumia ujumbe uleule hata kama email haipo
    response = {
        "message": "If the account exists, a reset code will be sent."
    }

    if not user:
        return response

    # Zima OTP zote ambazo hazijatumika kwa akaunti hii
    now = datetime.now()

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used_at.is_(None),
    ).update(
        {PasswordResetToken.used_at: now},
        synchronize_session=False,
    )

    # Tengeneza OTP ya namba sita
    otp = f"{secrets.randbelow(1_000_000):06d}"

    # Hifadhi hash badala ya OTP halisi
    otp_hash = hashlib.sha256(otp.encode("utf-8")).hexdigest()

    # Tengeneza rekodi ya OTP yenye muda wa dakika 10
    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=otp_hash,
        expires_at=now + timedelta(minutes=10),
    )

    db.add(reset_record)
    db.commit()

    try:
        # Tuma OTP kwenye email ya mtumiaji
        send_otp_email(user.email, otp)

    except Exception:
        logging.exception("Failed to send password reset email")
        # Futa OTP iliyotengenezwa ikiwa email imeshindwa kutumwa
        db.delete(reset_record)
        db.commit()

        raise HTTPException(
            status_code=503,
            detail="Unable to send the reset email. Please try again later.",
        )

    return response

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordIn,
    db: Session = Depends(get_db),
):
    # 1. Tafuta akaunti kwa kutumia email iliyotumwa
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset code."
        )

    # 2. Badilisha OTP kuwa hash ili kulinganisha na iliyohifadhiwa database
    otp_hash = hashlib.sha256(
        data.otp.encode("utf-8")
    ).hexdigest()

    # 3. Tafuta OTP inayolingana na mtumiaji
    reset_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.token_hash == otp_hash,
        PasswordResetToken.used_at.is_(None),
        PasswordResetToken.expires_at > datetime.now(),
    ).with_for_update().first()

    if not reset_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset code."
        )

    # 4. Hifadhi password mpya ikiwa imesimbwa kwa hash
    user.password_hash = hash_password(data.new_password)

    # 5. Weka alama kuwa OTP imetumika
    reset_record.used_at = datetime.now()

    # 6. Hifadhi mabadiliko kwenye database
    db.commit()

    return {
        "message": "Password has been reset successfully. You can now log in."
    }
