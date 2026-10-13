"""Stub routes for chat and message endpoints.

Real behaviour -- retrieval, grounded answering and persisting both sides of
the exchange -- is development-sprint work against app.models.Chat and
app.models.Message.
"""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(prefix="/api/v1/chats", tags=["chats"])


@router.post("", response_model=StubResponse)
async def create_chat() -> StubResponse:
    return StubResponse(endpoint="POST /api/v1/chats")


@router.get("", response_model=StubResponse)
async def list_chats() -> StubResponse:
    return StubResponse(endpoint="GET /api/v1/chats")


@router.get("/{chat_id}", response_model=StubResponse)
async def get_chat(chat_id: int) -> StubResponse:
    return StubResponse(endpoint="GET /api/v1/chats/{id}")


@router.delete("/{chat_id}", status_code=204)
async def delete_chat(chat_id: int) -> None:
    return None


@router.post("/{chat_id}/messages", response_model=StubResponse)
async def post_message(chat_id: int) -> StubResponse:
    return StubResponse(endpoint="POST /api/v1/chats/{id}/messages")
