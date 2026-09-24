"""테마 — 다크/라이트 팔레트와 스타일시트 생성기."""
from __future__ import annotations

DARK = {
    "BG": "#0f1117", "SURFACE": "#171a23", "SURFACE_ALT": "#1e222d", "BORDER": "#2a2f3d",
    "TEXT": "#e6e9ef", "TEXT_DIM": "#8b93a7", "ACCENT": "#f5b301", "ACCENT_DIM": "#8a6600",
    "GOOD": "#4ade80", "WARN": "#fbbf24", "BAD": "#f87171", "SIDEBAR": "#12141c",
    "ON_ACCENT": "#1a1400",
}

LIGHT = {
    "BG": "#f6f7fa", "SURFACE": "#ffffff", "SURFACE_ALT": "#eef0f5", "BORDER": "#d3d8e2",
    "TEXT": "#1b1f2b", "TEXT_DIM": "#606a80", "ACCENT": "#b97e00", "ACCENT_DIM": "#f0d79a",
    "GOOD": "#0f8a4a", "WARN": "#a76a00", "BAD": "#c0392b", "SIDEBAR": "#e9ecf3",
    "ON_ACCENT": "#ffffff",
}

PALETTES = {"dark": DARK, "light": LIGHT}

# 모듈 수준 이름은 현재 팔레트를 가리킨다 (기존 코드 호환).
BG = DARK["BG"]
SURFACE = DARK["SURFACE"]
SURFACE_ALT = DARK["SURFACE_ALT"]
BORDER = DARK["BORDER"]
TEXT = DARK["TEXT"]
TEXT_DIM = DARK["TEXT_DIM"]
ACCENT = DARK["ACCENT"]
ACCENT_DIM = DARK["ACCENT_DIM"]
GOOD = DARK["GOOD"]
WARN = DARK["WARN"]
BAD = DARK["BAD"]
SIDEBAR = DARK["SIDEBAR"]
ON_ACCENT = DARK["ON_ACCENT"]


def apply_palette(name: str) -> dict[str, str]:
    """모듈 수준 색 이름을 해당 팔레트로 바꾼다."""
    palette = PALETTES.get(name, DARK)
    globals().update(palette)
    return palette

FONT_STACK = '"Malgun Gothic", "Pretendard", "Noto Sans KR", "Segoe UI", sans-serif'


def stylesheet(theme_name: str = "dark", font_scale: float = 1.0) -> str:
    """팔레트와 글자 크기를 적용한 전체 스타일시트."""
    c = apply_palette(theme_name)
    scale = min(1.6, max(0.8, float(font_scale or 1.0)))

    def px(base: int) -> str:
        return f"{max(8, round(base * scale))}px"

    return f"""
QWidget {{
    background-color: {c['BG']};
    color: {c['TEXT']};
    font-family: {FONT_STACK};
    font-size: {px(13)};
}}
QMainWindow, QDialog {{ background-color: {c['BG']}; }}

/* 사이드바 ------------------------------------------------------- */
QListWidget#sidebar {{
    background-color: {c['SIDEBAR']};
    border: none;
    border-right: 1px solid {c['BORDER']};
    outline: none;
    padding: 8px 6px;
}}
QListWidget#sidebar::item {{
    color: {c['TEXT_DIM']};
    padding: 9px 12px;
    border-radius: 7px;
    margin-bottom: 2px;
    font-weight: 600;
}}
QListWidget#sidebar::item:selected {{
    background-color: {c['ACCENT']};
    color: {c['ON_ACCENT']};
}}
QListWidget#sidebar::item:hover:!selected {{
    background-color: {c['SURFACE_ALT']};
    color: {c['TEXT']};
}}

QTabWidget::pane {{
    border: 1px solid {c['BORDER']};
    border-radius: 8px;
    background-color: {c['SURFACE']};
    top: -1px;
}}
QTabBar::tab {{
    background: transparent;
    color: {c['TEXT_DIM']};
    padding: {px(8)} {px(16)};
    margin-right: 2px;
    border: 1px solid transparent;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    font-weight: 600;
}}
QTabBar::tab:selected {{
    background: {c['SURFACE']};
    color: {c['ACCENT']};
    border: 1px solid {c['BORDER']};
    border-bottom-color: {c['SURFACE']};
}}
QTabBar::tab:hover:!selected {{ color: {c['TEXT']}; }}

QGroupBox {{
    border: 1px solid {c['BORDER']};
    border-radius: 8px;
    margin-top: 14px;
    padding: 14px 12px 12px 12px;
    background-color: {c['SURFACE_ALT']};
    font-weight: 600;
}}
QGroupBox::title {{
    subcontrol-origin: margin;
    left: 12px;
    padding: 0 6px;
    color: {c['ACCENT']};
}}

QLineEdit, QComboBox, QSpinBox, QDoubleSpinBox, QPlainTextEdit {{
    max-width: 360px;
    background-color: {c['BG']};
    border: 1px solid {c['BORDER']};
    border-radius: 6px;
    padding: 6px 8px;
    selection-background-color: {c['ACCENT_DIM']};
}}
QLineEdit:focus, QComboBox:focus, QSpinBox:focus, QDoubleSpinBox:focus {{
    border-color: {c['ACCENT']};
}}
QLineEdit[invalid="true"] {{ border-color: {c['BAD']}; }}
QLineEdit#searchbox {{ max-width: 16777215px; font-size: {px(15)}; padding: 10px 12px; }}
QComboBox::drop-down {{ border: none; width: 22px; }}
QComboBox QAbstractItemView {{
    background-color: {c['SURFACE']};
    border: 1px solid {c['BORDER']};
    selection-background-color: {c['ACCENT_DIM']};
    outline: none;
}}

QPushButton {{
    background-color: {c['SURFACE_ALT']};
    border: 1px solid {c['BORDER']};
    border-radius: 6px;
    padding: {px(7)} {px(15)};
    font-weight: 600;
}}
QPushButton:hover {{ border-color: {c['ACCENT']}; color: {c['ACCENT']}; }}
QPushButton:pressed {{ background-color: {c['BG']}; }}
QPushButton:disabled {{ color: {c['TEXT_DIM']}; border-color: {c['BORDER']}; }}
QPushButton[accent="true"] {{
    background-color: {c['ACCENT']};
    color: {c['ON_ACCENT']};
    border: none;
}}
QPushButton[accent="true"]:hover {{ background-color: {c['ACCENT']}; color: {c['ON_ACCENT']}; }}
QPushButton[star="true"] {{
    max-width: 34px; padding: 4px; font-size: {px(15)};
}}

QTableWidget, QTableView {{
    background-color: {c['BG']};
    alternate-background-color: {c['SURFACE']};
    gridline-color: {c['BORDER']};
    border: 1px solid {c['BORDER']};
    border-radius: 6px;
    selection-background-color: {c['ACCENT_DIM']};
    selection-color: {c['TEXT']};
}}
QHeaderView::section {{
    background-color: {c['SURFACE_ALT']};
    color: {c['TEXT_DIM']};
    padding: 7px 8px;
    border: none;
    border-right: 1px solid {c['BORDER']};
    border-bottom: 1px solid {c['BORDER']};
    font-weight: 600;
}}
QTableCornerButton::section {{ background-color: {c['SURFACE_ALT']}; border: none; }}

QProgressBar {{
    border: 1px solid {c['BORDER']};
    border-radius: 6px;
    background-color: {c['BG']};
    text-align: center;
    height: {px(18)};
}}
QProgressBar::chunk {{ background-color: {c['ACCENT']}; border-radius: 5px; }}

QScrollBar:vertical {{ background: transparent; width: 10px; margin: 2px; }}
QScrollBar::handle:vertical {{ background: {c['BORDER']}; border-radius: 5px; min-height: 30px; }}
QScrollBar::handle:vertical:hover {{ background: {c['TEXT_DIM']}; }}
QScrollBar:horizontal {{ background: transparent; height: 10px; margin: 2px; }}
QScrollBar::handle:horizontal {{ background: {c['BORDER']}; border-radius: 5px; min-width: 30px; }}
QScrollBar::add-line, QScrollBar::sub-line {{ height: 0; width: 0; }}
QScrollBar::add-page, QScrollBar::sub-page {{ background: none; }}

QScrollArea {{ border: none; background: transparent; }}
QScrollArea > QWidget > QWidget {{ background: transparent; }}

QLabel[role="hint"] {{ color: {c['TEXT_DIM']}; font-size: {px(12)}; }}
QLabel[role="big"] {{ font-size: {px(26)}; font-weight: 700; color: {c['ACCENT']}; }}
QLabel[role="metric"] {{ font-size: {px(17)}; font-weight: 700; }}
QLabel[role="good"] {{ color: {c['GOOD']}; font-weight: 600; }}
QLabel[role="warn"] {{ color: {c['WARN']}; font-weight: 600; }}
QLabel[role="bad"] {{ color: {c['BAD']}; font-weight: 600; }}
QLabel[role="title"] {{ font-size: {px(15)}; font-weight: 700; }}
QLabel[role="section"] {{ font-size: {px(20)}; font-weight: 700; }}

QFrame[role="card"] {{
    background-color: {c['SURFACE_ALT']};
    border: 1px solid {c['BORDER']};
    border-radius: 10px;
}}

QStatusBar {{ background-color: {c['SURFACE']}; color: {c['TEXT_DIM']}; border-top: 1px solid {c['BORDER']}; }}
QToolTip {{
    background-color: {c['SURFACE_ALT']};
    color: {c['TEXT']};
    border: 1px solid {c['ACCENT']};
    padding: 6px;
    border-radius: 4px;
}}
QCheckBox::indicator {{
    width: 15px; height: 15px;
    border: 1px solid {c['BORDER']}; border-radius: 4px; background: {c['BG']};
}}
QCheckBox::indicator:checked {{ background: {c['ACCENT']}; border-color: {c['ACCENT']}; }}
QSplitter::handle {{ background: {c['BORDER']}; }}
"""


# 기존 코드 호환용 — 기본 다크 스타일시트
STYLESHEET = stylesheet("dark", 1.0)
