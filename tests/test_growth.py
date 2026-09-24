import math

import pytest

from eggmate.core import growth
from eggmate.core.growth import Upgrade


def test_payback_is_cost_over_gain():
    assert Upgrade("x", 1000, 10).payback_seconds == pytest.approx(100)


def test_payback_is_infinite_without_gain():
    assert math.isinf(Upgrade("x", 1000, 0).payback_seconds)


def test_prioritise_puts_fast_payback_first():
    slow = Upgrade("slow", 1000, 1)
    fast = Upgrade("fast", 10, 10)
    dead = Upgrade("dead", 5, 0)
    assert [u.name for u in growth.prioritise([slow, dead, fast])] == ["fast", "slow", "dead"]


def test_purchase_plan_compounds_income():
    steps = growth.purchase_plan(
        [Upgrade("a", 100, 100), Upgrade("b", 1000, 50)], starting_income=10
    )
    assert steps[0].income_after == 110
    assert steps[1].income_before == 110
    assert steps[1].income_after == 160


def test_purchase_plan_waits_for_money():
    steps = growth.purchase_plan([Upgrade("a", 500, 5)], starting_income=10)
    assert steps[0].wait_seconds == pytest.approx(50)


def test_purchase_plan_uses_money_on_hand():
    steps = growth.purchase_plan([Upgrade("a", 500, 5)], starting_income=10, starting_money=500)
    assert steps[0].wait_seconds == 0


def test_purchase_plan_carries_leftover_money():
    steps = growth.purchase_plan(
        [Upgrade("a", 100, 10), Upgrade("b", 100, 10)], starting_income=10, starting_money=1000
    )
    assert all(step.wait_seconds == 0 for step in steps)


def test_purchase_plan_with_no_income_never_finishes():
    steps = growth.purchase_plan([Upgrade("a", 100, 10)], starting_income=0)
    assert math.isinf(steps[0].wait_seconds)
    assert math.isinf(steps[0].cumulative_seconds)


def test_purchase_plan_is_empty_for_no_upgrades():
    assert growth.purchase_plan([], starting_income=100) == []


def test_reinvestment_curve_grows_income():
    points = growth.reinvestment_curve(100, hours=10, reinvest_ratio=0.9, efficiency=1e-4)
    assert points[-1].income > points[0].income
    assert points[-1].money_earned > 0


def test_reinvesting_nothing_keeps_income_flat():
    points = growth.reinvestment_curve(100, hours=5, reinvest_ratio=0.0, efficiency=1e-3)
    assert points[-1].income == pytest.approx(100)
    assert points[-1].money_earned == pytest.approx(100 * 5 * 3600)


def test_reinvesting_everything_earns_no_cash():
    points = growth.reinvestment_curve(100, hours=5, reinvest_ratio=1.0, efficiency=1e-6)
    assert points[-1].money_earned == 0


def test_reinvestment_curve_starts_at_zero_hours():
    points = growth.reinvestment_curve(50, hours=1)
    assert points[0].hour == 0 and points[0].money_earned == 0


@pytest.mark.parametrize("ratio", [-1.0, 2.0])
def test_reinvestment_ratio_is_clamped(ratio):
    growth.reinvestment_curve(100, hours=1, reinvest_ratio=ratio)  # 예외 없이 동작


def test_training_time_uses_rate_and_trail():
    estimate = growth.training_time(0, 1000, speed_per_tick=10, trail_multiplier=2)
    assert estimate.rate_per_second == 20
    assert estimate.seconds == pytest.approx(50)
    assert estimate.is_reachable


def test_training_time_is_zero_when_already_there():
    assert growth.training_time(5000, 1000, 10).seconds == 0


def test_training_time_is_infinite_without_progress():
    estimate = growth.training_time(0, 1000, speed_per_tick=0)
    assert math.isinf(estimate.seconds)
    assert not estimate.is_reachable


def test_training_time_respects_tick_length():
    fast = growth.training_time(0, 100, speed_per_tick=10, seconds_per_tick=1)
    slow = growth.training_time(0, 100, speed_per_tick=10, seconds_per_tick=5)
    assert slow.seconds == pytest.approx(fast.seconds * 5)


def test_run_value_multiplies_through():
    estimate = growth.run_value(eggs_per_run=4, success_rate=0.5, value_per_egg=1000, seconds_per_run=60)
    assert estimate.expected_value == pytest.approx(2000)
    assert estimate.runs_per_hour == pytest.approx(60)
    assert estimate.value_per_hour == pytest.approx(120_000)


def test_run_value_with_certain_failure():
    assert growth.run_value(4, 0.0, 1000, 60).expected_value == 0


def test_run_value_with_zero_duration_has_no_hourly_rate():
    assert growth.run_value(4, 1.0, 1000, 0).value_per_hour == 0
