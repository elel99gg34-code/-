"""로컬 저장소 (SQLite).

게임과는 아무 연결도 하지 않는다. 전부 사용자가 직접 입력한 내용이고,
데이터는 내 PC 안의 파일 하나에만 저장된다.

파일 하나(eggmate.db)에 모든 표를 담고, 각 행은 프로필(부캐) 이름을 가진다.
예전 버전의 hatches.db 가 있으면 처음 열 때 옮겨 온다.
"""
from __future__ import annotations

import csv
import shutil
import sqlite3
import zipfile
from contextlib import closing
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from .dataset import user_dir

DB_FILENAME = "eggmate.db"
LEGACY_DB_FILENAME = "hatches.db"
DEFAULT_PROFILE = "기본"

SCHEMA = """
CREATE TABLE IF NOT EXISTS hatches (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    profile     TEXT    NOT NULL DEFAULT '기본',
    created_at  TEXT    NOT NULL,
    biome       TEXT    NOT NULL DEFAULT '',
    pet         TEXT    NOT NULL DEFAULT '',
    rarity      TEXT    NOT NULL DEFAULT '',
    mutation    TEXT    NOT NULL DEFAULT 'None',
    weight      REAL,
    note        TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_hatches_created ON hatches(profile, created_at);
CREATE INDEX IF NOT EXISTS idx_hatches_rarity  ON hatches(profile, rarity);

CREATE TABLE IF NOT EXISTS inventory (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    profile      TEXT    NOT NULL DEFAULT '기본',
    created_at   TEXT    NOT NULL,
    pet          TEXT    NOT NULL,
    mutation     TEXT    NOT NULL DEFAULT 'None',
    weight_ratio REAL    NOT NULL DEFAULT 1.0,
    quantity     INTEGER NOT NULL DEFAULT 1,
    equipped     INTEGER NOT NULL DEFAULT 0,
    note         TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_inventory_profile ON inventory(profile, pet);

CREATE TABLE IF NOT EXISTS wishlist (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    profile    TEXT    NOT NULL DEFAULT '기본',
    created_at TEXT    NOT NULL,
    pet        TEXT    NOT NULL,
    priority   INTEGER NOT NULL DEFAULT 2,
    note       TEXT    NOT NULL DEFAULT '',
    done       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wishlist_profile ON wishlist(profile, done);

CREATE TABLE IF NOT EXISTS timeline (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    profile    TEXT    NOT NULL DEFAULT '기본',
    created_at TEXT    NOT NULL,
    speed      REAL,
    money      REAL,
    income     REAL,
    note       TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_timeline_profile ON timeline(profile, created_at);

CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
"""

LEGACY_MIGRATED_KEY = "legacy_migrated"


def _now() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def default_db_path() -> Path:
    return user_dir() / DB_FILENAME


class Database:
    """연결 한 개를 여러 저장소가 나눠 쓴다."""

    def __init__(self, path: Path | str | None = None, profile: str = DEFAULT_PROFILE) -> None:
        self.path = Path(path) if path else default_db_path()
        self.profile = profile or DEFAULT_PROFILE
        if str(self.path) != ":memory:":
            self.path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self.path))
        self._conn.row_factory = sqlite3.Row
        with closing(self._conn.cursor()) as cur:
            cur.executescript(SCHEMA)
        self._conn.commit()
        self._migrate_legacy()

    # --- 내부 ---------------------------------------------------------
    def get_meta(self, key: str, default: str = "") -> str:
        rows = self.execute("SELECT value FROM meta WHERE key = ?", (key,))
        return rows[0]["value"] if rows else default

    def set_meta(self, key: str, value: str) -> None:
        self.write(
            "INSERT INTO meta (key, value) VALUES (?, ?)"
            " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (key, value),
        )

    def _migrate_legacy(self) -> int:
        """구버전 hatches.db 의 기록을 한 번만 옮겨 온다.

        완료 표시는 DB 안의 meta 표에 남긴다. 예전에는 원본 파일 이름을 바꾸는 것으로
        표시를 대신했는데, Windows 에서 파일이 잠겨 있으면 이름 변경이 실패해 표시가
        남지 않았다. 그 상태에서 사용자가 기록을 전부 지우면 옛 기록이 되살아났다.
        """
        if str(self.path) == ":memory:":
            return 0
        if self.get_meta(LEGACY_MIGRATED_KEY):
            return 0
        legacy = self.path.parent / LEGACY_DB_FILENAME
        if not legacy.exists():
            return 0
        if self.count("hatches") > 0:
            self.set_meta(LEGACY_MIGRATED_KEY, "skipped")
            return 0
        try:
            with closing(sqlite3.connect(str(legacy))) as old:
                old.row_factory = sqlite3.Row
                rows = old.execute("SELECT * FROM hatches").fetchall()
        except sqlite3.Error:
            return 0

        moved = 0
        with closing(self._conn.cursor()) as cur:
            for row in rows:
                cur.execute(
                    "INSERT INTO hatches (profile, created_at, biome, pet, rarity, mutation, weight, note)"
                    " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (DEFAULT_PROFILE, row["created_at"], row["biome"], row["pet"],
                     row["rarity"], row["mutation"], row["weight"], row["note"]),
                )
                moved += 1
        self._conn.commit()
        self.set_meta(LEGACY_MIGRATED_KEY, str(moved))

        # 원본 정리는 어디까지나 덤이다. 실패해도 위 표시가 있으니 다시 옮기지 않는다.
        try:
            legacy.rename(legacy.with_suffix(".db.migrated"))
        except OSError:
            pass
        return moved

    def execute(self, query: str, params: Iterable[Any] = ()) -> list[sqlite3.Row]:
        with closing(self._conn.cursor()) as cur:
            rows = cur.execute(query, tuple(params)).fetchall()
        return rows

    def write(self, query: str, params: Iterable[Any] = ()) -> int:
        with closing(self._conn.cursor()) as cur:
            cur.execute(query, tuple(params))
            last = cur.lastrowid
        self._conn.commit()
        return int(last or 0)

    def count(self, table: str) -> int:
        if table not in {"hatches", "inventory", "wishlist", "timeline"}:
            raise ValueError(f"알 수 없는 표: {table}")
        rows = self.execute(f"SELECT COUNT(*) AS n FROM {table} WHERE profile = ?", (self.profile,))
        return int(rows[0]["n"])

    # --- 프로필 -------------------------------------------------------
    def profiles(self) -> list[str]:
        """기록이 하나라도 있는 프로필 목록. 활성 프로필은 항상 포함된다."""
        names: set[str] = {self.profile}
        for table in ("hatches", "inventory", "wishlist", "timeline"):
            for row in self.execute(f"SELECT DISTINCT profile FROM {table}"):
                if row["profile"]:
                    names.add(row["profile"])
        return sorted(names)

    def use_profile(self, name: str) -> None:
        self.profile = (name or DEFAULT_PROFILE).strip() or DEFAULT_PROFILE

    def rename_profile(self, old: str, new: str) -> int:
        new = (new or "").strip()
        if not new:
            raise ValueError("프로필 이름이 비어 있습니다.")
        changed = 0
        for table in ("hatches", "inventory", "wishlist", "timeline"):
            with closing(self._conn.cursor()) as cur:
                cur.execute(f"UPDATE {table} SET profile = ? WHERE profile = ?", (new, old))
                changed += cur.rowcount
        self._conn.commit()
        if self.profile == old:
            self.profile = new
        return changed

    def delete_profile(self, name: str) -> int:
        removed = 0
        for table in ("hatches", "inventory", "wishlist", "timeline"):
            with closing(self._conn.cursor()) as cur:
                cur.execute(f"DELETE FROM {table} WHERE profile = ?", (name,))
                removed += cur.rowcount
        self._conn.commit()
        if self.profile == name:
            self.profile = DEFAULT_PROFILE
        return removed

    # --- 수명 ---------------------------------------------------------
    def close(self) -> None:
        self._conn.close()

    def __enter__(self) -> "Database":
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.close()

    # --- 백업 ---------------------------------------------------------
    def backup_to(self, target: Path | str) -> Path:
        """DB + 설정 + 사용자 데이터 파일을 ZIP 하나로 묶는다."""
        target = Path(target)
        target.parent.mkdir(parents=True, exist_ok=True)
        self._conn.commit()

        folder = self.path.parent
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
            if self.path.exists():
                archive.write(self.path, self.path.name)
            for extra in ("settings.json", "gamedata.json"):
                candidate = folder / extra
                if candidate.exists():
                    archive.write(candidate, extra)
        return target

    def restore_from(self, source: Path | str) -> list[str]:
        """백업 ZIP 을 풀어 되돌린다. 되돌린 파일 이름 목록을 준다."""
        source = Path(source)
        folder = self.path.parent
        allowed = {DB_FILENAME, "settings.json", "gamedata.json"}

        with zipfile.ZipFile(source) as archive:
            names = [n for n in archive.namelist() if Path(n).name in allowed and "/" not in n]
            if not names:
                raise ValueError("백업 파일에 복원할 내용이 없습니다.")
            self._conn.close()
            for name in names:
                with archive.open(name) as handle, (folder / name).open("wb") as out:
                    shutil.copyfileobj(handle, out)

        self._conn = sqlite3.connect(str(self.path))
        self._conn.row_factory = sqlite3.Row
        with closing(self._conn.cursor()) as cur:
            cur.executescript(SCHEMA)
        self._conn.commit()
        return names


# ---------------------------------------------------------------------------
# 저장소 공통
# ---------------------------------------------------------------------------
class _Repository:
    """Database 를 공유하거나, 경로를 받아 스스로 하나 연다."""

    def __init__(self, source: "Database | Path | str | None" = None) -> None:
        if isinstance(source, Database):
            self.db = source
            self._owned = False
        else:
            self.db = Database(source)
            self._owned = True

    @property
    def profile(self) -> str:
        return self.db.profile

    def close(self) -> None:
        if self._owned:
            self.db.close()

    def __enter__(self):
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.close()


# ---------------------------------------------------------------------------
# 부화 기록
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class HatchRecord:
    id: int
    created_at: str
    biome: str
    pet: str
    rarity: str
    mutation: str
    weight: float | None
    note: str


class HatchLog(_Repository):
    """부화 기록 CRUD + 통계."""

    def add(
        self,
        pet: str = "",
        rarity: str = "",
        biome: str = "",
        mutation: str = "None",
        weight: float | None = None,
        note: str = "",
        created_at: str | None = None,
    ) -> int:
        return self.db.write(
            "INSERT INTO hatches (profile, created_at, biome, pet, rarity, mutation, weight, note)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (self.profile, created_at or _now(), biome, pet, rarity, mutation, weight, note),
        )

    def delete(self, record_id: int) -> None:
        self.db.write("DELETE FROM hatches WHERE id = ? AND profile = ?", (record_id, self.profile))

    def clear(self) -> None:
        self.db.write("DELETE FROM hatches WHERE profile = ?", (self.profile,))

    def all(self, limit: int | None = None) -> list[HatchRecord]:
        query = "SELECT * FROM hatches WHERE profile = ? ORDER BY id DESC"
        params: list[Any] = [self.profile]
        if limit is not None:
            query += " LIMIT ?"
            params.append(int(limit))
        return [
            HatchRecord(
                id=r["id"], created_at=r["created_at"], biome=r["biome"], pet=r["pet"],
                rarity=r["rarity"], mutation=r["mutation"], weight=r["weight"], note=r["note"],
            )
            for r in self.db.execute(query, params)
        ]

    def count(self) -> int:
        return self.db.count("hatches")

    def counts_by(self, column: str) -> dict[str, int]:
        if column not in {"rarity", "biome", "pet", "mutation"}:
            raise ValueError(f"집계할 수 없는 컬럼: {column}")
        rows = self.db.execute(
            f"SELECT {column} AS key, COUNT(*) AS n FROM hatches WHERE profile = ?"
            f" GROUP BY {column} ORDER BY n DESC",
            (self.profile,),
        )
        return {r["key"]: int(r["n"]) for r in rows}

    def dry_streak(self, rarities: set[str]) -> int:
        """마지막으로 해당 등급이 나온 뒤 몇 번을 헛깠는지."""
        streak = 0
        for record in self.all():
            if record.rarity in rarities:
                break
            streak += 1
        return streak

    def distinct_pets(self) -> set[str]:
        rows = self.db.execute(
            "SELECT DISTINCT pet FROM hatches WHERE profile = ? AND pet <> ''", (self.profile,)
        )
        return {r["pet"] for r in rows}

    def daily_counts(self) -> dict[str, int]:
        """날짜별 부화 수 (오래된 순)."""
        rows = self.db.execute(
            "SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n FROM hatches"
            " WHERE profile = ? GROUP BY day ORDER BY day",
            (self.profile,),
        )
        return {r["day"]: int(r["n"]) for r in rows}

    def export_csv(self, target: Path | str) -> Path:
        target = Path(target)
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.writer(handle)
            writer.writerow(["id", "시각", "바이옴", "펫", "등급", "뮤테이션", "무게", "메모"])
            for r in reversed(self.all()):
                writer.writerow(
                    [r.id, r.created_at, r.biome, r.pet, r.rarity, r.mutation,
                     "" if r.weight is None else r.weight, r.note]
                )
        return target


# ---------------------------------------------------------------------------
# 인벤토리
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class InventoryItem:
    id: int
    created_at: str
    pet: str
    mutation: str
    weight_ratio: float
    quantity: int
    equipped: bool
    note: str


class Inventory(_Repository):
    """내가 가진 펫 목록. 펜 빌더와 퓨즈 탐지의 입력이 된다."""

    def add(
        self,
        pet: str,
        mutation: str = "None",
        weight_ratio: float = 1.0,
        quantity: int = 1,
        equipped: bool = False,
        note: str = "",
        created_at: str | None = None,
    ) -> int:
        if not pet:
            raise ValueError("펫 이름이 필요합니다.")
        return self.db.write(
            "INSERT INTO inventory (profile, created_at, pet, mutation, weight_ratio, quantity, equipped, note)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (self.profile, created_at or _now(), pet, mutation,
             max(0.01, float(weight_ratio)), max(1, int(quantity)), int(bool(equipped)), note),
        )

    def update(self, item_id: int, **changes: Any) -> None:
        allowed = {"pet", "mutation", "weight_ratio", "quantity", "equipped", "note"}
        updates = {k: v for k, v in changes.items() if k in allowed}
        if not updates:
            return
        if "equipped" in updates:
            updates["equipped"] = int(bool(updates["equipped"]))
        assignments = ", ".join(f"{k} = ?" for k in updates)
        self.db.write(
            f"UPDATE inventory SET {assignments} WHERE id = ? AND profile = ?",
            (*updates.values(), item_id, self.profile),
        )

    def delete(self, item_id: int) -> None:
        self.db.write("DELETE FROM inventory WHERE id = ? AND profile = ?", (item_id, self.profile))

    def clear(self) -> None:
        self.db.write("DELETE FROM inventory WHERE profile = ?", (self.profile,))

    def all(self) -> list[InventoryItem]:
        rows = self.db.execute(
            "SELECT * FROM inventory WHERE profile = ? ORDER BY id DESC", (self.profile,)
        )
        return [
            InventoryItem(
                id=r["id"], created_at=r["created_at"], pet=r["pet"], mutation=r["mutation"],
                weight_ratio=float(r["weight_ratio"]), quantity=int(r["quantity"]),
                equipped=bool(r["equipped"]), note=r["note"],
            )
            for r in rows
        ]

    def equipped(self) -> list[InventoryItem]:
        return [item for item in self.all() if item.equipped]

    def count(self) -> int:
        return self.db.count("inventory")

    def total_quantity(self) -> int:
        rows = self.db.execute(
            "SELECT COALESCE(SUM(quantity), 0) AS n FROM inventory WHERE profile = ?", (self.profile,)
        )
        return int(rows[0]["n"])

    def set_equipped(self, ids: set[int]) -> None:
        """넘긴 id 만 장착 상태로 만든다."""
        self.db.write("UPDATE inventory SET equipped = 0 WHERE profile = ?", (self.profile,))
        for item_id in ids:
            self.db.write(
                "UPDATE inventory SET equipped = 1 WHERE id = ? AND profile = ?",
                (item_id, self.profile),
            )

    def fuse_candidates(self) -> list[tuple[str, int]]:
        """뮤테이션 없는 같은 펫이 3마리 이상 모인 조합 (퓨즈 후보)."""
        rows = self.db.execute(
            "SELECT pet, COALESCE(SUM(quantity), 0) AS n FROM inventory"
            " WHERE profile = ? AND mutation = 'None' GROUP BY pet HAVING n >= 3"
            " ORDER BY n DESC",
            (self.profile,),
        )
        return [(r["pet"], int(r["n"])) for r in rows]

    def distinct_pets(self) -> set[str]:
        rows = self.db.execute(
            "SELECT DISTINCT pet FROM inventory WHERE profile = ?", (self.profile,)
        )
        return {r["pet"] for r in rows}

    def export_csv(self, target: Path | str) -> Path:
        target = Path(target)
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.writer(handle)
            writer.writerow(["펫", "뮤테이션", "무게배수", "수량", "장착", "메모"])
            for item in reversed(self.all()):
                writer.writerow([item.pet, item.mutation, item.weight_ratio,
                                 item.quantity, "Y" if item.equipped else "", item.note])
        return target

    def import_csv(self, source: Path | str) -> int:
        """export_csv 형식을 되읽는다. 읽은 줄 수를 돌려준다."""
        source = Path(source)
        added = 0
        with source.open(newline="", encoding="utf-8-sig") as handle:
            for row in csv.DictReader(handle):
                pet = (row.get("펫") or "").strip()
                if not pet:
                    continue
                try:
                    ratio = float(row.get("무게배수") or 1.0)
                    quantity = int(float(row.get("수량") or 1))
                except ValueError:
                    ratio, quantity = 1.0, 1
                self.add(
                    pet=pet,
                    mutation=(row.get("뮤테이션") or "None").strip() or "None",
                    weight_ratio=ratio,
                    quantity=quantity,
                    equipped=(row.get("장착") or "").strip().upper() == "Y",
                    note=(row.get("메모") or "").strip(),
                )
                added += 1
        return added


# ---------------------------------------------------------------------------
# 위시리스트
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class WishItem:
    id: int
    created_at: str
    pet: str
    priority: int
    note: str
    done: bool


class Wishlist(_Repository):
    """노리는 펫 목록. 우선순위 1(높음)~3(낮음)."""

    def add(self, pet: str, priority: int = 2, note: str = "") -> int:
        if not pet:
            raise ValueError("펫 이름이 필요합니다.")
        return self.db.write(
            "INSERT INTO wishlist (profile, created_at, pet, priority, note, done)"
            " VALUES (?, ?, ?, ?, ?, 0)",
            (self.profile, _now(), pet, min(3, max(1, int(priority))), note),
        )

    def set_done(self, item_id: int, done: bool = True) -> None:
        self.db.write(
            "UPDATE wishlist SET done = ? WHERE id = ? AND profile = ?",
            (int(bool(done)), item_id, self.profile),
        )

    def delete(self, item_id: int) -> None:
        self.db.write("DELETE FROM wishlist WHERE id = ? AND profile = ?", (item_id, self.profile))

    def all(self, include_done: bool = True) -> list[WishItem]:
        query = "SELECT * FROM wishlist WHERE profile = ?"
        if not include_done:
            query += " AND done = 0"
        query += " ORDER BY done, priority, id"
        rows = self.db.execute(query, (self.profile,))
        return [
            WishItem(id=r["id"], created_at=r["created_at"], pet=r["pet"],
                     priority=int(r["priority"]), note=r["note"], done=bool(r["done"]))
            for r in rows
        ]

    def count(self) -> int:
        return self.db.count("wishlist")

    def pending_pets(self) -> set[str]:
        return {item.pet for item in self.all(include_done=False)}


# ---------------------------------------------------------------------------
# 진행 타임라인
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class TimelinePoint:
    id: int
    created_at: str
    speed: float | None
    money: float | None
    income: float | None
    note: str


class Timeline(_Repository):
    """스피드/자산/수입 기록. 내 성장 곡선을 본다."""

    def add(
        self,
        speed: float | None = None,
        money: float | None = None,
        income: float | None = None,
        note: str = "",
        created_at: str | None = None,
    ) -> int:
        return self.db.write(
            "INSERT INTO timeline (profile, created_at, speed, money, income, note)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (self.profile, created_at or _now(), speed, money, income, note),
        )

    def delete(self, point_id: int) -> None:
        self.db.write("DELETE FROM timeline WHERE id = ? AND profile = ?", (point_id, self.profile))

    def all(self, ascending: bool = True) -> list[TimelinePoint]:
        order = "ASC" if ascending else "DESC"
        rows = self.db.execute(
            f"SELECT * FROM timeline WHERE profile = ? ORDER BY created_at {order}, id {order}",
            (self.profile,),
        )
        return [
            TimelinePoint(id=r["id"], created_at=r["created_at"], speed=r["speed"],
                          money=r["money"], income=r["income"], note=r["note"])
            for r in rows
        ]

    def count(self) -> int:
        return self.db.count("timeline")

    def latest(self) -> TimelinePoint | None:
        points = self.all(ascending=False)
        return points[0] if points else None

    def growth(self, field_name: str) -> tuple[float, float] | None:
        """(첫 값, 마지막 값). 값이 두 개 미만이면 None."""
        if field_name not in {"speed", "money", "income"}:
            raise ValueError(f"알 수 없는 항목: {field_name}")
        values = [getattr(p, field_name) for p in self.all() if getattr(p, field_name) is not None]
        if len(values) < 2:
            return None
        return (float(values[0]), float(values[-1]))
