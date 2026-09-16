import math

import pytest

from eggmate.core import income
from eggmate.core.models import IncomeModel

MODEL = IncomeModel()


def test_base_weight_is_identity():
    assert income.weight_multiplier(1.0, MODEL) == pytest.approx(1.0)


@pytest.mark.parametrize("ratio,published", [(100, 17), (200, 23), (1000, 45)])
def test_matches_published_spot_checks(ratio, published):
    """위키에 공개된 '100배 무게 = 약 17배 수입' 수치와 일치해야 한다."""
    assert income.weight_multiplier(ratio, MODEL) == pytest.approx(published, abs=1.0)


def test_curve_is_continuous_at_breakpoint():
    below = income.weight_multiplier(MODEL.breakpoint_ratio - 1e-9, MODEL)
    above = income.weight_multiplier(MODEL.breakpoint_ratio, MODEL)
    assert below == pytest.approx(above, rel=1e-9)


def test_high_curve_is_flatter_than_low_curve():
    """125배 이후에는 같은 배수를 더 넣어도 증가폭이 줄어야 한다."""
    gain_low = income.weight_multiplier(20, MODEL) / income.weight_multiplier(10, MODEL)
    gain_high = income.weight_multiplier(2000, MODEL) / income.weight_multiplier(1000, MODEL)
    assert gain_high < gain_low


def test_zero_and_negative_weight():
    assert income.weight_multiplier(0, MODEL) == 0.0
    assert income.weight_multiplier(-5, MODEL) == 0.0


def test_compute_breakdown_multiplies_out():
    result = income.compute(1000, ratio=64, mutation=3.5, model=MODEL)
    assert result.total == pytest.approx(1000 * result.weight_multiplier * 3.5)
    assert result.curve == "low"
    assert result.total_multiplier == pytest.approx(result.weight_multiplier * 3.5)


def test_compute_selects_high_curve():
    assert income.compute(100, ratio=500, model=MODEL).curve == "high"


def test_mutation_comparison_sorted_desc():
    rows = income.compare_mutations(
        1000, 10, [("Silver", 1.2), ("Rainbow", 3.5), ("Golden", 2.0)], MODEL
    )
    assert [name for name, _, _ in rows] == ["Rainbow", "Golden", "Silver"]
    assert rows[0][2] == pytest.approx(3.5)


@pytest.mark.parametrize("ratio", [0.5, 2, 50, 124, 125, 300, 5000])
def test_ratio_for_target_round_trips(ratio):
    base, mutation = 2500.0, 2.0
    target = income.compute(base, ratio, mutation, MODEL).total
    recovered = income.ratio_for_target(base, target, mutation, MODEL)
    assert recovered == pytest.approx(ratio, rel=1e-6)


def test_ratio_for_target_rejects_impossible_input():
    assert income.ratio_for_target(0, 100) is None
    assert income.ratio_for_target(100, 0) is None
    assert income.ratio_for_target(100, 500, mutation=0) is None


def test_total_income_sums_pets():
    pets = [(100.0, 1.0, 1.0), (200.0, 1.0, 2.0)]
    assert income.total_income(pets, MODEL) == pytest.approx(500.0)


def test_income_is_monotonic_in_weight():
    values = [income.weight_multiplier(r, MODEL) for r in (1, 5, 50, 124, 126, 500, 10000)]
    assert values == sorted(values)
    assert all(math.isfinite(v) for v in values)
