from datetime import datetime

from pydantic import BaseModel


class SurveyOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    title: str
    questions: list
    is_active: bool
    created_at: datetime


class SurveyRespondRequest(BaseModel):
    answers: dict
