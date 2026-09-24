import math

import pytest

from eggmate.core import simulate


def test_mean_converges_on_the_theoretical_value():
    result = simulate.attempts_until_first(0.01, trials=20_000, seed=7)
    assert result.mean == pytest.approx(result.theoretical_mean, rel=0.05)


def test_same_seed_gives_the_same_answer():
    a = simulate.attempts_until_first(0.05, trials=500, seed=123)
    b = simulate.attempts_until_first(0.05, trials=500, seed=123)
    assert a.samples == b.samples


def test_different_seeds_differ():
    a = simulate.attempts_until_first(0.05, trials=500, seed=1)
    b = simulate.attempts_until_first(0.05, trials=500, seed=2)
    assert a.samples != b.samples


def test_percentiles_are_ordered():
    result = simulate.attempts_until_first(0.002, trials=5_000, seed=11)
    assert result.luckiest <= result.p10 <= result.p25 <= result.median
    assert result.median <= result.p75 <= result.p90 <= result.p99 <= result.unluckiest


def test_median_is_below_the_mean_for_a_geometric_distribution():
    """기하분포는 오른쪽으로 길게 늘어져서 중앙값이 평균보다 작다."""
    result = simulate.attempts_until_first(0.001, trials=20_000, seed=3)
    assert result.median < result.mean


def test_spread_ratio_shows_the_luck_gap():
    result = simulate.attempts_until_first(0.001, trials=10_000, seed=5)
    assert result.spread_ratio > 5


def test_certain_probability_always_takes_one_attempt():
    result = simulate.attempts_until_first(1.0, trials=100, seed=1)
    assert set(result.samples) == {1}


def test_zero_probability_produces_no_samples():
    result = simulate.attempts_until_first(0.0, trials=100, seed=1)
    assert result.samples == []
    assert math.isinf(result.theoretical_mean)


def test_trials_are_capped():
    result = simulate.attempts_until_first(0.5, trials=10_000_000, seed=1)
    assert result.trials == simulate.MAX_TRIALS


def test_every_sample_is_at_least_one():
    result = simulate.attempts_until_first(0.3, trials=1_000, seed=9)
    assert min(result.samples) >= 1


def test_hatch_session_counts_add_up():
    outcome = simulate.hatch_session({"a": 0.5, "b": 0.5}, hatches=1_000, seed=4)
    assert sum(outcome.counts.values()) == 1_000


def test_hatch_session_ratios_track_the_input():
    outcome = simulate.hatch_session({"common": 0.9, "rare": 0.1}, hatches=20_000, seed=6)
    assert outcome.ratio("rare") == pytest.approx(0.1, abs=0.02)


def test_hatch_session_adds_a_leftover_bucket():
    outcome = simulate.hatch_session({"rare": 0.01}, hatches=1_000, seed=2)
    assert "기타" in outcome.counts
    assert outcome.counts["기타"] > 900


def test_hatch_session_normalises_probabilities_over_one():
    outcome = simulate.hatch_session({"a": 0.8, "b": 0.8}, hatches=2_000, seed=8)
    assert sum(outcome.counts.values()) == 2_000
    assert "기타" not in outcome.counts


def test_hatch_session_with_no_probabilities():
    assert simulate.hatch_session({}, hatches=100).counts == {}


def test_hatch_session_ratio_of_missing_key_is_zero():
    assert simulate.hatch_session({"a": 1.0}, hatches=10, seed=1).ratio("nope") == 0


def test_histogram_buckets_cover_every_value():
    values = [1, 5, 9, 12, 30, 44]
    buckets = simulate.histogram(values, buckets=4)
    assert sum(count for _, _, count in buckets) == len(values)


def test_histogram_of_identical_values_is_a_single_bucket():
    assert simulate.histogram([7, 7, 7]) == [(7.0, 7.0, 3)]


def test_histogram_of_nothing_is_empty():
    assert simulate.histogram([]) == []
