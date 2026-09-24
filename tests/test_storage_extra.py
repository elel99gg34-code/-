"""인벤토리·위시리스트·타임라인·프로필·백업."""
import sqlite3

import pytest

from eggmate.core.storage import (
    Database,
    HatchLog,
    Inventory,
    Timeline,
    Wishlist,
)


@pytest.fixture
def db(tmp_path):
    with Database(tmp_path / "eggmate.db") as handle:
        yield handle


# --- 인벤토리 ---------------------------------------------------------
def test_inventory_add_and_list(db):
    inv = Inventory(db)
    inv.add("Spider", quantity=2)
    inv.add("Kitsune", mutation="Rainbow", weight_ratio=40)
    assert inv.count() == 2
    assert inv.total_quantity() == 3


def test_inventory_rejects_a_blank_pet(db):
    with pytest.raises(ValueError):
        Inventory(db).add("")


def test_inventory_update_changes_fields(db):
    inv = Inventory(db)
    item_id = inv.add("Spider")
    inv.update(item_id, mutation="Golden", weight_ratio=12.5)
    item = inv.all()[0]
    assert item.mutation == "Golden" and item.weight_ratio == 12.5


def test_inventory_update_ignores_unknown_fields(db):
    inv = Inventory(db)
    item_id = inv.add("Spider")
    inv.update(item_id, 해킹="drop table")  # 조용히 무시
    assert inv.all()[0].pet == "Spider"


def test_inventory_update_with_nothing_is_a_noop(db):
    inv = Inventory(db)
    item_id = inv.add("Spider")
    inv.update(item_id)
    assert inv.count() == 1


def test_inventory_delete_and_clear(db):
    inv = Inventory(db)
    first = inv.add("A")
    inv.add("B")
    inv.delete(first)
    assert [i.pet for i in inv.all()] == ["B"]
    inv.clear()
    assert inv.count() == 0


def test_set_equipped_replaces_the_previous_selection(db):
    inv = Inventory(db)
    a, b, c = inv.add("A"), inv.add("B"), inv.add("C")
    inv.set_equipped({a, b})
    assert {i.id for i in inv.equipped()} == {a, b}
    inv.set_equipped({c})
    assert {i.id for i in inv.equipped()} == {c}


def test_set_equipped_with_an_empty_set_unequips_everything(db):
    inv = Inventory(db)
    inv.add("A", equipped=True)
    inv.set_equipped(set())
    assert inv.equipped() == []


def test_fuse_candidates_needs_three_of_a_kind(db):
    inv = Inventory(db)
    inv.add("Spider", quantity=2)
    inv.add("Bear", quantity=3)
    assert inv.fuse_candidates() == [("Bear", 3)]


def test_fuse_candidates_sum_across_rows(db):
    inv = Inventory(db)
    inv.add("Spider", quantity=1)
    inv.add("Spider", quantity=2)
    assert inv.fuse_candidates() == [("Spider", 3)]


def test_fuse_candidates_skip_mutated_pets(db):
    """뮤테이션 붙은 펫은 퓨즈하면 손해라 후보에서 뺀다."""
    inv = Inventory(db)
    inv.add("Spider", mutation="Rainbow", quantity=5)
    assert inv.fuse_candidates() == []


def test_inventory_csv_round_trip(db, tmp_path):
    inv = Inventory(db)
    inv.add("Spider", mutation="Golden", weight_ratio=3.5, quantity=2, equipped=True, note="메모")
    target = inv.export_csv(tmp_path / "inv.csv")

    inv.clear()
    assert inv.import_csv(target) == 1

    restored = inv.all()[0]
    assert restored.pet == "Spider"
    assert restored.mutation == "Golden"
    assert restored.weight_ratio == pytest.approx(3.5)
    assert restored.quantity == 2
    assert restored.equipped


def test_inventory_import_skips_blank_rows(db, tmp_path):
    path = tmp_path / "partial.csv"
    path.write_text("펫,뮤테이션,무게배수,수량,장착,메모\n,None,1,1,,\nSpider,None,1,1,,\n",
                    encoding="utf-8-sig")
    assert Inventory(db).import_csv(path) == 1


def test_inventory_import_tolerates_bad_numbers(db, tmp_path):
    path = tmp_path / "bad.csv"
    path.write_text("펫,뮤테이션,무게배수,수량,장착,메모\nSpider,None,많이,조금,,\n",
                    encoding="utf-8-sig")
    Inventory(db).import_csv(path)
    assert Inventory(db).all()[0].weight_ratio == 1.0


# --- 위시리스트 -------------------------------------------------------
def test_wishlist_orders_by_priority(db):
    wish = Wishlist(db)
    wish.add("Low", priority=3)
    wish.add("High", priority=1)
    assert [i.pet for i in wish.all()] == ["High", "Low"]


def test_wishlist_priority_is_clamped(db):
    wish = Wishlist(db)
    wish.add("X", priority=99)
    assert wish.all()[0].priority == 3


def test_wishlist_done_items_sort_last_and_can_be_hidden(db):
    wish = Wishlist(db)
    first = wish.add("Done", priority=1)
    wish.add("Todo", priority=2)
    wish.set_done(first)
    assert [i.pet for i in wish.all()] == ["Todo", "Done"]
    assert [i.pet for i in wish.all(include_done=False)] == ["Todo"]
    assert wish.pending_pets() == {"Todo"}


def test_wishlist_rejects_a_blank_pet(db):
    with pytest.raises(ValueError):
        Wishlist(db).add("")


def test_wishlist_delete(db):
    wish = Wishlist(db)
    wish.delete(wish.add("X"))
    assert wish.count() == 0


# --- 타임라인 ---------------------------------------------------------
def test_timeline_is_chronological(db):
    line = Timeline(db)
    line.add(speed=100, created_at="2026-01-01T00:00:00")
    line.add(speed=900, created_at="2026-02-01T00:00:00")
    assert [p.speed for p in line.all()] == [100, 900]
    assert line.latest().speed == 900


def test_timeline_growth_needs_two_points(db):
    line = Timeline(db)
    line.add(speed=100)
    assert line.growth("speed") is None
    line.add(speed=500)
    assert line.growth("speed") == (100.0, 500.0)


def test_timeline_growth_skips_missing_values(db):
    line = Timeline(db)
    line.add(speed=100, created_at="2026-01-01T00:00:00")
    line.add(money=50, created_at="2026-01-02T00:00:00")
    line.add(speed=700, created_at="2026-01-03T00:00:00")
    assert line.growth("speed") == (100.0, 700.0)


def test_timeline_rejects_an_unknown_field(db):
    with pytest.raises(ValueError):
        Timeline(db).growth("행복")


def test_timeline_latest_is_none_when_empty(db):
    assert Timeline(db).latest() is None


def test_timeline_delete(db):
    line = Timeline(db)
    line.delete(line.add(speed=1))
    assert line.count() == 0


# --- 프로필 -----------------------------------------------------------
def test_profiles_are_isolated(db):
    log = HatchLog(db)
    log.add(pet="본캐펫")
    db.use_profile("부캐")
    assert log.count() == 0
    log.add(pet="부캐펫")
    db.use_profile("기본")
    assert [r.pet for r in log.all()] == ["본캐펫"]


def test_profiles_lists_every_profile_in_use(db):
    HatchLog(db).add(pet="A")
    db.use_profile("두번째")
    Inventory(db).add("B")
    assert set(db.profiles()) >= {"기본", "두번째"}


def test_rename_profile_moves_every_table(db):
    HatchLog(db).add(pet="A")
    Inventory(db).add("B")
    assert db.rename_profile("기본", "새이름") == 2
    assert db.profile == "새이름"
    assert HatchLog(db).count() == 1


def test_rename_profile_rejects_a_blank_name(db):
    with pytest.raises(ValueError):
        db.rename_profile("기본", "  ")


def test_delete_profile_removes_its_rows_and_falls_back(db):
    db.use_profile("버릴것")
    HatchLog(db).add(pet="A")
    assert db.delete_profile("버릴것") == 1
    assert db.profile == "기본"


def test_use_profile_normalises_blanks(db):
    db.use_profile("")
    assert db.profile == "기본"


def test_count_rejects_an_unknown_table(db):
    with pytest.raises(ValueError):
        db.count("비밀")


# --- 백업 -------------------------------------------------------------
def test_backup_and_restore_round_trip(db, tmp_path):
    log = HatchLog(db)
    log.add(pet="Kitsune", rarity="Divine")
    archive = db.backup_to(tmp_path / "backup.zip")
    assert archive.exists()

    log.clear()
    assert log.count() == 0

    db.restore_from(archive)
    assert HatchLog(db).count() == 1


def test_restore_rejects_an_archive_with_nothing_useful(db, tmp_path):
    import zipfile

    junk = tmp_path / "junk.zip"
    with zipfile.ZipFile(junk, "w") as archive:
        archive.writestr("readme.txt", "관계없는 파일")
    with pytest.raises(ValueError):
        db.restore_from(junk)


def test_backup_includes_settings_when_present(db, tmp_path):
    import zipfile

    (db.path.parent / "settings.json").write_text('{"theme": "light"}', encoding="utf-8")
    archive = db.backup_to(tmp_path / "with-settings.zip")
    with zipfile.ZipFile(archive) as handle:
        assert "settings.json" in handle.namelist()


# --- 마이그레이션 -----------------------------------------------------
def _write_legacy_db(path, rows=1):
    """구버전 DB 를 만들고 연결을 확실히 닫는다.

    sqlite3.connect 를 with 로 써도 연결은 닫히지 않는다 (트랜잭션만 끝난다).
    Windows 에서는 열린 파일을 옮길 수 없어서, 닫지 않으면 테스트가 깨진다.
    """
    conn = sqlite3.connect(path)
    try:
        conn.execute(
            "CREATE TABLE hatches (id INTEGER PRIMARY KEY, created_at TEXT, biome TEXT,"
            " pet TEXT, rarity TEXT, mutation TEXT, weight REAL, note TEXT)"
        )
        for index in range(rows):
            conn.execute(
                "INSERT INTO hatches VALUES (?, '2026-01-01T00:00:00', 'Forest', 'Chicken',"
                " 'Common', 'None', NULL, '옛기록')",
                (index + 1,),
            )
        conn.commit()
    finally:
        conn.close()


def test_legacy_hatches_db_is_migrated(tmp_path):
    _write_legacy_db(tmp_path / "hatches.db")

    with Database(tmp_path / "eggmate.db") as db:
        assert [r.pet for r in HatchLog(db).all()] == ["Chicken"]
        assert db.get_meta("legacy_migrated") == "1"


def test_migration_does_not_run_twice(tmp_path):
    _write_legacy_db(tmp_path / "hatches.db")

    for _ in range(2):
        with Database(tmp_path / "eggmate.db") as db:
            count = HatchLog(db).count()
    assert count == 1


def test_migration_does_not_resurrect_cleared_records(tmp_path):
    """옮긴 뒤 기록을 지웠다가 다시 열어도 옛 기록이 되살아나면 안 된다.

    예전에는 원본 파일 이름 변경으로 완료를 표시해서, 이름 변경이 실패한 환경에서는
    기록을 지운 뒤 다시 열 때 옛 기록이 돌아왔다.
    """
    legacy = tmp_path / "hatches.db"
    _write_legacy_db(legacy, rows=3)

    with Database(tmp_path / "eggmate.db") as db:
        assert HatchLog(db).count() == 3
        HatchLog(db).clear()

    # 원본을 일부러 되살려 둬도 다시 옮겨 오면 안 된다.
    migrated = legacy.with_suffix(".db.migrated")
    if migrated.exists():
        migrated.rename(legacy)

    with Database(tmp_path / "eggmate.db") as db:
        assert HatchLog(db).count() == 0


def test_migration_is_skipped_when_records_already_exist(tmp_path):
    target = tmp_path / "eggmate.db"
    with Database(target) as db:
        HatchLog(db).add(pet="이미 있는 기록")

    _write_legacy_db(tmp_path / "hatches.db")
    with Database(target) as db:
        assert HatchLog(db).count() == 1
        assert db.get_meta("legacy_migrated") == "skipped"


def test_meta_round_trips(tmp_path):
    with Database(tmp_path / "eggmate.db") as db:
        assert db.get_meta("없는키", "기본값") == "기본값"
        db.set_meta("키", "값1")
        db.set_meta("키", "값2")
        assert db.get_meta("키") == "값2"


# --- 추가된 부화 기록 기능 -------------------------------------------
def test_daily_counts(db):
    log = HatchLog(db)
    log.add(pet="A", created_at="2026-01-01T10:00:00")
    log.add(pet="B", created_at="2026-01-01T20:00:00")
    log.add(pet="C", created_at="2026-01-02T10:00:00")
    assert log.daily_counts() == {"2026-01-01": 2, "2026-01-02": 1}


def test_distinct_pets_ignores_blanks(db):
    log = HatchLog(db)
    log.add(pet="Chicken")
    log.add(pet="")
    assert log.distinct_pets() == {"Chicken"}


def test_repository_sharing_a_database_does_not_close_it(db):
    log = HatchLog(db)
    log.close()
    log.add(pet="여전히 동작")   # 공유 연결이라 닫히면 안 된다
    assert log.count() == 1
