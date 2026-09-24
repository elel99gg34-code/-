"""몬테카를로 시뮬레이션.

공식이 알려 주는 건 평균이다. 실제로 겪는 건 분포다. "기대 시도 1만 번"이라고 해도
누구는 2천 번에 뽑고 누구는 3만 번을 깐다. 이 모듈은 그 폭을 직접 돌려서 보여 준다.

시드를 받으므로 같은 입력이면 항상 같은 결과가 나온다.
"""
from __future__ import annotations

import math
import random
from dataclasses import dataclass, field

MAX_TRIALS = 200_000
MAX_ATTEMPTS_PER_TRIAL = 5_000_000


@dataclass(frozen=True)
class AttemptsDistribution:
    """첫 성공까지 걸린 시도 횟수의 분포."""

    probability: float
    trials: int
    samples: list[int] = field(repr=False, default_factory=list)
    mean: float = 0.0
    median: float = 0.0
    p10: float = 0.0
    p25: float = 0.0
    p75: float = 0.0
    p90: float = 0.0
    p99: float = 0.0
    luckiest: int = 0
    unluckiest: int = 0
    capped: int = 0          # 상한에 걸려 중단된 표본 수

    @property
    def theoretical_mean(self) -> float:
        return (1.0 / self.probability) if self.probability > 0 else math.inf

    @property
    def spread_ratio(self) -> float:
        """상위 10%와 하위 10%의 배율. 이 값이 클수록 '운빨'이 심하다."""
        return (self.p90 / self.p10) if self.p10 > 0 else math.inf


def _percentile(sorted_values: list[int], fraction: float) -> float:
    if not sorted_values:
        return 0.0
    if len(sorted_values) == 1:
        return float(sorted_values[0])
    position = fraction * (len(sorted_values) - 1)
    low = math.floor(position)
    high = math.ceil(position)
    if low == high:
        return float(sorted_values[low])
    weight = position - low
    return sorted_values[low] * (1 - weight) + sorted_values[high] * weight


def attempts_until_first(
    probability: float,
    trials: int = 10_000,
    seed: int | None = None,
) -> AttemptsDistribution:
    """확률 p 인 것을 처음 뽑기까지 몇 번 걸리는지 trials 번 시뮬레이션한다.

    기하분포를 역변환으로 뽑는다. 한 번씩 굴리면 0.01% 확률에서 표본당 평균 1만 번을
    굴려야 해서 너무 느리다.
    """
    p = float(probability)
    trials = max(1, min(int(trials), MAX_TRIALS))
    if not 0 < p <= 1:
        return AttemptsDistribution(probability=max(0.0, p), trials=trials)

    rng = random.Random(seed)
    log_keep = math.log1p(-p) if p < 1 else -math.inf

    samples: list[int] = []
    capped = 0
    for _ in range(trials):
        if p >= 1.0:
            samples.append(1)
            continue
        u = rng.random()
        while u <= 0.0:
            u = rng.random()
        attempts = int(math.floor(math.log(u) / log_keep)) + 1
        if attempts > MAX_ATTEMPTS_PER_TRIAL:
            attempts = MAX_ATTEMPTS_PER_TRIAL
            capped += 1
        samples.append(attempts)

    ordered = sorted(samples)
    return AttemptsDistribution(
        probability=p,
        trials=trials,
        samples=samples,
        mean=sum(ordered) / len(ordered),
        median=_percentile(ordered, 0.50),
        p10=_percentile(ordered, 0.10),
        p25=_percentile(ordered, 0.25),
        p75=_percentile(ordered, 0.75),
        p90=_percentile(ordered, 0.90),
        p99=_percentile(ordered, 0.99),
        luckiest=ordered[0],
        unluckiest=ordered[-1],
        capped=capped,
    )


@dataclass(frozen=True)
class HatchOutcome:
    counts: dict[str, int]
    hatches: int

    def ratio(self, key: str) -> float:
        return (self.counts.get(key, 0) / self.hatches) if self.hatches else 0.0


def hatch_session(
    probabilities: dict[str, float],
    hatches: int = 1_000,
    seed: int | None = None,
) -> HatchOutcome:
    """등급별 확률표를 주면 알을 hatches 번 까 본다.

    확률 합이 1 미만이면 나머지는 '기타'로 떨어진다. 1을 넘으면 정규화한다.
    """
    hatches = max(0, min(int(hatches), MAX_TRIALS))
    entries = [(k, max(0.0, float(v))) for k, v in probabilities.items()]
    total = sum(weight for _, weight in entries)

    if total <= 0:
        return HatchOutcome(counts={}, hatches=hatches)
    if total > 1.0:
        entries = [(k, w / total) for k, w in entries]
        total = 1.0

    rng = random.Random(seed)
    counts: dict[str, int] = {key: 0 for key, _ in entries}
    leftover = 1.0 - total
    if leftover > 1e-12:
        counts["기타"] = 0

    for _ in range(hatches):
        roll = rng.random()
        cumulative = 0.0
        landed = "기타"
        for key, weight in entries:
            cumulative += weight
            if roll < cumulative:
                landed = key
                break
        counts[landed] = counts.get(landed, 0) + 1

    return HatchOutcome(counts=counts, hatches=hatches)


def histogram(values: list[int], buckets: int = 12) -> list[tuple[float, float, int]]:
    """(구간 시작, 구간 끝, 개수) 목록. 화면에 막대로 그리기 위한 것."""
    if not values:
        return []
    buckets = max(1, int(buckets))
    low, high = min(values), max(values)
    if low == high:
        return [(float(low), float(high), len(values))]

    width = (high - low) / buckets
    counts = [0] * buckets
    for value in values:
        index = min(buckets - 1, int((value - low) / width))
        counts[index] += 1
    return [(low + i * width, low + (i + 1) * width, counts[i]) for i in range(buckets)]
