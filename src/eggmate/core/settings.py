"""앱 설정 — 테마, 창 상태, 활성 프로필 등을 JSON 한 벌로 관리한다.

설정이 깨져 있어도 앱이 못 켜지면 안 되므로, 읽기는 언제나 기본값으로 폴백한다.
"""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field, fields
from pathlib import Path
from typing import Any

from .dataset import user_dir

SETTINGS_FILENAME = "settings.json"

THEMES = ("dark", "light")
DEFAULT_PROFILE = "기본"


@dataclass
class Settings:
    theme: str = "dark"
    font_scale: float = 1.0
    always_on_top: bool = False
    compact_mode: bool = False
    profile: str = DEFAULT_PROFILE
    last_tab: int = 0
    window_geometry: str = ""          # base64 QByteArray
    window_state: str = ""
    favorites: list[str] = field(default_factory=list)
    recent_calculations: list[dict[str, Any]] = field(default_factory=list)
    safety_margin: float = 2.0
    seconds_per_hatch: int = 45
    show_hints: bool = True

    # --- 정규화 -------------------------------------------------------
    def normalised(self) -> "Settings":
        """범위를 벗어난 값을 안전한 값으로 되돌린 복사본."""
        theme = self.theme if self.theme in THEMES else "dark"
        scale = min(1.6, max(0.8, float(self.font_scale or 1.0)))
        margin = min(10.0, max(1.0, float(self.safety_margin or 2.0)))
        seconds = min(3600, max(1, int(self.seconds_per_hatch or 45)))
        return Settings(
            theme=theme,
            font_scale=scale,
            always_on_top=bool(self.always_on_top),
            compact_mode=bool(self.compact_mode),
            profile=str(self.profile or DEFAULT_PROFILE).strip() or DEFAULT_PROFILE,
            last_tab=max(0, int(self.last_tab or 0)),
            window_geometry=str(self.window_geometry or ""),
            window_state=str(self.window_state or ""),
            favorites=list(dict.fromkeys(str(f) for f in (self.favorites or []))),
            recent_calculations=list(self.recent_calculations or [])[:50],
            safety_margin=margin,
            seconds_per_hatch=seconds,
            show_hints=bool(self.show_hints),
        )

    # --- 즐겨찾기 -----------------------------------------------------
    def is_favorite(self, pet_name: str) -> bool:
        return pet_name in self.favorites

    def toggle_favorite(self, pet_name: str) -> bool:
        """켜면 True, 끄면 False 를 돌려준다."""
        if pet_name in self.favorites:
            self.favorites.remove(pet_name)
            return False
        self.favorites.append(pet_name)
        return True

    # --- 최근 계산 ----------------------------------------------------
    def remember_calculation(self, kind: str, summary: str, payload: dict[str, Any] | None = None) -> None:
        entry = {"kind": kind, "summary": summary, "payload": payload or {}}
        self.recent_calculations = [
            e for e in self.recent_calculations
            if not (e.get("kind") == kind and e.get("summary") == summary)
        ]
        self.recent_calculations.insert(0, entry)
        del self.recent_calculations[20:]


def settings_path() -> Path:
    return user_dir() / SETTINGS_FILENAME


def load(path: Path | None = None) -> Settings:
    """설정을 읽는다. 없거나 깨졌으면 기본값."""
    target = path or settings_path()
    try:
        raw = json.loads(target.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return Settings()
    if not isinstance(raw, dict):
        return Settings()

    known = {f.name for f in fields(Settings)}
    filtered = {k: v for k, v in raw.items() if k in known}
    try:
        return Settings(**filtered).normalised()
    except (TypeError, ValueError):
        return Settings()


def save(settings: Settings, path: Path | None = None) -> bool:
    """설정을 저장한다. 실패해도 예외를 던지지 않고 False 를 돌려준다."""
    target = path or settings_path()
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(
            json.dumps(asdict(settings.normalised()), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return True
    except OSError:
        return False
