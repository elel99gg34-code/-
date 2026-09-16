"""gamedata.json 로딩/검증/사용자 오버라이드."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

from .models import Biome, Dataset, IncomeModel, Mutation, Pet, Rarity

APP_DIRNAME = "EggMate"


class DatasetError(Exception):
    """데이터 파일이 손상되었거나 필수 항목이 빠졌을 때."""


def bundled_data_path() -> Path:
    """PyInstaller onefile 번들과 소스 실행 양쪽에서 동작하는 경로."""
    base = getattr(sys, "_MEIPASS", None)
    if base:
        candidate = Path(base) / "eggmate" / "data" / "gamedata.json"
        if candidate.exists():
            return candidate
        return Path(base) / "gamedata.json"
    return Path(__file__).resolve().parent.parent / "data" / "gamedata.json"


def user_dir() -> Path:
    """쓰기 가능한 사용자 데이터 폴더 (Windows: %APPDATA%\\EggMate)."""
    appdata = os.environ.get("APPDATA")
    if appdata:
        return Path(appdata) / APP_DIRNAME
    xdg = os.environ.get("XDG_DATA_HOME")
    if xdg:
        return Path(xdg) / APP_DIRNAME
    return Path.home() / ".local" / "share" / APP_DIRNAME


def user_data_path() -> Path:
    return user_dir() / "gamedata.json"


def _require(raw: dict[str, Any], key: str) -> Any:
    if key not in raw:
        raise DatasetError(f"데이터 파일에 '{key}' 항목이 없습니다.")
    return raw[key]


def parse(raw: dict[str, Any]) -> Dataset:
    """dict -> Dataset. 필수 키가 없으면 DatasetError."""
    if not isinstance(raw, dict):
        raise DatasetError("데이터 파일의 최상위가 객체(JSON object)가 아닙니다.")

    try:
        rarities = [
            Rarity(
                name=r["name"], ko=r.get("ko", r["name"]), order=int(r.get("order", 0)),
                color=r.get("color", "#9aa4b2"), note=r.get("note"),
            )
            for r in _require(raw, "rarities")
        ]
        biomes = [
            Biome(
                name=b["name"], ko=b.get("ko", b["name"]), order=int(b.get("order", 0)),
                speed_required=float(b.get("speed_required", 0)), speed_note=b.get("speed_note"),
            )
            for b in _require(raw, "biomes")
        ]
        mutations = [
            Mutation(
                name=m["name"], ko=m.get("ko", m["name"]),
                multiplier=float(m.get("multiplier", 1.0)),
                source=m.get("source", "-"), note=m.get("note"),
            )
            for m in _require(raw, "mutations")
        ]
        pets = [
            Pet(
                name=p["name"], ko=p.get("ko", p["name"]), biome=p.get("biome", "?"),
                rarity=p.get("rarity", "Common"),
                income=None if p.get("income") is None else float(p["income"]),
                note=p.get("note"),
            )
            for p in _require(raw, "pets")
        ]
    except (KeyError, TypeError, ValueError) as exc:
        raise DatasetError(f"데이터 형식 오류: {exc}") from exc

    if not pets:
        raise DatasetError("펫 목록이 비어 있습니다.")

    return Dataset(
        data_version=str(raw.get("data_version", "unknown")),
        game=str(raw.get("game", "Steal An Egg")),
        disclaimer=str(raw.get("disclaimer", "")),
        sources=list(raw.get("sources", [])),
        income_model=IncomeModel.from_json(raw.get("income_model", {})),
        rarities=rarities,
        biomes=biomes,
        mutations=mutations,
        pets=pets,
        mechanics=dict(raw.get("mechanics", {})),
    )


def load_from(path: Path) -> Dataset:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise DatasetError(f"JSON 파싱 실패 ({path.name} {exc.lineno}행): {exc.msg}") from exc
    except OSError as exc:
        raise DatasetError(f"파일을 읽을 수 없습니다: {exc}") from exc
    return parse(raw)


def load() -> tuple[Dataset, Path]:
    """사용자 데이터가 있으면 우선, 없거나 깨졌으면 번들 데이터로 폴백."""
    user_path = user_data_path()
    if user_path.exists():
        try:
            return load_from(user_path), user_path
        except DatasetError:
            pass  # 사용자 파일이 깨졌으면 조용히 기본값 사용
    bundled = bundled_data_path()
    return load_from(bundled), bundled


def install_user_copy(source: Path | None = None) -> Path:
    """번들 데이터를 사용자 폴더로 복사해 편집 가능하게 만든다."""
    source = source or bundled_data_path()
    target = user_data_path()
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(source.read_text(encoding="utf-8"), encoding="utf-8")
    return target
