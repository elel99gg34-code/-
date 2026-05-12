from pydantic import BaseModel, Field, model_validator


class ChatRequest(BaseModel):
    message: str | None = Field(default=None, description="단일 사용자 입력 메시지")
    questions: list[str] | None = Field(default=None, description="여러 질문을 한 번에 전달")
    system_prompt: str | None = Field(
        default="당신은 친절하고 실용적인 한국어 AI 어시스턴트입니다.",
        description="선택 시스템 프롬프트",
    )

    @model_validator(mode="after")
    def validate_message_or_questions(self):
        has_message = bool(self.message and self.message.strip())
        has_questions = bool(self.questions)

        if not has_message and not has_questions:
            raise ValueError("message 또는 questions 중 하나는 반드시 제공해야 합니다.")

        if has_questions:
            normalized = []
            for question in self.questions or []:
                if not question or not question.strip():
                    raise ValueError("questions 항목에는 빈 문자열을 넣을 수 없습니다.")
                normalized.append(question.strip())
            self.questions = normalized

        if has_message and self.message is not None:
            self.message = self.message.strip()

        return self


class ChatResponse(BaseModel):
    reply: str | None = None
    answers: list[str] | None = None
    model: str
