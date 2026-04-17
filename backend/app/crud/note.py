from sqlalchemy.orm import Session

from app.models.note import Note
from app.schemas.note import NoteCreate


def get_user_notes(db: Session, user_id: int) -> list[Note]:
    return db.query(Note).filter(Note.user_id == user_id).all()


def create(db: Session, user_id: int, data: NoteCreate) -> Note:
    note = Note(
        user_id=user_id,
        book_id=data.book_id,
        page_number=data.page_number,
        text=data.text,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def delete(db: Session, note_id: int, user_id: int) -> bool:
    note = (
        db.query(Note)
        .filter(Note.id == note_id, Note.user_id == user_id)
        .first()
    )
    if not note:
        return False
    db.delete(note)
    db.commit()
    return True
