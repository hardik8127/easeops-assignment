from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_db, get_admin_user
from app.models.user import User
from app.models.book import Book
from app.models.category import Category
from app.models.tag import Tag
from app.models.faq import FAQ
from app.models.survey import Survey
from app.models.contact import ContactRequest
from app.schemas.user import UserOut
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Schemas ──────────────────────────────────────────────────────────────────

class CategoryIn(BaseModel):
    name: str

class CategoryOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    name: str

class TagIn(BaseModel):
    name: str

class TagOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    name: str

class BookIn(BaseModel):
    title: str
    author: str
    description: str | None = None
    category_id: int | None = None
    cloudinary_url: str
    cloudinary_public_id: str
    cover_url: str | None = None
    total_pages: int | None = None
    tag_ids: list[int] = []

class BookOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    title: str
    author: str
    description: str | None
    cloudinary_url: str
    cover_url: str | None
    total_pages: int | None
    category_id: int | None

class FAQIn(BaseModel):
    question: str
    answer: str

class FAQOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    question: str
    answer: str

class SurveyIn(BaseModel):
    title: str
    questions: list

class SurveyOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    title: str
    questions: list

class ContactOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    name: str
    email: str
    subject: str | None
    message: str


# ── Categories ───────────────────────────────────────────────────────────────

@router.get("/categories", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Category).all()

@router.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(data: CategoryIn, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    existing = db.query(Category).filter(Category.name == data.name).first()
    if existing:
        raise HTTPException(status_code=409, detail="Category already exists")
    cat = Category(name=data.name)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/categories/{cat_id}", status_code=204)
def delete_category(cat_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(cat)
    db.commit()


# ── Tags ─────────────────────────────────────────────────────────────────────

@router.get("/tags", response_model=List[TagOut])
def list_tags(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Tag).all()

@router.post("/tags", response_model=TagOut, status_code=201)
def create_tag(data: TagIn, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    tag = Tag(name=data.name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag

@router.delete("/tags/{tag_id}", status_code=204)
def delete_tag(tag_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(tag)
    db.commit()


# ── Books ────────────────────────────────────────────────────────────────────

@router.get("/books", response_model=List[BookOut])
def list_books(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Book).all()

@router.post("/books", response_model=BookOut, status_code=201)
def create_book(data: BookIn, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    tags = db.query(Tag).filter(Tag.id.in_(data.tag_ids)).all()
    book = Book(
        title=data.title,
        author=data.author,
        description=data.description,
        category_id=data.category_id,
        cloudinary_url=data.cloudinary_url,
        cloudinary_public_id=data.cloudinary_public_id,
        cover_url=data.cover_url,
        total_pages=data.total_pages,
        tags=tags,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@router.put("/books/{book_id}", response_model=BookOut)
def update_book(book_id: int, data: BookIn, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Not found")
    for field in ("title", "author", "description", "category_id", "cloudinary_url", "cloudinary_public_id", "cover_url", "total_pages"):
        setattr(book, field, getattr(data, field))
    book.tags = db.query(Tag).filter(Tag.id.in_(data.tag_ids)).all()
    db.commit()
    db.refresh(book)
    return book

@router.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(book)
    db.commit()


# ── FAQs ─────────────────────────────────────────────────────────────────────

@router.get("/faqs", response_model=List[FAQOut])
def list_faqs(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(FAQ).all()

@router.post("/faqs", response_model=FAQOut, status_code=201)
def create_faq(data: FAQIn, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    faq = FAQ(question=data.question, answer=data.answer)
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq

@router.delete("/faqs/{faq_id}", status_code=204)
def delete_faq(faq_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(faq)
    db.commit()


# ── Surveys ──────────────────────────────────────────────────────────────────

@router.get("/surveys", response_model=List[SurveyOut])
def list_surveys(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Survey).all()

@router.post("/surveys", response_model=SurveyOut, status_code=201)
def create_survey(data: SurveyIn, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    survey = Survey(title=data.title, questions=data.questions)
    db.add(survey)
    db.commit()
    db.refresh(survey)
    return survey

@router.delete("/surveys/{survey_id}", status_code=204)
def delete_survey(survey_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(survey)
    db.commit()


# ── Contact requests ─────────────────────────────────────────────────────────

@router.get("/contacts", response_model=List[ContactOut])
def list_contacts(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(ContactRequest).order_by(ContactRequest.id.desc()).all()


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(User).all()

@router.patch("/users/{user_id}/toggle-admin", response_model=UserOut)
def toggle_admin(user_id: int, db: Session = Depends(get_db), current: User = Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    if user.id == current.id:
        raise HTTPException(status_code=400, detail="Cannot change your own admin status")
    user.is_admin = not user.is_admin
    db.commit()
    db.refresh(user)
    return user
