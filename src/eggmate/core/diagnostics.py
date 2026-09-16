"""GUI 없이 돌아가는 진단 기능 — 표준 출력 보정과 자체 점검.

Qt 를 임포트하지 않는다. 번들 검증은 디스플레이가 없는 환경에서도 돌아가야 하고,
테스트도 GUI 스택 없이 실행할 수 있어야 한다.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from .. import APP_NAME, __version__
from . import dataset as dataset_module
from .dataset import DatasetError

SELFTEST_REPORT_ENV = "EGGMATE_SELFTEST_REPORT"


def configure_stdio() -> None:
    """표준 출력을 UTF-8 로 맞춘다.

    이 앱은 한글을 출력하는데 Windows 콘솔/파이프의 기본 인코딩은 cp1252 라서
    그대로 print 하면 UnicodeEncodeError 가 난다. PYTHONUTF8 환경변수는 PyInstaller
    번들에 적용되지 않으므로 런타임에 직접 맞춘다. windowed 빌드에서는 스트림이
    None 일 수 있으므로 그 경우는 조용히 넘어간다.
    """
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure is None:
            continue
        try:
            reconfigure(encoding="utf-8", errors="replace")
        except (OSError, ValueError):
            pass


def report(message: str) -> None:
    """결과를 보고 파일과 표준 출력 양쪽에 남긴다.

    파일을 먼저 쓴다. 콘솔이 없는 빌드에서 출력이 실패하더라도 보고서는 남아야
    빌드 검증 스크립트가 판정할 수 있다.
    """
    target = os.environ.get(SELFTEST_REPORT_ENV)
    if target:
        try:
            Path(target).write_text(message, encoding="utf-8")
        except OSError:
            pass
    try:
        print(message)
    except (OSError, UnicodeEncodeError, AttributeError):
        pass  # 콘솔이 없거나 인코딩이 맞지 않아도 자체 점검은 계속된다


def selftest() -> int:
    """창을 띄우지 않고 번들 상태를 점검한다 (--selftest).

    Qt 를 전혀 건드리지 않으므로 디스플레이가 없어도 돌아간다.
    """
    try:
        data, path = dataset_module.load()
    except DatasetError as exc:
        report(f"SELFTEST FAIL: {exc}")
        return 1
    report(
        f"SELFTEST OK: {APP_NAME} {__version__} · 데이터 {data.data_version} · "
        f"펫 {len(data.pets)}종 · 바이옴 {len(data.biomes)}개 · 뮤테이션 {len(data.mutations)}종\n"
        f"데이터 경로: {path}"
    )
    return 0
