from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_ok():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_chat_ok_with_mock(monkeypatch):
    def fake_generate_reply(message: str, system_prompt: str | None = None):
        assert message == '테스트 메시지'
        assert system_prompt == '테스트 시스템'
        return '모의 응답', 'mock-model'

    monkeypatch.setattr('app.main.generate_reply', fake_generate_reply)

    response = client.post(
        '/chat',
        json={'message': '테스트 메시지', 'system_prompt': '테스트 시스템'},
    )

    assert response.status_code == 200
    assert response.json() == {'reply': '모의 응답', 'model': 'mock-model'}


def test_chat_validation_error():
    response = client.post('/chat', json={'message': ''})
    assert response.status_code == 422
