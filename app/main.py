from fastapi import FastAPI, HTTPException

from app.schemas import ChatRequest, ChatResponse
from app.service import generate_answers, generate_reply

app = FastAPI(title="Generative AI Starter API", version="0.2.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    try:
        if req.questions:
            answers, model = generate_answers(req.questions, req.system_prompt)
            return ChatResponse(answers=answers, model=model)

        reply, model = generate_reply(req.message or "", req.system_prompt)
        return ChatResponse(reply=reply, model=model)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"생성 중 오류: {e}") from e
