"""Proves settings are environment-driven, defaulted, and generated when unset."""

import importlib
import logging


def _reload_config(monkeypatch, **env):
    for key in (
        "DATABASE_URL",
        "JWT_SECRET",
        "GEMINI_API_KEY",
        "GEMINI_CHAT_MODEL",
        "GEMINI_EMBED_MODEL",
    ):
        monkeypatch.delenv(key, raising=False)
    for key, value in env.items():
        monkeypatch.setenv(key, value)

    from app import config

    return importlib.reload(config)


def test_sqlite_is_the_default_database(monkeypatch) -> None:
    config = _reload_config(monkeypatch)

    assert config.settings.database_url == "sqlite:///./app.db"


def test_database_url_is_read_from_the_environment(monkeypatch) -> None:
    config = _reload_config(monkeypatch, DATABASE_URL="postgresql://user:pw@host/db")

    assert config.settings.database_url == "postgresql://user:pw@host/db"


def test_unset_jwt_secret_is_generated_and_warned_about(monkeypatch, caplog) -> None:
    with caplog.at_level(logging.WARNING):
        config = _reload_config(monkeypatch)

    assert config.settings.jwt_secret
    assert any("restart" in record.message for record in caplog.records)


def test_set_jwt_secret_is_used_verbatim(monkeypatch) -> None:
    config = _reload_config(monkeypatch, JWT_SECRET="a-fixed-secret")

    assert config.settings.jwt_secret == "a-fixed-secret"


def test_gemini_model_defaults(monkeypatch) -> None:
    config = _reload_config(monkeypatch)

    assert config.settings.gemini_chat_model == "gemini-2.5-flash"
    assert config.settings.gemini_embed_model == "gemini-embedding-001"


def test_gemini_models_are_overridable(monkeypatch) -> None:
    config = _reload_config(
        monkeypatch, GEMINI_CHAT_MODEL="custom-chat", GEMINI_EMBED_MODEL="custom-embed"
    )

    assert config.settings.gemini_chat_model == "custom-chat"
    assert config.settings.gemini_embed_model == "custom-embed"


def test_unset_gemini_api_key_enables_bring_your_own_key(monkeypatch) -> None:
    config = _reload_config(monkeypatch)

    assert config.settings.gemini_api_key is None
    assert config.settings.byok_required is True


def test_set_gemini_api_key_disables_bring_your_own_key(monkeypatch) -> None:
    config = _reload_config(monkeypatch, GEMINI_API_KEY="shared-key")

    assert config.settings.gemini_api_key == "shared-key"
    assert config.settings.byok_required is False
