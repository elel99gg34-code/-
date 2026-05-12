import pytest

from app import service


def test_generate_reply_without_key(monkeypatch):
    monkeypatch.delenv('OPENAI_API_KEY', raising=False)

    with pytest.raises(ValueError):
        service.generate_reply('hello')


def test_generate_answers_calls_generate_reply(monkeypatch):
    def fake_generate_reply(message: str, system_prompt: str | None = None):
        return f'답변:{message}', 'mock-model'

    monkeypatch.setattr(service, 'generate_reply', fake_generate_reply)

    answers, model = service.generate_answers(['Q1', 'Q2'], 'sys')
    assert answers == ['답변:Q1', '답변:Q2']
    assert model == service.DEFAULT_MODEL
