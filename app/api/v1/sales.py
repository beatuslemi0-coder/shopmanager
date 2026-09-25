from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.dependencies import get_current_user
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


@router.post(
    "",
    response_model=SaleOut,
)
def create_sale(
    data: SaleIn,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Kurekodi sale moja au sale yenye bidhaa nyingi.

    Hatua:
    1. Tafuta biashara ya user.
    2. Hakikisha products zipo na ni za biashara hiyo.
    3. Hakikisha stock inatosha.
    4. Hifadhi sale.
    5. Hifadhi sale items.
    6. Punguza stock.
    7. Hifadhi stock movement.
    8. Calculate profit.
    9. Commit transaction.
    """

    try:

        # Tunapata business ya user aliyeingia
        business = (
            db.query(Business)
            .filter(
                Business.owner_id == user.id
            )
            .first()
        )


        if not business:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Create business profile first "
                    "before recording a sale."
                ),
            )


        # Tunatengeneza Sale
        sale = Sale(
            owner_id=user.id,
            customer_id=data.customer_id,
            payment_method=data.payment_method,
            notes=data.notes,
            total_amount=0,
            total_cost=0,
            profit=0,
        )

        db.add(sale)

        # Tunahitaji sale.id kabla ya kutengeneza SaleItem
        db.flush()


        total_amount = 0
        total_cost = 0


        # Tunapitia kila product iliyouzwa
        for item in data.items:

            product = (
                db.query(Product)
                .filter(
                    Product.id == item.product_id,
                    Product.business_id == business.id,
                    Product.is_active == True,
                )
                .first()
            )


            if not product:

                raise HTTPException(
                    status_code=404,
                    detail=(
                        f"Product "
                        f"{item.product_id} not found."
                    ),
                )


            # Tunahakikisha stock inatosha
            if product.stock_quantity < item.quantity:

                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Insufficient stock for "
                        f"{product.name}. "
                        f"Available stock: "
                        f"{product.stock_quantity}"
                    ),
                )


            # Calculate amounts
            item_total = (
                product.selling_price
                * item.quantity
            )

            item_cost = (
                product.buying_price
                * item.quantity
            )


            total_amount += item_total

            total_cost += item_cost


            # Tunahifadhi sale item
            sale_item = SaleItem(
                sale_id=sale.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.selling_price,
                unit_cost=product.buying_price,
            )

            db.add(sale_item)


            # Tunapunguza stock
            product.stock_quantity -= item.quantity


            # Tuna-record movement ya stock
            movement = StockMovement(
                product_id=product.id,
                movement_type="SALE",
                quantity=-item.quantity,
                note=f"Sale #{sale.id}",
            )

            db.add(movement)


        # Tunahifadhi totals
        sale.total_amount = total_amount

        sale.total_cost = total_cost

        sale.profit = (
            total_amount - total_cost
        )


        # Tunakamilisha transaction
        db.commit()

        db.refresh(sale)


        return sale


    except HTTPException:

        # Tukipata business error,
        # tunarudisha transaction nyuma.
        db.rollback()

        raise


    except Exception as error:

        # Error nyingine yoyote
        # tunarudisha transaction nyuma.
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to record sale: "
                f"{str(error)}"
            ),
        )

@router.get(
    "",
    response_model=list[SaleOut],
)
def get_sales(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
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