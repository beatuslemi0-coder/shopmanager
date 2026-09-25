from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import require_admin
from app.models import User, Business, Product, Sale, Advertisement
from app.schemas.schemas import AdminStats

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


@router.post("/users/{id}/deactivate")
def deactivate(id: int, db: Session = Depends(get_db), u=Depends(require_admin)):
    x = db.get(User, id)
    if not x:
        raise HTTPException(404, "User not found")
    x.is_active = False
    db.commit()
    return {"message": "User deactivated"}


@router.delete("/advertisements/{id}")
def remove(id: int, db: Session = Depends(get_db), u=Depends(require_admin)):
    x = db.get(Advertisement, id)
    if not x:
        raise HTTPException(404, "Advertisement not found")
    db.delete(x)
    db.commit()
    return {"message": "Advertisement removed"}
