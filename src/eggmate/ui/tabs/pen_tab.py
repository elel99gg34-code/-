"""펜 빌더 — 슬롯이 제한된 상태에서 뭘 끼울지 정한다."""
from __future__ import annotations

from PySide6.QtWidgets import QComboBox, QPushButton, QSpinBox, QVBoxLayout, QWidget

from ...core import fmt
from ...core.pen import (
    Candidate,
    build,
    candidates_from_inventory,
    evaluate_swap,
    inventory_id,
    slot_value_curve,
)
from .. import theme, widgets
from ..context import AppContext

SOURCE_INVENTORY = "내 인벤토리"
SOURCE_DATASET = "도감 전체 (이론상 최고)"


class PenTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        self._plan = None

        self.source = QComboBox()
        self.source.addItems([SOURCE_INVENTORY, SOURCE_DATASET])

        self.slots = QSpinBox()
        self.slots.setRange(1, 200)
        self.slots.setValue(6)
        self.slots.setSuffix(" 슬롯")

        self.total = widgets.big("—")
        self.detail = widgets.hint("")
        self.next_slot = widgets.metric("—")

        apply_button = QPushButton("이 조합으로 장착 저장")
        apply_button.setProperty("accent", "true")
        apply_button.clicked.connect(self.apply_plan)
        apply_button.setToolTip("계산된 최적 조합을 인벤토리의 장착 상태로 기록합니다.")
        self.apply_button = apply_button

        self.copy_button = widgets.copy_button(self._plan_as_text, "조합 복사")

        self.equipped_table = widgets.make_table(
            ["순위", "펫", "뮤테이션", "무게", "수입 $/s", "비중"], min_rows=10
        )
        self.bench_table = widgets.make_table(["펫", "뮤테이션", "수입 $/s", "차이"], min_rows=6)
        self.curve_table = widgets.make_table(["슬롯", "총 수입 $/s", "이 슬롯이 더해 주는 값"], min_rows=8)

        self.swap_out = QComboBox()
        self.swap_in = QComboBox()
        self.swap_result = widgets.metric("—")

        controls = widgets.form()
        controls.addRow("후보 출처", self.source)
        controls.addRow("장착 가능 슬롯", self.slots)
        controls.addRow("총 수입", self.total)
        controls.addRow("", self.detail)
        controls.addRow("슬롯 +1 의 가치", self.next_slot)

        swap_form = widgets.form()
        swap_form.addRow("빼는 펫", self.swap_out)
        swap_form.addRow("넣는 펫", self.swap_in)
        swap_form.addRow("변화", self.swap_result)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("설정", controls))
        layout.addWidget(widgets.row(apply_button, self.copy_button))
        layout.addWidget(widgets.group("장착 — 최적 조합", self.equipped_table))
        layout.addWidget(widgets.group("벤치 — 못 끼운 펫", self.bench_table))
        layout.addWidget(widgets.group("슬롯을 늘리면 얼마나 이득인가", self.curve_table))
        layout.addWidget(widgets.group("교체 시뮬레이션", swap_form))
        layout.addWidget(widgets.hint(
            "펫 하나가 슬롯 하나를 쓰고 수입은 서로 독립이라, '수입 높은 순으로 슬롯 수만큼'이 "
            "수학적으로 정확한 최적해입니다. 배낭 문제가 아니라 정렬 문제라서 항상 최적이 나옵니다."
        ))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.source.currentIndexChanged.connect(self.recalculate)
        self.slots.valueChanged.connect(self.recalculate)
        self.swap_out.currentIndexChanged.connect(self._update_swap)
        self.swap_in.currentIndexChanged.connect(self._update_swap)
        ctx.bus.inventory_changed.connect(self.recalculate)
        ctx.bus.dataset_changed.connect(self.recalculate)
        ctx.bus.profile_changed.connect(self.recalculate)
        self.recalculate()

    # ------------------------------------------------------------------
    def _candidates(self) -> list[Candidate]:
        data = self.ctx.dataset
        if self.source.currentText() == SOURCE_DATASET:
            return [
                Candidate(key=p.name, pet=p.name, label=p.ko, base_income=p.income or 0.0)
                for p in data.pets_with_income
            ]

        return candidates_from_inventory(data, self.ctx.inventory.all())

    def recalculate(self) -> None:
        model = self.ctx.dataset.income_model
        candidates = self._candidates()
        plan = build(candidates, self.slots.value(), model)
        self._plan = plan

        from_inventory = self.source.currentText() == SOURCE_INVENTORY
        self.apply_button.setEnabled(from_inventory and bool(plan.equipped))

        if not candidates:
            self.total.setText("후보 없음")
            self.detail.setText(
                "인벤토리가 비어 있습니다. [인벤토리] 탭에서 가진 펫을 넣거나, "
                "출처를 '도감 전체'로 바꿔 이론상 최고 조합을 보세요."
            )
        else:
            self.total.setText(fmt.money(plan.total_income) + " /초")
            self.detail.setText(
                f"후보 {len(candidates)}마리 중 {len(plan.equipped)}마리 장착 · "
                f"시간당 {fmt.compact(plan.total_income * 3600)} · "
                f"하루 {fmt.compact(plan.total_income * 86400)}"
            )

        if plan.next_slot_gain > 0:
            share = plan.next_slot_gain / plan.total_income if plan.total_income else 0
            # 0.05% 같은 값이 '0.0%' 로 뭉개지지 않게 아주 작은 비중은 따로 표기한다.
            share_text = f"{share:.1%}" if share >= 0.001 else "0.1% 미만"
            self.next_slot.setText(
                f"+{fmt.compact(plan.next_slot_gain)}/s  (현재 수입의 {share_text})"
            )
            widgets.set_role(self.next_slot, "good" if share > 0.05 else "metric")
        else:
            self.next_slot.setText("벤치가 비어 슬롯을 늘려도 이득이 없습니다")
            widgets.set_role(self.next_slot, "hint")

        self._fill_equipped(plan, model)
        self._fill_bench(plan, model)
        self._fill_curve(candidates, model)
        self._reload_swap_pickers(plan, candidates)

    def _fill_equipped(self, plan, model) -> None:
        rows = []
        for rank, candidate in enumerate(plan.equipped, start=1):
            value = candidate.income(model)
            share = (value / plan.total_income) if plan.total_income else 0.0
            rows.append([
                widgets.cell(f"{rank}", align_right=True),
                widgets.cell(candidate.label),
                widgets.cell(candidate.mutation if candidate.mutation != "None" else "—",
                             color=theme.GOOD if candidate.mutation_multiplier > 1 else None),
                widgets.cell(f"×{candidate.weight_ratio:g}", align_right=True),
                widgets.cell(fmt.compact(value), align_right=True),
                widgets.cell(f"{share:.1%}", align_right=True,
                             color=theme.WARN if share > 0.5 else None),
            ])
        widgets.fill_table(self.equipped_table, rows)

    def _fill_bench(self, plan, model) -> None:
        weakest = plan.weakest_equipped.income(model) if plan.weakest_equipped else 0.0
        rows = []
        for candidate in plan.benched[:40]:
            value = candidate.income(model)
            gap = value - weakest
            rows.append([
                widgets.cell(candidate.label),
                widgets.cell(candidate.mutation if candidate.mutation != "None" else "—"),
                widgets.cell(fmt.compact(value), align_right=True),
                widgets.cell(
                    f"{'+' if gap >= 0 else ''}{fmt.compact(gap)}", align_right=True,
                    color=theme.GOOD if gap > 0 else theme.TEXT_DIM,
                ),
            ])
        widgets.fill_table(self.bench_table, rows)

    def _fill_curve(self, candidates, model) -> None:
        upper = min(30, max(self.slots.value() + 4, 8))
        rows = []
        for slot, total, gain in slot_value_curve(candidates, upper, model):
            rows.append([
                widgets.cell(f"{slot}", align_right=True,
                             color=theme.ACCENT if slot == self.slots.value() else None),
                widgets.cell(fmt.compact(total), align_right=True),
                widgets.cell(f"+{fmt.compact(gain)}" if gain else "—", align_right=True,
                             color=theme.TEXT_DIM if not gain else None),
            ])
        widgets.fill_table(self.curve_table, rows)

    def _reload_swap_pickers(self, plan, candidates) -> None:
        for picker in (self.swap_out, self.swap_in):
            picker.blockSignals(True)
            picker.clear()

        for candidate in plan.equipped:
            self.swap_out.addItem(candidate.label, candidate.key)
        for candidate in plan.benched[:60]:
            self.swap_in.addItem(candidate.label, candidate.key)

        for picker in (self.swap_out, self.swap_in):
            picker.blockSignals(False)
        self._candidate_index = {c.key: c for c in candidates}
        self._update_swap()

    def _update_swap(self) -> None:
        if self._plan is None:
            return
        out_key = self.swap_out.currentData()
        in_key = self.swap_in.currentData()
        incoming = getattr(self, "_candidate_index", {}).get(in_key)
        if not out_key or incoming is None:
            self.swap_result.setText("교체할 펫을 고르세요")
            widgets.set_role(self.swap_result, "hint")
            return

        result = evaluate_swap(self._plan, out_key, incoming, self.ctx.dataset.income_model)
        if result is None:
            self.swap_result.setText("—")
            return
        sign = "+" if result.delta >= 0 else ""
        self.swap_result.setText(
            f"{sign}{fmt.compact(result.delta)}/s — "
            f"{'이득' if result.worth_it else '손해라 하지 마세요'}"
        )
        widgets.set_role(self.swap_result, "good" if result.worth_it else "bad")

    def apply_plan(self) -> None:
        if self._plan is None:
            return
        ids = {inventory_id(c.key) for c in self._plan.equipped}
        ids.discard(None)
        self.ctx.inventory.set_equipped(ids)
        self.ctx.bus.inventory_changed.emit()

    def _plan_as_text(self) -> str:
        if self._plan is None or not self._plan.equipped:
            return ""
        model = self.ctx.dataset.income_model
        lines = [f"EggMate 펜 조합 ({len(self._plan.equipped)}슬롯)",
                 f"총 수입: {fmt.compact(self._plan.total_income)}/s", ""]
        for rank, candidate in enumerate(self._plan.equipped, start=1):
            mutation = "" if candidate.mutation == "None" else f" [{candidate.mutation}]"
            lines.append(
                f"{rank}. {candidate.label}{mutation} ×{candidate.weight_ratio:g}"
                f" — {fmt.compact(candidate.income(model))}/s"
            )
        return "\n".join(lines)
