from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.core.config import settings
from app.crud import user as user_crud
from app.models.refresh_token import RefreshToken
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


def register(db: Session, data: RegisterRequest) -> TokenResponse:
    if user_crud.get_by_email(db, data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    user = user_crud.create(db, data)
    return _issue_tokens(db, user.id)


def login(db: Session, data: LoginRequest) -> TokenResponse:
    user = user_crud.get_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
    return _issue_tokens(db, user.id)


def refresh(db: Session, token: str) -> TokenResponse:
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    db_token = db.query(RefreshToken).filter(RefreshToken.token == token).first()
    if not db_token or db_token.is_revoked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked or not found")

    if db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    db_token.is_revoked = True
    db.commit()

    user_id = int(payload["sub"])
    return _issue_tokens(db, user_id)


def logout(db: Session, token: str) -> None:
    db_token = db.query(RefreshToken).filter(RefreshToken.token == token).first()
    if db_token:
        db_token.is_revoked = True
        db.commit()


def _issue_tokens(db: Session, user_id: int) -> TokenResponse:
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)

    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db_token = RefreshToken(user_id=user_id, token=refresh, expires_at=expires_at)
    db.add(db_token)
    db.commit()

    return TokenResponse(access_token=access, refresh_token=refresh)
