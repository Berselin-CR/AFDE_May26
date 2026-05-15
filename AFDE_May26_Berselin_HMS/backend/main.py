from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from database import engine, get_db
import models
from schemas import TicketResponse
import crud
from routers import tickets
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Helpdesk Ticket Management System",
    description="Phase 1 — Core ticket management API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router)


@app.get("/api/search", response_model=List[TicketResponse])
def search_tickets(
    keyword: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud.search_tickets(db, keyword=keyword, category=category, status=status)


# Serve React build — must come after all API routes
DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

@app.get("/", response_class=FileResponse, include_in_schema=False)
def serve_root():
    return FileResponse(os.path.join(DIST_DIR, "index.html"))

@app.get("/{full_path:path}", response_class=FileResponse, include_in_schema=False)
def serve_react(full_path: str):
    return FileResponse(os.path.join(DIST_DIR, "index.html"))
