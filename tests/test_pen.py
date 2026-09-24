import pytest

from eggmate.core import pen
from eggmate.core.pen import Candidate


def make(key: str, income: float, **kwargs) -> Candidate:
    return Candidate(key=key, pet=key, label=key, base_income=income, **kwargs)


def test_build_takes_the_highest_earners():
    cands = [make("a", 100), make("b", 500), make("c", 300)]
    plan = pen.build(cands, slots=2)
    assert [c.key for c in plan.equipped] == ["b", "c"]
    assert plan.total_income == 800
    assert [c.key for c in plan.benched] == ["a"]


def test_greedy_is_optimal_because_every_pet_costs_one_slot():
    """모든 조합을 다 해 봐도 정렬해서 위에서 자른 것보다 좋을 수 없다."""
    import itertools

    cands = [make(str(i), income) for i, income in enumerate([13, 7, 91, 44, 2, 68])]
    for slots in range(1, len(cands) + 1):
        best = max(
            sum(c.income() for c in combo)
            for combo in itertools.combinations(cands, slots)
        )
        assert pen.build(cands, slots).total_income == pytest.approx(best)


def test_more_slots_than_pets_equips_everything():
    cands = [make("a", 10), make("b", 20)]
    plan = pen.build(cands, slots=9)
    assert len(plan.equipped) == 2
    assert plan.benched == []
    assert plan.next_slot_gain == 0
    assert not plan.is_full


def test_zero_slots():
    plan = pen.build([make("a", 10)], slots=0)
    assert plan.equipped == []
    assert plan.total_income == 0
    assert plan.weakest_equipped is None


def test_next_slot_gain_is_the_best_benched_pet():
    cands = [make("a", 100), make("b", 500), make("c", 300)]
    assert pen.build(cands, slots=1).next_slot_gain == 300


def test_mutation_and_weight_change_the_ranking():
    plain = make("plain", 1000)
    mutated = make("mutated", 500, mutation="Rainbow", mutation_multiplier=3.5)
    plan = pen.build([plain, mutated], slots=1)
    assert plan.equipped[0].key == "mutated"


def test_expand_duplicates_by_quantity():
    expanded = pen.expand([make("a", 10)], {"a": 3})
    assert len(expanded) == 3
    assert len({c.key for c in expanded}) == 3, "중복 항목은 서로 다른 키를 가져야 한다"
    assert all(c.pet == "a" for c in expanded)


def test_expand_without_quantities_is_a_copy():
    cands = [make("a", 10)]
    assert [c.key for c in pen.expand(cands)] == ["a"]


def test_slot_value_curve_has_diminishing_returns():
    cands = [make(str(i), income) for i, income in enumerate([500, 300, 100, 50])]
    rows = pen.slot_value_curve(cands, 4)
    gains = [gain for _, _, gain in rows]
    assert gains == sorted(gains, reverse=True)
    assert rows[-1][1] == pytest.approx(950)


def test_slot_value_curve_pads_with_zero_when_out_of_pets():
    rows = pen.slot_value_curve([make("a", 10)], 3)
    assert [gain for _, _, gain in rows] == [10, 0, 0]


def test_evaluate_swap_reports_gain():
    plan = pen.build([make("weak", 100), make("strong", 900)], slots=2)
    result = pen.evaluate_swap(plan, "weak", make("better", 400))
    assert result is not None and result.delta == 300 and result.worth_it


def test_evaluate_swap_reports_loss():
    plan = pen.build([make("good", 900)], slots=1)
    result = pen.evaluate_swap(plan, "good", make("worse", 100))
    assert result is not None and result.delta == -800 and not result.worth_it


def test_evaluate_swap_returns_none_for_a_benched_pet():
    plan = pen.build([make("a", 100), make("b", 900)], slots=1)
    assert pen.evaluate_swap(plan, "a", make("x", 50)) is None


def test_candidates_from_dataset(dataset):
    all_cands = pen.candidates_from_dataset(dataset)
    assert len(all_cands) == len(dataset.pets_with_income)

    subset = pen.candidates_from_dataset(dataset, ["Kitsune", "Chicken"])
    assert {c.pet for c in subset} == {"Kitsune", "Chicken"}


def test_optimal_plan_has_no_upgrade_available(dataset):
    plan = pen.build(pen.candidates_from_dataset(dataset), slots=5)
    assert not plan.has_upgrade_available


# ---------------------------------------------------------------------------
# 인벤토리 변환 — 화면마다 따로 구현하다 수량을 빠뜨린 적이 있어 테스트로 고정한다.
# ---------------------------------------------------------------------------
from dataclasses import dataclass  # noqa: E402


@dataclass
class FakeItem:
    id: int
    pet: str
    mutation: str = "None"
    weight_ratio: float = 1.0
    quantity: int = 1


def test_inventory_conversion_expands_by_quantity(dataset):
    cands = pen.candidates_from_inventory(dataset, [FakeItem(7, "Spider", quantity=5)])
    assert len(cands) == 5, "수량만큼 슬롯을 차지해야 한다"
    assert len({c.key for c in cands}) == 5, "각 마리는 서로 다른 키를 가져야 한다"
    assert all(c.pet == "Spider" for c in cands)


def test_inventory_conversion_keeps_total_income_consistent(dataset):
    """대시보드와 펜 빌더가 같은 수를 내놓아야 한다."""
    items = [FakeItem(1, "Spider", quantity=5)]
    cands = pen.candidates_from_inventory(dataset, items)
    total = pen.build(cands, slots=len(cands), model=dataset.income_model).total_income
    spider = dataset.pet("Spider")
    assert total == pytest.approx(spider.income * 5)


def test_inventory_conversion_applies_mutation_and_weight(dataset):
    cands = pen.candidates_from_inventory(
        dataset, [FakeItem(1, "Kitsune", mutation="Rainbow", weight_ratio=85)]
    )
    assert len(cands) == 1
    assert cands[0].mutation_multiplier == pytest.approx(3.5)
    assert cands[0].weight_ratio == 85


def test_inventory_conversion_skips_pets_without_a_known_income(dataset):
    """수입이 확인되지 않은 펫은 계산에 넣을 수 없다."""
    assert pen.candidates_from_inventory(dataset, [FakeItem(1, "Nightflame")]) == []


def test_inventory_conversion_skips_unknown_pets(dataset):
    assert pen.candidates_from_inventory(dataset, [FakeItem(1, "존재하지않는펫")]) == []


def test_inventory_conversion_treats_zero_quantity_as_one(dataset):
    assert len(pen.candidates_from_inventory(dataset, [FakeItem(1, "Spider", quantity=0)])) == 1


def test_inventory_conversion_of_nothing(dataset):
    assert pen.candidates_from_inventory(dataset, []) == []


@pytest.mark.parametrize("key,expected", [("7", 7), ("7#3", 7), ("Kitsune", None), ("", None)])
def test_inventory_id_recovers_the_row(key, expected):
    assert pen.inventory_id(key) == expected


def test_equipping_a_plan_maps_back_to_inventory_rows(dataset):
    items = [FakeItem(11, "Spider", quantity=3), FakeItem(22, "Kitsune")]
    plan = pen.build(pen.candidates_from_inventory(dataset, items), slots=4)
    ids = {pen.inventory_id(c.key) for c in plan.equipped}
    assert ids == {11, 22}
