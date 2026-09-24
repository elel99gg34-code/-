"""성장 기록 — 스피드/자산 추이, 업그레이드 순서, 훈련 시간, 런 효율."""
from __future__ import annotations

from PySide6.QtWidgets import (
    QComboBox,
    QDoubleSpinBox,
    QLineEdit,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from ...core import fmt
from ...core.growth import Upgrade, purchase_plan, reinvestment_curve, run_value, training_time
from .. import theme, widgets
from ..context import AppContext


class GrowthTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx

        # --- 기록 ---
        self.speed_input = widgets.AmountEdit("현재 스피드 (예: 250k)")
        self.money_input = widgets.AmountEdit("보유 금액 (예: 1.2b)")
        self.income_input = widgets.AmountEdit("현재 총 $/s (예: 900k)")
        self.note_input = QLineEdit()
        self.note_input.setPlaceholderText("메모 (선택)")

        record_button = QPushButton("지금 상태 기록")
        record_button.setProperty("accent", "true")
        record_button.clicked.connect(self.record_point)
        delete_button = QPushButton("선택 기록 삭제")
        delete_button.clicked.connect(self.delete_selected)

        self.growth_summary = widgets.metric("—")
        self.chart_field = QComboBox()
        self.chart_field.addItem("스피드", "speed")
        self.chart_field.addItem("보유 금액", "money")
        self.chart_field.addItem("초당 수입", "income")
        self.chart = widgets.BarChart(height=170)
        self.timeline_table = widgets.make_table(
            ["id", "시각", "스피드", "금액", "$/s", "메모"], stretch_column=5, min_rows=8
        )

        # --- 업그레이드 큐 ---
        self.queue_income = widgets.AmountEdit("현재 총 $/s", "1000")
        self.queue_money = widgets.AmountEdit("보유 금액", "0")
        self.queue_input = QLineEdit()
        self.queue_input.setPlaceholderText("이름,비용,증가분  (줄바꿈 대신 ; 로 구분)")
        self.queue_input.setText("러닝머신;1000;50 / 펜+1;75m;900k / 트레일;5000;200")
        self.queue_table = widgets.make_table(
            ["순서", "업그레이드", "비용", "수입 증가", "회수", "대기", "누적"], min_rows=6
        )
        self.queue_note = widgets.hint(
            "'이름;비용;초당증가분' 을 ' / ' 로 이어서 적으세요. 회수가 빠른 것부터 사면 "
            "복리로 다음 업그레이드가 빨라집니다."
        )

        # --- 훈련 ---
        self.train_current = widgets.AmountEdit("현재 스피드", "250k")
        self.train_target = widgets.AmountEdit("목표 스피드", "700k")
        self.train_rate = QDoubleSpinBox()
        self.train_rate.setRange(0.0, 1e9)
        self.train_rate.setDecimals(2)
        self.train_rate.setValue(50.0)
        self.train_rate.setSuffix(" 스피드/틱")
        self.train_trail = QDoubleSpinBox()
        self.train_trail.setRange(0.0, 1000.0)
        self.train_trail.setDecimals(2)
        self.train_trail.setValue(1.0)
        self.train_trail.setPrefix("트레일 ×")
        self.train_result = widgets.metric("—")

        # --- 런 효율 ---
        self.run_eggs = QDoubleSpinBox()
        self.run_eggs.setRange(0.0, 999.0)
        self.run_eggs.setValue(3.0)
        self.run_eggs.setSuffix(" 개/런")
        self.run_success = QDoubleSpinBox()
        self.run_success.setRange(0.0, 100.0)
        self.run_success.setValue(80.0)
        self.run_success.setSuffix(" % 성공")
        self.run_value_each = widgets.AmountEdit("알 1개 가치", "1m")
        self.run_seconds = QDoubleSpinBox()
        self.run_seconds.setRange(1.0, 3600.0)
        self.run_seconds.setValue(45.0)
        self.run_seconds.setSuffix(" 초/런")
        self.run_result = widgets.metric("—")
        self.run_detail = widgets.hint("")

        # --- 재투자 ---
        self.reinvest_ratio = QDoubleSpinBox()
        self.reinvest_ratio.setRange(0.0, 100.0)
        self.reinvest_ratio.setValue(80.0)
        self.reinvest_ratio.setSuffix(" % 재투자")
        self.reinvest_hours = QDoubleSpinBox()
        self.reinvest_hours.setRange(1.0, 720.0)
        self.reinvest_hours.setValue(24.0)
        self.reinvest_hours.setSuffix(" 시간")
        self.reinvest_efficiency = QLineEdit("1e-6")
        self.reinvest_efficiency.setPlaceholderText("1원당 초당 수입 증가량")
        self.reinvest_chart = widgets.BarChart(height=150)
        self.reinvest_result = widgets.hint("")

        record_form = widgets.form()
        record_form.addRow("스피드", self.speed_input)
        record_form.addRow("보유 금액", self.money_input)
        record_form.addRow("초당 수입", self.income_input)
        record_form.addRow("메모", self.note_input)

        chart_form = widgets.form()
        chart_form.addRow("그래프 항목", self.chart_field)
        chart_form.addRow("성장", self.growth_summary)

        queue_form = widgets.form()
        queue_form.addRow("현재 수입", self.queue_income)
        queue_form.addRow("보유 금액", self.queue_money)
        queue_form.addRow("업그레이드 목록", self.queue_input)
        queue_form.addRow("", self.queue_note)

        train_form = widgets.form()
        train_form.addRow("현재", self.train_current)
        train_form.addRow("목표", self.train_target)
        train_form.addRow("획득량", self.train_rate)
        train_form.addRow("트레일 배율", self.train_trail)
        train_form.addRow("걸리는 시간", self.train_result)

        run_form = widgets.form()
        run_form.addRow("런당 알", self.run_eggs)
        run_form.addRow("성공률", self.run_success)
        run_form.addRow("알 가치", self.run_value_each)
        run_form.addRow("런 소요", self.run_seconds)
        run_form.addRow("시간당 기대 수익", self.run_result)
        run_form.addRow("", self.run_detail)

        reinvest_form = widgets.form()
        reinvest_form.addRow("재투자 비율", self.reinvest_ratio)
        reinvest_form.addRow("기간", self.reinvest_hours)
        reinvest_form.addRow("투자 효율", self.reinvest_efficiency)
        reinvest_form.addRow("", self.reinvest_result)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("내 상태 기록", record_form))
        layout.addWidget(widgets.row(record_button, delete_button))
        layout.addWidget(widgets.group("성장 추이", widgets.column(chart_form, self.chart)))
        layout.addWidget(widgets.group("기록 목록", self.timeline_table))
        layout.addWidget(widgets.group("업그레이드 구매 순서", widgets.column(queue_form, self.queue_table)))
        layout.addWidget(widgets.group("스피드 훈련 시간", train_form))
        layout.addWidget(widgets.group("런 효율", run_form))
        layout.addWidget(widgets.group("재투자 성장 곡선",
                                       widgets.column(reinvest_form, self.reinvest_chart)))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.chart_field.currentIndexChanged.connect(self.refresh)
        for control in (self.queue_income, self.queue_money, self.queue_input):
            widgets.debounce_connect(control, self.refresh_queue)
        for control in (self.train_current, self.train_target, self.train_rate, self.train_trail):
            widgets.debounce_connect(control, self.refresh_training)
        for control in (self.run_eggs, self.run_success, self.run_value_each, self.run_seconds):
            widgets.debounce_connect(control, self.refresh_run)
        for control in (self.reinvest_ratio, self.reinvest_hours, self.reinvest_efficiency):
            widgets.debounce_connect(control, self.refresh_reinvest)

        ctx.bus.timeline_changed.connect(self.refresh)
        ctx.bus.profile_changed.connect(self.refresh)

        self.refresh()
        self.refresh_queue()
        self.refresh_training()
        self.refresh_run()
        self.refresh_reinvest()

    # ------------------------------------------------------------------
    def record_point(self) -> None:
        self.ctx.timeline.add(
            speed=self.speed_input.value(),
            money=self.money_input.value(),
            income=self.income_input.value(),
            note=self.note_input.text().strip(),
        )
        self.note_input.clear()
        self.ctx.bus.timeline_changed.emit()
        self.refresh()

    def delete_selected(self) -> None:
        row = self.timeline_table.currentRow()
        if row < 0:
            return
        item = self.timeline_table.item(row, 0)
        if item is None:
            return
        self.ctx.timeline.delete(int(item.text()))
        self.ctx.bus.timeline_changed.emit()
        self.refresh()

    def refresh(self) -> None:
        timeline = self.ctx.timeline
        points = timeline.all()

        field = self.chart_field.currentData()
        values = [(p.created_at[5:10], float(getattr(p, field) or 0.0)) for p in points]
        self.chart.set_bars(values[-30:], self.chart_field.currentText())

        pair = timeline.growth(field)
        if pair is None:
            self.growth_summary.setText("기록이 2개 이상 쌓이면 성장률이 보입니다")
            widgets.set_role(self.growth_summary, "hint")
        else:
            first, last = pair
            multiple = (last / first) if first else float("inf")
            self.growth_summary.setText(
                f"{fmt.compact(first)} → {fmt.compact(last)}  ({multiple:,.1f}배)"
            )
            widgets.set_role(self.growth_summary, "good" if last >= first else "bad")

        rows = []
        for point in reversed(points):
            rows.append([
                widgets.cell(str(point.id), align_right=True),
                widgets.cell(point.created_at.replace("T", " ")[:16]),
                widgets.cell(fmt.compact(point.speed), align_right=True),
                widgets.cell(fmt.compact(point.money), align_right=True),
                widgets.cell(fmt.compact(point.income), align_right=True),
                widgets.cell(point.note),
            ])
        widgets.fill_table(self.timeline_table, rows)

    def refresh_queue(self) -> None:
        upgrades: list[Upgrade] = []
        for chunk in self.queue_input.text().split("/"):
            parts = [p.strip() for p in chunk.split(";")]
            if len(parts) != 3 or not parts[0]:
                continue
            try:
                cost = fmt.parse_amount(parts[1])
                gain = fmt.parse_amount(parts[2])
            except ValueError:
                continue
            upgrades.append(Upgrade(parts[0], cost, gain))

        steps = purchase_plan(
            upgrades,
            starting_income=self.queue_income.value(default=0.0) or 0.0,
            starting_money=self.queue_money.value(default=0.0) or 0.0,
        )
        rows = []
        for step in steps:
            rows.append([
                widgets.cell(f"{step.order}", align_right=True),
                widgets.cell(step.upgrade.name),
                widgets.cell(fmt.compact(step.upgrade.cost), align_right=True),
                widgets.cell(f"+{fmt.compact(step.upgrade.income_gain)}", align_right=True),
                widgets.cell(fmt.duration(step.upgrade.payback_seconds), align_right=True),
                widgets.cell(fmt.duration(step.wait_seconds), align_right=True),
                widgets.cell(fmt.duration(step.cumulative_seconds), align_right=True,
                             color=theme.ACCENT),
            ])
        widgets.fill_table(self.queue_table, rows)

    def refresh_training(self) -> None:
        estimate = training_time(
            self.train_current.value(default=0.0) or 0.0,
            self.train_target.value(default=0.0) or 0.0,
            self.train_rate.value(),
            trail_multiplier=self.train_trail.value(),
        )
        if estimate.gap <= 0:
            self.train_result.setText("이미 목표를 넘었습니다")
            widgets.set_role(self.train_result, "good")
            return
        self.train_result.setText(
            f"{fmt.duration(estimate.seconds)}  "
            f"(초당 {fmt.compact(estimate.rate_per_second)} · 부족분 {fmt.compact(estimate.gap)})"
        )
        widgets.set_role(self.train_result, "metric" if estimate.is_reachable else "bad")

    def refresh_run(self) -> None:
        estimate = run_value(
            self.run_eggs.value(),
            self.run_success.value() / 100.0,
            self.run_value_each.value(default=0.0) or 0.0,
            self.run_seconds.value(),
        )
        self.run_result.setText(fmt.money(estimate.value_per_hour))
        self.run_detail.setText(
            f"런당 기대 {fmt.compact(estimate.expected_value)} · "
            f"시간당 {estimate.runs_per_hour:.0f}런 · "
            f"잡히면 런 전체를 잃으므로 성공률이 그대로 곱해집니다"
        )

    def refresh_reinvest(self) -> None:
        try:
            efficiency = float(self.reinvest_efficiency.text() or 0)
        except ValueError:
            efficiency = 0.0
        income_now = self.queue_income.value(default=1000.0) or 1000.0

        points = reinvestment_curve(
            income_now,
            hours=self.reinvest_hours.value(),
            reinvest_ratio=self.reinvest_ratio.value() / 100.0,
            efficiency=efficiency,
        )
        self.reinvest_chart.set_bars(
            [(f"{p.hour:.0f}h", p.income) for p in points[::2]], "초당 수입"
        )
        last = points[-1]
        self.reinvest_result.setText(
            f"{self.reinvest_hours.value():.0f}시간 뒤 수입 {fmt.compact(last.income)}/s "
            f"(시작 {fmt.compact(points[0].income)}/s) · 그동안 손에 쥔 돈 "
            f"{fmt.compact(last.money_earned)}"
        )
