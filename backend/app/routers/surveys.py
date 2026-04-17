from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.crud import survey as survey_crud
from app.models.user import User
from app.schemas.survey import SurveyOut, SurveyRespondRequest

router = APIRouter(prefix="/surveys", tags=["surveys"])


@router.get("/", response_model=list[SurveyOut])
def list_surveys(db: Session = Depends(get_db)):
    return survey_crud.get_active(db)


@router.post("/{survey_id}/respond", status_code=201)
def respond(
    survey_id: int,
    data: SurveyRespondRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    survey = survey_crud.get_by_id(db, survey_id)
    if not survey:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
    user_id = current_user.id if current_user else None
    survey_crud.create_response(db, survey_id, user_id, data.answers)
    return {"detail": "Response recorded"}
