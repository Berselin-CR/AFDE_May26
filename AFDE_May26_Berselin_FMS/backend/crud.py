from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import models
import schemas


def get_all_feedback(db: Session) -> List[models.Feedback]:
    return db.query(models.Feedback).order_by(models.Feedback.submitted_at.desc()).all()


def get_feedback_by_id(db: Session, feedback_id: int) -> Optional[models.Feedback]:
    return db.query(models.Feedback).filter(models.Feedback.feedback_id == feedback_id).first()


def create_feedback(db: Session, feedback: schemas.FeedbackCreate) -> models.Feedback:
    db_feedback = models.Feedback(
        participant_name=feedback.participant_name,
        program_name=feedback.program_name,
        rating=feedback.rating,
        comments=feedback.comments,
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def update_feedback(
    db: Session, feedback_id: int, feedback: schemas.FeedbackUpdate
) -> Optional[models.Feedback]:
    db_feedback = get_feedback_by_id(db, feedback_id)
    if not db_feedback:
        return None

    update_data = feedback.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_feedback, field, value)

    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def delete_feedback(db: Session, feedback_id: int) -> bool:
    db_feedback = get_feedback_by_id(db, feedback_id)
    if not db_feedback:
        return False
    db.delete(db_feedback)
    db.commit()
    return True


def search_feedback(
    db: Session,
    keyword: Optional[str] = None,
    rating: Optional[int] = None,
    program_name: Optional[str] = None,
) -> List[models.Feedback]:
    query = db.query(models.Feedback)

    if keyword:
        query = query.filter(
            or_(
                models.Feedback.participant_name.ilike(f"%{keyword}%"),
                models.Feedback.program_name.ilike(f"%{keyword}%"),
                models.Feedback.comments.ilike(f"%{keyword}%"),
            )
        )

    if rating is not None:
        query = query.filter(models.Feedback.rating == rating)

    if program_name:
        query = query.filter(models.Feedback.program_name.ilike(f"%{program_name}%"))

    return query.order_by(models.Feedback.submitted_at.desc()).all()
