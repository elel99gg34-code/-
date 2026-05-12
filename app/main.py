from fastapi import FastAPI, HTTPException

from app.schemas import ChatRequest, ChatResponse
from app.service import generate_reply

app = FastAPI(title="Generative AI Starter API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    try:
        reply, model = generate_reply(req.message, req.system_prompt)
        return ChatResponse(reply=reply, model=model)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"생성 중 오류: {e}") from e
