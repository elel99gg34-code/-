"""탭들이 공통으로 쓰는 위젯 헬퍼."""
from __future__ import annotations

from collections.abc import Callable

from PySide6.QtCore import Qt, QTimer
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


def _as_widget(item) -> QWidget:
    """위젯이면 그대로, 레이아웃이면 감싼 위젯으로."""
    if isinstance(item, QWidget):
        return item
    holder = QWidget()
    holder.setLayout(item)
    return holder


def row(*items, stretch_last: bool = True) -> QWidget:
    holder = QWidget()
    layout = QHBoxLayout(holder)
    layout.setContentsMargins(0, 0, 0, 0)
    layout.setSpacing(8)
    for item in items:
        layout.addWidget(_as_widget(item))
    if stretch_last:
        layout.addStretch(1)
    return holder


def column(*items, spacing: int = 10) -> QWidget:
    holder = QWidget()
    layout = QVBoxLayout(holder)
    layout.setContentsMargins(0, 0, 0, 0)
    layout.setSpacing(spacing)
    for item in items:
        layout.addWidget(_as_widget(item))
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


# ---------------------------------------------------------------------------
# 추가 위젯
# ---------------------------------------------------------------------------
from PySide6.QtGui import QGuiApplication, QPainter, QPen  # noqa: E402
from PySide6.QtWidgets import (  # noqa: E402
    QGridLayout,
    QProgressBar,
    QPushButton,
    QSizePolicy,
)


def copy_button(text_provider: Callable[[], str], label: str = "복사") -> QPushButton:
    """눌렀을 때 text_provider() 결과를 클립보드에 넣는 버튼."""
    button = QPushButton(label)
    button.setToolTip("계산 결과를 클립보드에 복사합니다.")

    def copy() -> None:
        clipboard = QGuiApplication.clipboard()
        if clipboard is None:
            return
        clipboard.setText(text_provider() or "")
        original = button.text()
        button.setText("복사됨")
        QTimer.singleShot(1200, lambda: button.setText(original))

    button.clicked.connect(copy)
    return button


def star_button(checked: bool = False) -> QPushButton:
    """즐겨찾기 토글 버튼."""
    button = QPushButton("★" if checked else "☆")
    button.setProperty("star", "true")
    button.setCheckable(True)
    button.setChecked(checked)
    button.setToolTip("즐겨찾기")
    button.toggled.connect(lambda on: button.setText("★" if on else "☆"))
    return button


def progress_row(value: float, maximum: float, text: str = "") -> QProgressBar:
    bar = QProgressBar()
    bar.setMaximum(max(1, int(maximum)))
    bar.setValue(max(0, min(int(maximum), int(value))))
    bar.setFormat(text or "%p%")
    return bar


class StatCard(QFrame):
    """대시보드에 쓰는 숫자 카드."""

    def __init__(self, title: str, value: str = "—", detail: str = "") -> None:
        super().__init__()
        self.setProperty("role", "card")
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Minimum)

        self.title_label = QLabel(title)
        self.title_label.setProperty("role", "hint")
        self.value_label = QLabel(value)
        self.value_label.setProperty("role", "big")
        self.value_label.setTextInteractionFlags(Qt.TextSelectableByMouse)
        self.detail_label = QLabel(detail)
        self.detail_label.setProperty("role", "hint")
        self.detail_label.setWordWrap(True)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(14, 12, 14, 12)
        layout.setSpacing(3)
        layout.addWidget(self.title_label)
        layout.addWidget(self.value_label)
        layout.addWidget(self.detail_label)

    def set_value(self, value: str, detail: str = "") -> None:
        self.value_label.setText(value)
        if detail:
            self.detail_label.setText(detail)


def card_grid(cards: list[QWidget], columns: int = 3) -> QWidget:
    holder = QWidget()
    grid = QGridLayout(holder)
    grid.setContentsMargins(0, 0, 0, 0)
    grid.setSpacing(10)
    for index, card in enumerate(cards):
        grid.addWidget(card, index // columns, index % columns)
    return holder


class BarChart(QWidget):
    """의존성 없이 그리는 간단한 막대 그래프.

    차트 라이브러리를 넣으면 배포 크기가 커지고 CSP/번들 문제가 늘어난다.
    여기서 필요한 건 '추세가 보이는 막대' 정도라 QPainter 로 충분하다.
    """

    def __init__(self, height: int = 150) -> None:
        super().__init__()
        self._bars: list[tuple[str, float]] = []
        self._caption = ""
        self.setMinimumHeight(height)
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)

    def set_bars(self, bars: list[tuple[str, float]], caption: str = "") -> None:
        self._bars = list(bars)
        self._caption = caption
        self.update()

    def paintEvent(self, event) -> None:  # noqa: N802  (Qt 규약)
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing, True)
        painter.fillRect(self.rect(), QColor(theme.BG))

        if not self._bars:
            painter.setPen(QPen(QColor(theme.TEXT_DIM)))
            painter.drawText(self.rect(), Qt.AlignCenter, "표시할 데이터가 없습니다")
            painter.end()
            return

        margin_x, margin_top, margin_bottom = 8, 10, 22
        width = max(1, self.width() - margin_x * 2)
        height = max(1, self.height() - margin_top - margin_bottom)
        peak = max((value for _, value in self._bars), default=0.0)
        if peak <= 0:
            peak = 1.0

        slot = width / len(self._bars)
        bar_width = max(2.0, slot * 0.68)

        for index, (label, value) in enumerate(self._bars):
            bar_height = max(1.0, (value / peak) * height)
            x = margin_x + slot * index + (slot - bar_width) / 2
            y = margin_top + height - bar_height
            painter.fillRect(
                int(x), int(y), int(bar_width), int(bar_height), QColor(theme.ACCENT)
            )

        painter.setPen(QPen(QColor(theme.TEXT_DIM)))
        step = max(1, len(self._bars) // 8)
        for index in range(0, len(self._bars), step):
            label = self._bars[index][0]
            x = margin_x + slot * index
            painter.drawText(
                int(x), self.height() - margin_bottom + 4, int(slot * step), 16,
                Qt.AlignLeft | Qt.AlignVCenter, label,
            )

        if self._caption:
            painter.drawText(
                margin_x, 0, width, margin_top + 4, Qt.AlignRight | Qt.AlignTop, self._caption
            )
        painter.end()
