from sqlalchemy.orm import Session, joinedload

from app.models.book import Book
from app.models.category import Category
from app.models.tag import Tag


def get_all(
    db: Session,
    search: str | None = None,
    category_id: int | None = None,
    tag: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Book], int]:
    query = db.query(Book).options(
        joinedload(Book.category), joinedload(Book.tags)
    )

    if search:
        query = query.filter(
            Book.title.ilike(f"%{search}%") | Book.author.ilike(f"%{search}%")
        )
    if category_id:
        query = query.filter(Book.category_id == category_id)
    if tag:
        query = query.join(Book.tags).filter(Tag.name == tag)

    total = query.count()
    books = query.offset(skip).limit(limit).all()
    return books, total


def get_by_id(db: Session, book_id: int) -> Book | None:
    return (
        db.query(Book)
        .options(joinedload(Book.category), joinedload(Book.tags))
        .filter(Book.id == book_id)
        .first()
    )


def get_categories(db: Session) -> list[Category]:
    return db.query(Category).all()


def get_tags(db: Session) -> list[Tag]:
    return db.query(Tag).all()
