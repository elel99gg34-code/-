import math

import pytest

from eggmate.core import collection


def test_uniform_closed_form():
    """고전적인 결과: 주사위 6면을 전부 보려면 평균 14.7번."""
    assert collection.expected_attempts_uniform(6) == pytest.approx(14.7, abs=0.05)


def test_uniform_of_one_kind():
    assert collection.expected_attempts_uniform(1) == 1.0


def test_uniform_of_nothing():
    assert collection.expected_attempts_uniform(0) == 0.0


@pytest.mark.parametrize("kinds", [2, 5, 10, 25, 50])
def test_general_integral_matches_the_closed_form(kinds):
    """일반식(수치적분)이 균등 확률에서 닫힌 형태와 일치해야 한다."""
    numeric = collection.expected_attempts([1.0 / kinds] * kinds)
    closed = collection.expected_attempts_uniform(kinds)
    assert numeric == pytest.approx(closed, rel=1e-3)


def test_single_probability_is_its_reciprocal():
    assert collection.expected_attempts([0.004]) == pytest.approx(250)


def test_the_rarest_item_dominates():
    """가장 희귀한 하나가 전체 소요 시간을 결정한다."""
    result = collection.expected_attempts([0.9, 0.9, 0.0001])
    assert result == pytest.approx(1 / 0.0001, rel=0.02)


def test_more_kinds_take_longer():
    few = collection.expected_attempts([0.2] * 5)
    many = collection.expected_attempts([0.05] * 20)
    assert many > few


def test_empty_probabilities_never_complete():
    assert math.isinf(collection.expected_attempts([]))


def test_zero_probabilities_are_ignored():
    assert collection.expected_attempts([0.5, 0.0]) == pytest.approx(2.0)


def test_progress_counts_owned_pets(dataset):
    owned = {"Chicken", "Kitsune"}
    result = collection.progress(dataset, owned)
    assert result.owned == 2
    assert result.total == len(dataset.pets)
    assert "Unicorn" in result.missing
    assert not result.is_complete


def test_progress_with_everything_owned(dataset):
    result = collection.progress(dataset, {p.name for p in dataset.pets})
    assert result.is_complete
    assert result.percent == 100.0
    assert result.missing == []


def test_progress_with_nothing_owned(dataset):
    result = collection.progress(dataset, set())
    assert result.owned == 0 and result.ratio == 0.0


def test_progress_ignores_unknown_pet_names(dataset):
    result = collection.progress(dataset, {"존재하지않는펫"})
    assert result.owned == 0


def test_progress_by_biome_partitions_every_pet(dataset):
    groups = collection.progress_by(dataset, set(), "biome")
    assert sum(g.total for g in groups.values()) == len(dataset.pets)


def test_progress_by_rarity(dataset):
    groups = collection.progress_by(dataset, {"Kitsune"}, "rarity")
    assert groups["Divine"].owned == 1


def test_progress_by_rejects_unknown_dimension(dataset):
    with pytest.raises(ValueError):
        collection.progress_by(dataset, set(), "색깔")


def test_any_of_probability_combines_independently():
    assert collection.any_of_probability([0.5, 0.5]) == pytest.approx(0.75)


def test_any_of_is_never_less_than_the_best_single():
    assert collection.any_of_probability([0.01, 0.2]) >= 0.2


def test_any_of_nothing_is_zero():
    assert collection.any_of_probability([]) == 0.0


def test_any_of_a_certainty_is_one():
    assert collection.any_of_probability([1.0, 0.1]) == 1.0


def test_all_of_takes_longer_than_any_of():
    probabilities = [0.05, 0.02, 0.01]
    any_attempts = 1 / collection.any_of_probability(probabilities)
    assert collection.all_of_attempts(probabilities) > any_attempts
