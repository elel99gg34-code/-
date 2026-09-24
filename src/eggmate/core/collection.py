"""도감 완성 계산 — 전부 모으려면 얼마나 걸리는가 (쿠폰 수집가 문제).

한 종류를 뽑는 것보다 '전부 모으기'가 훨씬 오래 걸린다. 마지막 한 종이 안 나와서
그렇다. 이 모듈은 그 기대 시도 횟수를 계산한다.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from .models import Dataset


def expected_attempts_uniform(kinds: int) -> float:
    """모든 종류가 같은 확률일 때: n · H_n."""
    n = int(kinds)
    if n <= 0:
        return 0.0
    harmonic = sum(1.0 / k for k in range(1, n + 1))
    return n * harmonic


def expected_attempts(probabilities: list[float], resolution: int = 4000) -> float:
    """종류마다 확률이 다를 때의 기대 시도 횟수.

        E[T] = ∫₀^∞ [ 1 − ∏ᵢ (1 − e^(−pᵢ·t)) ] dt

    s = p_min · t 로 치환해 적분 구간을 확률 크기와 무관하게 만든 뒤 심프슨 적분한다.
    치환하지 않으면 0.01% 같은 작은 확률에서 적분 구간이 터진다.
    """
    values = [float(p) for p in probabilities if p and p > 0]
    if not values:
        return math.inf
    if len(values) == 1:
        return 1.0 / values[0]

    p_min = min(values)
    scaled = [p / p_min for p in values]
    upper = math.log(len(values) + 1) + 40.0
    steps = max(2, int(resolution) // 2 * 2)   # 심프슨은 짝수 구간이 필요하다
    h = upper / steps

    def integrand(s: float) -> float:
        product = 1.0
        for ratio in scaled:
            exponent = -ratio * s
            product *= 1.0 - (math.exp(exponent) if exponent > -700 else 0.0)
            if product <= 0.0:
                return 1.0
        return 1.0 - product

    total = integrand(0.0) + integrand(upper)
    for i in range(1, steps):
        total += integrand(i * h) * (4 if i % 2 else 2)
    return (total * h / 3.0) / p_min


@dataclass(frozen=True)
class CollectionProgress:
    owned: int
    total: int
    missing: list[str]

    @property
    def ratio(self) -> float:
        return (self.owned / self.total) if self.total else 0.0

    @property
    def percent(self) -> float:
        return self.ratio * 100.0

    @property
    def is_complete(self) -> bool:
        return self.total > 0 and self.owned >= self.total


def progress(dataset: Dataset, owned_pets: set[str]) -> CollectionProgress:
    """도감 전체 대비 보유 현황."""
    all_names = [p.name for p in dataset.pets]
    owned = [name for name in all_names if name in owned_pets]
    missing = [name for name in all_names if name not in owned_pets]
    return CollectionProgress(owned=len(owned), total=len(all_names), missing=missing)


def progress_by(
    dataset: Dataset,
    owned_pets: set[str],
    dimension: str = "biome",
) -> dict[str, CollectionProgress]:
    """바이옴별 또는 등급별 완성도."""
    if dimension not in {"biome", "rarity"}:
        raise ValueError(f"알 수 없는 기준: {dimension}")

    grouped: dict[str, list[str]] = {}
    for pet in dataset.pets:
        grouped.setdefault(getattr(pet, dimension), []).append(pet.name)

    result: dict[str, CollectionProgress] = {}
    for key, names in grouped.items():
        owned = [n for n in names if n in owned_pets]
        result[key] = CollectionProgress(
            owned=len(owned), total=len(names),
            missing=[n for n in names if n not in owned_pets],
        )
    return result


def any_of_probability(probabilities: list[float]) -> float:
    """여러 목표 중 '아무거나 하나'가 한 번의 시도에서 나올 확률."""
    remaining = 1.0
    for p in probabilities:
        remaining *= 1.0 - min(1.0, max(0.0, float(p)))
    return 1.0 - remaining


def all_of_attempts(probabilities: list[float]) -> float:
    """여러 목표를 '전부' 모으는 데 걸리는 기대 시도 횟수."""
    return expected_attempts(probabilities)
