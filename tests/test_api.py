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
    assert response.json() == {'reply': '모의 응답', 'answers': None, 'model': 'mock-model'}


def test_chat_multi_question_ok(monkeypatch):
    def fake_generate_answers(questions: list[str], system_prompt: str | None = None):
        assert questions == ['첫 질문', '둘째 질문']
        assert system_prompt == '멀티 시스템'
        return ['첫 답변', '둘째 답변'], 'mock-model'

    monkeypatch.setattr('app.main.generate_answers', fake_generate_answers)

    response = client.post(
        '/chat',
        json={'questions': ['첫 질문', '둘째 질문'], 'system_prompt': '멀티 시스템'},
    )

    assert response.status_code == 200
    assert response.json() == {'reply': None, 'answers': ['첫 답변', '둘째 답변'], 'model': 'mock-model'}


def test_chat_validation_error_when_empty_payload():
    response = client.post('/chat', json={})
    assert response.status_code == 422
