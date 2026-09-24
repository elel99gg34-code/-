"""성장 계산 — 재투자 곡선, 스피드 훈련 시간, 업그레이드 우선순위."""
from __future__ import annotations

import math
from dataclasses import dataclass


# ---------------------------------------------------------------------------
# 업그레이드 우선순위
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Upgrade:
    name: str
    cost: float
    income_gain: float      # 초당 증가분

    @property
    def payback_seconds(self) -> float:
        if self.income_gain <= 0:
            return math.inf
        return self.cost / self.income_gain


@dataclass(frozen=True)
class QueueStep:
    order: int
    upgrade: Upgrade
    income_before: float
    income_after: float
    wait_seconds: float         # 이 업그레이드를 살 돈이 모일 때까지
    cumulative_seconds: float


def prioritise(upgrades: list[Upgrade]) -> list[Upgrade]:
    """회수 시간이 짧은 순. 수입이 안 느는 항목은 뒤로 민다."""
    return sorted(upgrades, key=lambda u: (u.payback_seconds, u.cost))


def purchase_plan(
    upgrades: list[Upgrade],
    starting_income: float,
    starting_money: float = 0.0,
) -> list[QueueStep]:
    """회수 빠른 순으로 하나씩 사 나갈 때의 예상 일정.

    앞 업그레이드가 수입을 올려 주므로 뒤로 갈수록 기다리는 시간이 줄어든다.
    이 복리 효과 때문에 '비싼 것부터'보다 '빨리 회수되는 것부터'가 대개 빠르다.
    """
    income = max(0.0, float(starting_income))
    money = max(0.0, float(starting_money))
    elapsed = 0.0
    steps: list[QueueStep] = []

    for order, upgrade in enumerate(prioritise(upgrades), start=1):
        shortfall = upgrade.cost - money
        if shortfall <= 0:
            wait = 0.0
        elif income <= 0:
            wait = math.inf
        else:
            wait = shortfall / income

        money = 0.0 if math.isinf(wait) else max(0.0, money + income * wait - upgrade.cost)
        elapsed = math.inf if math.isinf(wait) else elapsed + wait
        after = income + upgrade.income_gain

        steps.append(
            QueueStep(
                order=order, upgrade=upgrade, income_before=income, income_after=after,
                wait_seconds=wait, cumulative_seconds=elapsed,
            )
        )
        income = after

    return steps


# ---------------------------------------------------------------------------
# 재투자 성장 곡선
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class GrowthPoint:
    hour: float
    money_earned: float
    income: float


def reinvestment_curve(
    starting_income: float,
    hours: float = 24.0,
    reinvest_ratio: float = 0.8,
    efficiency: float = 1e-6,
    steps: int = 48,
) -> list[GrowthPoint]:
    """번 돈의 일부를 업그레이드에 넣었을 때의 수입 성장 곡선.

    efficiency 는 '1원을 업그레이드에 넣으면 초당 수입이 얼마나 오르는가'다.
    게임이 공개한 값이 아니라 사용자가 자기 상황에 맞춰 넣는 값이므로,
    절대 수치를 맞히는 도구가 아니라 '재투자 비율을 바꾸면 얼마나 달라지나'를
    비교하는 도구로 쓴다.
    """
    steps = max(1, int(steps))
    hours = max(0.0, float(hours))
    ratio = min(1.0, max(0.0, float(reinvest_ratio)))
    income = max(0.0, float(starting_income))
    dt = (hours * 3600.0) / steps

    earned = 0.0
    points = [GrowthPoint(0.0, 0.0, income)]
    for step in range(1, steps + 1):
        produced = income * dt
        earned += produced * (1.0 - ratio)
        income += produced * ratio * max(0.0, float(efficiency))
        points.append(GrowthPoint((step * dt) / 3600.0, earned, income))
    return points


# ---------------------------------------------------------------------------
# 스피드 훈련
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class TrainingEstimate:
    current_speed: float
    target_speed: float
    gap: float
    rate_per_second: float
    seconds: float

    @property
    def is_reachable(self) -> bool:
        return math.isfinite(self.seconds)


def training_time(
    current_speed: float,
    target_speed: float,
    speed_per_tick: float,
    seconds_per_tick: float = 1.0,
    trail_multiplier: float = 1.0,
) -> TrainingEstimate:
    """러닝머신으로 목표 스피드까지 걸리는 시간.

    speed_per_tick 은 러닝머신 1회(또는 1초)에 오르는 스피드, trail_multiplier 는
    트레일 배율이다. 둘 다 인게임 수치가 자주 바뀌므로 사용자가 직접 넣는다.
    """
    current = max(0.0, float(current_speed))
    target = max(0.0, float(target_speed))
    gap = max(0.0, target - current)

    tick = max(1e-9, float(seconds_per_tick))
    rate = (max(0.0, float(speed_per_tick)) * max(0.0, float(trail_multiplier))) / tick

    if gap <= 0:
        seconds = 0.0
    elif rate <= 0:
        seconds = math.inf
    else:
        seconds = gap / rate

    return TrainingEstimate(current, target, gap, rate, seconds)


# ---------------------------------------------------------------------------
# 런 기대값
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class RunEstimate:
    eggs_per_run: float
    success_rate: float
    value_per_egg: float
    seconds_per_run: float
    expected_value: float
    value_per_hour: float
    runs_per_hour: float


def run_value(
    eggs_per_run: float,
    success_rate: float,
    value_per_egg: float,
    seconds_per_run: float,
) -> RunEstimate:
    """한 번 털러 갔을 때 기대 수익과 시간당 효율.

    잡히면 런 전체를 잃기 때문에, 성공률이 기대값에 그대로 곱해진다.
    """
    eggs = max(0.0, float(eggs_per_run))
    rate = min(1.0, max(0.0, float(success_rate)))
    value = max(0.0, float(value_per_egg))
    seconds = max(0.0, float(seconds_per_run))

    expected = eggs * rate * value
    runs_per_hour = (3600.0 / seconds) if seconds > 0 else 0.0

    return RunEstimate(
        eggs_per_run=eggs, success_rate=rate, value_per_egg=value,
        seconds_per_run=seconds, expected_value=expected,
        value_per_hour=expected * runs_per_hour, runs_per_hour=runs_per_hour,
    )
