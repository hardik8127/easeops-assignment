from datetime import datetime

from pydantic import BaseModel


class CategoryOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str
    slug: str


class TagOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str


class BookOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    title: str
    author: str
    description: str | None
    cover_url: str | None
    total_pages: int | None
    created_at: datetime
    category: CategoryOut | None
    tags: list[TagOut]


class BookDetailOut(BookOut):
    cloudinary_url: str


class BookListParams(BaseModel):
    search: str | None = None
    category_id: int | None = None
    tag: str | None = None
    page: int = 1
    page_size: int = 20
