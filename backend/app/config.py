"""Process-wide settings loaded from the environment.

Every environment variable the approved architecture names lives here, so a
route or background job reads `app.config.SOMETHING` instead of calling
`os.getenv` inline and risking a second, disagreeing default elsewhere.
Nothing here hardcodes a secret or a key -- every value is either read from
the environment or, where the architecture explicitly allows it, generated at
startup.
"""

import logging
import os
import secrets

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


JWT_SECRET: str = _load_jwt_secret()
JWT_ALGORITHM: str = "HS256"
JWT_EXPIRES_MINUTES: int = 24 * 60

# Set only when the deployment provides a shared key. When it is unset, each
# user pastes their own after logging in; see app.gemini_keys for where that
# key lives. It is never stored, logged or returned either way.
GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY") or None
GEMINI_CHAT_MODEL: str = os.getenv("GEMINI_CHAT_MODEL", "gemini-2.5-flash")
GEMINI_EMBED_MODEL: str = os.getenv("GEMINI_EMBED_MODEL", "gemini-embedding-001")

# The free-tier document size limit the architecture names explicitly.
MAX_UPLOAD_BYTES: int = 2 * 1024 * 1024
