"""전역 검색 (Ctrl+K) — 펫이든 기능이든 이름만 치면 바로 간다."""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QDialog, QLineEdit, QListWidget, QListWidgetItem, QVBoxLayout

from . import widgets


@dataclass(frozen=True)
class SearchHit:
    label: str
    detail: str
    action: Callable[[], None]


class SearchDialog(QDialog):
    def __init__(self, parent, hits_provider: Callable[[str], list[SearchHit]]) -> None:
        super().__init__(parent)
        self.setWindowTitle("검색")
        self.setModal(True)
        self.resize(560, 420)
        self._provider = hits_provider
        self._hits: list[SearchHit] = []

        self.query = QLineEdit()
        self.query.setObjectName("searchbox")
        self.query.setPlaceholderText("펫 이름이나 기능 이름을 입력하세요 (예: 키츠네, 확률, 펜)")
        self.results = QListWidget()

        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 12, 12, 12)
        layout.setSpacing(8)
        layout.addWidget(self.query)
        layout.addWidget(self.results, 1)
        layout.addWidget(widgets.hint("↑↓ 로 이동, Enter 로 실행, Esc 로 닫기"))

        self.query.textChanged.connect(self.refresh)
        self.query.returnPressed.connect(self.activate_current)
        self.results.itemActivated.connect(lambda _: self.activate_current())
        self.results.itemDoubleClicked.connect(lambda _: self.activate_current())
        self.refresh()

    def keyPressEvent(self, event) -> None:  # noqa: N802  (Qt 규약)
        if event.key() in (Qt.Key_Down, Qt.Key_Up) and self.results.count():
            delta = 1 if event.key() == Qt.Key_Down else -1
            row = (self.results.currentRow() + delta) % self.results.count()
            self.results.setCurrentRow(row)
            return
        super().keyPressEvent(event)

    def refresh(self) -> None:
        self._hits = self._provider(self.query.text().strip())
        self.results.clear()
        for hit in self._hits:
            item = QListWidgetItem(f"{hit.label}    —    {hit.detail}" if hit.detail else hit.label)
            self.results.addItem(item)
        if self.results.count():
            self.results.setCurrentRow(0)

    def activate_current(self) -> None:
        row = self.results.currentRow()
        if 0 <= row < len(self._hits):
            self._hits[row].action()
            self.accept()
