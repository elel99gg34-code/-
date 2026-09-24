"""인벤토리 — 내가 가진 펫 관리. 펜 빌더와 도감 완성도의 입력이 된다."""
from __future__ import annotations

from PySide6.QtWidgets import (
    QCheckBox,
    QComboBox,
    QDoubleSpinBox,
    QFileDialog,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from ...core import fmt, income
from .. import theme, widgets
from ..context import AppContext

HEADERS = ["id", "펫", "등급", "바이옴", "뮤테이션", "무게배수", "수량", "장착",
           "1마리 $/s", "합계 $/s", "메모"]


class InventoryTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx

        self.pet_picker = QComboBox()
        self.mutation_picker = QComboBox()
        self.weight_input = QDoubleSpinBox()
        self.weight_input.setRange(0.01, 1_000_000.0)
        self.weight_input.setDecimals(2)
        self.weight_input.setValue(1.0)
        self.weight_input.setSuffix(" 배")
        self.quantity_input = QSpinBox()
        self.quantity_input.setRange(1, 9999)
        self.quantity_input.setValue(1)
        self.quantity_input.setSuffix(" 마리")
        self.equipped_input = QCheckBox("바로 장착")
        self.note_input = QLineEdit()
        self.note_input.setPlaceholderText("메모 (선택)")

        add_button = QPushButton("추가")
        add_button.setProperty("accent", "true")
        add_button.clicked.connect(self.add_item)

        equip_button = QPushButton("장착 토글")
        equip_button.clicked.connect(self.toggle_equipped)
        delete_button = QPushButton("삭제")
        delete_button.clicked.connect(self.delete_selected)
        export_button = QPushButton("CSV 내보내기")
        export_button.clicked.connect(self.export_csv)
        import_button = QPushButton("CSV 가져오기")
        import_button.clicked.connect(self.import_csv)
        clear_button = QPushButton("전체 삭제")
        clear_button.clicked.connect(self.clear_all)

        self.summary = widgets.metric("—")
        self.equipped_summary = widgets.hint("")
        self.table = widgets.make_table(HEADERS, stretch_column=10, min_rows=14)

        entry = widgets.form()
        entry.addRow("펫", self.pet_picker)
        entry.addRow("뮤테이션", self.mutation_picker)
        entry.addRow("무게 배수", self.weight_input)
        entry.addRow("수량", self.quantity_input)
        entry.addRow("", self.equipped_input)
        entry.addRow("메모", self.note_input)

        summary_form = widgets.form()
        summary_form.addRow("보유 현황", self.summary)
        summary_form.addRow("", self.equipped_summary)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("펫 추가", entry))
        layout.addWidget(widgets.row(add_button, equip_button, delete_button,
                                     export_button, import_button, clear_button))
        layout.addWidget(widgets.group("요약", summary_form))
        layout.addWidget(widgets.group("보유 목록", self.table))
        layout.addWidget(widgets.hint(
            "여기 넣은 펫이 [펜 빌더]에서 최적 조합 계산에 쓰이고, [도감 완성도]의 보유 판정에도 "
            "반영됩니다. 무게 배수는 '기본 무게의 몇 배'입니다."
        ))

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        ctx.bus.dataset_changed.connect(self.reload_pickers)
        ctx.bus.profile_changed.connect(self.refresh)
        self.reload_pickers()
        self.refresh()

    # ------------------------------------------------------------------
    def reload_pickers(self) -> None:
        data = self.ctx.dataset
        self.pet_picker.clear()
        for pet in sorted(data.pets, key=lambda p: (data.biome_order(p.biome), p.ko)):
            suffix = f"  ·  {fmt.compact(pet.income)}/s" if pet.has_income else ""
            self.pet_picker.addItem(f"{pet.ko}{suffix}", pet.name)

        self.mutation_picker.clear()
        for mutation in sorted(data.mutations, key=lambda m: m.multiplier):
            self.mutation_picker.addItem(mutation.label, mutation.name)

    def add_item(self) -> None:
        pet_name = self.pet_picker.currentData()
        if not pet_name:
            return
        self.ctx.inventory.add(
            pet=pet_name,
            mutation=self.mutation_picker.currentData() or "None",
            weight_ratio=self.weight_input.value(),
            quantity=self.quantity_input.value(),
            equipped=self.equipped_input.isChecked(),
            note=self.note_input.text().strip(),
        )
        self.note_input.clear()
        self.quantity_input.setValue(1)
        self.ctx.bus.inventory_changed.emit()
        self.refresh()

    def _selected_id(self) -> int | None:
        row = self.table.currentRow()
        if row < 0:
            return None
        item = self.table.item(row, 0)
        return int(item.text()) if item else None

    def toggle_equipped(self) -> None:
        item_id = self._selected_id()
        if item_id is None:
            return
        inventory = self.ctx.inventory
        current = next((i for i in inventory.all() if i.id == item_id), None)
        if current is None:
            return
        inventory.update(item_id, equipped=not current.equipped)
        self.ctx.bus.inventory_changed.emit()
        self.refresh()

    def delete_selected(self) -> None:
        item_id = self._selected_id()
        if item_id is None:
            return
        self.ctx.inventory.delete(item_id)
        self.ctx.bus.inventory_changed.emit()
        self.refresh()

    def clear_all(self) -> None:
        inventory = self.ctx.inventory
        if inventory.count() == 0:
            return
        confirm = QMessageBox.question(
            self, "전체 삭제",
            f"보유 목록 {inventory.count()}건을 모두 지웁니다. 되돌릴 수 없습니다. 계속할까요?",
            QMessageBox.Yes | QMessageBox.No, QMessageBox.No,
        )
        if confirm == QMessageBox.Yes:
            inventory.clear()
            self.ctx.bus.inventory_changed.emit()
            self.refresh()

    def export_csv(self) -> None:
        path, _ = QFileDialog.getSaveFileName(self, "CSV 내보내기", "inventory.csv", "CSV (*.csv)")
        if not path:
            return
        try:
            self.ctx.inventory.export_csv(path)
        except OSError as exc:
            QMessageBox.warning(self, "내보내기 실패", str(exc))
            return
        QMessageBox.information(self, "완료", f"{path} 에 저장했습니다.")

    def import_csv(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, "CSV 가져오기", "", "CSV (*.csv)")
        if not path:
            return
        try:
            added = self.ctx.inventory.import_csv(path)
        except (OSError, ValueError, UnicodeDecodeError) as exc:
            QMessageBox.warning(self, "가져오기 실패", str(exc))
            return
        self.ctx.bus.inventory_changed.emit()
        self.refresh()
        QMessageBox.information(self, "완료", f"{added}건을 추가했습니다.")

    # ------------------------------------------------------------------
    def refresh(self) -> None:
        data = self.ctx.dataset
        inventory = self.ctx.inventory
        items = inventory.all()

        rows = []
        equipped_income = 0.0
        for item in items:
            pet = data.pet(item.pet)
            rarity = data.rarity(pet.rarity) if pet else None
            biome = data.biome(pet.biome) if pet else None
            mutation = data.mutation(item.mutation)
            multiplier = mutation.multiplier if mutation else 1.0

            actual = (
                income.compute(pet.income, item.weight_ratio, multiplier, data.income_model).total
                if pet and pet.income is not None else None
            )
            if item.equipped and actual:
                equipped_income += actual * item.quantity

            rows.append([
                widgets.cell(str(item.id), align_right=True),
                widgets.cell(pet.ko if pet else item.pet,
                             color=rarity.color if rarity else None),
                widgets.cell(rarity.ko if rarity else "", color=rarity.color if rarity else None),
                widgets.cell(biome.ko if biome else (pet.biome if pet else "")),
                widgets.cell(mutation.ko if mutation else item.mutation,
                             color=theme.GOOD if multiplier > 1 else None),
                widgets.cell(f"{item.weight_ratio:g}", align_right=True),
                widgets.cell(f"{item.quantity}", align_right=True),
                widgets.cell("✔" if item.equipped else "", color=theme.GOOD),
                widgets.cell(fmt.compact(actual), align_right=True),
                widgets.cell(fmt.compact(actual * item.quantity if actual else None),
                             align_right=True, color=theme.ACCENT),
                widgets.cell(item.note),
            ])
        widgets.fill_table(self.table, rows)

        self.summary.setText(
            f"{inventory.total_quantity():,}마리 · 서로 다른 {len(inventory.distinct_pets())}종"
        )
        equipped_count = sum(i.quantity for i in items if i.equipped)
        self.equipped_summary.setText(
            f"장착 {equipped_count}마리 · 장착 총수입 {fmt.money(equipped_income)}/초"
        )
