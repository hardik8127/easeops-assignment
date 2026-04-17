from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str
    email: EmailStr
    dark_mode: bool
    is_active: bool
    is_admin: bool
    created_at: datetime


class UserUpdate(BaseModel):
    name: str | None = None
    dark_mode: bool | None = None
