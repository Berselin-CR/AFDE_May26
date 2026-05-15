from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import crud
import schemas
from database import get_db

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])


def require_admin(x_role: Optional[str] = Header(None)):
    if x_role != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")


@router.get("/", response_model=List[schemas.FeedbackResponse])
def get_all_feedback(db: Session = Depends(get_db)):
    """Retrieve all feedback entries."""
    return crud.get_all_feedback(db)


@router.get("/{feedback_id}", response_model=schemas.FeedbackResponse)
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    """Retrieve a single feedback entry by ID."""
    feedback = crud.get_feedback_by_id(db, feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback


@router.post("/", response_model=schemas.FeedbackResponse, status_code=201)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    """Submit a new feedback entry."""
    return crud.create_feedback(db, feedback)


@router.put("/{feedback_id}", response_model=schemas.FeedbackResponse, dependencies=[Depends(require_admin)])
def update_feedback(
    feedback_id: int, feedback: schemas.FeedbackUpdate, db: Session = Depends(get_db)
):
    """Update an existing feedback entry. Requires Administrator role."""
    updated = crud.update_feedback(db, feedback_id, feedback)
    if not updated:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return updated


@router.delete("/{feedback_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    """Delete a feedback entry. Requires Administrator role."""
    deleted = crud.delete_feedback(db, feedback_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Feedback not found")
