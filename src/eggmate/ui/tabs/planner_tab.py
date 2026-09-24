"""진행 플래너 - 스피드로 갈 수 있는 곳, 업그레이드 ROI, 목표 도달 시간."""
from __future__ import annotations

from PySide6.QtWidgets import QDoubleSpinBox, QVBoxLayout, QWidget

from ...core import fmt, planner
from ...core.planner import LOCKED, SAFE, TIGHT
from .. import theme, widgets
from ..context import AppContext

STATUS_COLOR = {SAFE: theme.GOOD, TIGHT: theme.WARN, LOCKED: theme.TEXT_DIM}


class PlannerTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        dataset = ctx.dataset
        self.dataset = dataset

        self.speed_input = widgets.AmountEdit("예: 250000, 1.5m, 7b", "10000")
        self.margin_input = QDoubleSpinBox()
        self.margin_input.setRange(1.0, 10.0)
        self.margin_input.setSingleStep(0.5)
        self.margin_input.setValue(ctx.settings.safety_margin)
        self.margin_input.setSuffix(" 배 안전 마진")

        self.next_goal = widgets.big()
        self.next_detail = widgets.hint("")

        self.biome_table = widgets.make_table(
            ["바이옴", "요구 스피드", "내 배율", "상태", "부족분", "안전선까지"], min_rows=11
        )
        self.best_pets = widgets.make_table(
            ["펫", "바이옴", "등급", "기본 수입 $/s"], min_rows=10
        )

        # --- ROI ---
        self.roi_cost = widgets.AmountEdit("업그레이드 비용 (예: 75m)", "1000")
        self.roi_before = widgets.AmountEdit("업그레이드 전 총 $/s", "100")
        self.roi_after = widgets.AmountEdit("업그레이드 후 총 $/s", "150")
        self.roi_result = widgets.metric()
        self.roi_detail = widgets.hint("")

        # --- 목표 ---
        self.goal_target = widgets.AmountEdit("목표 금액 (예: 75m)", "1000000")
        self.goal_current = widgets.AmountEdit("현재 보유 금액", "0")
        self.goal_income = widgets.AmountEdit("현재 총 $/s", "1000")
        self.goal_result = widgets.metric()

        speed_form = widgets.form()
        speed_form.addRow("내 스피드", self.speed_input)
        speed_form.addRow("안전 기준", self.margin_input)
        speed_form.addRow("다음 목표", self.next_goal)
        speed_form.addRow("", self.next_detail)

        roi_form = widgets.form()
        roi_form.addRow("비용", self.roi_cost)
        roi_form.addRow("전 수입", self.roi_before)
        roi_form.addRow("후 수입", self.roi_after)
        roi_form.addRow("회수 시간", self.roi_result)
        roi_form.addRow("", self.roi_detail)

        goal_form = widgets.form()
        goal_form.addRow("목표 금액", self.goal_target)
        goal_form.addRow("현재 보유", self.goal_current)
        goal_form.addRow("현재 수입", self.goal_income)
        goal_form.addRow("도달까지", self.goal_result)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("스피드", speed_form))
        layout.addWidget(widgets.group("바이옴 접근 판정", self.biome_table))
        layout.addWidget(widgets.group("지금 노릴 수 있는 최고 수입 펫", self.best_pets))
        layout.addWidget(widgets.group("업그레이드 회수 계산 (ROI)", roi_form))
        layout.addWidget(widgets.group("목표 금액 도달 시간", goal_form))
        layout.addWidget(widgets.hint(
            str(dataset.mechanics.get("safety_margin_note", "")) + " " +
            str(dataset.mechanics.get("carry_penalty", ""))
        ))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        for control in (self.speed_input, self.margin_input):
            widgets.debounce_connect(control, self.refresh_speed)
        for control in (self.roi_cost, self.roi_before, self.roi_after):
            widgets.debounce_connect(control, self.refresh_roi)
        for control in (self.goal_target, self.goal_current, self.goal_income):
            widgets.debounce_connect(control, self.refresh_goal)

        self.refresh_speed()
        self.refresh_roi()
        self.refresh_goal()

    def refresh_speed(self) -> None:
        speed = self.speed_input.value(default=0.0) or 0.0
        margin = self.margin_input.value()
        rows_data = planner.evaluate_biomes(self.dataset, speed, margin)

        rows = []
        for row in rows_data:
            colour = STATUS_COLOR[row.status]
            ratio_text = "—" if row.biome.speed_required <= 0 else f"×{row.ratio:,.2f}"
            rows.append([
                widgets.cell(row.biome.ko, color=colour),
                widgets.cell(fmt.compact(row.biome.speed_required), align_right=True),
                widgets.cell(ratio_text, align_right=True),
                widgets.cell(row.status_ko, color=colour),
                widgets.cell(fmt.compact(row.shortfall) if row.shortfall else "—", align_right=True),
                widgets.cell(
                    fmt.compact(row.needed_for_safe) if row.needed_for_safe else "달성",
                    align_right=True,
                ),
            ])
        widgets.fill_table(self.biome_table, rows)

        target = planner.next_target(self.dataset, speed)
        if target is None:
            self.next_goal.setText("전 바이옴 개방")
            self.next_detail.setText("더 열 곳이 없습니다. 이제 무게와 뮤테이션 싸움입니다.")
        else:
            self.next_goal.setText(target.biome.ko)
            multiple = (target.biome.speed_required / speed) if speed > 0 else float("inf")
            note = f" · {target.biome.speed_note}" if target.biome.speed_note else ""
            self.next_detail.setText(
                f"{fmt.compact(target.shortfall)} 더 필요 "
                f"(현재의 약 {multiple:,.1f}배) · 안전하게 들어가려면 "
                f"{fmt.compact(target.needed_for_safe)} 더{note}"
            )

        best = planner.best_reachable_pets(self.dataset, speed, limit=10)
        pet_rows = []
        for entry in best:
            rarity = self.dataset.rarity(entry.rarity)
            biome = self.dataset.biome(entry.biome)
            pet_rows.append([
                widgets.cell(entry.pet_ko, color=rarity.color if rarity else None),
                widgets.cell(biome.ko if biome else entry.biome),
                widgets.cell(rarity.ko if rarity else entry.rarity,
                             color=rarity.color if rarity else None),
                widgets.cell(fmt.compact(entry.income), align_right=True),
            ])
        widgets.fill_table(self.best_pets, pet_rows)

    def refresh_roi(self) -> None:
        cost = self.roi_cost.value(default=0.0) or 0.0
        before = self.roi_before.value(default=0.0) or 0.0
        after = self.roi_after.value(default=0.0) or 0.0
        result = planner.roi(cost, before, after)

        self.roi_result.setText(fmt.duration(result.payback_seconds))
        if result.income_gain <= 0:
            self.roi_detail.setText("수입이 늘지 않는 업그레이드입니다. 돈을 다른 데 쓰세요.")
            widgets.set_role(self.roi_detail, "bad")
            return
        verdict = "하루 안에 본전 — 바로 지르세요." if result.is_worth_it \
            else "회수에 하루 이상 걸립니다. 더 싼 업그레이드부터 확인하세요."
        self.roi_detail.setText(
            f"초당 +{fmt.compact(result.income_gain)} · 하루 +{fmt.compact(result.daily_gain)} · {verdict}"
        )
        widgets.set_role(self.roi_detail, "good" if result.is_worth_it else "warn")

    def refresh_goal(self) -> None:
        target = self.goal_target.value(default=0.0) or 0.0
        current = self.goal_current.value(default=0.0) or 0.0
        rate = self.goal_income.value(default=0.0) or 0.0
        seconds = planner.time_to_amount(target, current, rate)
        if seconds == 0:
            self.goal_result.setText("이미 달성했습니다")
        else:
            self.goal_result.setText(
                f"{fmt.duration(seconds)}  (부족분 {fmt.compact(max(0.0, target - current))})"
            )
