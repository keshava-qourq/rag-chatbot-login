"""Per-user in-memory store for pasted Gemini API keys.

The architecture is explicit that a user's pasted key is kept in process
memory only -- never written to the database, never logged, never echoed back
in a response. A dict keyed by user id, guarded by a lock, is enough for that:
it holds nothing across a restart, and nothing here ever serialises it.
"""

from threading import Lock

_keys: dict[int, str] = {}
_lock = Lock()


def set_key(user_id: int, api_key: str) -> None:
    """Remember `api_key` for `user_id` for the life of this process."""
    with _lock:
        _keys[user_id] = api_key


def get_key(user_id: int) -> str | None:
    """Return the pasted key for `user_id`, or None if none was ever set."""
    with _lock:
        return _keys.get(user_id)


def has_key(user_id: int) -> bool:
    """Whether `user_id` has a pasted key available right now."""
    with _lock:
        return user_id in _keys


def clear_key(user_id: int) -> None:
    """Forget `user_id`'s pasted key, if any."""
    with _lock:
        _keys.pop(user_id, None)
