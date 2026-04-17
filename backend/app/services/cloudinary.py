import cloudinary
import cloudinary.uploader
import cloudinary.utils

from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_pdf(file_bytes: bytes, filename: str) -> dict:
    result = cloudinary.uploader.upload(
        file_bytes,
        resource_type="raw",
        folder="ebooks",
        public_id=filename,
        overwrite=True,
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def upload_image(file_bytes: bytes, filename: str) -> str:
    result = cloudinary.uploader.upload(
        file_bytes,
        resource_type="image",
        folder="covers",
        public_id=filename,
        overwrite=True,
    )
    return result["secure_url"]


def get_signed_url(public_id: str, expires_in: int = 3600) -> str:
    timestamp = cloudinary.utils.now() + expires_in
    signed_url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        resource_type="raw",
        type="upload",
        sign_url=True,
        expires_at=timestamp,
    )
    return signed_url


def delete_resource(public_id: str, resource_type: str = "raw") -> None:
    cloudinary.uploader.destroy(public_id, resource_type=resource_type)
