"""설정 — 테마, 글자 크기, 창 동작, 프로필, 백업."""
from __future__ import annotations

from pathlib import Path

from PySide6.QtWidgets import (
    QCheckBox,
    QComboBox,
    QDoubleSpinBox,
    QFileDialog,
    QInputDialog,
    QMessageBox,
    QPushButton,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from ...core import settings as settings_module
from .. import widgets
from ..context import AppContext

THEME_LABELS = {"dark": "어두운 테마", "light": "밝은 테마"}


class SettingsTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        self._loading = False

        self.theme_picker = QComboBox()
        for key, label in THEME_LABELS.items():
            self.theme_picker.addItem(label, key)

        self.font_scale = QDoubleSpinBox()
        self.font_scale.setRange(0.8, 1.6)
        self.font_scale.setSingleStep(0.1)
        self.font_scale.setDecimals(1)
        self.font_scale.setSuffix(" 배")

        self.always_on_top = QCheckBox("창을 항상 맨 위에 (게임하면서 보기)")
        self.show_hints = QCheckBox("화면 아래 설명 문구 보이기")

        self.safety_margin = QDoubleSpinBox()
        self.safety_margin.setRange(1.0, 10.0)
        self.safety_margin.setSingleStep(0.5)
        self.safety_margin.setSuffix(" 배 안전 마진")

        self.seconds_per_hatch = QSpinBox()
        self.seconds_per_hatch.setRange(1, 3600)
        self.seconds_per_hatch.setSuffix(" 초 / 부화 1회")

        # --- 프로필 ---
        self.profile_picker = QComboBox()
        new_profile = QPushButton("새 프로필")
        new_profile.clicked.connect(self.create_profile)
        rename_profile = QPushButton("이름 변경")
        rename_profile.clicked.connect(self.rename_profile)
        delete_profile = QPushButton("프로필 삭제")
        delete_profile.clicked.connect(self.delete_profile)
        self.profile_detail = widgets.hint("")

        # --- 백업 ---
        backup_button = QPushButton("백업 만들기 (.zip)")
        backup_button.setProperty("accent", "true")
        backup_button.clicked.connect(self.backup)
        restore_button = QPushButton("백업에서 복원")
        restore_button.clicked.connect(self.restore)
        folder_button = QPushButton("저장 폴더 열기")
        folder_button.clicked.connect(self.open_folder)
        self.storage_detail = widgets.hint("")

        # --- 즐겨찾기 / 최근 ---
        self.favorites_table = widgets.make_table(["즐겨찾기한 펫", "바이옴", "등급"], min_rows=5)
        clear_favorites = QPushButton("즐겨찾기 비우기")
        clear_favorites.clicked.connect(self.clear_favorites)
        self.recent_table = widgets.make_table(["종류", "내용"], stretch_column=1, min_rows=5)
        clear_recent = QPushButton("최근 계산 비우기")
        clear_recent.clicked.connect(self.clear_recent)

        appearance = widgets.form()
        appearance.addRow("테마", self.theme_picker)
        appearance.addRow("글자 크기", self.font_scale)
        appearance.addRow("", self.always_on_top)
        appearance.addRow("", self.show_hints)

        defaults = widgets.form()
        defaults.addRow("바이옴 안전 기준", self.safety_margin)
        defaults.addRow("부화 1회 소요", self.seconds_per_hatch)

        profile_form = widgets.form()
        profile_form.addRow("활성 프로필", self.profile_picker)
        profile_form.addRow("", self.profile_detail)

        storage_form = widgets.form()
        storage_form.addRow("저장 위치", self.storage_detail)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("모양", appearance))
        layout.addWidget(widgets.group("기본값", defaults))
        layout.addWidget(widgets.group("프로필 (부캐 관리)", widgets.column(
            profile_form, widgets.row(new_profile, rename_profile, delete_profile)
        )))
        layout.addWidget(widgets.group("백업", widgets.column(
            storage_form, widgets.row(backup_button, restore_button, folder_button)
        )))
        layout.addWidget(widgets.group("즐겨찾기", widgets.column(
            self.favorites_table, widgets.row(clear_favorites)
        )))
        layout.addWidget(widgets.group("최근 계산", widgets.column(
            self.recent_table, widgets.row(clear_recent)
        )))
        layout.addWidget(widgets.hint(
            "모든 기록은 내 PC 안에만 저장됩니다. 게임이나 외부 서버로 전송되지 않습니다. "
            "프로필을 나누면 부캐 기록이 서로 섞이지 않습니다."
        ))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.theme_picker.currentIndexChanged.connect(self._on_changed)
        self.font_scale.valueChanged.connect(self._on_changed)
        self.always_on_top.toggled.connect(self._on_changed)
        self.show_hints.toggled.connect(self._on_changed)
        self.safety_margin.valueChanged.connect(self._on_changed)
        self.seconds_per_hatch.valueChanged.connect(self._on_changed)
        self.profile_picker.currentIndexChanged.connect(self._on_profile_picked)

        ctx.bus.profile_changed.connect(self.refresh)
        ctx.bus.settings_changed.connect(self.refresh)
        self.refresh()

    # ------------------------------------------------------------------
    def refresh(self) -> None:
        self._loading = True
        s = self.ctx.settings

        index = self.theme_picker.findData(s.theme)
        self.theme_picker.setCurrentIndex(max(0, index))
        self.font_scale.setValue(s.font_scale)
        self.always_on_top.setChecked(s.always_on_top)
        self.show_hints.setChecked(s.show_hints)
        self.safety_margin.setValue(s.safety_margin)
        self.seconds_per_hatch.setValue(s.seconds_per_hatch)

        self.profile_picker.clear()
        for name in self.ctx.db.profiles():
            self.profile_picker.addItem(name, name)
        current = self.profile_picker.findData(self.ctx.db.profile)
        self.profile_picker.setCurrentIndex(max(0, current))

        self.profile_detail.setText(
            f"부화 {self.ctx.hatches.count()}건 · 보유 {self.ctx.inventory.count()}건 · "
            f"위시 {self.ctx.wishlist.count()}건 · 성장 {self.ctx.timeline.count()}건"
        )
        self.storage_detail.setText(
            f"{self.ctx.db.path}\n설정: {settings_module.settings_path()}"
        )

        data = self.ctx.dataset
        rows = []
        for name in s.favorites:
            pet = data.pet(name)
            rarity = data.rarity(pet.rarity) if pet else None
            biome = data.biome(pet.biome) if pet else None
            rows.append([
                widgets.cell(pet.ko if pet else name, color=rarity.color if rarity else None),
                widgets.cell(biome.ko if biome else ""),
                widgets.cell(rarity.ko if rarity else ""),
            ])
        widgets.fill_table(self.favorites_table, rows)

        widgets.fill_table(self.recent_table, [
            [widgets.cell(entry.get("kind", "")), widgets.cell(entry.get("summary", ""))]
            for entry in s.recent_calculations
        ])
        self._loading = False

    def _on_changed(self) -> None:
        if self._loading:
            return
        s = self.ctx.settings
        s.theme = self.theme_picker.currentData() or "dark"
        s.font_scale = self.font_scale.value()
        s.always_on_top = self.always_on_top.isChecked()
        s.show_hints = self.show_hints.isChecked()
        s.safety_margin = self.safety_margin.value()
        s.seconds_per_hatch = self.seconds_per_hatch.value()
        self.ctx.save_settings()

    def _on_profile_picked(self) -> None:
        if self._loading:
            return
        name = self.profile_picker.currentData()
        if name and name != self.ctx.db.profile:
            self.ctx.use_profile(name)

    # --- 프로필 조작 ---------------------------------------------------
    def create_profile(self) -> None:
        name, ok = QInputDialog.getText(self, "새 프로필", "프로필 이름:")
        name = (name or "").strip()
        if not ok or not name:
            return
        if name in self.ctx.db.profiles():
            QMessageBox.information(self, "이미 있음", f"'{name}' 프로필이 이미 있습니다.")
            return
        self.ctx.use_profile(name)
        self.refresh()

    def rename_profile(self) -> None:
        old = self.ctx.db.profile
        name, ok = QInputDialog.getText(self, "이름 변경", "새 이름:", text=old)
        name = (name or "").strip()
        if not ok or not name or name == old:
            return
        try:
            self.ctx.db.rename_profile(old, name)
        except ValueError as exc:
            QMessageBox.warning(self, "변경 실패", str(exc))
            return
        self.ctx.use_profile(name)
        self.refresh()

    def delete_profile(self) -> None:
        name = self.ctx.db.profile
        profiles = self.ctx.db.profiles()
        if len(profiles) <= 1:
            QMessageBox.information(self, "삭제 불가", "프로필이 하나뿐입니다.")
            return
        confirm = QMessageBox.question(
            self, "프로필 삭제",
            f"'{name}' 프로필의 모든 기록을 지웁니다. 되돌릴 수 없습니다. 계속할까요?",
            QMessageBox.Yes | QMessageBox.No, QMessageBox.No,
        )
        if confirm != QMessageBox.Yes:
            return
        self.ctx.db.delete_profile(name)
        remaining = [p for p in self.ctx.db.profiles() if p != name]
        self.ctx.use_profile(remaining[0] if remaining else settings_module.DEFAULT_PROFILE)
        self.refresh()

    # --- 백업 ----------------------------------------------------------
    def backup(self) -> None:
        path, _ = QFileDialog.getSaveFileName(
            self, "백업 저장", "eggmate-backup.zip", "ZIP (*.zip)"
        )
        if not path:
            return
        try:
            self.ctx.db.backup_to(path)
        except OSError as exc:
            QMessageBox.warning(self, "백업 실패", str(exc))
            return
        QMessageBox.information(self, "완료", f"{path} 에 저장했습니다.")

    def restore(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, "백업 열기", "", "ZIP (*.zip)")
        if not path:
            return
        confirm = QMessageBox.question(
            self, "복원",
            "지금 기록을 백업 내용으로 덮어씁니다. 되돌릴 수 없습니다. 계속할까요?",
            QMessageBox.Yes | QMessageBox.No, QMessageBox.No,
        )
        if confirm != QMessageBox.Yes:
            return
        try:
            restored = self.ctx.db.restore_from(Path(path))
        except (OSError, ValueError) as exc:
            QMessageBox.warning(self, "복원 실패", str(exc))
            return

        self.ctx.settings = settings_module.load()
        self.ctx.db.use_profile(self.ctx.settings.profile)
        self.ctx.bus.everything_changed()
        self.refresh()
        QMessageBox.information(self, "완료", f"복원했습니다: {', '.join(restored)}")

    def open_folder(self) -> None:
        import webbrowser

        folder = self.ctx.db.path.parent
        folder.mkdir(parents=True, exist_ok=True)
        webbrowser.open(folder.as_uri())

    # --- 목록 비우기 ---------------------------------------------------
    def clear_favorites(self) -> None:
        self.ctx.settings.favorites.clear()
        self.ctx.save_settings()
        self.refresh()

    def clear_recent(self) -> None:
        self.ctx.settings.recent_calculations.clear()
        self.ctx.save_settings()
        self.refresh()
