"""Engine, session factory and the request-scoped session dependency.

SQLite by default so a fresh clone runs with nothing but `pip install -r
requirements.txt` -- the approved architecture may name Postgres, but naming
one is not the same as having one, and a scaffold that cannot start without a
database server is a scaffold nobody runs. Point `DATABASE_URL` at the real
thing (read once, in app.config) when it exists; nothing else has to change.
"""

from collections.abc import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

DATABASE_URL = settings.database_url

# SQLite rejects a connection made on one thread and used on another, which is
# exactly what happens when FastAPI runs a sync dependency in its threadpool.
_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=_connect_args, future=True)

if DATABASE_URL.startswith("sqlite"):
    # SQLite ignores `ON DELETE CASCADE` unless foreign key enforcement is
    # turned on for the connection -- without this, deleting a document would
    # silently leave its chunks and chats behind on the SQLite fallback, but
    # not on Postgres, which is exactly the kind of fallback-only bug the
    # cascade-delete requirement exists to avoid.
    @event.listens_for(engine, "connect")
    def _enable_sqlite_foreign_keys(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Declarative base that every generated model inherits."""


def get_db() -> Iterator[Session]:
    """One session per request, closed even when the handler raises."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
