"""Grep-style guard: configuration values must come only from app.config.

If a model, route or the app entrypoint ever hardcodes the SQLite URL, the
Gemini model names, or a JWT algorithm instead of reading `app.config.settings`
(or one of its flat aliases), a later deployment that overrides the
environment variable would silently keep using the old literal. This checks
the source text of every non-config module for those literals.
"""

from pathlib import Path

APP_DIR = Path(__file__).resolve().parent.parent / "app"

# Modules allowed to hold the literal because they *are* the configuration
# layer -- everything else must obtain the value through `app.config`.
EXEMPT_FILES = {"config.py"}

FORBIDDEN_LITERALS = [
    "sqlite:///./app.db",
    "gemini-2.5-flash",
    "gemini-embedding-001",
]


def _non_config_source_files():
    for path in APP_DIR.rglob("*.py"):
        if path.name in EXEMPT_FILES:
            continue
        yield path


def test_no_module_other_than_config_hardcodes_a_configuration_literal() -> None:
    offenders = []
    for path in _non_config_source_files():
        text = path.read_text()
        for literal in FORBIDDEN_LITERALS:
            if literal in text:
                offenders.append(f"{path.relative_to(APP_DIR.parent)}: {literal!r}")

    assert not offenders, f"hardcoded configuration literals found: {offenders}"
