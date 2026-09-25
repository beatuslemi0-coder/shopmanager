from fastapi import APIRouter
from app.api.v1 import (
    auth,
    businesses,
    products,
    sales,
    expenses,
    customers,
    reports,
    advertisements,
    admin,
    uploads,
)

api_router = APIRouter(prefix="/api/v1")
for r in [
    auth.router,
    businesses.router,
    products.router,
    sales.router,
    expenses.router,
    customers.router,
    reports.router,
    advertisements.router,
    admin.router,
    uploads.router,
]:
    api_router.include_router(r)
