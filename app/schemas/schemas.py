from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class RegisterIn(BaseModel):
    full_name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=6)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(ORM):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
    profile_image_url: str | None = None


class ProfileImageUpdate(BaseModel):
    profile_image_url: str = Field(min_length=1)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class BusinessIn(BaseModel):
    name: str
    owner_name: str
    phone: str | None = None
    email: EmailStr | None = None
    location: str | None = None
    address: str | None = None
    category: str | None = None
    description: str | None = None
    logo_url: str | None = None


class BusinessOut(ORM):
    id: int
    name: str
    owner_name: str
    phone: str | None
    email: EmailStr | None
    location: str | None
    address: str | None
    category: str | None
    description: str | None
    logo_url: str | None
    created_at: datetime


class ProductIn(BaseModel):
    name: str
    description: str | None = None
    buying_price: Decimal = Field(ge=0)
    selling_price: Decimal = Field(ge=0)
    stock_quantity: int = Field(ge=0)
    minimum_stock: int = Field(ge=0)
    image_url: str | None = None
    sku: str | None = None


class ProductOut(ORM):
    id: int
    name: str
    description: str | None
    buying_price: Decimal
    selling_price: Decimal
    stock_quantity: int
    minimum_stock: int
    image_url: str | None
    sku: str | None
    is_active: bool


class SaleItemIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class SaleIn(BaseModel):
    customer_id: int | None = None
    payment_method: str = "Cash"
    notes: str | None = None
    items: list[SaleItemIn] = Field(min_length=1)


class SaleOut(ORM):
    id: int
    payment_method: str
    total_amount: Decimal
    total_cost: Decimal
    profit: Decimal
    created_at: datetime


class ExpenseIn(BaseModel):
    category: str
    description: str | None = None
    amount: Decimal = Field(gt=0)
    payment_method: str = "Cash"
    notes: str | None = None


class ExpenseOut(ORM):
    id: int
    category: str
    description: str | None
    amount: Decimal
    payment_method: str
    notes: str | None
    created_at: datetime


class CustomerIn(BaseModel):
    name: str
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    notes: str | None = None


class CustomerOut(ORM):
    id: int
    name: str
    phone: str | None
    email: EmailStr | None
    address: str | None
    notes: str | None


class AdvertisementIn(BaseModel):
    product_id: int | None = None
    title: str
    description: str | None = None
    price: Decimal | None = None
    image_url: str | None = None
    is_published: bool = True


class AdvertisementOut(ORM):
    id: int
    business_id: int
    product_id: int | None
    title: str
    description: str | None
    price: Decimal | None
    image_url: str | None
    is_published: bool
    created_at: datetime


class ReportOut(BaseModel):
    date_from: str
    date_to: str
    revenue: Decimal
    cost_of_goods: Decimal
    gross_profit: Decimal
    expenses: Decimal
    net_profit: Decimal
    profit_margin: Decimal
    sales_count: int
    products_sold: int


class DashboardOut(ReportOut):
    total_products: int
    low_stock_products: int
    total_customers: int


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_businesses: int
    total_products: int
    total_sales: int
    total_advertisements: int


class AdminUserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    business_name: str | None
    products_count: int
    sales_count: int


class ForgotPasswordIn(BaseModel):
    email: EmailStr


# Schema ya kuthibitisha OTP na kuweka password mpya
class ResetPasswordIn(BaseModel):
    email: EmailStr

    # OTP lazima iwe na namba 6
    otp: str = Field(pattern=r"^\d{6}$")

    # Password mpya lazima iwe na angalau herufi/namba 8
    new_password: str = Field(min_length=8, max_length=128)