from sqlalchemy.orm import Session

from app.models.bookmark import Bookmark
from app.schemas.bookmark import BookmarkCreate


def get_user_bookmarks(db: Session, user_id: int) -> list[Bookmark]:
    return db.query(Bookmark).filter(Bookmark.user_id == user_id).all()


def create(db: Session, user_id: int, data: BookmarkCreate) -> Bookmark:
    bookmark = Bookmark(
        user_id=user_id,
        book_id=data.book_id,
        page_number=data.page_number,
        label=data.label,
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark


def delete(db: Session, bookmark_id: int, user_id: int) -> bool:
    bookmark = (
        db.query(Bookmark)
        .filter(Bookmark.id == bookmark_id, Bookmark.user_id == user_id)
        .first()
    )
    if not bookmark:
        return False
    db.delete(bookmark)
    db.commit()
    return True
