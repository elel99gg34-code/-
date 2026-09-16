"""진행도 플래너 - 바이옴 접근 판정, 업그레이드 ROI, 목표 도달 시간."""
from __future__ import annotations

import math
from dataclasses import dataclass

from .models import Biome, Dataset

SAFE = "safe"          # 권장 마진 이상
TIGHT = "tight"        # 최소치는 넘었지만 여유 없음
LOCKED = "locked"      # 최소치 미달


@dataclass(frozen=True)
class BiomeStatus:
    biome: Biome
    status: str
    ratio: float               # 내 스피드 / 요구 스피드
    shortfall: float           # 부족분 (도달했으면 0)
    needed_for_safe: float     # 권장 마진까지 추가로 필요한 스피드

    @property
    def is_open(self) -> bool:
        return self.status in (SAFE, TIGHT)

    @property
    def status_ko(self) -> str:
        return {SAFE: "안전", TIGHT: "빠듯함", LOCKED: "잠김"}[self.status]


def evaluate_biomes(dataset: Dataset, speed: float, margin: float | None = None) -> list[BiomeStatus]:
    """현재 스피드로 각 바이옴이 안전/빠듯/잠김 중 무엇인지 판정."""
    if margin is None:
        margin = float(dataset.mechanics.get("safety_margin_recommended", 2.0))
    speed = max(0.0, float(speed))

    rows: list[BiomeStatus] = []
    for biome in dataset.biomes_by_speed:
        required = biome.speed_required
        safe_line = required * margin
        if required <= 0:
            status, ratio = SAFE, math.inf
        else:
            ratio = speed / required
            if speed >= safe_line:
                status = SAFE
            elif speed >= required:
                status = TIGHT
            else:
                status = LOCKED
        rows.append(
            BiomeStatus(
                biome=biome,
                status=status,
                ratio=ratio,
                shortfall=max(0.0, required - speed),
                needed_for_safe=max(0.0, safe_line - speed),
            )
        )
    return rows


def next_target(dataset: Dataset, speed: float) -> BiomeStatus | None:
    """아직 못 연 바이옴 중 가장 가까운 것."""
    locked = [row for row in evaluate_biomes(dataset, speed) if row.status == LOCKED]
    return min(locked, key=lambda r: r.biome.speed_required) if locked else None


@dataclass(frozen=True)
class RoiResult:
    cost: float
    income_gain: float
    payback_seconds: float
    daily_gain: float

    @property
    def is_worth_it(self) -> bool:
        """하루 안에 본전을 뽑으면 '즉시 사도 되는' 업그레이드로 본다."""
        return math.isfinite(self.payback_seconds) and self.payback_seconds <= 86400


def roi(cost: float, income_before: float, income_after: float) -> RoiResult:
    """업그레이드 비용 대비 회수 시간."""
    gain = float(income_after) - float(income_before)
    payback = math.inf if gain <= 0 else float(cost) / gain
    return RoiResult(
        cost=float(cost),
        income_gain=gain,
        payback_seconds=payback,
        daily_gain=gain * 86400,
    )


def time_to_amount(target: float, current: float, income_per_second: float) -> float:
    """현재 보유액에서 목표 금액까지 걸리는 초."""
    remaining = float(target) - float(current)
    if remaining <= 0:
        return 0.0
    if income_per_second <= 0:
        return math.inf
    return remaining / float(income_per_second)


@dataclass(frozen=True)
class BestPetRow:
    pet_name: str
    pet_ko: str
    biome: str
    rarity: str
    income: float


def best_reachable_pets(dataset: Dataset, speed: float, limit: int = 10) -> list[BestPetRow]:
    """지금 스피드로 갈 수 있는 바이옴에서 노려볼 만한 최고 수입 펫."""
    open_biomes = {row.biome.name for row in evaluate_biomes(dataset, speed) if row.is_open}
    candidates = [
        BestPetRow(p.name, p.ko, p.biome, p.rarity, p.income)
        for p in dataset.pets_with_income
        if p.biome in open_biomes
    ]
    candidates.sort(key=lambda row: row.income, reverse=True)
    return candidates[:limit]
