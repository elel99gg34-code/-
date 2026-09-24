"""계산 코어는 Qt 없이 임포트되어야 한다.

이 경계가 무너지면 GUI 스택이 없는 환경(CI 리눅스 러너, 서버)에서 테스트가
통째로 수집 실패한다. 실제로 한 번 그렇게 깨졌기 때문에 테스트로 고정한다.
"""
from __future__ import annotations

import os
import subprocess
import sys

import pytest

CORE_MODULES = [
    "eggmate.core",
    "eggmate.core.collection",
    "eggmate.core.dataset",
    "eggmate.core.diagnostics",
    "eggmate.core.fmt",
    "eggmate.core.fuse",
    "eggmate.core.growth",
    "eggmate.core.income",
    "eggmate.core.models",
    "eggmate.core.odds",
    "eggmate.core.pen",
    "eggmate.core.planner",
    "eggmate.core.settings",
    "eggmate.core.simulate",
    "eggmate.core.storage",
]


def _probe(modules: list[str]) -> subprocess.CompletedProcess[str]:
    """별도 프로세스에서 모듈을 임포트하고 올라온 Qt 모듈 이름을 찍는다.

    같은 프로세스에서는 다른 테스트가 이미 Qt 를 올려놨을 수 있어 의미가 없다.
    pytest 의 pythonpath 설정은 sys.path 에만 반영되므로 자식에게는 직접 넘겨준다.
    """
    script = (
        "import sys;"
        + "".join(f"__import__({name!r});" for name in modules)
        + "loaded=[m for m in sys.modules if m.startswith(('PySide6','shiboken6'))];"
        "print('|'.join(sorted(loaded)))"
    )
    env = dict(os.environ, PYTHONPATH=os.pathsep.join(p for p in sys.path if p))
    return subprocess.run(
        [sys.executable, "-c", script], capture_output=True, text=True, timeout=120, env=env
    )


def test_core_modules_do_not_pull_in_qt():
    result = _probe(CORE_MODULES)
    assert result.returncode == 0, result.stderr
    leaked = result.stdout.strip()
    assert not leaked, f"코어가 Qt 를 끌어들이고 있습니다: {leaked}"


def test_the_probe_would_notice_a_violation():
    """검사 자체가 동작하는지 확인 — UI 모듈을 넣으면 반드시 Qt 가 잡혀야 한다."""
    result = _probe(["eggmate.ui.app"])
    if result.returncode != 0:
        pytest.skip(f"이 환경에서는 GUI 스택을 임포트할 수 없습니다: {result.stderr.strip()[-200:]}")
    assert "PySide6" in result.stdout
