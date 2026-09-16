"""내 부화 기록 저장소 (로컬 SQLite).

게임과는 아무 연결도 하지 않는다. 사용자가 직접 입력한 결과만 쌓아서
'공개된 확률'과 '내 실제 결과'를 비교할 수 있게 해 준다.
"""
from __future__ import annotations

import csv
import sqlite3
from contextlib import closing
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from .dataset import user_dir

SCHEMA = """
CREATE TABLE IF NOT EXISTS hatches (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT    NOT NULL,
    biome       TEXT    NOT NULL DEFAULT '',
    pet         TEXT    NOT NULL DEFAULT '',
    rarity      TEXT    NOT NULL DEFAULT '',
    mutation    TEXT    NOT NULL DEFAULT 'None',
    weight      REAL,
    note        TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_hatches_created ON hatches(created_at);
CREATE INDEX IF NOT EXISTS idx_hatches_rarity  ON hatches(rarity);
"""


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


def default_db_path() -> Path:
    return user_dir() / "hatches.db"


class HatchLog:
    """부화 기록 CRUD + 통계. with 문으로 쓰거나 close() 를 직접 부른다."""

    def __init__(self, path: Path | str | None = None) -> None:
        self.path = Path(path) if path else default_db_path()
        if str(self.path) != ":memory:":
            self.path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self.path))
        self._conn.row_factory = sqlite3.Row
        with closing(self._conn.cursor()) as cur:
            cur.executescript(SCHEMA)
        self._conn.commit()

    def __enter__(self) -> "HatchLog":
        return self

    def __exit__(self, *exc_info: object) -> None:
        self.close()

    def close(self) -> None:
        self._conn.close()

    # --- 쓰기 -----------------------------------------------------------
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
        stamp = created_at or datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
        with closing(self._conn.cursor()) as cur:
            cur.execute(
                "INSERT INTO hatches (created_at, biome, pet, rarity, mutation, weight, note)"
                " VALUES (?, ?, ?, ?, ?, ?, ?)",
                (stamp, biome, pet, rarity, mutation, weight, note),
            )
            new_id = cur.lastrowid
        self._conn.commit()
        return int(new_id)

    def delete(self, record_id: int) -> None:
        with closing(self._conn.cursor()) as cur:
            cur.execute("DELETE FROM hatches WHERE id = ?", (record_id,))
        self._conn.commit()

    def clear(self) -> None:
        with closing(self._conn.cursor()) as cur:
            cur.execute("DELETE FROM hatches")
        self._conn.commit()

    # --- 읽기 -----------------------------------------------------------
    def all(self, limit: int | None = None) -> list[HatchRecord]:
        query = "SELECT * FROM hatches ORDER BY id DESC"
        params: tuple[object, ...] = ()
        if limit is not None:
            query += " LIMIT ?"
            params = (int(limit),)
        with closing(self._conn.cursor()) as cur:
            rows = cur.execute(query, params).fetchall()
        return [
            HatchRecord(
                id=row["id"], created_at=row["created_at"], biome=row["biome"],
                pet=row["pet"], rarity=row["rarity"], mutation=row["mutation"],
                weight=row["weight"], note=row["note"],
            )
            for row in rows
        ]

    def count(self) -> int:
        with closing(self._conn.cursor()) as cur:
            return int(cur.execute("SELECT COUNT(*) FROM hatches").fetchone()[0])

    def counts_by(self, column: str) -> dict[str, int]:
        if column not in {"rarity", "biome", "pet", "mutation"}:
            raise ValueError(f"집계할 수 없는 컬럼: {column}")
        with closing(self._conn.cursor()) as cur:
            rows = cur.execute(
                f"SELECT {column} AS key, COUNT(*) AS n FROM hatches"
                f" GROUP BY {column} ORDER BY n DESC"
            ).fetchall()
        return {row["key"]: int(row["n"]) for row in rows}

    def dry_streak(self, rarities: set[str]) -> int:
        """마지막으로 해당 등급이 나온 뒤 몇 번을 헛깠는지."""
        streak = 0
        for record in self.all():
            if record.rarity in rarities:
                break
            streak += 1
        return streak

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
