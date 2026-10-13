"""Stub routes for the per-user Gemini key endpoints.

Real behaviour reads and writes app.gemini_keys, the in-memory store the
architecture requires -- that wiring, and the auth guard it depends on, is
development-sprint work.
"""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(prefix="/api/v1/key", tags=["key"])


@router.get("/status", response_model=StubResponse)
async def key_status() -> StubResponse:
    return StubResponse(endpoint="GET /api/v1/key/status")


@router.post("", response_model=StubResponse)
async def set_key() -> StubResponse:
    return StubResponse(endpoint="POST /api/v1/key")
