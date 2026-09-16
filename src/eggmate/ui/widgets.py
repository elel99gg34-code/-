"""탭들이 공통으로 쓰는 위젯 헬퍼."""
from __future__ import annotations

from collections.abc import Callable

from PySide6.QtCore import Qt
from PySide6.QtGui import QColor
from PySide6.QtWidgets import (
    QFormLayout,
    QFrame,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QScrollArea,
    QTableWidget,
    QTableWidgetItem,
    QVBoxLayout,
    QWidget,
)

from ..core import fmt
from . import theme


def hint(text: str) -> QLabel:
    label = QLabel(text)
    label.setProperty("role", "hint")
    label.setWordWrap(True)
    return label


def title(text: str) -> QLabel:
    label = QLabel(text)
    label.setProperty("role", "title")
    return label


def metric(text: str = "—") -> QLabel:
    label = QLabel(text)
    label.setProperty("role", "metric")
    label.setTextInteractionFlags(Qt.TextSelectableByMouse)
    return label


def big(text: str = "—") -> QLabel:
    label = QLabel(text)
    label.setProperty("role", "big")
    label.setTextInteractionFlags(Qt.TextSelectableByMouse)
    return label


def set_role(label: QLabel, role: str | None) -> None:
    """스타일 롤을 바꾸고 즉시 다시 그리게 한다."""
    label.setProperty("role", role)
    label.style().unpolish(label)
    label.style().polish(label)


def group(name: str, content) -> QGroupBox:
    """레이아웃이든 위젯이든 받아서 그룹박스로 감싼다."""
    box = QGroupBox(name)
    if isinstance(content, QWidget):
        wrapper = QVBoxLayout()
        wrapper.setContentsMargins(0, 0, 0, 0)
        wrapper.addWidget(content)
        box.setLayout(wrapper)
    else:
        box.setLayout(content)
    return box


def form() -> QFormLayout:
    layout = QFormLayout()
    layout.setLabelAlignment(Qt.AlignRight | Qt.AlignVCenter)
    layout.setFormAlignment(Qt.AlignLeft | Qt.AlignTop)
    layout.setHorizontalSpacing(14)
    layout.setVerticalSpacing(9)
    return layout


def divider() -> QFrame:
    line = QFrame()
    line.setFrameShape(QFrame.HLine)
    line.setStyleSheet(f"color: {theme.BORDER}; background: {theme.BORDER}; max-height: 1px;")
    return line


def scrollable(inner: QWidget) -> QScrollArea:
    area = QScrollArea()
    area.setWidgetResizable(True)
    area.setWidget(inner)
    area.setHorizontalScrollBarPolicy(Qt.ScrollBarAsNeeded)
    return area


def row(*widgets: QWidget, stretch_last: bool = True) -> QWidget:
    holder = QWidget()
    layout = QHBoxLayout(holder)
    layout.setContentsMargins(0, 0, 0, 0)
    layout.setSpacing(8)
    for widget in widgets:
        layout.addWidget(widget)
    if stretch_last:
        layout.addStretch(1)
    return holder


def column(*widgets: QWidget, spacing: int = 10) -> QWidget:
    holder = QWidget()
    layout = QVBoxLayout(holder)
    layout.setContentsMargins(0, 0, 0, 0)
    layout.setSpacing(spacing)
    for widget in widgets:
        layout.addWidget(widget)
    return holder


class AmountEdit(QLineEdit):
    """'1.5b', '250M', '3억' 같은 입력을 받아 float 으로 변환하는 입력칸."""

    def __init__(self, placeholder: str = "예: 1.5b, 250M, 12000", default: str = "") -> None:
        super().__init__(default)
        self.setPlaceholderText(placeholder)

    def value(self, default: float | None = None) -> float | None:
        """해석에 성공하면 값을, 실패하면 default 를 돌려주고 테두리를 붉게 표시."""
        text = self.text().strip()
        if not text:
            self._mark(False)
            return default
        try:
            parsed = fmt.parse_amount(text)
        except ValueError:
            self._mark(True)
            return default
        self._mark(False)
        return parsed

    def _mark(self, invalid: bool) -> None:
        self.setProperty("invalid", "true" if invalid else "false")
        self.style().unpolish(self)
        self.style().polish(self)


def make_table(
    headers: list[str], stretch_column: int | None = None, min_rows: int = 6
) -> QTableWidget:
    """stretch_column 을 주면 그 열만, 주지 않으면 모든 열이 폭을 나눠 갖는다.

    min_rows 는 스크롤 없이 보이길 바라는 최소 행 수다.
    """
    table = QTableWidget(0, len(headers))
    table.setHorizontalHeaderLabels(headers)
    table.setAlternatingRowColors(True)
    table.setEditTriggers(QTableWidget.NoEditTriggers)
    table.setSelectionBehavior(QTableWidget.SelectRows)
    table.setSelectionMode(QTableWidget.SingleSelection)
    table.verticalHeader().setVisible(False)
    table.setSortingEnabled(False)
    header = table.horizontalHeader()
    header.setStretchLastSection(False)
    if stretch_column is None:
        # 열이 적은 표는 남는 폭을 고르게 나눠 갖는 쪽이 보기 좋다.
        header.setSectionResizeMode(header.ResizeMode.Stretch)
    else:
        header.setSectionResizeMode(header.ResizeMode.ResizeToContents)
        if 0 <= stretch_column < len(headers):
            header.setSectionResizeMode(stretch_column, header.ResizeMode.Stretch)
    row_height = table.verticalHeader().defaultSectionSize()
    table.setMinimumHeight(header.height() + row_height * max(1, min_rows) + 8)
    return table


def cell(text: str, *, color: str | None = None, align_right: bool = False,
         sort_value: float | None = None) -> QTableWidgetItem:
    item = QTableWidgetItem(text)
    if color:
        item.setForeground(QColor(color))
    if align_right:
        item.setTextAlignment(Qt.AlignRight | Qt.AlignVCenter)
    if sort_value is not None:
        item.setData(Qt.UserRole, sort_value)
    return item


def fill_table(table: QTableWidget, rows: list[list[QTableWidgetItem]]) -> None:
    table.setRowCount(len(rows))
    for r, items in enumerate(rows):
        for c, item in enumerate(items):
            table.setItem(r, c, item)


def debounce_connect(widget, handler: Callable[[], None]) -> None:
    """텍스트/값 변경 시그널을 종류에 관계없이 핸들러에 연결."""
    for signal_name in ("textChanged", "currentIndexChanged", "valueChanged", "stateChanged"):
        signal = getattr(widget, signal_name, None)
        if signal is not None:
            signal.connect(lambda *_: handler())
            return
