"""Pydantic request and response models.

One pair per entity in the approved data model, named and shaped to match the
approved API spec exactly, plus the placeholder every generated route returns
until it has been implemented. These are typed contracts only -- no
validation logic beyond what Pydantic gives for free, and no route below
builds a real one yet. That wiring is development-sprint work.

Email fields are plain `str`, not Pydantic's `EmailStr`: the latter needs the
`email-validator` package, which the approved architecture never asked for.
"""

from datetime import datetime

from pydantic import BaseModel


class StubResponse(BaseModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


# ---- auth --------------------------------------------------------------


class RegisterRequest(BaseModel):
    email: str
    password: str


class RegisterResponse(BaseModel):
    message: str


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str


class UserOut(BaseModel):
    id: int
    email: str


# ---- gemini key ----------------------------------------------------------


class KeyStatus(BaseModel):
    has_key: bool


class SetKeyRequest(BaseModel):
    api_key: str


# ---- documents -----------------------------------------------------------


class DocumentOut(BaseModel):
    id: int
    filename: str
    chunk_count: int
    created_at: datetime


# ---- chats and messages ---------------------------------------------------


class ChatCreateRequest(BaseModel):
    document_id: int


class ChatOut(BaseModel):
    id: int
    document_id: int
    title: str
    created_at: datetime


class MessageOut(BaseModel):
    role: str
    content: str
    sources: list | None = None
    created_at: datetime


class ChatDetail(BaseModel):
    id: int
    document_id: int
    title: str
    messages: list[MessageOut]


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str
    sources: list
