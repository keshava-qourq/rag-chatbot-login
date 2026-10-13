"""Confirms the approved API spec's routes exist in the running app.

Each handler is still a stub (see app/routers/*.py), so this only proves the
toolchain is wired end to end -- the app imports, the routers are included
and the OpenAPI document lists every endpoint the spec declares -- not that
any of them do the real work yet.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

EXPECTED_PATHS = {
    "/api/v1/auth/register",
    "/api/v1/auth/login",
    "/api/v1/auth/me",
    "/api/v1/key/status",
    "/api/v1/key",
    "/api/v1/documents",
    "/api/v1/documents/{document_id}",
    "/api/v1/chats",
    "/api/v1/chats/{chat_id}",
    "/api/v1/chats/{chat_id}/messages",
}


def test_every_spec_path_is_registered() -> None:
    paths = client.get("/openapi.json").json()["paths"]
    missing = EXPECTED_PATHS - set(paths)
    assert not missing, f"missing from the OpenAPI document: {missing}"


def test_a_stub_route_returns_its_placeholder() -> None:
    response = client.get("/api/v1/key/status")

    assert response.status_code == 200
    assert response.json()["status"] == "not_implemented"
