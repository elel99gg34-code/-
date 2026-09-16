"""퓨즈 머신 판단기.

규칙: 완전히 같은 펫 3마리를 넣으면 1마리가 나온다. 투입한 펫의 뮤테이션은
사라진다. 따라서 '지금 그 3마리가 내 펜에서 벌고 있는 돈'과 '결과물 1마리가
벌 돈'을 비교해야 손해를 안 본다.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from .income import compute
from .models import IncomeModel

INPUT_COUNT = 3


@dataclass(frozen=True)
class FuseVerdict:
    income_before: float      # 투입 3마리가 현재 버는 총 $/s
    income_after: float       # 결과물 1마리가 벌 $/s (기대값)
    delta: float              # 수입 변화 (음수면 손해)
    freed_slots: int          # 비는 펜 슬롯 수
    cost: float
    payback_seconds: float
    recommend: bool
    reasons: list[str]

    @property
    def verdict_ko(self) -> str:
        return "퓨즈 권장" if self.recommend else "퓨즈 비권장"


def evaluate(
    base_income: float,
    result_base_income: float,
    input_ratio: float = 1.0,
    result_ratio: float = 1.0,
    input_mutation: float = 1.0,
    expected_result_mutation: float = 1.0,
    cost: float = 0.0,
    pen_is_full: bool = False,
    model: IncomeModel | None = None,
) -> FuseVerdict:
    """퓨즈 손익 판정.

    input_mutation 은 투입 펫에 붙어 있던 뮤테이션 배율이다. 퓨즈하면 사라지므로
    '잃는 것'에 포함된다. expected_result_mutation 은 결과물에 뮤테이션이 붙을
    기대 배율(모르면 1.0).
    """
    model = model or IncomeModel()

    per_input = compute(base_income, input_ratio, input_mutation, model).total
    before = per_input * INPUT_COUNT
    after = compute(result_base_income, result_ratio, expected_result_mutation, model).total
    delta = after - before

    payback = math.inf if delta <= 0 else float(cost) / delta

    reasons: list[str] = []
    recommend = delta > 0

    if delta > 0:
        reasons.append(f"총 수입이 초당 +{delta:,.0f} 증가")
        if cost > 0:
            reasons.append(f"퓨즈 비용 회수에 약 {payback:,.0f}초")
    else:
        reasons.append(f"총 수입이 초당 {delta:,.0f} 감소 — 3마리 그대로 두는 게 이득")

    if input_mutation > 1.0:
        reasons.append(
            f"투입 펫에 ×{input_mutation:g} 뮤테이션이 붙어 있음 — 퓨즈하면 사라짐"
        )
        if delta > 0:
            recommend = False
            reasons.append("수입이 늘어도 뮤테이션 손실이 크므로 비권장")

    if pen_is_full and delta <= 0:
        reasons.append("펜이 꽉 찼다면 슬롯 2칸을 비우려고 감수할 수는 있음")

    return FuseVerdict(
        income_before=before,
        income_after=after,
        delta=delta,
        freed_slots=INPUT_COUNT - 1,
        cost=float(cost),
        payback_seconds=payback,
        recommend=recommend,
        reasons=reasons,
    )
