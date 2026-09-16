"""계산 코어는 Qt 없이 임포트되어야 한다.

이 경계가 무너지면 GUI 스택이 없는 환경(CI 리눅스 러너, 서버)에서 테스트가
통째로 수집 실패한다. 실제로 한 번 그렇게 깨졌기 때문에 테스트로 고정한다.
"""
from __future__ import annotations

import subprocess
import sys

CORE_MODULES = [
    "eggmate.core",
    "eggmate.core.dataset",
    "eggmate.core.diagnostics",
    "eggmate.core.fmt",
    "eggmate.core.fuse",
    "eggmate.core.income",
    "eggmate.core.models",
    "eggmate.core.odds",
    "eggmate.core.planner",
    "eggmate.core.storage",
]


def test_core_modules_do_not_pull_in_qt():
    """별도 프로세스에서 확인한다. 같은 프로세스는 이미 Qt 가 올라와 있을 수 있다."""
    script = (
        "import sys;"
        + "".join(f"__import__({name!r});" for name in CORE_MODULES)
        + "loaded=[m for m in sys.modules if m.startswith(('PySide6','shiboken6'))];"
        "print('|'.join(sorted(loaded)))"
    )
    result = subprocess.run(
        [sys.executable, "-c", script], capture_output=True, text=True, timeout=120
    )
    assert result.returncode == 0, result.stderr
    leaked = result.stdout.strip()
    assert not leaked, f"코어가 Qt 를 끌어들이고 있습니다: {leaked}"
