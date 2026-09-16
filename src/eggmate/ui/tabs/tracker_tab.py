"""부화 기록 - 내가 직접 입력한 결과로 내 실제 확률을 재는 탭.

게임 프로세스를 읽거나 자동으로 수집하지 않는다. 전부 수동 입력이고,
데이터는 내 PC 안의 SQLite 파일에만 저장된다.
"""
from __future__ import annotations

from PySide6.QtWidgets import (
    QComboBox,
    QDoubleSpinBox,
    QFileDialog,
    QHBoxLayout,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from ...core import odds
from ...core.models import Dataset
from ...core.storage import HatchLog
from .. import theme, widgets

ANY = "(선택 안 함)"


class TrackerTab(QWidget):
    def __init__(self, dataset: Dataset, log: HatchLog) -> None:
        super().__init__()
        self.dataset = dataset
        self.log = log

        self.pet_input = QComboBox()
        self.pet_input.setEditable(True)
        self.pet_input.addItem("")
        for pet in sorted(dataset.pets, key=lambda p: (dataset.biome_order(p.biome), p.ko)):
            self.pet_input.addItem(pet.ko, pet.name)

        self.rarity_input = QComboBox()
        self.rarity_input.addItem(ANY, "")
        for rarity in sorted(dataset.rarities, key=lambda r: r.order):
            self.rarity_input.addItem(rarity.ko, rarity.name)

        self.biome_input = QComboBox()
        self.biome_input.addItem(ANY, "")
        for biome in sorted(dataset.biomes, key=lambda b: b.order):
            self.biome_input.addItem(biome.ko, biome.name)

        self.mutation_input = QComboBox()
        for mutation in sorted(dataset.mutations, key=lambda m: m.multiplier):
            self.mutation_input.addItem(mutation.ko, mutation.name)

        self.weight_input = QDoubleSpinBox()
        self.weight_input.setRange(0.0, 1_000_000.0)
        self.weight_input.setDecimals(2)
        self.weight_input.setSpecialValueText("기록 안 함")
        self.weight_input.setSuffix(" kg")

        self.note_input = QLineEdit()
        self.note_input.setPlaceholderText("메모 (선택)")

        add_button = QPushButton("기록 추가")
        add_button.setProperty("accent", "true")
        add_button.clicked.connect(self.add_record)

        delete_button = QPushButton("선택 기록 삭제")
        delete_button.clicked.connect(self.delete_selected)

        export_button = QPushButton("CSV 내보내기")
        export_button.clicked.connect(self.export_csv)

        clear_button = QPushButton("전체 삭제")
        clear_button.clicked.connect(self.clear_all)

        self.pet_input.currentIndexChanged.connect(self._autofill_from_pet)

        self.total_label = widgets.big("0")
        self.summary = widgets.hint("")
        self.stats_table = widgets.make_table(
            ["등급", "횟수", "내 실측 비율", "95% 신뢰구간", "연속 꽝"], min_rows=7
        )
        self.records_table = widgets.make_table(
            ["id", "시각", "펫", "등급", "바이옴", "뮤테이션", "무게", "메모"], stretch_column=7, min_rows=10
        )

        entry = widgets.form()
        entry.addRow("펫", self.pet_input)
        entry.addRow("등급", self.rarity_input)
        entry.addRow("바이옴", self.biome_input)
        entry.addRow("뮤테이션", self.mutation_input)
        entry.addRow("무게", self.weight_input)
        entry.addRow("메모", self.note_input)

        buttons = QWidget()
        button_row = QHBoxLayout(buttons)
        button_row.setContentsMargins(0, 0, 0, 0)
        button_row.addWidget(add_button)
        button_row.addWidget(delete_button)
        button_row.addWidget(export_button)
        button_row.addStretch(1)
        button_row.addWidget(clear_button)

        summary_box = widgets.form()
        summary_box.addRow("총 부화 기록", self.total_label)
        summary_box.addRow("", self.summary)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("새 기록", entry))
        layout.addWidget(buttons)
        layout.addWidget(widgets.group("요약", summary_box))
        layout.addWidget(widgets.group("등급별 실측", self.stats_table))
        layout.addWidget(widgets.group("기록", self.records_table))
        layout.addWidget(widgets.hint(
            "실측 비율은 표본이 적으면 심하게 흔들립니다. 95% 신뢰구간이 넓다면 아직 "
            "'내 확률'을 말하기엔 표본이 부족하다는 뜻입니다. 이 기록은 내 PC에만 저장되며 "
            "게임이나 외부 서버로 전송되지 않습니다."
        ))

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.refresh()

    def _autofill_from_pet(self) -> None:
        """펫을 고르면 등급/바이옴을 자동으로 채운다."""
        name = self.pet_input.currentData()
        if not name:
            return
        pet = self.dataset.pet(name)
        if not pet:
            return
        rarity_index = self.rarity_input.findData(pet.rarity)
        if rarity_index >= 0:
            self.rarity_input.setCurrentIndex(rarity_index)
        biome_index = self.biome_input.findData(pet.biome)
        if biome_index >= 0:
            self.biome_input.setCurrentIndex(biome_index)

    def add_record(self) -> None:
        pet_name = self.pet_input.currentData() or self.pet_input.currentText().strip()
        weight = self.weight_input.value()
        self.log.add(
            pet=pet_name,
            rarity=self.rarity_input.currentData() or "",
            biome=self.biome_input.currentData() or "",
            mutation=self.mutation_input.currentData() or "None",
            weight=None if weight <= 0 else weight,
            note=self.note_input.text().strip(),
        )
        self.note_input.clear()
        self.weight_input.setValue(0.0)
        self.refresh()

    def delete_selected(self) -> None:
        row = self.records_table.currentRow()
        if row < 0:
            return
        item = self.records_table.item(row, 0)
        if item is None:
            return
        self.log.delete(int(item.text()))
        self.refresh()

    def clear_all(self) -> None:
        if self.log.count() == 0:
            return
        confirm = QMessageBox.question(
            self,
            "전체 삭제",
            f"기록 {self.log.count()}건을 모두 지웁니다. 되돌릴 수 없습니다. 계속할까요?",
            QMessageBox.Yes | QMessageBox.No,
            QMessageBox.No,
        )
        if confirm == QMessageBox.Yes:
            self.log.clear()
            self.refresh()

    def export_csv(self) -> None:
        path, _ = QFileDialog.getSaveFileName(self, "CSV 내보내기", "hatches.csv", "CSV (*.csv)")
        if not path:
            return
        try:
            self.log.export_csv(path)
        except OSError as exc:
            QMessageBox.warning(self, "내보내기 실패", str(exc))
            return
        QMessageBox.information(self, "완료", f"{path} 에 저장했습니다.")

    def refresh(self) -> None:
        total = self.log.count()
        self.total_label.setText(f"{total:,}")

        by_rarity = self.log.counts_by("rarity")
        by_mutation = self.log.counts_by("mutation")
        mutated = sum(count for name, count in by_mutation.items() if name and name != "None")
        if total:
            self.summary.setText(
                f"뮤테이션이 붙은 기록 {mutated}건 ({mutated / total:.1%}) · "
                f"서로 다른 펫 {len(self.log.counts_by('pet'))}종"
            )
        else:
            self.summary.setText("아직 기록이 없습니다. 부화할 때마다 한 줄씩 남겨 보세요.")

        stat_rows = []
        for rarity in sorted(self.dataset.rarities, key=lambda r: r.order):
            count = by_rarity.get(rarity.name, 0)
            if count == 0 and rarity.order <= 4:
                continue  # 하위 등급은 기록이 없으면 굳이 보여주지 않는다
            low, high = odds.wilson_interval(count, total) if total else (0.0, 1.0)
            ratio = (count / total) if total else 0.0
            width = high - low
            stat_rows.append([
                widgets.cell(rarity.ko, color=rarity.color),
                widgets.cell(f"{count:,}", align_right=True),
                widgets.cell(f"{ratio:.3%}" if total else "—", align_right=True),
                widgets.cell(
                    f"{low:.3%} ~ {high:.3%}" if total else "—",
                    align_right=True,
                    color=theme.WARN if width > 0.05 else theme.TEXT_DIM,
                ),
                widgets.cell(f"{self.log.dry_streak({rarity.name}):,}", align_right=True),
            ])
        widgets.fill_table(self.stats_table, stat_rows)

        record_rows = []
        for record in self.log.all(limit=500):
            rarity = self.dataset.rarity(record.rarity)
            pet = self.dataset.pet(record.pet)
            mutation = self.dataset.mutation(record.mutation)
            record_rows.append([
                widgets.cell(str(record.id), align_right=True),
                widgets.cell(record.created_at.replace("T", " ")[:19]),
                widgets.cell(pet.ko if pet else record.pet),
                widgets.cell(rarity.ko if rarity else record.rarity,
                             color=rarity.color if rarity else None),
                widgets.cell(
                    (self.dataset.biome(record.biome).ko
                     if self.dataset.biome(record.biome) else record.biome)
                ),
                widgets.cell(mutation.ko if mutation else record.mutation),
                widgets.cell("" if record.weight is None else f"{record.weight:g}", align_right=True),
                widgets.cell(record.note),
            ])
        widgets.fill_table(self.records_table, record_rows)
