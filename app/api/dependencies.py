from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_access_token
from app.models import User
from app.models.models import Subscription

bearer = HTTPBearer()
TRIAL_DAYS = 7
SUBSCRIPTION_REQUIRED_MESSAGE = (
    "Your free trial has expired. An active subscription is required to continue."
)


def get_current_user(
    c: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    # JWT token inamtambulisha user
    try:
        uid = decode_access_token(c.credentials)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")
    u = db.get(User, uid)
    if not u or not u.is_active:
        raise HTTPException(401, "User not found or inactive")
    return u


def require_admin(user: User = Depends(get_current_user)):
    if user.role.lower() != "admin":
        raise HTTPException(403, "Admin access required")
    return user


def require_active_subscription(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    if user.role.lower() == "admin":
        return user

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user.id,
            Subscription.status == "ACTIVE",
            Subscription.expires_at > now,
        )
        .order_by(Subscription.expires_at.desc())
        .first()
    )

    trial_is_active = user.trial_expires_at and user.trial_expires_at > now
    if not subscription and not trial_is_active:
        raise HTTPException(
            status_code=403,
            detail=SUBSCRIPTION_REQUIRED_MESSAGE,
        )

    return user
