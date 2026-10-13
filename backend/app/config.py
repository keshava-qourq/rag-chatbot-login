"""Process-wide settings loaded from the environment.

Every environment variable the approved architecture names is read here, and
nowhere else -- a route or background job depends on `app.config.settings`
instead of calling `os.getenv` inline and risking a second, disagreeing
default elsewhere. Nothing here hardcodes a secret or a key: every value is
either read from the environment or, where the architecture explicitly
allows it, generated at startup.
"""

import logging
import os
import secrets
from dataclasses import dataclass

logger = logging.getLogger(__name__)


def _load_jwt_secret() -> str:
    """Use JWT_SECRET when set; otherwise mint one for this process only.

    An unset secret means every restart invalidates every issued token. The
    architecture accepts that trade-off explicitly, but it must not pass
    silently -- hence the warning rather than a quiet fallback.
    """
    secret = os.getenv("JWT_SECRET")
    if secret:
        return secret
    logger.warning(
        "JWT_SECRET is not set; generated a random secret for this process. "
        "All users will be logged out the next time the server restarts."
    )
    return secrets.token_urlsafe(32)


@dataclass(frozen=True)
class Settings:
    """The single object every later module depends on for configuration."""

    database_url: str
    jwt_secret: str
    jwt_algorithm: str
    jwt_expires_minutes: int
    gemini_api_key: str | None
    gemini_chat_model: str
    gemini_embed_model: str
    max_upload_bytes: int

    @property
    def byok_required(self) -> bool:
        """True when no shared Gemini key is configured.

        In that case every user must paste their own key after logging in
        (see app.gemini_keys for where that key is held, in memory, for the
        life of the process).
        """
        return self.gemini_api_key is None


def _load_settings() -> Settings:
    return Settings(
        database_url=os.getenv("DATABASE_URL", "sqlite:///./app.db"),
        jwt_secret=_load_jwt_secret(),
        jwt_algorithm="HS256",
        jwt_expires_minutes=24 * 60,
        # Set only when the deployment provides a shared key. When it is
        # unset, each user pastes their own; it is never stored, logged or
        # returned either way.
        gemini_api_key=os.getenv("GEMINI_API_KEY") or None,
        gemini_chat_model=os.getenv("GEMINI_CHAT_MODEL", "gemini-2.5-flash"),
        gemini_embed_model=os.getenv("GEMINI_EMBED_MODEL", "gemini-embedding-001"),
        # The free-tier document size limit the architecture names explicitly.
        max_upload_bytes=2 * 1024 * 1024,
    )


settings: Settings = _load_settings()

# Flat module-level aliases, kept so existing and generated code can import
# the individual values directly without reaching through the settings
# object. They are derived from -- never a second source of truth alongside
# -- `settings` above.
DATABASE_URL = settings.database_url
JWT_SECRET = settings.jwt_secret
JWT_ALGORITHM = settings.jwt_algorithm
JWT_EXPIRES_MINUTES = settings.jwt_expires_minutes
GEMINI_API_KEY = settings.gemini_api_key
GEMINI_CHAT_MODEL = settings.gemini_chat_model
GEMINI_EMBED_MODEL = settings.gemini_embed_model
MAX_UPLOAD_BYTES = settings.max_upload_bytes
