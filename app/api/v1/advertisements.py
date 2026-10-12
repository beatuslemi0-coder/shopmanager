from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models import Business, Advertisement, Product
from app.schemas.schemas import AdvertisementIn, AdvertisementOut

router = APIRouter(prefix="/advertisements", tags=["Advertisements"])


@router.get("", response_model=list[AdvertisementOut])
def mine(db: Session = Depends(get_db), u=Depends(get_current_user)):
    b = db.query(Business).filter(Business.owner_id == u.id).first()
    return (
        db.query(Advertisement).filter(Advertisement.business_id == b.id).all()
        if b
        else []
    )


@router.post("", response_model=AdvertisementOut)
def create(
    d: AdvertisementIn, db: Session = Depends(get_db), u=Depends(get_current_user)
):
    b = db.query(Business).filter(Business.owner_id == u.id).first()
    if not b:
        raise HTTPException(400, "Create business profile first")

    if d.product_id is not None:
        product = (
            db.query(Product)
            .filter(Product.id == d.product_id, Product.business_id == b.id)
            .first()
        )
        if not product:
            raise HTTPException(
                400,
                "Selected product does not belong to your business or was not found",
            )

    a = Advertisement(business_id=b.id, **d.model_dump())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@router.put("/{id}", response_model=AdvertisementOut)
def update(
    id: int,
    d: AdvertisementIn,
    db: Session = Depends(get_db),
    u=Depends(get_current_user),
):
    b = db.query(Business).filter(Business.owner_id == u.id).first()
    a = (
        db.query(Advertisement)
        .filter(Advertisement.id == id, Advertisement.business_id == b.id)
        .first()
    )
    if not a:
        raise HTTPException(404, "Advertisement not found")
    for k, v in d.model_dump().items():
        setattr(a, k, v)
    db.commit()
    db.refresh(a)
    return a


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), u=Depends(get_current_user)):
    b = db.query(Business).filter(Business.owner_id == u.id).first()
    a = (
        db.query(Advertisement)
        .filter(Advertisement.id == id, Advertisement.business_id == b.id)
        .first()
    )
    if not a:
        raise HTTPException(404, "Advertisement not found")
    db.delete(a)
    db.commit()
    return {"message": "Advertisement deleted"}


@router.get("/public")
def public(db: Session = Depends(get_db)):
    # Taarifa za biashara zinazoonyeshwa hapa ni public tu
    ads = db.query(Advertisement).filter(Advertisement.is_published == True).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "price": a.price,
            "image_url": a.image_url,
            "business_name": a.business.name,
            "location": a.business.location,
            "phone": a.business.phone,
        }
        for a in ads
    ]
