"""컴팩트 오버레이 — 게임하면서 옆에 띄워 두는 작은 창."""
from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QDialog, QPushButton, QVBoxLayout

from ..core import collection, fmt, planner
from ..core.pen import build, candidates_from_inventory
from . import widgets
from .context import AppContext


class CompactWindow(QDialog):
    """핵심 숫자 몇 개만 큼직하게. 항상 맨 위에 뜬다."""

    def __init__(self, ctx: AppContext, parent=None) -> None:
        super().__init__(parent)
        self.ctx = ctx
        self.setWindowTitle("EggMate")
        self.setWindowFlag(Qt.WindowStaysOnTopHint, True)
        self.resize(300, 340)

        self.income = widgets.StatCard("장착 총수입")
        self.goal = widgets.StatCard("다음 바이옴")
        self.completion = widgets.StatCard("도감")

        close_button = QPushButton("전체 화면으로 돌아가기")
        close_button.clicked.connect(self.accept)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(10, 10, 10, 10)
        layout.setSpacing(8)
        layout.addWidget(self.income)
        layout.addWidget(self.goal)
        layout.addWidget(self.completion)
        layout.addStretch(1)
        layout.addWidget(close_button)

        self._timer = QTimer(self)
        self._timer.timeout.connect(self.refresh)
        self._timer.start(4000)
        self.refresh()

    def refresh(self) -> None:
        data = self.ctx.dataset

        candidates = candidates_from_inventory(data, self.ctx.inventory.equipped())
        plan = build(candidates, len(candidates), data.income_model)
        self.income.set_value(
            fmt.compact(plan.total_income) + "/s", f"장착 {len(candidates)}마리"
        )

        latest = self.ctx.timeline.latest()
        speed = latest.speed if latest and latest.speed else 0.0
        target = planner.next_target(data, speed)
        if target is None:
            self.goal.set_value("전부 개방" if speed else "—",
                                "" if speed else "성장 기록을 남겨 주세요")
        else:
            self.goal.set_value(target.biome.ko, f"{fmt.compact(target.shortfall)} 더 필요")

        progress = collection.progress(data, self.ctx.owned_pets())
        self.completion.set_value(
            f"{progress.percent:.0f}%", f"{progress.owned}/{progress.total}종"
        )

    def closeEvent(self, event) -> None:  # noqa: N802  (Qt 규약)
        self._timer.stop()
        super().closeEvent(event)
