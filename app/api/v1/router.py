from fastapi import APIRouter
from app.api.v1.subscriptions import router as subscriptions_router

from app.api.v1 import (
    auth,
    businesses,
    products,
    sales,
    expenses,
    customers,
    reports,
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
    admin.router,
    uploads.router,
]:
    api_router.include_router(r)
    
    api_router.include_router(subscriptions_router)
