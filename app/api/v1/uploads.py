from uuid import uuid4

import cloudinary
import cloudinary.uploader

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.dependencies import get_current_user
from app.core.config import settings


# Router ya kupokea picha kutoka kwenye frontend.
router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"]
)

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)
# 2. ENDPOINT YA KUPAKIA PICHA

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    """
    Endpoint hii inapokea picha kutoka frontend,
    inaipeleka Cloudinary na kurudisha URL yake.
    """

    # Hatua ya kwanza: kuhakikisha credentials zipo.

    cloud_name = settings.CLOUDINARY_CLOUD_NAME
    api_key = settings.CLOUDINARY_API_KEY
    api_secret = settings.CLOUDINARY_API_SECRET

    if not all([cloud_name, api_key, api_secret]):
        raise HTTPException(
            status_code=500,
            detail="Cloudinary is not configured correctly"
        )

    # Hatua ya pili: kuruhusu aina za picha zinazokubalika.

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG or WEBP images are allowed"
        )

    # Hatua ya tatu: kusoma picha iliyotumwa.

    image_data = await file.read()

    # Kukataa picha tupu.

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty"
        )

    # Kikomo cha ukubwa ni 5 MB.

    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be 5MB or smaller"
        )

    try:

        result = cloudinary.uploader.upload(
            image_data,
            folder="shopmanager",
            public_id=uuid4().hex,
            resource_type="image"
        )

        # Cloudinary inaturudishia URL ya picha.

        image_url = result.get("secure_url")

        if not image_url:
            raise HTTPException(
                status_code=502,
                detail="Cloudinary did not return an image URL"
            )


        return {
            "message": "Image uploaded successfully",
            "image_url": image_url,
            "public_id": result.get("public_id")
        }

    except HTTPException:
        raise

    except Exception:
        # Hatufichui taarifa za siri za Cloudinary kwa mtumiaji.

        raise HTTPException(
            status_code=502,
            detail="Failed to upload image to Cloudinary"
        )