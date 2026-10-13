"""Generated routers: one per resource the approved API spec declares.

`main.py` includes every router in `routers` under its own prefix, so a new
resource only has to add its module here to be wired into the app.
"""

from app.routers.auth import router as auth_router
from app.routers.chats import router as chats_router
from app.routers.documents import router as documents_router
from app.routers.keys import router as keys_router

routers = [auth_router, keys_router, documents_router, chats_router]

__all__ = ["routers"]
