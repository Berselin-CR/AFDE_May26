from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

import models
import crud
import schemas
from database import engine, get_db
from routers import feedback as feedback_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Learn Next Feedback Management System",
    description="A centralized platform to collect, store, search, and manage feedback.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feedback_router.router)


@app.get("/api/search", response_model=List[schemas.FeedbackResponse], tags=["Search"])
def search_feedback(
    keyword: Optional[str] = Query(None, description="Search in name, program, or comments"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by exact rating (1–5)"),
    program_name: Optional[str] = Query(None, description="Filter by program/event name"),
    db: Session = Depends(get_db),
):
    return crud.search_feedback(db, keyword=keyword, rating=rating, program_name=program_name)


# Serve React build — must come after all API routes
DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

@app.get("/", response_class=FileResponse, include_in_schema=False)
def serve_root():
    return FileResponse(os.path.join(DIST_DIR, "index.html"))

@app.get("/{full_path:path}", response_class=FileResponse, include_in_schema=False)
def serve_react(full_path: str):
    return FileResponse(os.path.join(DIST_DIR, "index.html"))
