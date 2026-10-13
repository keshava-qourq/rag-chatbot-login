"""Proves each table has exactly the columns the architecture agreed to."""

from app.database import Base
from app.models import Chat, Chunk, Document, Message, User  # noqa: F401


def _columns(model) -> set[str]:
    return {c.name for c in model.__table__.columns}


def test_users_columns() -> None:
    assert _columns(User) == {"id", "email", "password_hash", "created_at"}


def test_documents_columns() -> None:
    assert _columns(Document) == {"id", "user_id", "filename", "chunk_count", "created_at"}


def test_chunks_columns() -> None:
    assert _columns(Chunk) == {"id", "document_id", "chunk_index", "page", "text", "embedding"}


def test_chats_columns() -> None:
    assert _columns(Chat) == {"id", "user_id", "document_id", "title", "created_at"}


def test_messages_columns() -> None:
    assert _columns(Message) == {
        "id",
        "chat_id",
        "role",
        "content",
        "sources",
        "created_at",
    }


def test_embedding_column_is_plain_json_not_a_vector_type() -> None:
    """The architecture requires a JSON list of numbers, not a Postgres-only
    vector type, so the same column works unchanged on the SQLite fallback and
    similarity search must be computed in Python/numpy rather than pushed down
    to a database-native vector operator."""
    from sqlalchemy import JSON

    embedding_type = Chunk.__table__.columns["embedding"].type
    assert isinstance(embedding_type, JSON)
