"""Stub routes for document upload, listing and deletion.

Real behaviour -- extraction, chunking, embedding and the cascade delete into
chunks and chats -- is development-sprint work against app.models.Document.
"""

from typing import Annotated

from fastapi import APIRouter, File, UploadFile

from app.schemas import StubResponse

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


@router.post("", response_model=StubResponse)
async def upload_document(file: Annotated[UploadFile, File()]) -> StubResponse:
    return StubResponse(endpoint="POST /api/v1/documents")


@router.get("", response_model=StubResponse)
async def list_documents() -> StubResponse:
    return StubResponse(endpoint="GET /api/v1/documents")


@router.delete("/{document_id}", status_code=204)
async def delete_document(document_id: int) -> None:
    return None
