"""확률 계산기.

'다음에 뭐가 나올지'는 계산할 수 없다. 서버가 굴리는 난수라 클라이언트에서
알 방법이 없고, 시행은 서로 독립이다. 대신 이 탭은 '몇 번 까면 얼마나
기대할 수 있는가'를 정확히 계산한다.
"""
from __future__ import annotations

import math

from PySide6.QtWidgets import (
    QComboBox,
    QLineEdit,
    QPushButton,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from ...core import collection, fmt, odds
from .. import theme, widgets
from ..context import AppContext

PRESETS = [
    ("직접 입력", ""),
    ("1/10  (10%)", "10%"),
    ("1/100  (1%)", "1%"),
    ("1/200  (0.5%)", "0.5%"),
    ("1/1,000  (0.1%)", "0.1%"),
    ("1/10,000  (0.01%)", "0.01%"),
    ("1/100,000  (0.001%)", "0.001%"),
]


class OddsTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        dataset = ctx.dataset
        self.dataset = dataset

        self.preset = QComboBox()
        for label, _ in PRESETS:
            self.preset.addItem(label)

        self.rate_input = QLineEdit("0.5%")
        self.rate_input.setPlaceholderText("0.5%  또는  1/200  또는  0.005")

        self.attempts = QSpinBox()
        self.attempts.setRange(0, 10_000_000)
        self.attempts.setValue(100)
        self.attempts.setSuffix(" 번")
        self.attempts.setGroupSeparatorShown(True)

        self.seconds_each = QSpinBox()
        self.seconds_each.setRange(0, 3600)
        self.seconds_each.setValue(45)
        self.seconds_each.setSuffix(" 초 / 1회")

        self.headline = widgets.big()
        self.expected = widgets.metric()
        self.mean_wait = widgets.metric()
        self.time_estimate = widgets.metric()
        self.error_label = widgets.hint("")

        self.thresholds = widgets.make_table(
            ["확신도", "필요한 시도 횟수", "예상 소요 시간"], min_rows=4
        )
        self.distribution = widgets.make_table(
            ["나온 개수", "정확히 그만큼일 확률", "그 이상일 확률"], min_rows=7
        )

        self.dry_input = QSpinBox()
        self.dry_input.setRange(0, 10_000_000)
        self.dry_input.setValue(0)
        self.dry_input.setSuffix(" 번 연속 꽝")
        self.dry_answer = widgets.hint("")

        inputs = widgets.form()
        inputs.addRow("확률 프리셋", self.preset)
        inputs.addRow("확률", self.rate_input)
        inputs.addRow("시도 횟수", self.attempts)
        inputs.addRow("1회 소요 시간", self.seconds_each)
        inputs.addRow("", self.error_label)

        results = widgets.form()
        results.addRow("최소 1개 나올 확률", self.headline)
        results.addRow("기대 획득 개수", self.expected)
        results.addRow("평균 대기 시도", self.mean_wait)
        results.addRow("예상 소요 시간", self.time_estimate)

        dry = widgets.form()
        dry.addRow("지금까지", self.dry_input)
        dry.addRow("", self.dry_answer)

        # --- 여러 목표 동시 ---
        # 구분자로 '/' 를 쓰면 1/2000 같은 분수 표기와 충돌하므로 세미콜론을 쓴다.
        self.multi_input = QLineEdit("0.5% ; 1/2000 ; 0.01%")
        self.multi_input.setPlaceholderText("여러 확률을 ' ; ' 로 구분 (예: 0.5% ; 1/2000)")
        self.multi_any = widgets.metric("—")
        self.multi_all = widgets.metric("—")
        self.multi_table = widgets.make_table(
            ["목표", "확률", "평균 대기", "이 시도 수에서 나올 확률"], min_rows=5
        )
        self.copy_button = widgets.copy_button(self._as_text, "결과 복사")

        multi_form = widgets.form()
        multi_form.addRow("여러 목표 확률", self.multi_input)
        multi_form.addRow("아무거나 하나 (1회당)", self.multi_any)
        multi_form.addRow("전부 모으기 (기대 시도)", self.multi_all)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("입력", inputs))
        layout.addWidget(widgets.group("결과", results))
        layout.addWidget(widgets.group("확신도별 필요 시도", self.thresholds))
        layout.addWidget(widgets.group("몇 개나 나올까 (이항분포)", self.distribution))
        layout.addWidget(widgets.group("여러 목표 동시에 노릴 때",
                                       widgets.column(multi_form, self.multi_table)))
        layout.addWidget(widgets.group("연속 꽝 진단", dry))
        layout.addWidget(widgets.row(self.copy_button))
        layout.addWidget(widgets.hint(
            "⚠ 이 탭은 '다음에 무엇이 나올지'를 맞히지 않습니다. 부화 결과는 서버에서 굴리는 "
            "난수이고 각 시행은 서로 독립이라, 클라이언트 쪽에서 미리 알 방법이 원천적으로 "
            "없습니다. 여기 있는 값은 전부 '장기적으로 이렇게 될 것'이라는 통계이지 "
            "개별 결과에 대한 예언이 아닙니다."
        ))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        self.preset.currentIndexChanged.connect(self._apply_preset)
        for control in (self.rate_input, self.attempts, self.seconds_each, self.dry_input,
                        self.multi_input):
            widgets.debounce_connect(control, self.recalculate)
        self.recalculate()

    def _apply_preset(self) -> None:
        _, value = PRESETS[self.preset.currentIndex()]
        if value:
            self.rate_input.setText(value)
        self.recalculate()

    def _read_rate(self) -> float | None:
        try:
            rate = odds.parse_rate(self.rate_input.text())
        except ValueError as exc:
            self.error_label.setText(f"확률을 읽을 수 없습니다 — {exc}")
            widgets.set_role(self.error_label, "bad")
            return None
        if rate <= 0:
            self.error_label.setText("확률이 0이면 아무리 시도해도 나오지 않습니다.")
            widgets.set_role(self.error_label, "warn")
            return None
        self.error_label.setText(f"해석된 확률: {rate:.6%}  (약 1/{1 / rate:,.0f})")
        widgets.set_role(self.error_label, "hint")
        return rate

    def recalculate(self) -> None:
        rate = self._read_rate()
        if rate is None:
            for label in (self.headline, self.expected, self.mean_wait, self.time_estimate):
                label.setText("—")
            self.thresholds.setRowCount(0)
            self.distribution.setRowCount(0)
            self.dry_answer.setText("")
            return

        n = self.attempts.value()
        each = self.seconds_each.value()
        result = odds.analyse(rate, n)

        self.headline.setText(f"{result.at_least_one:.2%}")
        self.expected.setText(f"{result.expected_hits:,.2f} 개")
        self.mean_wait.setText(f"{result.mean_attempts:,.0f} 번")
        self.time_estimate.setText(fmt.duration(n * each))

        rows = []
        for label, attempts_needed in (
            ("50% (반반)", result.median_attempts),
            ("90%", result.p90_attempts),
            ("95%", odds.attempts_for_confidence(rate, 0.95)),
            ("99%", result.p99_attempts),
        ):
            reached = math.isfinite(attempts_needed) and n >= attempts_needed
            rows.append([
                widgets.cell(label),
                widgets.cell(f"{attempts_needed:,.0f} 번", align_right=True,
                             color=theme.GOOD if reached else theme.TEXT),
                widgets.cell(fmt.duration(attempts_needed * each), align_right=True),
            ])
        widgets.fill_table(self.thresholds, rows)

        self._update_distribution(rate, n)
        self._update_dry_streak(rate)
        self._update_multi(n)

    def _update_distribution(self, rate: float, n: int) -> None:
        expected = rate * n
        top = max(4, min(12, int(expected * 2) + 3))
        rows = []
        for k in range(0, top + 1):
            exactly = odds.probability_of_exactly(rate, n, k)
            at_least = odds.probability_of_at_least(rate, n, k)
            if k > 0 and exactly < 1e-6 and at_least < 1e-6:
                break
            rows.append([
                widgets.cell(f"{k} 개"),
                widgets.cell(f"{exactly:.3%}", align_right=True),
                widgets.cell(f"{at_least:.3%}", align_right=True),
            ])
        widgets.fill_table(self.distribution, rows)

    def _update_dry_streak(self, rate: float) -> None:
        dry = self.dry_input.value()
        if dry <= 0:
            self.dry_answer.setText(
                "연속으로 꽝이 난 횟수를 넣으면, 그게 얼마나 흔한 일인지 알려줍니다."
            )
            widgets.set_role(self.dry_answer, "hint")
            return
        chance = (1 - rate) ** dry
        message = (
            f"이 확률에서 {dry:,}번 연속 꽝이 날 가능성은 {chance:.2%}입니다. "
            f"{'드문 일이긴 하지만 ' if chance < 0.05 else '충분히 흔한 일이고 '}"
            "다음 시도의 확률은 여전히 정확히 "
            f"{rate:.4%}입니다. 천장(pity) 시스템은 없습니다 — "
            "많이 깠다고 확률이 올라가지 않습니다."
        )
        self.dry_answer.setText(message)
        widgets.set_role(self.dry_answer, "warn" if chance < 0.05 else "hint")

    # ------------------------------------------------------------------
    def _parse_multi(self) -> list[tuple[str, float]]:
        parsed: list[tuple[str, float]] = []
        for index, chunk in enumerate(self.multi_input.text().split(";"), start=1):
            text = chunk.strip()
            if not text:
                continue
            try:
                parsed.append((f"목표 {index}  ({text})", odds.parse_rate(text)))
            except ValueError:
                continue
        return parsed

    def _update_multi(self, attempts: int) -> None:
        entries = self._parse_multi()
        if not entries:
            self.multi_any.setText("—")
            self.multi_all.setText("확률을 ' ; ' 로 구분해 입력하세요")
            widgets.set_role(self.multi_all, "hint")
            self.multi_table.setRowCount(0)
            return

        rates = [rate for _, rate in entries]
        any_one = collection.any_of_probability(rates)
        all_attempts = collection.all_of_attempts(rates)

        self.multi_any.setText(
            f"{any_one:.4%}  (평균 {1 / any_one:,.0f}번마다 하나)" if any_one > 0 else "0%"
        )
        widgets.set_role(self.multi_any, "good")
        self.multi_all.setText(f"{all_attempts:,.0f}번")
        widgets.set_role(self.multi_all, "metric")

        rows = []
        for label, rate in entries:
            rows.append([
                widgets.cell(label),
                widgets.cell(f"{rate:.4%}", align_right=True),
                widgets.cell(f"{1 / rate:,.0f}번" if rate > 0 else "∞", align_right=True),
                widgets.cell(f"{odds.analyse(rate, attempts).at_least_one:.2%}", align_right=True),
            ])
        widgets.fill_table(self.multi_table, rows)

    def _as_text(self) -> str:
        try:
            rate = odds.parse_rate(self.rate_input.text())
        except ValueError:
            return ""
        result = odds.analyse(rate, self.attempts.value())
        return (
            f"EggMate 확률 계산 (p = {rate:.6%}, 1/{1 / rate:,.0f})\n"
            f"{result.attempts:,}번 시도 → 최소 1개 나올 확률 {result.at_least_one:.2%}\n"
            f"기대 획득 {result.expected_hits:.2f}개 · 평균 대기 {result.mean_attempts:,.0f}번\n"
            f"90% 확신에 {result.p90_attempts:,.0f}번, 99% 에 {result.p99_attempts:,.0f}번"
        )
