"""숫자 포맷 유틸 - 게임 내 표기(K/M/B/T)와 한국어 단위를 함께 다룬다."""
from __future__ import annotations

import math
import re

_SUFFIXES = [
    (1e15, "Q"),
    (1e12, "T"),
    (1e9, "B"),
    (1e6, "M"),
    (1e3, "K"),
]

_PARSE_UNITS = {
    "k": 1e3, "천": 1e3,
    "m": 1e6, "만": 1e4,
    "b": 1e9, "억": 1e8,
    "t": 1e12, "조": 1e12,
    "q": 1e15,
}

_NUM_RE = re.compile(r"^\s*([0-9]*\.?[0-9]+)\s*([a-zA-Z가-힣]*)\s*$")


def compact(value: float | None, digits: int = 2) -> str:
    """1800000000 -> '1.8B'. 게임 UI와 같은 표기."""
    if value is None:
        return "—"
    if not math.isfinite(value):
        return "∞"
    neg = value < 0
    v = abs(float(value))
    for threshold, suffix in _SUFFIXES:
        if v >= threshold:
            scaled = v / threshold
            text = f"{scaled:.{digits}f}".rstrip("0").rstrip(".")
            return ("-" if neg else "") + text + suffix
    text = f"{v:.{digits}f}".rstrip("0").rstrip(".")
    return ("-" if neg else "") + text


def korean(value: float | None) -> str:
    """한국어 큰 수 표기. 1800000000 -> '18억'."""
    if value is None:
        return "—"
    if not math.isfinite(value):
        return "무한"
    neg = value < 0
    v = abs(float(value))
    for threshold, unit in ((1e12, "조"), (1e8, "억"), (1e4, "만")):
        if v >= threshold:
            scaled = v / threshold
            text = f"{scaled:.2f}".rstrip("0").rstrip(".")
            return ("-" if neg else "") + text + unit
    text = f"{v:.2f}".rstrip("0").rstrip(".")
    return ("-" if neg else "") + text


def money(value: float | None) -> str:
    """'$1.8B (18억)' 형태."""
    if value is None:
        return "—"
    return f"${compact(value)} ({korean(value)})"


def parse_amount(text: str) -> float:
    """'1.5b', '250M', '3억', '12000' 을 float으로. 실패 시 ValueError."""
    if text is None:
        raise ValueError("빈 값")
    cleaned = str(text).replace(",", "").replace("$", "").strip()
    match = _NUM_RE.match(cleaned)
    if not match:
        raise ValueError(f"숫자로 해석할 수 없음: {text!r}")
    number = float(match.group(1))
    unit = match.group(2).lower()
    if not unit:
        return number
    if unit not in _PARSE_UNITS:
        raise ValueError(f"알 수 없는 단위: {match.group(2)!r}")
    return number * _PARSE_UNITS[unit]


def duration(seconds: float | None) -> str:
    """초를 사람이 읽는 시간으로. 음수/무한은 안내 문구."""
    if seconds is None:
        return "—"
    if not math.isfinite(seconds):
        return "영원히 못 갚음"
    if seconds < 0:
        return "이미 달성"
    seconds = float(seconds)
    if seconds < 60:
        return f"{seconds:.0f}초"
    minutes = seconds / 60
    if minutes < 60:
        return f"{minutes:.1f}분"
    hours = minutes / 60
    if hours < 24:
        return f"{hours:.1f}시간"
    days = hours / 24
    if days < 365:
        return f"{days:.1f}일"
    return f"{days / 365:.1f}년"
