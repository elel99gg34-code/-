"""다크 테마 스타일시트와 색상 토큰."""
from __future__ import annotations

BG = "#0f1117"
SURFACE = "#171a23"
SURFACE_ALT = "#1e222d"
BORDER = "#2a2f3d"
TEXT = "#e6e9ef"
TEXT_DIM = "#8b93a7"
ACCENT = "#f5b301"
ACCENT_DIM = "#8a6600"
GOOD = "#4ade80"
WARN = "#fbbf24"
BAD = "#f87171"

FONT_STACK = '"Malgun Gothic", "Pretendard", "Noto Sans KR", "Segoe UI", sans-serif'

STYLESHEET = f"""
QWidget {{
    background-color: {BG};
    color: {TEXT};
    font-family: {FONT_STACK};
    font-size: 13px;
}}
QMainWindow, QDialog {{ background-color: {BG}; }}

QTabWidget::pane {{
    border: 1px solid {BORDER};
    border-radius: 8px;
    background-color: {SURFACE};
    top: -1px;
}}
QTabBar::tab {{
    background: transparent;
    color: {TEXT_DIM};
    padding: 9px 18px;
    margin-right: 2px;
    border: 1px solid transparent;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    font-weight: 600;
}}
QTabBar::tab:selected {{
    background: {SURFACE};
    color: {ACCENT};
    border: 1px solid {BORDER};
    border-bottom-color: {SURFACE};
}}
QTabBar::tab:hover:!selected {{ color: {TEXT}; }}

QGroupBox {{
    border: 1px solid {BORDER};
    border-radius: 8px;
    margin-top: 14px;
    padding: 14px 12px 12px 12px;
    background-color: {SURFACE_ALT};
    font-weight: 600;
}}
QGroupBox::title {{
    subcontrol-origin: margin;
    left: 12px;
    padding: 0 6px;
    color: {ACCENT};
}}

QLineEdit, QComboBox, QSpinBox, QDoubleSpinBox, QPlainTextEdit {{
    max-width: 360px;
    background-color: {BG};
    border: 1px solid {BORDER};
    border-radius: 6px;
    padding: 6px 8px;
    selection-background-color: {ACCENT_DIM};
}}
QLineEdit:focus, QComboBox:focus, QSpinBox:focus, QDoubleSpinBox:focus {{
    border-color: {ACCENT};
}}
QLineEdit[invalid="true"] {{ border-color: {BAD}; }}
QComboBox::drop-down {{ border: none; width: 22px; }}
QComboBox QAbstractItemView {{
    background-color: {SURFACE};
    border: 1px solid {BORDER};
    selection-background-color: {ACCENT_DIM};
    outline: none;
}}

QPushButton {{
    background-color: {SURFACE_ALT};
    border: 1px solid {BORDER};
    border-radius: 6px;
    padding: 7px 16px;
    font-weight: 600;
}}
QPushButton:hover {{ border-color: {ACCENT}; color: {ACCENT}; }}
QPushButton:pressed {{ background-color: {BG}; }}
QPushButton:disabled {{ color: {TEXT_DIM}; border-color: {BORDER}; }}
QPushButton[accent="true"] {{
    background-color: {ACCENT};
    color: #1a1400;
    border: none;
}}
QPushButton[accent="true"]:hover {{ background-color: #ffc933; color: #1a1400; }}

QTableWidget, QTableView {{
    background-color: {BG};
    alternate-background-color: {SURFACE};
    gridline-color: {BORDER};
    border: 1px solid {BORDER};
    border-radius: 6px;
    selection-background-color: {ACCENT_DIM};
    selection-color: {TEXT};
}}
QHeaderView::section {{
    background-color: {SURFACE_ALT};
    color: {TEXT_DIM};
    padding: 7px 8px;
    border: none;
    border-right: 1px solid {BORDER};
    border-bottom: 1px solid {BORDER};
    font-weight: 600;
}}
QTableCornerButton::section {{ background-color: {SURFACE_ALT}; border: none; }}

QScrollBar:vertical {{ background: transparent; width: 10px; margin: 2px; }}
QScrollBar::handle:vertical {{ background: {BORDER}; border-radius: 5px; min-height: 30px; }}
QScrollBar::handle:vertical:hover {{ background: {TEXT_DIM}; }}
QScrollBar:horizontal {{ background: transparent; height: 10px; margin: 2px; }}
QScrollBar::handle:horizontal {{ background: {BORDER}; border-radius: 5px; min-width: 30px; }}
QScrollBar::add-line, QScrollBar::sub-line {{ height: 0; width: 0; }}
QScrollBar::add-page, QScrollBar::sub-page {{ background: none; }}

QScrollArea {{ border: none; background: transparent; }}
QScrollArea > QWidget > QWidget {{ background: transparent; }}

QLabel[role="hint"] {{ color: {TEXT_DIM}; font-size: 12px; }}
QLabel[role="big"] {{ font-size: 26px; font-weight: 700; color: {ACCENT}; }}
QLabel[role="metric"] {{ font-size: 17px; font-weight: 700; }}
QLabel[role="good"] {{ color: {GOOD}; font-weight: 600; }}
QLabel[role="warn"] {{ color: {WARN}; font-weight: 600; }}
QLabel[role="bad"] {{ color: {BAD}; font-weight: 600; }}
QLabel[role="title"] {{ font-size: 15px; font-weight: 700; }}

QStatusBar {{ background-color: {SURFACE}; color: {TEXT_DIM}; border-top: 1px solid {BORDER}; }}
QToolTip {{
    background-color: {SURFACE_ALT};
    color: {TEXT};
    border: 1px solid {ACCENT};
    padding: 6px;
    border-radius: 4px;
}}
QCheckBox::indicator {{
    width: 15px; height: 15px;
    border: 1px solid {BORDER}; border-radius: 4px; background: {BG};
}}
QCheckBox::indicator:checked {{ background: {ACCENT}; border-color: {ACCENT}; }}
QSplitter::handle {{ background: {BORDER}; }}
"""
