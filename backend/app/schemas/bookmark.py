from datetime import datetime

from pydantic import BaseModel


class BookmarkCreate(BaseModel):
    book_id: int
    page_number: int
    label: str | None = None


class BookmarkOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    book_id: int
    page_number: int
    label: str | None
    created_at: datetime
