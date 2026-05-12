# 생성형 AI 빠른 시작 템플릿

이 저장소는 **바로 실행 가능한 생성형 AI 백엔드 MVP** 템플릿입니다.

## 기능
- FastAPI 기반 `/chat` API
- OpenAI Responses API 호출
- 환경 변수 기반 설정

## 실행 방법
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# .env에 OPENAI_API_KEY 입력
uvicorn app.main:app --reload --port 8000
```

## 테스트 호출
```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"안녕하세요, 오늘 할 일 3가지 추천해줘"}'
```

## 파일 구조
- `app/main.py`: FastAPI 앱 엔트리
- `app/schemas.py`: 요청/응답 스키마
- `app/service.py`: 모델 호출 로직
- `requirements.txt`: 의존성
