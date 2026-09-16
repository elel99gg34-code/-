"""정보 탭 - 데이터 출처, 데이터 갱신, 그리고 이 앱이 하지 않는 것."""
from __future__ import annotations

import webbrowser
from pathlib import Path

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QFileDialog,
    QHBoxLayout,
    QLabel,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from ... import __version__
from ...core import dataset as dataset_module
from ...core.models import Dataset
from .. import theme, widgets

POLICY = """이 앱은 로블록스 클라이언트와 전혀 상호작용하지 않습니다.

하지 않는 것 (앞으로도 넣지 않습니다)
· 게임 프로세스 메모리 읽기/쓰기, DLL 인젝션
· 투시(ESP) · 월핵 · 벽 너머 알/플레이어 표시
· 자동 클릭, 매크로, 오토파밍 등 조작 자동화
· 게임 서버와의 통신 가로채기, 패킷 조작
· 계정 정보 수집, 외부 서버 전송

전부 로블록스 이용약관 위반이고 영구정지 사유입니다. 특히 이 게임은 다른 플레이어의
알을 뺏는 구조라, 그런 기능은 실제로 상대 플레이어에게 피해를 줍니다.

대신 이 앱이 하는 것
· 공개된 수치로 계산: 무게/뮤테이션 수입 공식, 확률, ROI, 퓨즈 손익
· 내가 직접 입력한 부화 기록의 통계
· 바이옴별 요구 스피드 정리

즉 이 앱은 계산기이자 메모장입니다. 게임을 대신 플레이해 주지 않습니다."""


class AboutTab(QWidget):
    def __init__(self, dataset: Dataset, data_path: Path, on_reload) -> None:
        super().__init__()
        self.dataset = dataset
        self.data_path = data_path
        self.on_reload = on_reload

        header = QLabel(
            f"<b style='font-size:20px'>EggMate {__version__}</b><br>"
            f"<span style='color:{theme.TEXT_DIM}'>{dataset.game}</span>"
        )
        header.setTextFormat(Qt.RichText)

        policy = QLabel(POLICY)
        policy.setWordWrap(True)
        policy.setStyleSheet(
            f"background:{theme.BG}; border:1px solid {theme.BORDER}; "
            f"border-left:3px solid {theme.ACCENT}; border-radius:6px; padding:12px; line-height:150%;"
        )

        self.data_label = widgets.hint("")
        self.disclaimer = widgets.hint(dataset.disclaimer)

        edit_button = QPushButton("데이터 파일 편집용 복사본 만들기")
        edit_button.clicked.connect(self.make_editable_copy)

        import_button = QPushButton("데이터 파일 불러오기")
        import_button.clicked.connect(self.import_data)

        folder_button = QPushButton("저장 폴더 열기")
        folder_button.clicked.connect(self.open_folder)

        reload_button = QPushButton("다시 불러오기")
        reload_button.setProperty("accent", "true")
        reload_button.clicked.connect(self._reload)

        buttons = QWidget()
        button_row = QHBoxLayout(buttons)
        button_row.setContentsMargins(0, 0, 0, 0)
        button_row.addWidget(edit_button)
        button_row.addWidget(import_button)
        button_row.addWidget(folder_button)
        button_row.addStretch(1)
        button_row.addWidget(reload_button)

        self.sources_table = widgets.make_table(["출처"], min_rows=8)
        self.sources_table.cellDoubleClicked.connect(self._open_source)
        widgets.fill_table(
            self.sources_table, [[widgets.cell(url)] for url in dataset.sources]
        )

        mechanics = QLabel(self._mechanics_text())
        mechanics.setWordWrap(True)
        mechanics.setTextInteractionFlags(Qt.TextSelectableByMouse)

        data_form = widgets.form()
        data_form.addRow("데이터 버전", self.data_label)
        data_form.addRow("", self.disclaimer)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(header)
        layout.addWidget(widgets.group("이 앱의 범위", policy))
        layout.addWidget(widgets.group("데이터", data_form))
        layout.addWidget(buttons)
        layout.addWidget(widgets.group("게임 메커니즘 메모", mechanics))
        layout.addWidget(widgets.group("출처 (더블클릭하면 브라우저로 열림)", self.sources_table))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.refresh_label()

    def _mechanics_text(self) -> str:
        mech = self.dataset.mechanics
        lines = [
            f"· 탈취 단계: {' → '.join(mech.get('steal_phases', []))}",
            f"· 가디언: {mech.get('guardian', '')}",
            f"· 잡히면: {mech.get('caught_penalty', '')}",
            f"· 운반 패널티: {mech.get('carry_penalty', '')}",
            f"· 러닝머신: {mech.get('treadmill', '')}",
            f"· 트레일: {mech.get('trails', '')}",
            f"· 펜: {mech.get('pen', '')}",
            f"· 코드: {mech.get('codes', '')}",
        ]
        return "\n\n".join(line for line in lines if line.strip(" ·"))

    def refresh_label(self) -> None:
        self.data_label.setText(
            f"{self.dataset.data_version} · 펫 {len(self.dataset.pets)}종 · "
            f"바이옴 {len(self.dataset.biomes)}개\n{self.data_path}"
        )

    def make_editable_copy(self) -> None:
        try:
            path = dataset_module.install_user_copy()
        except OSError as exc:
            QMessageBox.warning(self, "복사 실패", str(exc))
            return
        QMessageBox.information(
            self,
            "복사본 생성",
            f"{path}\n\n이 파일을 메모장으로 고치면 앱이 그 값을 씁니다.\n"
            "고친 뒤 [다시 불러오기]를 누르세요.",
        )
        self._reload()

    def import_data(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, "gamedata.json 선택", "", "JSON (*.json)")
        if not path:
            return
        try:
            dataset_module.load_from(Path(path))  # 먼저 검증
            target = dataset_module.install_user_copy(Path(path))
        except (dataset_module.DatasetError, OSError) as exc:
            QMessageBox.warning(self, "불러오기 실패", str(exc))
            return
        QMessageBox.information(self, "완료", f"{target} 로 적용했습니다.")
        self._reload()

    def open_folder(self) -> None:
        folder = dataset_module.user_dir()
        folder.mkdir(parents=True, exist_ok=True)
        webbrowser.open(folder.as_uri())

    def _open_source(self, row: int, _column: int) -> None:
        item = self.sources_table.item(row, 0)
        if item:
            webbrowser.open(item.text())

    def _reload(self) -> None:
        if callable(self.on_reload):
            self.on_reload()
