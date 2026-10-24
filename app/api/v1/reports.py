from datetime import datetime, timedelta, timezone
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import require_active_subscription
from app.models import Sale, SaleItem, Expense, Product, Customer, Business
from app.schemas.schemas import DashboardOut, DailyTrendPoint, ReportOut

router = APIRouter(prefix="/reports", tags=["Reports"])


def calc(db, u, start, end):
    s = (
        db.query(
            func.coalesce(func.sum(Sale.total_amount), 0),
            func.coalesce(func.sum(Sale.total_cost), 0),
            func.count(Sale.id),
        )
        .filter(Sale.owner_id == u.id, Sale.created_at >= start, Sale.created_at < end)
        .first()
    )
    e = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.owner_id == u.id,
            Expense.created_at >= start,
            Expense.created_at < end,
        )
        .scalar()
        or 0
    )
    ps = (
        db.query(func.coalesce(func.sum(SaleItem.quantity), 0))
        .join(Sale)
        .filter(Sale.owner_id == u.id, Sale.created_at >= start, Sale.created_at < end)
        .scalar()
        or 0
    )
    rev = Decimal(str(s[0]))
    cost = Decimal(str(s[1]))
    exp = Decimal(str(e))
    gross = rev - cost
    net = gross - exp
    margin = net / rev * 100 if rev else Decimal("0")
    return {
        "date_from": start.date().isoformat(),
        "date_to": (end - timedelta(seconds=1)).date().isoformat(),
        "revenue": rev,
        "cost_of_goods": cost,
        "gross_profit": gross,
        "expenses": exp,
        "net_profit": net,
        "profit_margin": margin,
        "sales_count": s[2],
        "products_sold": int(ps),
    }


def rng(period):
    n = datetime.utcnow()
    if period == "yesterday":
        st = (n - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        return st, st + timedelta(days=1)
    if period == "week":
        st = (n - timedelta(days=n.weekday())).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        return st, n + timedelta(seconds=1)
    if period == "month":
        st = n.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return st, n + timedelta(seconds=1)
    if period == "year":
        st = n.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        return st, n + timedelta(seconds=1)
    st = n.replace(hour=0, minute=0, second=0, microsecond=0)
    return st, st + timedelta(days=1)


@router.get("/summary", response_model=ReportOut)
def summary(
    period: str = "today", db: Session = Depends(get_db), u=Depends(require_active_subscription)
):
    st, en = rng(period)
    return calc(db, u, st, en)


@router.get("/daily", response_model=ReportOut)
def daily(db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    st, en = rng("today")
    return calc(db, u, st, en)


@router.get("/weekly", response_model=ReportOut)
def weekly(db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    st, en = rng("week")
    return calc(db, u, st, en)


@router.get("/monthly", response_model=ReportOut)
def monthly(db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    st, en = rng("month")
    return calc(db, u, st, en)


@router.get("/yearly", response_model=ReportOut)
def yearly(db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    st, en = rng("year")
    return calc(db, u, st, en)


@router.get("/dashboard", response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db), u=Depends(require_active_subscription)):
    st, en = rng("today")
    r = calc(db, u, st, en)
    b = db.query(Business).filter(Business.owner_id == u.id).first()
    tp = (
        db.query(Product)
        .filter(Product.business_id == b.id, Product.is_active == True)
        .count()
        if b
        else 0
    )
    low = (
        db.query(Product)
        .filter(
            Product.business_id == b.id,
            Product.is_active == True,
            Product.stock_quantity <= Product.minimum_stock,
        )
        .count()
        if b
        else 0
    )
    return {
        **r,
        "total_products": tp,
        "low_stock_products": low,
        "total_customers": db.query(Customer).filter(Customer.owner_id == u.id).count(),
    }


@router.get("/monthly-trend", response_model=list[DailyTrendPoint])
def monthly_trend(
    month: str,
    db: Session = Depends(get_db),
    u=Depends(require_active_subscription),
):
    try:
        start = datetime.strptime(month, "%Y-%m")
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail="Month must use the YYYY-MM format.",
        ) from error
    if start.strftime("%Y-%m") != month:
        raise HTTPException(
            status_code=422,
            detail="Month must use the YYYY-MM format.",
        )

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if start > now.replace(day=1, hour=0, minute=0, second=0, microsecond=0):
        raise HTTPException(status_code=422, detail="Month cannot be in the future.")

    if start.month == 12:
        end = datetime(start.year + 1, 1, 1)
    else:
        end = datetime(start.year, start.month + 1, 1)

    days = (end - start).days
    totals = {
        (start + timedelta(days=day)).date().isoformat(): {
            "revenue": Decimal("0"),
            "cost_of_goods": Decimal("0"),
            "expenses": Decimal("0"),
            "sales_count": 0,
        }
        for day in range(days)
    }

    sales = (
        db.query(Sale.created_at, Sale.total_amount, Sale.total_cost)
        .filter(
            Sale.owner_id == u.id,
            Sale.created_at >= start,
            Sale.created_at < end,
        )
        .all()
    )
    for created_at, amount, cost in sales:
        day_totals = totals[created_at.date().isoformat()]
        day_totals["revenue"] += Decimal(str(amount))
        day_totals["cost_of_goods"] += Decimal(str(cost))
        day_totals["sales_count"] += 1

    expenses = (
        db.query(Expense.created_at, Expense.amount)
        .filter(
            Expense.owner_id == u.id,
            Expense.created_at >= start,
            Expense.created_at < end,
        )
        .all()
    )
    for created_at, amount in expenses:
        totals[created_at.date().isoformat()]["expenses"] += Decimal(str(amount))

    return [
        {
            "date": day,
            "revenue": totals[day]["revenue"],
            "expenses": totals[day]["expenses"],
            "net_profit": (
                totals[day]["revenue"]
                - totals[day]["cost_of_goods"]
                - totals[day]["expenses"]
            ),
            "sales_count": totals[day]["sales_count"],
        }
        for day in totals
    ]
