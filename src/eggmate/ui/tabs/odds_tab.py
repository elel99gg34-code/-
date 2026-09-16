"""확률 계산기.

'다음에 뭐가 나올지'는 계산할 수 없다. 서버가 굴리는 난수라 클라이언트에서
알 방법이 없고, 시행은 서로 독립이다. 대신 이 탭은 '몇 번 까면 얼마나
기대할 수 있는가'를 정확히 계산한다.
"""
from __future__ import annotations

import math

from PySide6.QtWidgets import QComboBox, QLineEdit, QSpinBox, QVBoxLayout, QWidget

from ...core import fmt, odds
from ...core.models import Dataset
from .. import theme, widgets

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
    def __init__(self, dataset: Dataset) -> None:
        super().__init__()

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

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.group("입력", inputs))
        layout.addWidget(widgets.group("결과", results))
        layout.addWidget(widgets.group("확신도별 필요 시도", self.thresholds))
        layout.addWidget(widgets.group("몇 개나 나올까 (이항분포)", self.distribution))
        layout.addWidget(widgets.group("연속 꽝 진단", dry))
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
        for control in (self.rate_input, self.attempts, self.seconds_each, self.dry_input):
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
