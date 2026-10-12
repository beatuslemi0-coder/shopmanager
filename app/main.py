from pathlib import Path


from app.core.paths import UPLOAD_DIR

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.router import api_router
import os
import cloudinary



app = FastAPI(
    title="SHOPMANAGER API",
    version="1.0.0",
)

allowed_origins = settings.cors_list or [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

# CORS allows the browser frontend to talk to the API from local dev servers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
