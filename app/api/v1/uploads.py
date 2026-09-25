from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.core.paths import UPLOAD_DIR



router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Kupokea picha kutoka kwenye computer ya seller
    na kuihifadhi kwenye backend/uploads.
    """

    # Tunakubali aina hizi tu za picha
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG or WEBP images are allowed",
        )

    # Tunasoma picha yote
    data = await file.read()

    # Maximum size ni 5MB
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be 5MB or smaller",
        )

    # Tunapata extension ya picha
    extension = Path(file.filename or "").suffix.lower()

    if extension not in {".jpg", ".jpeg", ".png", ".webp"}:
        extension = ".jpg"

    # Tunatengeneza jina la kipekee
    filename = f"{uuid4().hex}{extension}"

    # Tunahifadhi picha kwenye uploads folder
    file_path = UPLOAD_DIR / filename
    file_path.write_bytes(data)

    # Tunairudisha URL ambayo frontend inaweza kutumia
    return {
        "image_url": f"/uploads/{filename}"
    }