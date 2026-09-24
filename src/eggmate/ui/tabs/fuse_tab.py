"""퓨즈 판단기 - 같은 펫 3마리를 합칠지 말지."""
from __future__ import annotations

from PySide6.QtWidgets import QCheckBox, QComboBox, QDoubleSpinBox, QVBoxLayout, QWidget

from ...core import fmt, fuse
from .. import theme, widgets
from ..context import AppContext

CUSTOM = "— 직접 입력 —"


class FuseTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        dataset = ctx.dataset
        self.dataset = dataset

        self.input_pet = self._pet_combo()
        self.result_pet = self._pet_combo()

        self.input_base = widgets.AmountEdit("투입 펫 기본 $/s", "22000")
        self.result_base = widgets.AmountEdit("결과 펫 기본 $/s", "120000")

        self.input_ratio = self._ratio_spin()
        self.result_ratio = self._ratio_spin()

        self.input_mutation = self._mutation_combo()
        self.result_mutation = self._mutation_combo()

        self.cost = widgets.AmountEdit("퓨즈 수수료 (예: 5m)", "0")
        self.pen_full = QCheckBox("펜이 꽉 차 있음 (슬롯이 아쉬움)")

        self.verdict = widgets.big()
        self.before_label = widgets.metric()
        self.after_label = widgets.metric()
        self.delta_label = widgets.metric()
        self.payback_label = widgets.metric()
        self.reasons = widgets.hint("")

        before = widgets.form()
        before.addRow("투입 펫", self.input_pet)
        before.addRow("기본 수입", self.input_base)
        before.addRow("무게 배수", self.input_ratio)
        before.addRow("붙어 있는 뮤테이션", self.input_mutation)

        after = widgets.form()
        after.addRow("결과 펫", self.result_pet)
        after.addRow("기본 수입", self.result_base)
        after.addRow("무게 배수", self.result_ratio)
        after.addRow("기대 뮤테이션", self.result_mutation)

        extra = widgets.form()
        extra.addRow("퓨즈 비용", self.cost)
        extra.addRow("", self.pen_full)

        results = widgets.form()
        results.addRow("판정", self.verdict)
        results.addRow("퓨즈 전 (3마리 합)", self.before_label)
        results.addRow("퓨즈 후 (1마리)", self.after_label)
        results.addRow("수입 변화", self.delta_label)
        results.addRow("비용 회수", self.payback_label)
        results.addRow("근거", self.reasons)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("투입 — 완전히 같은 펫 3마리", before))
        layout.addWidget(widgets.group("결과 — 나올 펫 1마리", after))
        layout.addWidget(widgets.group("기타", extra))
        layout.addWidget(widgets.group("판정", results))
        layout.addWidget(widgets.hint(
            str(dataset.mechanics.get("fuse_machine", {}).get("mutation_loss", "")) + "\n" +
            str(dataset.mechanics.get("fuse_machine", {}).get("advice", ""))
        ))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.input_pet.currentIndexChanged.connect(
            lambda: self._sync_base(self.input_pet, self.input_base)
        )
        self.result_pet.currentIndexChanged.connect(
            lambda: self._sync_base(self.result_pet, self.result_base)
        )
        for control in (self.input_base, self.result_base, self.input_ratio, self.result_ratio,
                        self.input_mutation, self.result_mutation, self.cost, self.pen_full):
            widgets.debounce_connect(control, self.recalculate)
        self.recalculate()

    def _pet_combo(self) -> QComboBox:
        combo = QComboBox()
        combo.addItem(CUSTOM, None)
        for pet in sorted(self.dataset.pets_with_income, key=lambda p: p.income):
            combo.addItem(f"{pet.ko}  ·  {fmt.compact(pet.income)}/s", pet.name)
        return combo

    def _ratio_spin(self) -> QDoubleSpinBox:
        spin = QDoubleSpinBox()
        spin.setRange(0.01, 1_000_000.0)
        spin.setDecimals(2)
        spin.setValue(1.0)
        spin.setSuffix(" 배")
        return spin

    def _mutation_combo(self) -> QComboBox:
        combo = QComboBox()
        for mutation in sorted(self.dataset.mutations, key=lambda m: m.multiplier):
            combo.addItem(mutation.label, mutation.multiplier)
        return combo

    def _sync_base(self, combo: QComboBox, field: widgets.AmountEdit) -> None:
        name = combo.currentData()
        if name:
            pet = self.dataset.pet(name)
            if pet and pet.income is not None:
                field.setText(fmt.compact(pet.income))
        self.recalculate()

    def recalculate(self) -> None:
        verdict = fuse.evaluate(
            base_income=self.input_base.value(default=0.0) or 0.0,
            result_base_income=self.result_base.value(default=0.0) or 0.0,
            input_ratio=self.input_ratio.value(),
            result_ratio=self.result_ratio.value(),
            input_mutation=self.input_mutation.currentData() or 1.0,
            expected_result_mutation=self.result_mutation.currentData() or 1.0,
            cost=self.cost.value(default=0.0) or 0.0,
            pen_is_full=self.pen_full.isChecked(),
            model=self.dataset.income_model,
        )

        self.verdict.setText(verdict.verdict_ko)
        widgets.set_role(self.verdict, "big")
        self.verdict.setStyleSheet(
            f"color: {theme.GOOD if verdict.recommend else theme.BAD}; font-size: 26px; font-weight: 700;"
        )

        self.before_label.setText(f"{fmt.money(verdict.income_before)} /초")
        self.after_label.setText(f"{fmt.money(verdict.income_after)} /초")
        sign = "+" if verdict.delta >= 0 else ""
        self.delta_label.setText(f"{sign}{fmt.compact(verdict.delta)} /초")
        widgets.set_role(self.delta_label, "good" if verdict.delta > 0 else "bad")
        self.payback_label.setText(fmt.duration(verdict.payback_seconds))
        self.reasons.setText("\n".join(f"· {reason}" for reason in verdict.reasons))
