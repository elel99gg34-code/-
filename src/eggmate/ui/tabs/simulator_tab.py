"""시뮬레이터 — 평균이 아니라 '실제로 겪는 폭'을 보여 준다."""
from __future__ import annotations

from PySide6.QtWidgets import QComboBox, QLineEdit, QPushButton, QSpinBox, QVBoxLayout, QWidget

from ...core import fmt, odds, simulate
from .. import theme, widgets
from ..context import AppContext


class SimulatorTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        self._result = None

        self.rate_input = QLineEdit("0.01%")
        self.rate_input.setPlaceholderText("0.01%  또는  1/10000")
        self.trials = QSpinBox()
        self.trials.setRange(100, simulate.MAX_TRIALS)
        self.trials.setValue(20_000)
        self.trials.setSingleStep(1_000)
        self.trials.setSuffix(" 명")
        self.trials.setGroupSeparatorShown(True)
        self.seconds_each = QSpinBox()
        self.seconds_each.setRange(0, 3600)
        self.seconds_each.setValue(45)
        self.seconds_each.setSuffix(" 초 / 1회")
        self.seed = QSpinBox()
        self.seed.setRange(0, 999_999)
        self.seed.setValue(42)
        self.seed.setPrefix("시드 ")

        run_button = QPushButton("시뮬레이션 실행")
        run_button.setProperty("accent", "true")
        run_button.clicked.connect(self.run)
        self.copy_button = widgets.copy_button(self._as_text, "결과 복사")

        self.headline = widgets.big("—")
        self.spread = widgets.metric("—")
        self.summary = widgets.hint("실행을 누르면 같은 확률을 여러 명이 겪었을 때의 분포를 보여 줍니다.")

        self.percentile_table = widgets.make_table(
            ["구간", "시도 횟수", "소요 시간", "설명"], stretch_column=3, min_rows=8
        )
        self.chart = widgets.BarChart(height=170)

        # --- 세션 시뮬레이션 ---
        self.session_hatches = QSpinBox()
        self.session_hatches.setRange(1, simulate.MAX_TRIALS)
        self.session_hatches.setValue(1_000)
        self.session_hatches.setSingleStep(100)
        self.session_hatches.setSuffix(" 번 부화")
        self.session_preset = QComboBox()
        self.session_preset.addItems(["기본 확률표", "레어 위주", "고확률 테스트"])
        session_button = QPushButton("세션 돌려보기")
        session_button.clicked.connect(self.run_session)
        self.session_table = widgets.make_table(["등급", "나온 횟수", "비율", "설정 확률"], min_rows=8)

        controls = widgets.form()
        controls.addRow("노리는 확률", self.rate_input)
        controls.addRow("표본 (가상 플레이어 수)", self.trials)
        controls.addRow("부화 1회 소요", self.seconds_each)
        controls.addRow("난수 시드", self.seed)

        results = widgets.form()
        results.addRow("절반이 이 안에 뽑음", self.headline)
        results.addRow("운빨 격차", self.spread)
        results.addRow("", self.summary)

        session_form = widgets.form()
        session_form.addRow("확률표", self.session_preset)
        session_form.addRow("부화 횟수", self.session_hatches)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("설정", controls))
        layout.addWidget(widgets.row(run_button, self.copy_button))
        layout.addWidget(widgets.group("결과", results))
        layout.addWidget(widgets.group("분포 — 시도 횟수별 인원", self.chart))
        layout.addWidget(widgets.group("구간별", self.percentile_table))
        layout.addWidget(widgets.group("세션 시뮬레이션 — 이만큼 까면 뭐가 나오나",
                                       widgets.column(session_form, widgets.row(session_button),
                                                      self.session_table)))
        layout.addWidget(widgets.hint(
            "같은 확률이어도 사람마다 결과가 크게 갈립니다. '기대 시도 1만 번'이라는 말은 "
            "누구는 1천 번에 뽑고 누구는 3만 번을 깐다는 뜻입니다. 시드가 같으면 결과도 같습니다."
        ))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.run()

    # ------------------------------------------------------------------
    def run(self) -> None:
        try:
            rate = odds.parse_rate(self.rate_input.text())
        except ValueError as exc:
            self.headline.setText("—")
            self.summary.setText(f"확률을 읽을 수 없습니다 — {exc}")
            widgets.set_role(self.summary, "bad")
            return
        if rate <= 0:
            self.summary.setText("확률이 0이면 아무리 돌려도 나오지 않습니다.")
            widgets.set_role(self.summary, "warn")
            return

        result = simulate.attempts_until_first(rate, self.trials.value(), self.seed.value())
        self._result = result
        each = self.seconds_each.value()

        self.headline.setText(f"{result.median:,.0f}번")
        self.spread.setText(
            f"{result.spread_ratio:.1f}배  (하위 10% {result.p10:,.0f}번 ↔ 상위 10% {result.p90:,.0f}번)"
        )
        widgets.set_role(self.spread, "warn" if result.spread_ratio > 10 else "metric")
        self.summary.setText(
            f"가상 플레이어 {result.trials:,}명 · 평균 {result.mean:,.0f}번 "
            f"(이론값 {result.theoretical_mean:,.0f}번) · "
            f"가장 운 좋은 사람 {result.luckiest:,}번, 가장 나쁜 사람 {result.unluckiest:,}번"
        )
        widgets.set_role(self.summary, "hint")

        rows = [
            ("가장 운 좋은 사람", result.luckiest, "이보다 빨리 뽑은 사람은 없음"),
            ("상위 10%", result.p10, "10명 중 1명은 이 안에 뽑음"),
            ("상위 25%", result.p25, "4명 중 1명"),
            ("중앙값", result.median, "절반이 이 안에 뽑음"),
            ("하위 25%", result.p75, "4명 중 3명은 이 안에 뽑음"),
            ("하위 10%", result.p90, "10명 중 9명은 이 안에 뽑음"),
            ("하위 1%", result.p99, "여기까지 오면 정말 운이 나쁜 것"),
            ("최악", result.unluckiest, "이 표본에서 가장 오래 걸린 사람"),
        ]
        table_rows = []
        for label, attempts, note in rows:
            table_rows.append([
                widgets.cell(label, color=theme.ACCENT if label == "중앙값" else None),
                widgets.cell(f"{attempts:,.0f}", align_right=True),
                widgets.cell(fmt.duration(attempts * each) if each else "—", align_right=True),
                widgets.cell(note),
            ])
        widgets.fill_table(self.percentile_table, table_rows)

        buckets = simulate.histogram(result.samples, buckets=14)
        self.chart.set_bars(
            [(fmt.compact(low, digits=0), float(count)) for low, _, count in buckets],
            f"{result.trials:,}명",
        )

    def run_session(self) -> None:
        presets = {
            "기본 확률표": {"커먼": 0.60, "언커먼": 0.22, "레어": 0.12,
                          "에픽": 0.04, "레전더리": 0.015, "미식": 0.004,
                          "시크릿": 0.0009, "이터널": 0.0001},
            "레어 위주": {"레어": 0.5, "에픽": 0.3, "레전더리": 0.15,
                       "미식": 0.04, "시크릿": 0.01},
            "고확률 테스트": {"당첨": 0.25, "꽝": 0.75},
        }
        table = presets[self.session_preset.currentText()]
        outcome = simulate.hatch_session(table, self.session_hatches.value(), self.seed.value())

        rows = []
        for key, count in sorted(outcome.counts.items(), key=lambda kv: kv[1], reverse=True):
            configured = table.get(key)
            rows.append([
                widgets.cell(key),
                widgets.cell(f"{count:,}", align_right=True),
                widgets.cell(f"{outcome.ratio(key):.3%}", align_right=True),
                widgets.cell(f"{configured:.3%}" if configured is not None else "—",
                             align_right=True, color=theme.TEXT_DIM),
            ])
        widgets.fill_table(self.session_table, rows)

    def _as_text(self) -> str:
        r = self._result
        if r is None:
            return ""
        return (
            f"EggMate 시뮬레이션 (확률 {r.probability:.6%}, 표본 {r.trials:,})\n"
            f"중앙값 {r.median:,.0f}번 / 평균 {r.mean:,.0f}번 (이론 {r.theoretical_mean:,.0f}번)\n"
            f"상위10% {r.p10:,.0f} · 하위10% {r.p90:,.0f} · 하위1% {r.p99:,.0f}\n"
            f"최선 {r.luckiest:,} · 최악 {r.unluckiest:,} · 운빨격차 {r.spread_ratio:.1f}배"
        )
