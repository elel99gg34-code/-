"""frozen 빌드에서 터졌던 표준 출력 인코딩 문제에 대한 회귀 테스트.

Windows 콘솔/파이프의 기본 인코딩은 cp1252 라서 한글 출력이 그대로는 실패한다.
PyInstaller 번들은 PYTHONUTF8 환경변수도 무시하므로 런타임에 직접 맞춰야 한다.
"""
from __future__ import annotations

import io
import os
import sys

import pytest

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

from eggmate.ui import app as app_module  # noqa: E402

KOREAN = "데이터 2026.09.16 · 펫 43종"


class _Cp1252Stream(io.TextIOBase):
    """한글을 못 쓰는 스트림 흉내. reconfigure 도 지원하지 않는다."""

    def __init__(self) -> None:
        self.written: list[str] = []

    def write(self, text: str) -> int:
        text.encode("cp1252")  # 한글이 들어오면 UnicodeEncodeError
        self.written.append(text)
        return len(text)


def test_report_survives_a_stream_that_cannot_encode_korean(monkeypatch, tmp_path):
    target = tmp_path / "selftest.txt"
    monkeypatch.setenv(app_module.SELFTEST_REPORT_ENV, str(target))
    monkeypatch.setattr(sys, "stdout", _Cp1252Stream())

    app_module._report(KOREAN)  # 예외가 새어 나오면 안 된다

    assert target.read_text(encoding="utf-8") == KOREAN


def test_report_writes_the_file_before_printing(monkeypatch, tmp_path):
    """출력이 실패해도 보고 파일은 남아야 검증 스크립트가 판정할 수 있다."""
    target = tmp_path / "report.txt"
    monkeypatch.setenv(app_module.SELFTEST_REPORT_ENV, str(target))
    monkeypatch.setattr(sys, "stdout", _Cp1252Stream())

    app_module._report("SELFTEST OK: " + KOREAN)

    assert "SELFTEST OK" in target.read_text(encoding="utf-8")


def test_report_without_the_env_var_still_prints(monkeypatch, capsys):
    monkeypatch.delenv(app_module.SELFTEST_REPORT_ENV, raising=False)
    app_module._report(KOREAN)
    assert KOREAN in capsys.readouterr().out


def test_report_tolerates_an_unwritable_target(monkeypatch, tmp_path, capsys):
    monkeypatch.setenv(app_module.SELFTEST_REPORT_ENV, str(tmp_path / "없는폴더" / "r.txt"))
    app_module._report(KOREAN)  # OSError 를 삼켜야 한다
    assert KOREAN in capsys.readouterr().out


def test_configure_stdio_switches_the_stream_to_utf8(monkeypatch):
    stream = io.TextIOWrapper(io.BytesIO(), encoding="cp1252")
    monkeypatch.setattr(sys, "stdout", stream)

    app_module.configure_stdio()

    assert stream.encoding.lower().replace("-", "") == "utf8"
    stream.write(KOREAN)  # 이제 한글이 들어가야 한다


def test_configure_stdio_tolerates_missing_streams(monkeypatch):
    """windowed 빌드에서는 sys.stdout 이 None 일 수 있다."""
    monkeypatch.setattr(sys, "stdout", None)
    monkeypatch.setattr(sys, "stderr", None)
    app_module.configure_stdio()


def test_configure_stdio_tolerates_a_stream_that_refuses(monkeypatch):
    class Refuses(io.TextIOBase):
        def reconfigure(self, **_kwargs):
            raise OSError("이 스트림은 재설정할 수 없음")

    monkeypatch.setattr(sys, "stdout", Refuses())
    app_module.configure_stdio()


def test_selftest_reports_success(monkeypatch, tmp_path, capsys):
    target = tmp_path / "selftest.txt"
    monkeypatch.setenv(app_module.SELFTEST_REPORT_ENV, str(target))

    assert app_module.selftest() == 0

    report = target.read_text(encoding="utf-8")
    assert "SELFTEST OK" in report
    assert "펫" in report


def test_selftest_reports_failure_when_data_is_unreadable(monkeypatch, tmp_path):
    target = tmp_path / "selftest.txt"
    monkeypatch.setenv(app_module.SELFTEST_REPORT_ENV, str(target))
    monkeypatch.setattr(
        app_module.dataset_module,
        "load",
        lambda: (_ for _ in ()).throw(app_module.DatasetError("데이터 없음")),
    )

    assert app_module.selftest() == 1
    assert "SELFTEST FAIL" in target.read_text(encoding="utf-8")


def test_main_routes_selftest_without_creating_a_window(monkeypatch):
    """--selftest 는 QApplication 을 만들기 전에 끝나야 디스플레이 없이 돌아간다."""
    monkeypatch.setattr(sys, "argv", ["EggMate", "--selftest"])
    called: list[str] = []
    monkeypatch.setattr(app_module, "selftest", lambda: called.append("yes") or 0)

    assert app_module.main() == 0
    assert called == ["yes"]
