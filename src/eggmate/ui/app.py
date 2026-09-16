"""메인 윈도우."""
from __future__ import annotations

import sys

from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon, QKeySequence, QShortcut
from PySide6.QtWidgets import QApplication, QMainWindow, QMessageBox, QTabWidget

from .. import APP_NAME, APP_NAME_KO, __version__
from ..core import dataset as dataset_module
from ..core.dataset import DatasetError
from ..core.diagnostics import configure_stdio, selftest
from ..core.storage import HatchLog
from . import theme
from .tabs.about_tab import AboutTab
from .tabs.fuse_tab import FuseTab
from .tabs.income_tab import IncomeTab
from .tabs.index_tab import IndexTab
from .tabs.odds_tab import OddsTab
from .tabs.planner_tab import PlannerTab
from .tabs.tracker_tab import TrackerTab


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle(f"{APP_NAME} ({APP_NAME_KO}) {__version__} — 계란을 훔치세요 도우미")
        self.resize(1080, 780)
        self.setMinimumSize(880, 600)

        self.log = HatchLog()
        self.tabs = QTabWidget()
        self.tabs.setDocumentMode(True)
        self.setCentralWidget(self.tabs)

        self._build_tabs()
        self._install_shortcuts()

    # --- 구성 -----------------------------------------------------------
    def _build_tabs(self) -> None:
        self.dataset, self.data_path = dataset_module.load()
        current = self.tabs.currentIndex()
        self.tabs.clear()

        self.tabs.addTab(IndexTab(self.dataset), "펫 도감")
        self.tabs.addTab(IncomeTab(self.dataset), "수입 계산기")
        self.tabs.addTab(OddsTab(self.dataset), "확률 계산기")
        self.tabs.addTab(TrackerTab(self.dataset, self.log), "부화 기록")
        self.tabs.addTab(PlannerTab(self.dataset), "진행 플래너")
        self.tabs.addTab(FuseTab(self.dataset), "퓨즈 판단")
        self.tabs.addTab(AboutTab(self.dataset, self.data_path, self.reload_dataset), "정보")

        if 0 <= current < self.tabs.count():
            self.tabs.setCurrentIndex(current)

        self.statusBar().showMessage(
            f"데이터 {self.dataset.data_version} · 펫 {len(self.dataset.pets)}종 · "
            f"기록 {self.log.count()}건 · Ctrl+1~7 로 탭 이동"
        )

    def _install_shortcuts(self) -> None:
        for index in range(7):
            shortcut = QShortcut(QKeySequence(f"Ctrl+{index + 1}"), self)
            shortcut.activated.connect(lambda i=index: self.tabs.setCurrentIndex(i))
        QShortcut(QKeySequence("Ctrl+R"), self).activated.connect(self.reload_dataset)
        QShortcut(QKeySequence.Quit, self).activated.connect(self.close)

    def reload_dataset(self) -> None:
        try:
            self._build_tabs()
        except DatasetError as exc:
            QMessageBox.critical(self, "데이터 오류", str(exc))

    def closeEvent(self, event) -> None:  # noqa: N802  (Qt 규약)
        self.log.close()
        super().closeEvent(event)


def main() -> int:
    configure_stdio()

    if "--selftest" in sys.argv:
        return selftest()

    QApplication.setApplicationName(APP_NAME)
    QApplication.setApplicationVersion(__version__)
    QApplication.setOrganizationName(APP_NAME)

    app = QApplication(sys.argv)
    app.setStyleSheet(theme.STYLESHEET)

    icon_path = dataset_module.bundled_data_path().parent / "icon.ico"
    if icon_path.exists():
        app.setWindowIcon(QIcon(str(icon_path)))

    try:
        window = MainWindow()
    except DatasetError as exc:
        QMessageBox.critical(None, "시작 실패", f"게임 데이터를 읽을 수 없습니다.\n\n{exc}")
        return 1

    window.show()
    return app.exec()
