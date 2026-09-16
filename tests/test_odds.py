import math

import pytest

from eggmate.core import odds


@pytest.mark.parametrize("text,expected", [
    ("0.5%", 0.005), ("1/2000", 0.0005), ("0.01", 0.01), ("50%", 0.5), (" 1/4 ", 0.25),
])
def test_parse_rate(text, expected):
    assert odds.parse_rate(text) == pytest.approx(expected)


@pytest.mark.parametrize("bad", ["", "abc", "1/0", "5"])
def test_parse_rate_rejects_garbage(bad):
    with pytest.raises(ValueError):
        odds.parse_rate(bad)


def test_at_least_one_matches_complement_rule():
    result = odds.analyse(0.01, 100)
    assert result.at_least_one == pytest.approx(1 - 0.99 ** 100)
    assert result.expected_hits == pytest.approx(1.0)


def test_mean_attempts_is_reciprocal():
    assert odds.analyse(0.004, 10).mean_attempts == pytest.approx(250.0)


def test_confidence_thresholds_increase():
    result = odds.analyse(0.01, 50)
    assert result.median_attempts < result.p90_attempts < result.p99_attempts


def test_attempts_for_confidence_known_value():
    """p=50% 에서 90% 확신은 약 3.32회."""
    assert odds.attempts_for_confidence(0.5, 0.9) == pytest.approx(3.3219, abs=1e-3)


def test_attempts_for_confidence_rejects_bad_confidence():
    with pytest.raises(ValueError):
        odds.attempts_for_confidence(0.1, 1.0)


def test_zero_probability_is_never_reachable():
    result = odds.analyse(0.0, 10_000)
    assert result.at_least_one == 0.0
    assert math.isinf(result.mean_attempts)


def test_certain_probability():
    result = odds.analyse(1.0, 3)
    assert result.at_least_one == 1.0
    assert result.expected_hits == 3.0


def test_binomial_distribution_sums_to_one():
    total = sum(odds.probability_of_exactly(0.3, 10, k) for k in range(11))
    assert total == pytest.approx(1.0)


def test_at_least_k_is_complement_of_fewer():
    p, n = 0.2, 12
    assert odds.probability_of_at_least(p, n, 0) == 1.0
    assert odds.probability_of_at_least(p, n, 3) == pytest.approx(
        1 - sum(odds.probability_of_exactly(p, n, k) for k in range(3))
    )


def test_wilson_interval_contains_point_estimate():
    low, high = odds.wilson_interval(5, 100)
    assert low < 0.05 < high
    assert 0.0 <= low <= high <= 1.0


def test_wilson_interval_is_wide_for_tiny_samples():
    narrow = odds.wilson_interval(50, 1000)
    wide = odds.wilson_interval(1, 20)
    assert (wide[1] - wide[0]) > (narrow[1] - narrow[0])


def test_wilson_interval_handles_no_trials():
    assert odds.wilson_interval(0, 0) == (0.0, 1.0)


def test_luck_index():
    assert odds.luck_index(hits=2, trials=100, probability=0.01) == pytest.approx(2.0)
    assert odds.luck_index(hits=0, trials=0, probability=0.01) is None
