"""펜 빌더 — 장착 슬롯이 제한된 상태에서 무엇을 끼울지 고른다.

펫 하나가 슬롯 하나를 쓰고 수입은 서로 독립이므로, 최적해는 '수입 높은 순으로
슬롯 수만큼'이 정확한 답이다. 배낭 문제가 아니다. 그래서 정렬만으로 최적이 나온다.
"""
from __future__ import annotations

from dataclasses import dataclass

from .income import compute
from .models import Dataset, IncomeModel


@dataclass(frozen=True)
class Candidate:
    """펜에 넣을 수 있는 펫 한 마리."""

    key: str                 # 인벤토리 id 등 식별자
    pet: str                 # 펫 영문명
    label: str               # 화면 표시용
    base_income: float
    weight_ratio: float = 1.0
    mutation: str = "None"
    mutation_multiplier: float = 1.0

    def income(self, model: IncomeModel | None = None) -> float:
        return compute(self.base_income, self.weight_ratio, self.mutation_multiplier, model).total


@dataclass(frozen=True)
class PenPlan:
    slots: int
    equipped: list[Candidate]
    benched: list[Candidate]
    total_income: float
    next_slot_gain: float      # 슬롯을 하나 더 열면 늘어나는 수입
    weakest_equipped: Candidate | None
    strongest_benched: Candidate | None

    @property
    def is_full(self) -> bool:
        return len(self.equipped) >= self.slots

    @property
    def has_upgrade_available(self) -> bool:
        """벤치에 끼는 것보다 센 펫이 있으면 True (정상적으로는 나오지 않는다)."""
        if not self.weakest_equipped or not self.strongest_benched:
            return False
        return self.strongest_benched.income() > self.weakest_equipped.income()


def expand(candidates: list[Candidate], quantities: dict[str, int] | None = None) -> list[Candidate]:
    """같은 펫을 여러 마리 가진 경우를 한 마리씩으로 펼친다."""
    if not quantities:
        return list(candidates)
    result: list[Candidate] = []
    for candidate in candidates:
        count = max(1, int(quantities.get(candidate.key, 1)))
        for index in range(count):
            key = candidate.key if index == 0 else f"{candidate.key}#{index + 1}"
            result.append(
                Candidate(
                    key=key, pet=candidate.pet, label=candidate.label,
                    base_income=candidate.base_income, weight_ratio=candidate.weight_ratio,
                    mutation=candidate.mutation, mutation_multiplier=candidate.mutation_multiplier,
                )
            )
    return result


def build(
    candidates: list[Candidate],
    slots: int,
    model: IncomeModel | None = None,
) -> PenPlan:
    """수입이 최대가 되도록 슬롯을 채운다."""
    slots = max(0, int(slots))
    ranked = sorted(candidates, key=lambda c: c.income(model), reverse=True)
    equipped = ranked[:slots]
    benched = ranked[slots:]

    total = sum(c.income(model) for c in equipped)
    next_gain = benched[0].income(model) if benched else 0.0

    return PenPlan(
        slots=slots,
        equipped=equipped,
        benched=benched,
        total_income=total,
        next_slot_gain=next_gain,
        weakest_equipped=equipped[-1] if equipped else None,
        strongest_benched=benched[0] if benched else None,
    )


@dataclass(frozen=True)
class SwapResult:
    out_pet: str
    in_pet: str
    delta: float
    worth_it: bool


def evaluate_swap(
    plan: PenPlan,
    outgoing_key: str,
    incoming: Candidate,
    model: IncomeModel | None = None,
) -> SwapResult | None:
    """장착 중인 한 마리를 다른 펫으로 갈아끼웠을 때의 수입 변화."""
    outgoing = next((c for c in plan.equipped if c.key == outgoing_key), None)
    if outgoing is None:
        return None
    delta = incoming.income(model) - outgoing.income(model)
    return SwapResult(
        out_pet=outgoing.label,
        in_pet=incoming.label,
        delta=delta,
        worth_it=delta > 0,
    )


def slot_value_curve(
    candidates: list[Candidate],
    max_slots: int,
    model: IncomeModel | None = None,
) -> list[tuple[int, float, float]]:
    """(슬롯 수, 총 수입, 직전 슬롯 대비 증가분) 목록.

    슬롯 업그레이드가 그만한 값어치를 하는지 보려면 증가분을 봐야 한다.
    """
    ranked = sorted(candidates, key=lambda c: c.income(model), reverse=True)
    rows: list[tuple[int, float, float]] = []
    running = 0.0
    for slot in range(1, max(1, int(max_slots)) + 1):
        gain = ranked[slot - 1].income(model) if slot <= len(ranked) else 0.0
        running += gain
        rows.append((slot, running, gain))
    return rows


def candidates_from_inventory(dataset: Dataset, items) -> list[Candidate]:
    """인벤토리 항목을 펜 후보로 바꾼다.

    수량이 2 이상이면 그만큼 슬롯을 차지하므로 마리 수대로 펼친다. 이 변환을 화면마다
    따로 하면 한 곳에서 수량을 빠뜨리는 일이 생기므로 여기 하나만 둔다.
    수입이 알려지지 않은 펫은 계산에 넣을 수 없어 건너뛴다.
    """
    built: list[Candidate] = []
    for item in items:
        pet = dataset.pet(item.pet)
        if pet is None or pet.income is None:
            continue
        mutation = dataset.mutation(item.mutation)
        for copy_index in range(max(1, int(item.quantity))):
            built.append(Candidate(
                key=str(item.id) if copy_index == 0 else f"{item.id}#{copy_index + 1}",
                pet=pet.name,
                label=pet.ko,
                base_income=pet.income,
                weight_ratio=item.weight_ratio,
                mutation=item.mutation,
                mutation_multiplier=mutation.multiplier if mutation else 1.0,
            ))
    return built


def inventory_id(key: str) -> int | None:
    """후보 키에서 원래 인벤토리 id 를 되살린다 ('7#2' → 7)."""
    head = key.split("#", 1)[0]
    return int(head) if head.isdigit() else None


def candidates_from_dataset(
    dataset: Dataset,
    pet_names: list[str] | None = None,
) -> list[Candidate]:
    """도감 전체(또는 지정한 펫)를 기본 무게·무뮤테이션 후보로 만든다."""
    pets = dataset.pets_with_income
    if pet_names is not None:
        wanted = set(pet_names)
        pets = [p for p in pets if p.name in wanted]
    return [
        Candidate(key=p.name, pet=p.name, label=p.ko, base_income=p.income or 0.0)
        for p in pets
    ]
