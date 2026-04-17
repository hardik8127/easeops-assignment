from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.faq import FAQ
from app.schemas.faq import FAQOut

router = APIRouter(prefix="/faqs", tags=["faqs"])


@router.get("/", response_model=list[FAQOut])
def list_faqs(db: Session = Depends(get_db)):
    return db.query(FAQ).order_by(FAQ.order).all()
