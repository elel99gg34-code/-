import pytest

from app import service


def test_generate_reply_without_key(monkeypatch):
    monkeypatch.delenv('OPENAI_API_KEY', raising=False)

    with pytest.raises(ValueError):
        service.generate_reply('hello')
