import pytest

from eggmate.core.storage import HatchLog


@pytest.fixture
def log(tmp_path):
    with HatchLog(tmp_path / "test.db") as handle:
        yield handle


def test_add_and_count(log):
    log.add(pet="Chicken", rarity="Common", biome="Forest")
    log.add(pet="Owl", rarity="Rare", biome="Forest")
    assert log.count() == 2


def test_records_come_back_newest_first(log):
    log.add(pet="First")
    log.add(pet="Second")
    assert [r.pet for r in log.all()] == ["Second", "First"]


def test_limit(log):
    for i in range(5):
        log.add(pet=f"P{i}")
    assert len(log.all(limit=2)) == 2


def test_counts_by_rarity(log):
    for rarity in ("Common", "Common", "Rare"):
        log.add(rarity=rarity)
    assert log.counts_by("rarity") == {"Common": 2, "Rare": 1}


def test_counts_by_rejects_unknown_column(log):
    with pytest.raises(ValueError):
        log.counts_by("weight; DROP TABLE hatches")


def test_dry_streak_counts_since_last_hit(log):
    log.add(rarity="Rare")
    log.add(rarity="Common")
    log.add(rarity="Common")
    assert log.dry_streak({"Rare"}) == 2


def test_dry_streak_is_zero_right_after_a_hit(log):
    log.add(rarity="Common")
    log.add(rarity="Secret")
    assert log.dry_streak({"Secret"}) == 0


def test_dry_streak_counts_everything_when_never_hit(log):
    for _ in range(4):
        log.add(rarity="Common")
    assert log.dry_streak({"Divine"}) == 4


def test_delete_and_clear(log):
    first = log.add(pet="A")
    log.add(pet="B")
    log.delete(first)
    assert [r.pet for r in log.all()] == ["B"]
    log.clear()
    assert log.count() == 0


def test_weight_is_optional(log):
    log.add(pet="A")
    log.add(pet="B", weight=12.5)
    weights = {r.pet: r.weight for r in log.all()}
    assert weights == {"A": None, "B": 12.5}


def test_export_csv(tmp_path, log):
    log.add(pet="Chicken", rarity="Common", biome="Forest", mutation="Golden", weight=3.2)
    target = log.export_csv(tmp_path / "out" / "hatches.csv")
    text = target.read_text(encoding="utf-8-sig")
    assert "Chicken" in text and "Golden" in text and "등급" in text


def test_reopening_the_database_keeps_records(tmp_path):
    path = tmp_path / "persist.db"
    with HatchLog(path) as first:
        first.add(pet="Kitsune", rarity="Divine")
    with HatchLog(path) as second:
        assert second.count() == 1
        assert second.all()[0].pet == "Kitsune"
