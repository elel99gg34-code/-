"""수입 계산기 - 무게와 뮤테이션을 반영한 실제 $/s."""
from __future__ import annotations

from PySide6.QtWidgets import QComboBox, QDoubleSpinBox, QPushButton, QVBoxLayout, QWidget

from ...core import fmt, income
from .. import theme, widgets
from ..context import AppContext

CUSTOM = "— 직접 입력 —"


class IncomeTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        dataset = ctx.dataset
        self.dataset = dataset
        self.model = dataset.income_model

        self.pet_picker = QComboBox()
        self.pet_picker.addItem(CUSTOM, None)
        for pet in sorted(dataset.pets_with_income, key=lambda p: p.income, reverse=True):
            self.pet_picker.addItem(f"{pet.ko}  ·  {fmt.compact(pet.income)}/s", pet.name)

        self.base_input = widgets.AmountEdit("예: 22000, 1.8b", "1000")

        self.ratio_input = QDoubleSpinBox()
        self.ratio_input.setRange(0.01, 1_000_000.0)
        self.ratio_input.setDecimals(2)
        self.ratio_input.setValue(1.0)
        self.ratio_input.setSuffix(" 배")

        self.mutation_picker = QComboBox()
        for mutation in sorted(dataset.mutations, key=lambda m: m.multiplier):
            self.mutation_picker.addItem(mutation.label, mutation.multiplier)

        self.pen_count = QDoubleSpinBox()
        self.pen_count.setRange(1, 200)
        self.pen_count.setDecimals(0)
        self.pen_count.setValue(1)
        self.pen_count.setSuffix(" 마리")

        self.result = widgets.big()
        self.per_minute = widgets.metric()
        self.per_hour = widgets.metric()
        self.breakdown = widgets.hint("")
        self.pen_total = widgets.metric()

        self.target_input = widgets.AmountEdit("목표 $/s (예: 1m)")
        self.target_answer = widgets.hint("목표 수입을 입력하면 필요한 무게 배수를 역산합니다.")

        self.compare_table = widgets.make_table(
            ["뮤테이션", "수입 $/s", "무뮤테이션 대비"], min_rows=8
        )

        inputs = widgets.form()
        inputs.addRow("펫 선택", self.pet_picker)
        inputs.addRow("기본 수입 $/s", self.base_input)
        inputs.addRow("무게 배수", self.ratio_input)
        inputs.addRow("뮤테이션", self.mutation_picker)
        inputs.addRow("펜에 넣을 마리 수", self.pen_count)

        results = widgets.form()
        results.addRow("실제 수입", self.result)
        results.addRow("분당", self.per_minute)
        results.addRow("시간당", self.per_hour)
        results.addRow(f"펜 합계", self.pen_total)
        results.addRow("계산 근거", self.breakdown)

        reverse = widgets.form()
        reverse.addRow("목표 수입", self.target_input)
        reverse.addRow("", self.target_answer)

        self.copy_button = widgets.copy_button(self._as_text, "결과 복사")
        self.save_button = QPushButton("최근 계산에 저장")
        self.save_button.clicked.connect(self._remember)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("입력", inputs))
        layout.addWidget(widgets.group("결과", results))
        layout.addWidget(widgets.row(self.copy_button, self.save_button))
        layout.addWidget(widgets.group("역산 — 이 수입을 내려면 무게가 얼마나 필요한가", reverse))
        layout.addWidget(widgets.group("뮤테이션별 비교", widgets.column(self.compare_table)))
        layout.addWidget(widgets.hint(
            "무게 배수 = 실제 무게 ÷ 그 펫의 기본 무게. 게임이 쓰는 공식은 "
            "125배 미만에서 r^(37/60), 이상에서 125^(13/60)·r^(2/5) 입니다. "
            "즉 무거울수록 이득이지만 증가폭은 점점 줄어듭니다."
        ))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.pet_picker.currentIndexChanged.connect(self._on_pet_selected)
        for control in (self.base_input, self.ratio_input, self.mutation_picker,
                        self.pen_count, self.target_input):
            widgets.debounce_connect(control, self.recalculate)
        self.recalculate()

    def _on_pet_selected(self) -> None:
        name = self.pet_picker.currentData()
        if name:
            pet = self.dataset.pet(name)
            if pet and pet.income is not None:
                self.base_input.setText(fmt.compact(pet.income))
        self.recalculate()

    def recalculate(self) -> None:
        base = self.base_input.value(default=0.0) or 0.0
        ratio = self.ratio_input.value()
        mutation = self.mutation_picker.currentData() or 1.0

        result = income.compute(base, ratio, mutation, self.model)
        self.result.setText(fmt.money(result.total) + " /초")
        self.per_minute.setText(fmt.money(result.total * 60))
        self.per_hour.setText(fmt.money(result.total * 3600))

        pen = int(self.pen_count.value())
        self.pen_total.setText(f"{fmt.money(result.total * pen)} /초  ({pen}마리 동일 구성 기준)")

        curve = "125배 미만 구간 r^(37/60)" if result.curve == "low" \
            else "125배 이상 구간 125^(13/60)·r^(2/5)"
        self.breakdown.setText(
            f"기본 {fmt.compact(base)}  ×  무게 {result.weight_multiplier:,.3f}배  "
            f"×  뮤테이션 {mutation:g}배  =  총 {result.total_multiplier:,.3f}배\n{curve}"
        )

        self._update_comparison(base, ratio)
        self._update_reverse(base, mutation)

    def _update_comparison(self, base: float, ratio: float) -> None:
        pairs = [(m.ko, m.multiplier) for m in self.dataset.mutations]
        rows = []
        for name, total, gain in income.compare_mutations(base, ratio, pairs, self.model):
            rows.append([
                widgets.cell(name),
                widgets.cell(fmt.compact(total), align_right=True),
                widgets.cell(f"×{gain:.2f}", align_right=True,
                             color=theme.GOOD if gain > 1 else theme.TEXT_DIM),
            ])
        widgets.fill_table(self.compare_table, rows)

    def _update_reverse(self, base: float, mutation: float) -> None:
        target = self.target_input.value()
        if target is None:
            self.target_answer.setText("목표 수입을 입력하면 필요한 무게 배수를 역산합니다.")
            return
        needed = income.ratio_for_target(base, target, mutation, self.model)
        if needed is None:
            self.target_answer.setText("기본 수입과 목표를 0보다 크게 입력하세요.")
            return
        if needed <= 1.0:
            self.target_answer.setText(
                f"기본 무게({fmt.compact(base * mutation)}/s)만으로 이미 목표를 넘습니다."
            )
            return
        self.target_answer.setText(
            f"기본 무게의 약 {needed:,.1f}배가 필요합니다. "
            f"(현재 설정 {self.ratio_input.value():,.2f}배)"
        )

    # ------------------------------------------------------------------
    def _as_text(self) -> str:
        base = self.base_input.value(default=0.0) or 0.0
        ratio = self.ratio_input.value()
        mutation = self.mutation_picker.currentData() or 1.0
        result = income.compute(base, ratio, mutation, self.model)
        return (
            f"EggMate 수입 계산\n"
            f"기본 {fmt.compact(base)}/s × 무게 {ratio:g}배 × 뮤테이션 {mutation:g}배\n"
            f"= {fmt.compact(result.total)}/s  "
            f"(분당 {fmt.compact(result.total * 60)}, 시간당 {fmt.compact(result.total * 3600)})"
        )

    def _remember(self) -> None:
        self.ctx.settings.remember_calculation(
            "수입", self._as_text().splitlines()[-1].strip()
        )
        self.ctx.save_settings()
