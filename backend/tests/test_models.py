"""Proves the five tables exist with the agreed shape and cascade deletes.

Runs against its own in-memory SQLite engine rather than the app's module
level one, so it exercises `Base.metadata.create_all` the same way startup
does without depending on test ordering or a file on disk.
"""

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models import Chat, Chunk, Document, Message, User


@pytest.fixture()
def session():
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}, future=True
    )

    @event.listens_for(engine, "connect")
    def _enable_fk(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_all_five_tables_are_created(session) -> None:
    table_names = set(Base.metadata.tables)

    assert table_names == {"users", "documents", "chunks", "chats", "messages"}


def test_chunk_embedding_round_trips_as_a_list_of_floats(session) -> None:
    user = User(email="a@example.com", password_hash="hash")
    session.add(user)
    session.flush()

    document = Document(user_id=user.id, filename="f.pdf", chunk_count=1)
    session.add(document)
    session.flush()

    chunk = Chunk(
        document_id=document.id,
        chunk_index=0,
        page=None,
        text="hello",
        embedding=[0.1, 0.2, 0.3],
    )
    session.add(chunk)
    session.commit()

    fetched = session.get(Chunk, chunk.id)
    assert fetched.embedding == [0.1, 0.2, 0.3]
    assert isinstance(fetched.embedding, list)


def test_deleting_a_document_cascades_to_its_chunks_and_chats(session) -> None:
    user = User(email="b@example.com", password_hash="hash")
    session.add(user)
    session.flush()

    document = Document(user_id=user.id, filename="f.pdf", chunk_count=1)
    session.add(document)
    session.flush()

    chunk = Chunk(document_id=document.id, chunk_index=0, page=1, text="t", embedding=[0.0])
    chat = Chat(user_id=user.id, document_id=document.id, title="t")
    session.add_all([chunk, chat])
    session.commit()

    chunk_id, chat_id = chunk.id, chat.id

    session.delete(document)
    session.commit()
    # expire_on_commit is False (to match production's SessionLocal), so the
    # session's identity map would otherwise still hand back the stale,
    # already-deleted instances from cache instead of reflecting the cascade
    # the database just performed.
    session.expire_all()

    assert session.get(Chunk, chunk_id) is None
    assert session.get(Chat, chat_id) is None


def test_deleting_a_chat_cascades_to_its_messages(session) -> None:
    user = User(email="c@example.com", password_hash="hash")
    session.add(user)
    session.flush()

    document = Document(user_id=user.id, filename="f.pdf", chunk_count=0)
    session.add(document)
    session.flush()

    chat = Chat(user_id=user.id, document_id=document.id, title="t")
    session.add(chat)
    session.flush()

    message = Message(chat_id=chat.id, role="user", content="hi", sources=None)
    session.add(message)
    session.commit()

    message_id = message.id

    session.delete(chat)
    session.commit()
    session.expire_all()

    assert session.get(Message, message_id) is None


def test_email_must_be_unique(session) -> None:
    session.add(User(email="dup@example.com", password_hash="h1"))
    session.commit()

    session.add(User(email="dup@example.com", password_hash="h2"))
    with pytest.raises(Exception):
        session.commit()
