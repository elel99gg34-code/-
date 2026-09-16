"""게임 데이터 도메인 모델."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class Rarity:
    name: str
    ko: str
    order: int
    color: str = "#9aa4b2"
    note: str | None = None

    @property
    def label(self) -> str:
        return f"{self.ko} ({self.name})"


@dataclass(frozen=True)
class Biome:
    name: str
    ko: str
    order: int
    speed_required: float
    speed_note: str | None = None

    @property
    def label(self) -> str:
        return f"{self.ko} ({self.name})"


@dataclass(frozen=True)
class Mutation:
    name: str
    ko: str
    multiplier: float
    source: str = "-"
    note: str | None = None

    @property
    def label(self) -> str:
        return f"{self.ko} ×{self.multiplier:g}"


@dataclass(frozen=True)
class Pet:
    name: str
    ko: str
    biome: str
    rarity: str
    income: float | None
    note: str | None = None

    @property
    def label(self) -> str:
        return f"{self.ko} ({self.name})"

    @property
    def has_income(self) -> bool:
        return self.income is not None


@dataclass(frozen=True)
class IncomeModel:
    """무게 기반 수입 곡선 파라미터."""

    breakpoint_ratio: float = 125.0
    low_exponent: float = 37.0 / 60.0
    high_exponent: float = 2.0 / 5.0
    high_constant_exponent: float = 13.0 / 60.0

    @classmethod
    def from_json(cls, raw: dict[str, Any]) -> "IncomeModel":
        def frac(key: str, default: float) -> float:
            value = raw.get(key)
            if isinstance(value, (list, tuple)) and len(value) == 2:
                return float(value[0]) / float(value[1])
            if isinstance(value, (int, float)):
                return float(value)
            return default

        return cls(
            breakpoint_ratio=float(raw.get("breakpoint_ratio", 125.0)),
            low_exponent=frac("low_exponent", 37.0 / 60.0),
            high_exponent=frac("high_exponent", 2.0 / 5.0),
            high_constant_exponent=frac("high_constant_exponent", 13.0 / 60.0),
        )


@dataclass
class Dataset:
    data_version: str
    game: str
    disclaimer: str
    sources: list[str]
    income_model: IncomeModel
    rarities: list[Rarity]
    biomes: list[Biome]
    mutations: list[Mutation]
    pets: list[Pet]
    mechanics: dict[str, Any] = field(default_factory=dict)

    # --- 조회 헬퍼 -------------------------------------------------------
    def biome(self, name: str) -> Biome | None:
        return next((b for b in self.biomes if b.name == name), None)

    def mutation(self, name: str) -> Mutation | None:
        return next((m for m in self.mutations if m.name == name), None)

    def rarity(self, name: str) -> Rarity | None:
        return next((r for r in self.rarities if r.name == name), None)

    def pet(self, name: str) -> Pet | None:
        return next((p for p in self.pets if p.name == name), None)

    def rarity_order(self, name: str) -> int:
        found = self.rarity(name)
        return found.order if found else 0

    def biome_order(self, name: str) -> int:
        found = self.biome(name)
        return found.order if found else 999

    @property
    def biomes_by_speed(self) -> list[Biome]:
        return sorted(self.biomes, key=lambda b: b.speed_required)

    @property
    def pets_with_income(self) -> list[Pet]:
        return [p for p in self.pets if p.has_income]
