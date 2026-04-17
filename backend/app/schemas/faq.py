from pydantic import BaseModel


class FAQOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    question: str
    answer: str
    order: int
