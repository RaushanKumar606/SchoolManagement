
import uuid
from pathlib import Path

from decouple import config
from supabase import create_client


SUPABASE_URL = config("SUPABASE_URL")
SUPABASE_SECRET_KEY = config("SUPABASE_SECRET_KEY")

SUPABASE_BUCKET = config(
    "SUPABASE_BUCKET",
    default="school-documents"
)

SIGNED_URL_EXPIRY = config(
    "SUPABASE_SIGNED_URL_EXPIRY",
    default=300,
    cast=int
)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)


ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "application/pdf",
}


def upload_document(uploaded_file, folder):

    content_type = uploaded_file.content_type

    if content_type not in ALLOWED_MIME_TYPES:
        raise ValueError(
            f"Unsupported file type: {content_type}"
        )

    extension = Path(uploaded_file.name).suffix.lower()

    allowed_extensions = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".pdf": "application/pdf",
    }

    if allowed_extensions.get(extension) != content_type:
        raise ValueError("File extension and MIME type do not match.")

    object_name = f"{uuid.uuid4().hex}{extension}"
    object_path = f"{folder}/{object_name}"

    uploaded_file.seek(0)
    file_bytes = uploaded_file.read()
    uploaded_file.seek(0)

    supabase.storage.from_(SUPABASE_BUCKET).upload(
        path=object_path,
        file=file_bytes,
        file_options={
            "content-type": content_type,
            "upsert": "false",
        }
    )

    return object_path


def create_document_signed_url(object_path):

    if not object_path:
        return None

    result = supabase.storage.from_(
        SUPABASE_BUCKET
    ).create_signed_url(
        object_path,
        SIGNED_URL_EXPIRY
    )

    return (
        result.get("signedURL")
        or result.get("signedUrl")
    )


def delete_document(object_path):

    if object_path:
        supabase.storage.from_(
            SUPABASE_BUCKET
        ).remove([object_path])
