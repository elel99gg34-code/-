"""무게/뮤테이션 기반 펫 수입 계산.

커뮤니티 위키에 공개된 공식:
    r = 실제무게 / 기본무게
    r  < 125 :  income = base * r^(37/60)                 * mutation
    r >= 125 :  income = base * 125^(13/60) * r^(2/5)      * mutation

두 식은 r=125 에서 정확히 연결된다:
    125^(13/60) * 125^(24/60) == 125^(37/60)
"""
from __future__ import annotations

from dataclasses import dataclass

from .models import IncomeModel


@dataclass(frozen=True)
class IncomeBreakdown:
    base: float
    weight_ratio: float
    weight_multiplier: float
    mutation_multiplier: float
    total: float
    curve: str  # "low" | "high"

    @property
    def total_multiplier(self) -> float:
        return self.weight_multiplier * self.mutation_multiplier


def weight_multiplier(ratio: float, model: IncomeModel | None = None) -> float:
    """무게 비율 r 에 대한 수입 배율. r<=0 이면 0."""
    model = model or IncomeModel()
    if ratio <= 0:
        return 0.0
    if ratio < model.breakpoint_ratio:
        return ratio ** model.low_exponent
    constant = model.breakpoint_ratio ** model.high_constant_exponent
    return constant * (ratio ** model.high_exponent)


def compute(
    base: float,
    ratio: float = 1.0,
    mutation: float = 1.0,
    model: IncomeModel | None = None,
) -> IncomeBreakdown:
    """base $/s 인 펫의 실제 $/s 를 계산해 분해 결과로 돌려준다."""
    model = model or IncomeModel()
    ratio = max(0.0, float(ratio))
    wmul = weight_multiplier(ratio, model)
    total = float(base) * wmul * float(mutation)
    curve = "low" if ratio < model.breakpoint_ratio else "high"
    return IncomeBreakdown(
        base=float(base),
        weight_ratio=ratio,
        weight_multiplier=wmul,
        mutation_multiplier=float(mutation),
        total=total,
        curve=curve,
    )


def compare_mutations(
    base: float,
    ratio: float,
    mutations: list[tuple[str, float]],
    model: IncomeModel | None = None,
) -> list[tuple[str, float, float]]:
    """(뮤테이션명, $/s, 무뮤테이션 대비 배율) 목록을 수입 내림차순으로."""
    plain = compute(base, ratio, 1.0, model).total
    rows: list[tuple[str, float, float]] = []
    for name, mult in mutations:
        total = compute(base, ratio, mult, model).total
        gain = (total / plain) if plain > 0 else 0.0
        rows.append((name, total, gain))
    return sorted(rows, key=lambda row: row[1], reverse=True)


def ratio_for_target(
    base: float,
    target_income: float,
    mutation: float = 1.0,
    model: IncomeModel | None = None,
) -> float | None:
    """목표 $/s 를 내려면 기본무게의 몇 배가 필요한지 역산. 불가능하면 None."""
    model = model or IncomeModel()
    base = float(base)
    if base <= 0 or mutation <= 0 or target_income <= 0:
        return None
    needed = target_income / (base * mutation)  # 필요한 무게배율
    if needed <= 1.0:
        return needed ** (1.0 / model.low_exponent) if needed > 0 else None

    break_mult = weight_multiplier(model.breakpoint_ratio, model)
    if needed < break_mult:
        return needed ** (1.0 / model.low_exponent)
    constant = model.breakpoint_ratio ** model.high_constant_exponent
    return (needed / constant) ** (1.0 / model.high_exponent)


def total_income(pets: list[tuple[float, float, float]], model: IncomeModel | None = None) -> float:
    """(base, ratio, mutation) 목록의 합산 $/s."""
    return sum(compute(b, r, m, model).total for b, r, m in pets)
