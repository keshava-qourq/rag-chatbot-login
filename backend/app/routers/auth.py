"""Stub routes for the auth endpoints the approved API spec declares.

Real behaviour -- hashing and verifying passwords, issuing and reading JWTs --
is development-sprint work (see app.config for the JWT settings it will need
and app.models.User for the table it reads and writes). These stubs exist so
the route shapes, and the OpenAPI document that describes them, exist before
that work starts.
"""

from fastapi import APIRouter

from app.schemas import StubResponse

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=StubResponse)
async def register() -> StubResponse:
    return StubResponse(endpoint="POST /api/v1/auth/register")


@router.post("/login", response_model=StubResponse)
async def login() -> StubResponse:
    return StubResponse(endpoint="POST /api/v1/auth/login")


@router.get("/me", response_model=StubResponse)
async def me() -> StubResponse:
    return StubResponse(endpoint="GET /api/v1/auth/me")
