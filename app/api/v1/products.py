from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import require_active_subscription
from app.models import Business, Product, StockMovement
from app.schemas.schemas import ProductIn, ProductOut

router = APIRouter(prefix="/products", tags=["Products"])


def biz(db, u):
    return db.query(Business).filter(Business.owner_id == u.id).first()


@router.get("", response_model=list[ProductOut])
def all(
    search: str | None = None,
    db: Session = Depends(get_db),
    u=Depends(require_active_subscription),
):
    b = biz(db, u)
    if not b:
        return []
    q = db.query(Product).filter(Product.business_id == b.id, Product.is_active == True)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))
    return q.order_by(Product.id.desc()).all()


@router.get("/{id}", response_model=ProductOut)
def one(id: int, db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    b = biz(db, u)
    p = db.query(Product).filter(Product.id == id, Product.business_id == b.id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    return p


@router.post("", response_model=ProductOut)
def create(d: ProductIn, db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    b = biz(db, u)
    if not b:
        raise HTTPException(400, "Create business profile first")
    product_name = d.name.strip()
    p = (
        db.query(Product)
        .filter(
            Product.business_id == b.id,
            Product.is_active == True,
            func.lower(Product.name) == product_name.lower(),
        )
        .first()
    )
    if p:
        p.stock_quantity += d.stock_quantity
        if d.stock_quantity:
            db.add(
                StockMovement(
                    product_id=p.id,
                    movement_type="ADDITION",
                    quantity=d.stock_quantity,
                    note="Additional stock",
                )
            )
        db.commit()
        db.refresh(p)
        return p
    p = Product(business_id=b.id, **d.model_dump())
    db.add(p)
    db.flush()
    if p.stock_quantity:
        db.add(
            StockMovement(
                product_id=p.id,
                movement_type="INITIAL",
                quantity=p.stock_quantity,
                note="Initial stock",
            )
        )
    db.commit()
    db.refresh(p)
    return p


@router.put("/{id}", response_model=ProductOut)
def update(
    id: int, d: ProductIn, db: Session = Depends(get_db), u=Depends(require_active_subscription)
):
    b = biz(db, u)
    p = db.query(Product).filter(Product.id == id, Product.business_id == b.id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    old = p.stock_quantity
    for k, v in d.model_dump().items():
        setattr(p, k, v)
    if d.stock_quantity != old:
        db.add(
            StockMovement(
                product_id=p.id,
                movement_type="ADJUSTMENT",
                quantity=d.stock_quantity - old,
                note="Stock adjustment",
            )
        )
    db.commit()
    db.refresh(p)
    return p


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    b = biz(db, u)
    p = db.query(Product).filter(Product.id == id, Product.business_id == b.id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    p.is_active = False
    db.commit()
    return {"message": "Product deleted"}
