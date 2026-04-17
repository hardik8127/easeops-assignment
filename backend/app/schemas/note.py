from datetime import datetime

from pydantic import BaseModel


class NoteCreate(BaseModel):
    book_id: int
    page_number: int
    text: str


class NoteOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    book_id: int
    page_number: int
    text: str
    created_at: datetime
