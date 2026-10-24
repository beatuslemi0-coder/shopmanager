from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import require_admin
from app.models import User, Business, Product, Sale
from app.schemas.schemas import AdminStats, AdminUserOut
from datetime import datetime, timedelta, timezone
from app.models.models import Payment, Subscription, SubscriptionPlan


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStats)
def stats(db: Session = Depends(get_db), u=Depends(require_admin)):
    return {
        "total_users": db.query(User).count(),
        "active_users": db.query(User).filter(User.is_active == True).count(),
        "total_businesses": db.query(Business).count(),
        "total_products": db.query(Product).count(),
        "total_sales": db.query(Sale).count(),
    }


@router.get("/users", response_model=list[AdminUserOut])
def users(db: Session = Depends(get_db), u=Depends(require_admin)):
    user_rows = (
        db.query(User, Business.name)
        .outerjoin(Business, Business.owner_id == User.id)
        .order_by(User.created_at.desc())
        .all()
    )
    sales_counts = dict(
        db.query(Sale.owner_id, func.count(Sale.id)).group_by(Sale.owner_id).all()
    )
    product_counts = dict(
        db.query(Business.owner_id, func.count(Product.id))
        .outerjoin(Product, Product.business_id == Business.id)
        .group_by(Business.owner_id)
        .all()
    )
    return [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "business_name": business_name,
            "products_count": product_counts.get(user.id, 0),
            "sales_count": sales_counts.get(user.id, 0),
        }
        for user, business_name in user_rows
    ]


@router.post("/users/{id}/deactivate")
def deactivate(id: int, db: Session = Depends(get_db), u=Depends(require_admin)):
    x = db.get(User, id)
    if not x:
        raise HTTPException(404, "User not found")
    if x.id == u.id:
        raise HTTPException(400, "You cannot deactivate your own account")
    if x.role == "ADMIN" and x.is_active:
        active_admins = db.query(User).filter(User.role == "ADMIN", User.is_active == True).count()
        if active_admins <= 1:
            raise HTTPException(400, "Cannot deactivate the last active admin")
    x.is_active = False
    db.commit()
    return {"message": "User deactivated"}


@router.post("/users/{id}/activate")
def activate(id: int, db: Session = Depends(get_db), u=Depends(require_admin)):
    x = db.get(User, id)
    if not x:
        raise HTTPException(404, "User not found")
    x.is_active = True
    db.commit()
    return {"message": "User activated"}


# Kuona malipo yote yanayosubiri kuhakikiwa
@router.get("/payments/pending")
def pending_payments(
    db: Session = Depends(get_db),
    u=Depends(require_admin),
):
    payments = (
        db.query(Payment)
        .filter(Payment.status == "PENDING")
        .order_by(Payment.created_at.asc())
        .all()
    )

    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "plan_id": p.plan_id,
            "plan_name": p.plan.name,
            "amount": float(p.amount),
            "phone_number": p.phone_number,
            "transaction_reference": p.transaction_reference,
            "status": p.status,
            "created_at": p.created_at,
        }
        for p in payments
    ]


# Kukubali malipo baada ya kuthibitisha kupokea pesa
@router.post("/payments/{payment_id}/approve")
def approve_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    u=Depends(require_admin),
):
    payment = db.get(Payment, payment_id)

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Payment is already reviewed",
        )

    # Pata kifurushi kilicholipiwa
    plan = db.get(SubscriptionPlan, payment.plan_id)

    if not plan or not plan.is_active:
        raise HTTPException(
            status_code=400,
            detail="Subscription plan is unavailable",
        )

    # MUHIMU: Admin lazima athibitishe muamala wa M-Pesa
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    # Kama subscription iliyopo bado hai, ongeza muda juu ya muda uliobaki
    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == payment.user_id,
            Subscription.status == "ACTIVE",
            Subscription.expires_at > now,
        )
        .order_by(Subscription.expires_at.desc())
        .first()
    )

    if subscription:
        subscription.expires_at += timedelta(days=plan.duration_days)
        subscription.plan_id = plan.id
    else:
        # Anzisha subscription mpya
        subscription = Subscription(
            user_id=payment.user_id,
            plan_id=plan.id,
            starts_at=now,
            expires_at=now + timedelta(days=plan.duration_days),
            status="ACTIVE",
        )
        db.add(subscription)

    # Hifadhi taarifa za uhakiki
    payment.status = "APPROVED"
    payment.reviewed_by = u.id
    payment.reviewed_at = now

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to approve payment",
        )

    return {
        "message": "Payment approved and subscription activated",
        "payment_id": payment.id,
        "subscription_expires_at": subscription.expires_at,
    }


# Kukataa malipo yasiyothibitishwa
@router.post("/payments/{payment_id}/reject")
def reject_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    u=Depends(require_admin),
):
    payment = db.get(Payment, payment_id)

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Payment is already reviewed",
        )

    payment.status = "REJECTED"
    payment.reviewed_by = u.id
    payment.reviewed_at = datetime.now(timezone.utc).replace(tzinfo=None)

    db.commit()

    return {"message": "Payment rejected", "payment_id": payment.id}
