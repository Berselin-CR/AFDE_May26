from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class FeedbackBase(BaseModel):
    participant_name: str = Field(..., min_length=1, max_length=255)
    program_name: str = Field(..., min_length=1, max_length=255)
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = None

    @validator("rating")
    def rating_must_be_valid(cls, v):
        if v not in range(1, 6):
            raise ValueError("Rating must be between 1 and 5")
        return v


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(BaseModel):
    participant_name: Optional[str] = Field(None, min_length=1, max_length=255)
    program_name: Optional[str] = Field(None, min_length=1, max_length=255)
    rating: Optional[int] = Field(None, ge=1, le=5)
    comments: Optional[str] = None


class FeedbackResponse(FeedbackBase):
    feedback_id: int
    submitted_at: datetime

    model_config = {"from_attributes": True}


class SearchParams(BaseModel):
    keyword: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    program_name: Optional[str] = None
