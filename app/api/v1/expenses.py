from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models import Expense
from app.schemas.schemas import ExpenseIn, ExpenseOut

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("", response_model=list[ExpenseOut])
def all(db: Session = Depends(get_db), u=Depends(get_current_user)):
    return (
        db.query(Expense)
        .filter(Expense.owner_id == u.id)
        .order_by(Expense.id.desc())
        .all()
    )


@router.post("", response_model=ExpenseOut)
def create(d: ExpenseIn, db: Session = Depends(get_db), u=Depends(get_current_user)):
    e = Expense(owner_id=u.id, **d.model_dump())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


@router.put("/{id}", response_model=ExpenseOut)
def update(
    id: int, d: ExpenseIn, db: Session = Depends(get_db), u=Depends(get_current_user)
):
    e = db.query(Expense).filter(Expense.id == id, Expense.owner_id == u.id).first()
    if not e:
        raise HTTPException(404, "Expense not found")
    for k, v in d.model_dump().items():
        setattr(e, k, v)
    db.commit()
    db.refresh(e)
    return e


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), u=Depends(get_current_user)):
    e = db.query(Expense).filter(Expense.id == id, Expense.owner_id == u.id).first()
    if not e:
        raise HTTPException(404, "Expense not found")
    db.delete(e)
    db.commit()
    return {"message": "Expense deleted"}
