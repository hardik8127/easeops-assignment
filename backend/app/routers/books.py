from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.crud import book as book_crud
from app.schemas.book import BookDetailOut, BookOut, CategoryOut, TagOut

router = APIRouter(prefix="/books", tags=["books"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return book_crud.get_categories(db)


@router.get("/tags", response_model=list[TagOut])
def list_tags(db: Session = Depends(get_db)):
    return book_crud.get_tags(db)


@router.get("/", response_model=dict)
def list_books(
    search: str | None = Query(None),
    category_id: int | None = Query(None),
    tag: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    books, total = book_crud.get_all(db, search, category_id, tag, skip, page_size)
    return {
        "items": [BookOut.model_validate(b) for b in books],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{book_id}", response_model=BookDetailOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = book_crud.get_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return book
