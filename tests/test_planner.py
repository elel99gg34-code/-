import math

import pytest

from eggmate.core import planner
from eggmate.core.planner import LOCKED, SAFE, TIGHT


def test_forest_is_always_open(dataset):
    rows = planner.evaluate_biomes(dataset, speed=0)
    forest = next(r for r in rows if r.biome.name == "Forest")
    assert forest.status == SAFE


def test_speed_exactly_at_requirement_is_tight(dataset):
    lake = dataset.biome("Lake")
    rows = planner.evaluate_biomes(dataset, speed=lake.speed_required)
    row = next(r for r in rows if r.biome.name == "Lake")
    assert row.status == TIGHT
    assert row.shortfall == 0
    assert row.needed_for_safe == pytest.approx(lake.speed_required)


def test_double_requirement_is_safe(dataset):
    lake = dataset.biome("Lake")
    rows = planner.evaluate_biomes(dataset, speed=lake.speed_required * 2)
    assert next(r for r in rows if r.biome.name == "Lake").status == SAFE


def test_below_requirement_is_locked_with_shortfall(dataset):
    rows = planner.evaluate_biomes(dataset, speed=500)
    lake = next(r for r in rows if r.biome.name == "Lake")
    assert lake.status == LOCKED
    assert lake.shortfall == pytest.approx(400)
    assert not lake.is_open


def test_next_target_is_nearest_locked_biome(dataset):
    target = planner.next_target(dataset, speed=50_000)
    assert target is not None
    assert target.biome.name == "Snow"


def test_next_target_is_none_when_everything_is_open(dataset):
    assert planner.next_target(dataset, speed=1e12) is None


def test_roi_payback():
    result = planner.roi(cost=1000, income_before=10, income_after=20)
    assert result.income_gain == 10
    assert result.payback_seconds == pytest.approx(100)
    assert result.daily_gain == pytest.approx(864_000)
    assert result.is_worth_it


def test_roi_with_no_gain_never_pays_back():
    result = planner.roi(cost=1000, income_before=50, income_after=50)
    assert math.isinf(result.payback_seconds)
    assert not result.is_worth_it


def test_roi_with_negative_gain():
    result = planner.roi(cost=100, income_before=80, income_after=40)
    assert result.income_gain == -40
    assert math.isinf(result.payback_seconds)


def test_time_to_amount():
    assert planner.time_to_amount(target=1000, current=0, income_per_second=10) == pytest.approx(100)
    assert planner.time_to_amount(target=100, current=500, income_per_second=10) == 0.0
    assert math.isinf(planner.time_to_amount(target=100, current=0, income_per_second=0))


def test_best_reachable_pets_excludes_locked_biomes(dataset):
    rows = planner.best_reachable_pets(dataset, speed=50_000, limit=5)
    assert rows
    reachable = {"Forest", "Lake", "Desert", "Jungle"}
    assert all(row.biome in reachable for row in rows)
    assert rows == sorted(rows, key=lambda r: r.income, reverse=True)


def test_best_reachable_pets_respects_limit(dataset):
    assert len(planner.best_reachable_pets(dataset, speed=1e12, limit=3)) == 3
