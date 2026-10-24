
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import SubscriptionPlan, Payment, User
from app.api.dependencies import get_current_user
from datetime import datetime, timezone
from app.models.models import Subscription

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


# Kuonyesha vifurushi vinavyopatikana
@router.get("/plans")
def get_plans(db: Session = Depends(get_db)):
    plans = (
        db.query(SubscriptionPlan)
        .filter(SubscriptionPlan.is_active == True)
        .all()
    )

    return [
        {
            "id": plan.id,
            "name": plan.name,
            "price": float(plan.price),
            "duration_days": plan.duration_days,
        }
        for plan in plans
    ]


# Mtumiaji kuwasilisha taarifa za malipo ya M-Pesa
@router.post("/payments")
def submit_payment(
    plan_id: int,
    phone_number: str,
    transaction_reference: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Hakikisha kifurushi kipo na kinapatikana
    plan = (
        db.query(SubscriptionPlan)
        .filter(
            SubscriptionPlan.id == plan_id,
            SubscriptionPlan.is_active == True,
        )
        .first()
    )

    if not plan:
        raise HTTPException(status_code=404, detail="Kifurushi hakijapatikana")

    # Zuia kutuma transaction reference ileile mara mbili
    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.transaction_reference == transaction_reference
        )
        .first()
    )

    if existing_payment:
        raise HTTPException(
            status_code=409,
            detail="Namba ya muamala imeshatumika",
        )

    # Hifadhi malipo yakisubiri kuhakikiwa na admin
    payment = Payment(
        user_id=current_user.id,
        plan_id=plan.id,
        amount=plan.price,
        phone_number=phone_number.strip(),
        transaction_reference=transaction_reference.strip(),
        status="PENDING",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "message": "Taarifa za malipo zimepokelewa. Zinasubiri uhakiki.",
        "payment_id": payment.id,
        "status": payment.status,
        "amount": float(payment.amount),
    }


# Mtumiaji kuangalia hali ya malipo yake
@router.get("/my-payments")
def get_my_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payments = (
        db.query(Payment)
        .filter(Payment.user_id == current_user.id)
        .order_by(Payment.created_at.desc())
        .all()
    )

    return [
        {
            "id": payment.id,
            "plan": payment.plan.name,
            "amount": float(payment.amount),
            "phone_number": payment.phone_number,
            "transaction_reference": payment.transaction_reference,
            "status": payment.status,
            "created_at": payment.created_at,
        }
        for payment in payments
    ]
    
@router.get("/my-subscription")
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    now = datetime.now(timezone.utc).replace(tzinfo=None)

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id,
            Subscription.status == "ACTIVE",
            Subscription.expires_at > now
        )
        .order_by(Subscription.expires_at.desc())
        .first()
    )

    if not subscription:
        trial_active = bool(
            current_user.trial_expires_at and current_user.trial_expires_at > now
        )
        return {
            "active": False,
            "trial_active": trial_active,
            "trial_expires_at": current_user.trial_expires_at,
            "message": (
                "Free trial is active."
                if trial_active
                else "Huna kifurushi hai kwa sasa."
            ),
        }

    return {
        "active": True,
        "trial_active": False,
        "trial_expires_at": current_user.trial_expires_at,
        "plan": subscription.plan.name,
        "starts_at": subscription.starts_at,
        "expires_at": subscription.expires_at,
        "status": subscription.status
    }
