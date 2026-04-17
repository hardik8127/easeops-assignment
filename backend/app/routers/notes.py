from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.crud import note as note_crud
from app.models.user import User
from app.schemas.note import NoteCreate, NoteOut

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=list[NoteOut])
def list_notes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return note_crud.get_user_notes(db, current_user.id)


@router.post("/", response_model=NoteOut, status_code=201)
def add_note(
    data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return note_crud.create(db, current_user.id, data)


@router.delete("/{note_id}", status_code=204)
def remove_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = note_crud.delete(db, note_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
