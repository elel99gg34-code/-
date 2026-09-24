"""메인 윈도우 — 사이드바 + 스택 방식."""
from __future__ import annotations

import sys

from PySide6.QtCore import QByteArray, Qt
from PySide6.QtGui import QIcon, QKeySequence, QShortcut
from PySide6.QtWidgets import (
    QApplication,
    QHBoxLayout,
    QLabel,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QMessageBox,
    QStackedWidget,
    QVBoxLayout,
    QWidget,
)

from .. import APP_NAME, APP_NAME_KO, __version__
from ..core import collection, dataset as dataset_module, fmt
from ..core.dataset import DatasetError
from ..core.diagnostics import configure_stdio, selftest
from . import context as context_module
from . import theme, widgets
from .compact import CompactWindow
from .context import AppContext
from .search import SearchDialog, SearchHit
from .tabs.about_tab import AboutTab
from .tabs.collection_tab import CollectionTab
from .tabs.dashboard_tab import DashboardTab
from .tabs.fuse_tab import FuseTab
from .tabs.growth_tab import GrowthTab
from .tabs.income_tab import IncomeTab
from .tabs.index_tab import IndexTab
from .tabs.inventory_tab import InventoryTab
from .tabs.odds_tab import OddsTab
from .tabs.pen_tab import PenTab
from .tabs.planner_tab import PlannerTab
from .tabs.settings_tab import SettingsTab
from .tabs.simulator_tab import SimulatorTab
from .tabs.tracker_tab import TrackerTab

SHORTCUT_HELP = """단축키

Ctrl+K          전역 검색 (펫 · 기능)
Ctrl+1 ~ Ctrl+9 앞쪽 화면으로 바로 이동
Ctrl+R          게임 데이터 다시 불러오기
Ctrl+T          테마 바꾸기 (어두운 ↔ 밝은)
Ctrl+M          컴팩트 오버레이 (게임하면서 보기)
Ctrl+P          창을 항상 맨 위로 토글
Ctrl++ / Ctrl+- 글자 크기 조절
F1              이 도움말
Ctrl+Q          종료"""


class MainWindow(QMainWindow):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        self._compact: CompactWindow | None = None

        self.setWindowTitle(
            f"{APP_NAME} ({APP_NAME_KO}) {__version__} — 계란을 훔치세요 도우미"
        )
        self.setMinimumSize(920, 620)

        self.sidebar = QListWidget()
        self.sidebar.setObjectName("sidebar")
        self.sidebar.setFixedWidth(168)
        self.pages = QStackedWidget()

        body = QWidget()
        layout = QHBoxLayout(body)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        layout.addWidget(self.sidebar)
        layout.addWidget(self.pages, 1)
        self.setCentralWidget(body)

        self.sidebar.currentRowChanged.connect(self._on_page_changed)

        self._build_pages()
        self._install_shortcuts()
        self._restore_window_state()
        self.apply_appearance()

        for signal in (ctx.bus.inventory_changed, ctx.bus.hatches_changed,
                       ctx.bus.profile_changed, ctx.bus.timeline_changed):
            signal.connect(self.refresh_status)
        ctx.bus.settings_changed.connect(self.apply_appearance)
        self.refresh_status()

    # --- 구성 -----------------------------------------------------------
    def _build_pages(self) -> None:
        previous = self.sidebar.currentRow()
        self.sidebar.clear()
        while self.pages.count():
            widget = self.pages.widget(0)
            self.pages.removeWidget(widget)
            widget.deleteLater()

        ctx = self.ctx
        sections: list[tuple[str, QWidget]] = [
            ("대시보드", DashboardTab(ctx)),
            ("펫 도감", IndexTab(ctx)),
            ("도감 완성도", CollectionTab(ctx)),
            ("인벤토리", InventoryTab(ctx)),
            ("펜 빌더", PenTab(ctx)),
            ("수입 계산기", IncomeTab(ctx)),
            ("확률 계산기", OddsTab(ctx)),
            ("시뮬레이터", SimulatorTab(ctx)),
            ("퓨즈 판단", FuseTab(ctx)),
            ("부화 기록", TrackerTab(ctx)),
            ("진행 플래너", PlannerTab(ctx)),
            ("성장 기록", GrowthTab(ctx)),
            ("설정", SettingsTab(ctx)),
            ("정보", AboutTab(ctx, self.reload_dataset)),
        ]
        self.section_names = [name for name, _ in sections]
        for name, page in sections:
            self.sidebar.addItem(QListWidgetItem(name))
            self.pages.addWidget(page)

        target = previous if 0 <= previous < len(sections) else self.ctx.settings.last_tab
        self.sidebar.setCurrentRow(max(0, min(target, len(sections) - 1)))

    def _install_shortcuts(self) -> None:
        def bind(sequence: str, handler) -> None:
            QShortcut(QKeySequence(sequence), self).activated.connect(handler)

        for index in range(9):
            bind(f"Ctrl+{index + 1}", lambda i=index: self.sidebar.setCurrentRow(i))
        bind("Ctrl+K", self.open_search)
        bind("Ctrl+R", self.reload_dataset)
        bind("Ctrl+T", self.toggle_theme)
        bind("Ctrl+M", self.open_compact)
        bind("Ctrl+P", self.toggle_always_on_top)
        bind("Ctrl++", lambda: self.nudge_font(0.1))
        bind("Ctrl+=", lambda: self.nudge_font(0.1))
        bind("Ctrl+-", lambda: self.nudge_font(-0.1))
        bind("F1", self.show_shortcuts)
        QShortcut(QKeySequence.Quit, self).activated.connect(self.close)

    # --- 모양 -----------------------------------------------------------
    def apply_appearance(self) -> None:
        app = QApplication.instance()
        if app is not None:
            app.setStyleSheet(
                theme.stylesheet(self.ctx.settings.theme, self.ctx.settings.font_scale)
            )
        self.setWindowFlag(Qt.WindowStaysOnTopHint, self.ctx.settings.always_on_top)
        if self.isVisible():
            self.show()   # 플래그 변경을 적용하려면 다시 보여 줘야 한다

    def toggle_theme(self) -> None:
        self.ctx.settings.theme = "light" if self.ctx.settings.theme == "dark" else "dark"
        self.ctx.save_settings()

    def nudge_font(self, delta: float) -> None:
        self.ctx.settings.font_scale = round(self.ctx.settings.font_scale + delta, 2)
        self.ctx.save_settings()

    def toggle_always_on_top(self) -> None:
        self.ctx.settings.always_on_top = not self.ctx.settings.always_on_top
        self.ctx.save_settings()

    def open_compact(self) -> None:
        self._compact = CompactWindow(self.ctx, self)
        self.hide()
        self._compact.exec()
        self.show()

    # --- 검색 -----------------------------------------------------------
    def open_search(self) -> None:
        SearchDialog(self, self._search_hits).exec()

    def _search_hits(self, query: str) -> list[SearchHit]:
        text = query.strip().lower()
        hits: list[SearchHit] = []

        for index, name in enumerate(self.section_names):
            if not text or text in name.lower():
                hits.append(SearchHit(
                    label=name, detail="화면 이동",
                    action=lambda i=index: self.sidebar.setCurrentRow(i),
                ))

        if text:
            for pet in self.ctx.dataset.pets:
                if text in pet.ko.lower() or text in pet.name.lower():
                    rarity = self.ctx.dataset.rarity(pet.rarity)
                    hits.append(SearchHit(
                        label=pet.ko,
                        detail=f"{rarity.ko if rarity else pet.rarity} · "
                               f"{fmt.compact(pet.income)}/s · 도감에서 보기",
                        action=lambda p=pet: self._show_pet(p),
                    ))
        return hits[:60]

    def _show_pet(self, pet) -> None:
        self.sidebar.setCurrentRow(self.section_names.index("펫 도감"))
        page = self.pages.widget(self.section_names.index("펫 도감"))
        if hasattr(page, "search"):
            page.search.setText(pet.ko)

    # --- 상태 -----------------------------------------------------------
    def _on_page_changed(self, row: int) -> None:
        self.pages.setCurrentIndex(row)
        self.ctx.settings.last_tab = row

    def refresh_status(self) -> None:
        ctx = self.ctx
        progress = collection.progress(ctx.dataset, ctx.owned_pets())
        self.statusBar().showMessage(
            f"프로필 {ctx.db.profile} · 데이터 {ctx.dataset.data_version} · "
            f"도감 {progress.owned}/{progress.total}종 ({progress.percent:.0f}%) · "
            f"보유 {ctx.inventory.total_quantity()}마리 · 부화 {ctx.hatches.count()}건 · "
            f"Ctrl+K 검색 · F1 단축키"
        )

    def show_shortcuts(self) -> None:
        QMessageBox.information(self, "단축키", SHORTCUT_HELP)

    # --- 데이터 ---------------------------------------------------------
    def reload_dataset(self) -> None:
        try:
            self.ctx.reload_dataset()
            self._build_pages()
        except DatasetError as exc:
            QMessageBox.critical(self, "데이터 오류", str(exc))
            return
        self.refresh_status()

    # --- 창 상태 --------------------------------------------------------
    def _restore_window_state(self) -> None:
        geometry = self.ctx.settings.window_geometry
        if geometry:
            try:
                self.restoreGeometry(QByteArray.fromBase64(geometry.encode("ascii")))
                return
            except (ValueError, UnicodeEncodeError):
                pass
        self.resize(1180, 820)

    def closeEvent(self, event) -> None:  # noqa: N802  (Qt 규약)
        settings = self.ctx.settings
        settings.window_geometry = bytes(self.saveGeometry().toBase64()).decode("ascii")
        settings.last_tab = self.sidebar.currentRow()
        self.ctx.save_settings()
        self.ctx.close()
        super().closeEvent(event)


def main() -> int:
    configure_stdio()

    if "--selftest" in sys.argv:
        return selftest()

    QApplication.setApplicationName(APP_NAME)
    QApplication.setApplicationVersion(__version__)
    QApplication.setOrganizationName(APP_NAME)

    app = QApplication(sys.argv)

    icon_path = dataset_module.bundled_data_path().parent / "icon.ico"
    if icon_path.exists():
        app.setWindowIcon(QIcon(str(icon_path)))

    try:
        ctx = context_module.create()
        window = MainWindow(ctx)
    except DatasetError as exc:
        app.setStyleSheet(theme.stylesheet("dark"))
        QMessageBox.critical(None, "시작 실패", f"게임 데이터를 읽을 수 없습니다.\n\n{exc}")
        return 1

    window.show()
    return app.exec()
