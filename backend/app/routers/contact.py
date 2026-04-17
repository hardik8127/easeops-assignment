from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.contact import ContactRequest
from app.schemas.contact import ContactCreate, ContactOut

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=ContactOut, status_code=201)
def submit_contact(data: ContactCreate, db: Session = Depends(get_db)):
    contact = ContactRequest(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact
