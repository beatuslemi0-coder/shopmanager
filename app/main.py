from pathlib import Path

from app.core.paths import UPLOAD_DIR

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.router import api_router
import os



app = FastAPI(
    title="SHOPMANAGER API",
    version="1.0.0",
)

raw_origins = os.getenv("COR_ORIGINS","*")
origins = [origin.strip() for origin in raw_origins.split(".") if origin.strip()]


# CORS inaruhusu frontend kuwasiliana na backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Tunafanya picha zilizopo kwenye uploads zipatikane kupitia browser
app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads",
)


# Tunaunganisha API routes zote
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "SHOPMANAGER API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }
