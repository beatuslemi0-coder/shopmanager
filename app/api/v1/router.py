from fastapi import APIRouter, Depends
from app.api.v1.subscriptions import router as subscriptions_router
from app.api.dependencies import require_active_subscription

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
    businesses.router,
    products.router,
    sales.router,
    expenses.router,
    customers.router,
    reports.router,
    uploads.router,
]:
    api_router.include_router(r, dependencies=[Depends(require_active_subscription)])

for r in [auth.router, admin.router]:
    api_router.include_router(r)

api_router.include_router(subscriptions_router)
