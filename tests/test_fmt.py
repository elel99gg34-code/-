import pytest

from eggmate.core import fmt


@pytest.mark.parametrize("value,expected", [
    (1, "1"), (999, "999"), (1_500, "1.5K"), (42_000, "42K"),
    (1_800_000_000, "1.8B"), (6_900_000_000, "6.9B"), (2.5e12, "2.5T"), (-1500, "-1.5K"),
])
def test_compact(value, expected):
    assert fmt.compact(value) == expected


@pytest.mark.parametrize("value,expected", [
    (1_800_000_000, "18억"), (42_000, "4.2만"), (2.5e12, "2.5조"), (500, "500"),
])
def test_korean(value, expected):
    assert fmt.korean(value) == expected


def test_money_shows_both_notations():
    assert fmt.money(1_800_000_000) == "$1.8B (18억)"


def test_none_renders_as_dash():
    assert fmt.compact(None) == "—"
    assert fmt.korean(None) == "—"
    assert fmt.money(None) == "—"
    assert fmt.duration(None) == "—"


@pytest.mark.parametrize("text,expected", [
    ("1.5b", 1.5e9), ("250M", 2.5e8), ("3억", 3e8), ("12,000", 12000.0),
    ("$75M", 7.5e7), ("2조", 2e12), ("5만", 50000.0),
])
def test_parse_amount(text, expected):
    assert fmt.parse_amount(text) == pytest.approx(expected)


@pytest.mark.parametrize("bad", ["", "abc", "12 zz", None])
def test_parse_amount_rejects_garbage(bad):
    with pytest.raises(ValueError):
        fmt.parse_amount(bad)


def test_parse_amount_round_trips_with_compact():
    for value in (1_500, 42_000, 1.8e9, 6.9e9):
        assert fmt.parse_amount(fmt.compact(value)) == pytest.approx(value)


@pytest.mark.parametrize("seconds,expected", [
    (30, "30초"), (90, "1.5분"), (3600, "1.0시간"), (93_600, "1.1일"), (-5, "이미 달성"),
])
def test_duration(seconds, expected):
    assert fmt.duration(seconds) == expected


def test_duration_infinite():
    assert fmt.duration(float("inf")) == "영원히 못 갚음"
