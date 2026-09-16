import math

import pytest

from eggmate.core import fuse


def test_fusing_into_a_stronger_pet_is_recommended():
    verdict = fuse.evaluate(base_income=1_000, result_base_income=5_000)
    assert verdict.income_before == 3_000
    assert verdict.income_after == 5_000
    assert verdict.delta == 2_000
    assert verdict.recommend


def test_fusing_into_a_weaker_result_is_rejected():
    verdict = fuse.evaluate(base_income=1_000, result_base_income=2_000)
    assert verdict.delta == -1_000
    assert not verdict.recommend
    assert "감소" in verdict.reasons[0]


def test_mutated_inputs_block_the_recommendation():
    """수입이 늘어도 뮤테이션이 사라지면 비권장이어야 한다."""
    verdict = fuse.evaluate(
        base_income=1_000, result_base_income=5_000, input_mutation=3.5
    )
    assert not verdict.recommend
    assert any("뮤테이션" in reason for reason in verdict.reasons)


def test_payback_uses_fuse_cost():
    verdict = fuse.evaluate(base_income=1_000, result_base_income=5_000, cost=20_000)
    assert verdict.payback_seconds == pytest.approx(10.0)


def test_payback_is_infinite_without_gain():
    verdict = fuse.evaluate(base_income=1_000, result_base_income=1_000, cost=500)
    assert math.isinf(verdict.payback_seconds)


def test_freed_slots_is_always_two():
    assert fuse.evaluate(1, 1).freed_slots == 2


def test_weight_affects_both_sides():
    heavy_inputs = fuse.evaluate(1_000, 5_000, input_ratio=100)
    plain = fuse.evaluate(1_000, 5_000)
    assert heavy_inputs.income_before > plain.income_before
    assert not heavy_inputs.recommend


def test_pen_full_note_appears_only_when_losing():
    losing = fuse.evaluate(1_000, 1_500, pen_is_full=True)
    assert any("슬롯" in reason for reason in losing.reasons)
