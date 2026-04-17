from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str | None = None
    message: str


class ContactOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str
    email: str
    subject: str | None
    message: str
