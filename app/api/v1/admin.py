from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import require_admin
from app.models import User, Business, Product, Sale, Advertisement
from app.schemas.schemas import AdminStats, AdminUserOut

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStats)
def stats(db: Session = Depends(get_db), u=Depends(require_admin)):
    return {
        "total_users": db.query(User).count(),
        "active_users": db.query(User).filter(User.is_active == True).count(),
        "total_businesses": db.query(Business).count(),
        "total_products": db.query(Product).count(),
        "total_sales": db.query(Sale).count(),
        "total_advertisements": db.query(Advertisement).count(),
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


@router.delete("/advertisements/{id}")
def remove(id: int, db: Session = Depends(get_db), u=Depends(require_admin)):
    x = db.get(Advertisement, id)
    if not x:
        raise HTTPException(404, "Advertisement not found")
    db.delete(x)
    db.commit()
    return {"message": "Advertisement removed"}
