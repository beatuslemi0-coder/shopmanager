import calendar
from datetime import datetime, timezone
from decimal import Decimal
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.api.v1.reports import monthly_trend


class TrendQuery:
    def __init__(self, rows):
        self.rows = rows

    def filter(self, *conditions):
        return self

    def all(self):
        return self.rows


class TrendDatabase:
    def __init__(self, sales, expenses):
        self.sales = sales
        self.expenses = expenses

    def query(self, *columns):
        if columns[1].key == "total_amount":
            return TrendQuery(self.sales)
        if columns[1].key == "amount":
            return TrendQuery(self.expenses)
        raise AssertionError(f"Unexpected monthly trend query: {columns}")


def test_monthly_trend_returns_daily_sales_and_financial_totals():
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    first_day = month_start.replace(day=1)
    middle_day = month_start.replace(day=15)
    sales = [
        (first_day, Decimal("100"), Decimal("40")),
        (first_day, Decimal("50"), Decimal("20")),
        (middle_day, Decimal("75"), Decimal("25")),
    ]
    expenses = [
        (first_day, Decimal("10")),
        (middle_day, Decimal("5")),
    ]

    result = monthly_trend(
        month=month_start.strftime("%Y-%m"),
        db=TrendDatabase(sales, expenses),
        u=SimpleNamespace(id=7),
    )

    assert len(result) == calendar.monthrange(month_start.year, month_start.month)[1]
    assert result[0]["date"] == first_day.date().isoformat()
    assert result[0]["revenue"] == Decimal("150")
    assert result[0]["expenses"] == Decimal("10")
    assert result[0]["net_profit"] == Decimal("80")
    assert result[0]["sales_count"] == 2
    assert result[14]["date"] == middle_day.date().isoformat()
    assert result[14]["revenue"] == Decimal("75")
    assert result[14]["expenses"] == Decimal("5")
    assert result[14]["net_profit"] == Decimal("45")
    assert result[14]["sales_count"] == 1
    assert result[1]["revenue"] == Decimal("0")
    assert result[1]["sales_count"] == 0


def test_monthly_trend_rejects_invalid_month():
    with pytest.raises(HTTPException) as error:
        monthly_trend(
            month="2026-13",
            db=TrendDatabase([], []),
            u=SimpleNamespace(id=7),
        )

    assert error.value.status_code == 422
