"""GUI 스모크 테스트 - 모든 탭을 실제로 만들어 보고 예외 없이 그려지는지 확인한다.

CI 에서 offscreen 플랫폼으로 돌린다. 임포트 누락이나 위젯 조립 실수는 단위 테스트로는
잡히지 않기 때문에 이 단계가 필요하다.
"""
from __future__ import annotations

import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

import os

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
# 기록 DB 가 개발자 홈을 건드리지 않도록 임시 폴더로 돌린다.
_TEMP = tempfile.mkdtemp(prefix="eggmate-smoke-")
os.environ["APPDATA"] = _TEMP
os.environ["XDG_DATA_HOME"] = _TEMP

from PySide6.QtWidgets import QApplication  # noqa: E402

from eggmate.ui import theme  # noqa: E402
from eggmate.ui.app import MainWindow  # noqa: E402

EXPECTED_TABS = [
    "펫 도감", "수입 계산기", "확률 계산기", "부화 기록", "진행 플래너", "퓨즈 판단", "정보",
]


def main() -> int:
    app = QApplication([])
    app.setStyleSheet(theme.STYLESHEET)

    window = MainWindow()
    window.resize(1120, 820)
    window.show()
    app.processEvents()

    tabs = [window.tabs.tabText(i) for i in range(window.tabs.count())]
    if tabs != EXPECTED_TABS:
        print(f"FAIL: 탭 구성이 다릅니다.\n  기대: {EXPECTED_TABS}\n  실제: {tabs}")
        return 1

    for index in range(window.tabs.count()):
        window.tabs.setCurrentIndex(index)
        app.processEvents()

    # 각 탭의 계산 경로를 한 번씩 실제로 태워 본다.
    income = window.tabs.widget(1)
    income.base_input.setText("22000")
    income.ratio_input.setValue(150)
    income.target_input.setText("5m")
    income.recalculate()
    assert income.compare_table.rowCount() > 0, "뮤테이션 비교표가 비어 있음"

    odds_tab = window.tabs.widget(2)
    odds_tab.rate_input.setText("0.01%")
    odds_tab.attempts.setValue(5000)
    odds_tab.dry_input.setValue(2500)
    odds_tab.recalculate()
    assert odds_tab.thresholds.rowCount() == 4, "확신도 표가 4행이 아님"
    odds_tab.rate_input.setText("완전히 잘못된 값")
    odds_tab.recalculate()  # 예외 없이 안내만 떠야 한다

    tracker = window.tabs.widget(3)
    tracker.add_record()
    tracker.refresh()

    planner = window.tabs.widget(4)
    planner.speed_input.setText("250000")
    planner.roi_cost.setText("75m")
    planner.roi_before.setText("100k")
    planner.roi_after.setText("900k")
    planner.goal_target.setText("1b")
    planner.goal_income.setText("900k")
    planner.refresh_speed()
    planner.refresh_roi()
    planner.refresh_goal()
    assert planner.biome_table.rowCount() > 0, "바이옴 표가 비어 있음"

    fuse_tab = window.tabs.widget(5)
    fuse_tab.input_base.setText("22000")
    fuse_tab.result_base.setText("120000")
    fuse_tab.recalculate()
    assert fuse_tab.verdict.text(), "퓨즈 판정이 비어 있음"

    window.reload_dataset()
    app.processEvents()
    window.close()

    print(f"OK: 탭 {len(tabs)}개가 모두 정상 동작합니다 — {', '.join(tabs)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
