from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import require_active_subscription
from app.models import Business
from app.schemas.schemas import BusinessIn, BusinessOut

router = APIRouter(prefix="/businesses", tags=["Business"])


@router.get("/me", response_model=BusinessOut | None)
def get(db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    return db.query(Business).filter(Business.owner_id == u.id).first()


@router.post("/me", response_model=BusinessOut)
def create(d: BusinessIn, db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    if db.query(Business).filter(Business.owner_id == u.id).first():
        raise HTTPException(400, "Business already exists")
    b = Business(owner_id=u.id, **d.model_dump())
    db.add(b)
    db.commit()
    db.refresh(b)
    return b


@router.put("/me", response_model=BusinessOut)
def update(d: BusinessIn, db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    b = db.query(Business).filter(Business.owner_id == u.id).first()
    if not b:
        raise HTTPException(404, "Business not found")
    for k, v in d.model_dump().items():
        setattr(b, k, v)
    db.commit()
    db.refresh(b)
    return b
