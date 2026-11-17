from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import require_active_subscription
from app.models import (
    Business,
    Product,
    Sale,
    SaleItem,
    StockMovement,
)
from app.schemas.schemas import SaleIn, SaleOut


router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)

@router.post("", response_model=SaleOut)
def create_sale(
    data: SaleIn,
    db: Session = Depends(get_db),
    user=Depends(require_active_subscription),
):
    try:
        # 1. Angalia kama mauzo haya yalishawahi kusawazishwa
        if data.offline_id:
            existing_sale = db.query(Sale).filter(
                Sale.owner_id == user.id,
                Sale.offline_id == data.offline_id,
            ).first()

            # Kama yapo, rudisha mauzo yaliyopo bila kupunguza stock tena
            if existing_sale:
                return existing_sale

        # 2. Tafuta biashara ya mtumiaji
        business = db.query(Business).filter(
            Business.owner_id == user.id
        ).first()

        if not business:
            raise HTTPException(
                status_code=400,
                detail="Business not found."
            )

        # 3. Tengeneza rekodi ya mauzo
        sale = Sale(
            owner_id=user.id,
            customer_id=data.customer_id,
            offline_id=data.offline_id,
            payment_method=data.payment_method,
            notes=data.notes,
            total_amount=0,
            total_cost=0,
            profit=0,
        )

        db.add(sale)
        db.flush()

        total_amount = 0
        total_cost = 0

        # 4. Pitia bidhaa zote zilizouzwa
        for item in data.items:
            product = db.query(Product).filter(
                Product.id == item.product_id,
                Product.business_id == business.id,
                Product.is_active == True,
            ).first()

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found."
                )

            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}."
                )

            item_total = product.selling_price * item.quantity
            item_cost = product.buying_price * item.quantity

            total_amount += item_total
            total_cost += item_cost

            db.add(
                SaleItem(
                    sale_id=sale.id,
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=product.selling_price,
                    unit_cost=product.buying_price,
                )
            )

            # Punguza stock
            product.stock_quantity -= item.quantity

            db.add(
                StockMovement(
                    product_id=product.id,
                    movement_type="SALE",
                    quantity=-item.quantity,
                    note=f"Sale #{sale.id}",
                )
            )

        # 5. Hesabu mapato, gharama na faida
        sale.total_amount = total_amount
        sale.total_cost = total_cost
        sale.profit = total_amount - total_cost

        # 6. Hifadhi kwenye database
        db.commit()
        db.refresh(sale)

        return sale

    except HTTPException:
        db.rollback()
        raise

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to record sale: {str(error)}"
        )

@router.get(
    "",
    response_model=list[SaleOut],
)
def get_sales(
    db: Session = Depends(get_db),
    user=Depends(require_active_subscription),
):
    """
    Kupata sales za user aliyeingia tu.
    """

    return (
        db.query(Sale)
        .filter(
            Sale.owner_id == user.id
        )
        .order_by(
            Sale.id.desc()
        )
        .limit(200)
        .all()
    )