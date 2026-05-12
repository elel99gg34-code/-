from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="사용자 입력 메시지")
    system_prompt: str | None = Field(
        default="당신은 친절하고 실용적인 한국어 AI 어시스턴트입니다.",
        description="선택 시스템 프롬프트",
    )


class ChatResponse(BaseModel):
    reply: str
    model: str
