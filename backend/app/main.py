import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.routers import admin, auth, books, bookmarks, contact, faqs, notes, proxy, surveys, users

app = FastAPI(
    title="EaseOps E-Library API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(books.router, prefix=API_PREFIX)
app.include_router(bookmarks.router, prefix=API_PREFIX)
app.include_router(notes.router, prefix=API_PREFIX)
app.include_router(surveys.router, prefix=API_PREFIX)
app.include_router(faqs.router, prefix=API_PREFIX)
app.include_router(contact.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)
app.include_router(proxy.router, prefix=API_PREFIX)


@app.get("/health")
def health():
    return {"status": "ok"}


# Serve React frontend static files (production only)
_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
_dist = os.path.abspath(_dist)

if os.path.isdir(_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        index = os.path.join(_dist, "index.html")
        return FileResponse(index)
