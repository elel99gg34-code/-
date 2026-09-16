"""확률 계산 - '레어 예측'이 아니라 '레어 확률'을 정직하게 다루는 모듈.

게임의 부화는 독립 시행이다. 즉 몇 번 실패했든 다음 시도의 확률은 변하지 않는다
(도박사의 오류). 이 모듈은 그 전제 위에서 기대값과 신뢰구간만 계산한다.
"""
from __future__ import annotations

import math
from dataclasses import dataclass


@dataclass(frozen=True)
class OddsResult:
    probability: float          # 1회 성공 확률 p
    attempts: int               # 시도 횟수 n
    at_least_one: float         # P(최소 1회 성공)
    expected_hits: float        # 기대 성공 횟수 n*p
    mean_attempts: float        # 평균 대기 시도 1/p
    median_attempts: float      # 50% 도달 시도
    p90_attempts: float
    p99_attempts: float


def attempts_for_confidence(probability: float, confidence: float) -> float:
    """원하는 확신도(예: 0.9)에 도달하기 위한 시도 횟수."""
    p = float(probability)
    c = float(confidence)
    if not 0 < p < 1:
        return math.inf if p <= 0 else 1.0
    if not 0 < c < 1:
        raise ValueError("confidence 는 0과 1 사이여야 합니다.")
    return math.log(1.0 - c) / math.log(1.0 - p)


def analyse(probability: float, attempts: int) -> OddsResult:
    """확률 p, 시도 n 에 대한 전체 요약."""
    p = float(probability)
    n = max(0, int(attempts))
    if p <= 0:
        return OddsResult(0.0, n, 0.0, 0.0, math.inf, math.inf, math.inf, math.inf)
    p = min(p, 1.0)
    if p >= 1.0:
        return OddsResult(1.0, n, 1.0 if n else 0.0, float(n), 1.0, 1.0, 1.0, 1.0)

    return OddsResult(
        probability=p,
        attempts=n,
        at_least_one=1.0 - (1.0 - p) ** n,
        expected_hits=n * p,
        mean_attempts=1.0 / p,
        median_attempts=attempts_for_confidence(p, 0.50),
        p90_attempts=attempts_for_confidence(p, 0.90),
        p99_attempts=attempts_for_confidence(p, 0.99),
    )


def probability_of_exactly(probability: float, attempts: int, hits: int) -> float:
    """n번 중 정확히 k번 성공할 확률 (이항분포)."""
    p, n, k = float(probability), int(attempts), int(hits)
    if k < 0 or k > n or n < 0:
        return 0.0
    if p <= 0:
        return 1.0 if k == 0 else 0.0
    if p >= 1:
        return 1.0 if k == n else 0.0
    return math.comb(n, k) * (p ** k) * ((1 - p) ** (n - k))


def probability_of_at_least(probability: float, attempts: int, hits: int) -> float:
    """n번 중 k번 이상 성공할 확률."""
    if hits <= 0:
        return 1.0
    total = sum(probability_of_exactly(probability, attempts, i) for i in range(hits))
    return max(0.0, min(1.0, 1.0 - total))


def wilson_interval(hits: int, trials: int, z: float = 1.96) -> tuple[float, float]:
    """관측된 성공률의 95% 신뢰구간 (Wilson score).

    표본이 적을 때 단순 hits/trials 보다 훨씬 정직하다.
    """
    n = int(trials)
    if n <= 0:
        return (0.0, 1.0)
    k = max(0, min(int(hits), n))
    phat = k / n
    denom = 1 + z * z / n
    centre = phat + z * z / (2 * n)
    margin = z * math.sqrt(phat * (1 - phat) / n + z * z / (4 * n * n))
    low = (centre - margin) / denom
    high = (centre + margin) / denom
    return (max(0.0, low), min(1.0, high))


def luck_index(hits: int, trials: int, probability: float) -> float | None:
    """실제 성공 수 / 기대 성공 수. 1.0 이면 평균, >1 이면 운이 좋았다는 뜻."""
    expected = trials * probability
    if expected <= 0:
        return None
    return hits / expected


def parse_rate(text: str) -> float:
    """'0.5%', '1/2000', '0.005' 를 확률(0~1)로 변환."""
    raw = str(text).strip().replace(",", "")
    if not raw:
        raise ValueError("빈 값")
    if raw.endswith("%"):
        return float(raw[:-1]) / 100.0
    if "/" in raw:
        numerator, _, denominator = raw.partition("/")
        denom = float(denominator)
        if denom == 0:
            raise ValueError("분모가 0입니다.")
        return float(numerator) / denom
    value = float(raw)
    if value > 1.0:
        raise ValueError("확률은 1을 넘을 수 없습니다. '%' 나 '1/N' 형식을 써 주세요.")
    return value
