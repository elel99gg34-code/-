import os
from openai import OpenAI

DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")


def _build_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.")
    return OpenAI(api_key=api_key)


def generate_reply(user_message: str, system_prompt: str | None = None) -> tuple[str, str]:
    client = _build_client()
    instructions = system_prompt or "당신은 친절하고 실용적인 한국어 AI 어시스턴트입니다."

    response = client.responses.create(
        model=DEFAULT_MODEL,
        instructions=instructions,
        input=user_message,
    )

    return response.output_text, DEFAULT_MODEL


def generate_answers(questions: list[str], system_prompt: str | None = None) -> tuple[list[str], str]:
    answers: list[str] = []
    for question in questions:
        answer, _ = generate_reply(question, system_prompt)
        answers.append(answer)
    return answers, DEFAULT_MODEL
