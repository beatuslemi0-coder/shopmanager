from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import require_active_subscription
from app.models import Customer
from app.schemas.schemas import CustomerIn, CustomerOut

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=list[CustomerOut])
def all(db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    return (
        db.query(Customer)
        .filter(Customer.owner_id == u.id)
        .order_by(Customer.id.desc())
        .all()
    )


@router.post("", response_model=CustomerOut)
def create(d: CustomerIn, db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    c = Customer(owner_id=u.id, **d.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.put("/{id}", response_model=CustomerOut)
def update(
    id: int, d: CustomerIn, db: Session = Depends(get_db), u=Depends(require_active_subscription)
):
    c = db.query(Customer).filter(Customer.id == id, Customer.owner_id == u.id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    for k, v in d.model_dump().items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    c = db.query(Customer).filter(Customer.id == id, Customer.owner_id == u.id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    db.delete(c)
    db.commit()
    return {"message": "Customer deleted"}
