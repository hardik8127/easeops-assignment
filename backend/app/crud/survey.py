from sqlalchemy.orm import Session

from app.models.survey import Survey, SurveyResponse


def get_active(db: Session) -> list[Survey]:
    return db.query(Survey).filter(Survey.is_active == True).all()


def get_by_id(db: Session, survey_id: int) -> Survey | None:
    return db.query(Survey).filter(Survey.id == survey_id).first()


def create_response(
    db: Session, survey_id: int, user_id: int | None, answers: dict
) -> SurveyResponse:
    response = SurveyResponse(
        survey_id=survey_id,
        user_id=user_id,
        answers=answers,
    )
    db.add(response)
    db.commit()
    db.refresh(response)
    return response
