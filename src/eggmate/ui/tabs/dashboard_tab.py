"""대시보드 — 지금 내 상태를 한 화면에."""
from __future__ import annotations

from PySide6.QtWidgets import QPushButton, QVBoxLayout, QWidget

from ...core import collection, fmt, planner
from ...core.pen import build, candidates_from_inventory
from .. import theme, widgets
from ..context import AppContext


class DashboardTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx

        self.card_profile = widgets.StatCard("프로필")
        self.card_income = widgets.StatCard("장착 펫 총수입")
        self.card_collection = widgets.StatCard("도감 완성도")
        self.card_inventory = widgets.StatCard("보유 펫")
        self.card_hatches = widgets.StatCard("부화 기록")
        self.card_speed = widgets.StatCard("최근 스피드")

        cards = widgets.card_grid([
            self.card_profile, self.card_income, self.card_collection,
            self.card_inventory, self.card_hatches, self.card_speed,
        ], columns=3)

        self.next_goal = widgets.metric("—")
        self.milestones = widgets.hint("")
        self.wish_table = widgets.make_table(["우선순위", "노리는 펫", "바이옴", "등급", "메모"], min_rows=5)
        self.fuse_table = widgets.make_table(["펫", "보유 수", "퓨즈 가능 횟수"], min_rows=4)
        self.activity = widgets.BarChart(height=140)

        refresh = QPushButton("새로고침")
        refresh.clicked.connect(self.refresh)

        goal_form = widgets.form()
        goal_form.addRow("다음 목표 바이옴", self.next_goal)
        goal_form.addRow("", self.milestones)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.row(refresh))
        layout.addWidget(cards)
        layout.addWidget(widgets.group("다음 목표", goal_form))
        layout.addWidget(widgets.group("최근 14일 부화 활동", self.activity))
        layout.addWidget(widgets.group("위시리스트 (아직 못 얻은 것)", self.wish_table))
        layout.addWidget(widgets.group("퓨즈 가능한 중복 펫", self.fuse_table))
        layout.addStretch(1)

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        for signal in (ctx.bus.inventory_changed, ctx.bus.hatches_changed,
                       ctx.bus.wishlist_changed, ctx.bus.timeline_changed,
                       ctx.bus.profile_changed, ctx.bus.dataset_changed):
            signal.connect(self.refresh)
        self.refresh()

    # ------------------------------------------------------------------
    def refresh(self) -> None:
        data = self.ctx.dataset
        inventory = self.ctx.inventory
        hatches = self.ctx.hatches

        self.card_profile.set_value(
            self.ctx.db.profile, f"프로필 {len(self.ctx.db.profiles())}개"
        )

        candidates = candidates_from_inventory(data, inventory.equipped())
        plan = build(candidates, slots=len(candidates), model=data.income_model)
        self.card_income.set_value(
            fmt.compact(plan.total_income) + "/s",
            f"장착 {len(candidates)}마리 · 시간당 {fmt.compact(plan.total_income * 3600)}",
        )

        owned = self.ctx.owned_pets()
        progress = collection.progress(data, owned)
        self.card_collection.set_value(
            f"{progress.percent:.0f}%", f"{progress.owned} / {progress.total}종"
        )

        self.card_inventory.set_value(
            f"{inventory.total_quantity():,}", f"서로 다른 {len(inventory.distinct_pets())}종"
        )

        hatch_count = hatches.count()
        by_rarity = hatches.counts_by("rarity")
        best = max(
            (r for r in data.rarities if by_rarity.get(r.name)),
            key=lambda r: r.order, default=None,
        )
        self.card_hatches.set_value(
            f"{hatch_count:,}", f"최고 등급 {best.ko}" if best else "아직 기록 없음"
        )

        latest = self.ctx.timeline.latest()
        if latest and latest.speed:
            self.card_speed.set_value(fmt.compact(latest.speed), latest.created_at[:10])
        else:
            self.card_speed.set_value("—", "성장 기록 탭에서 입력하세요")

        self._refresh_goal(latest.speed if latest and latest.speed else 0.0)
        self._refresh_activity()
        self._refresh_wishlist()
        self._refresh_fuse()

    def _refresh_goal(self, speed: float) -> None:
        target = planner.next_target(self.ctx.dataset, speed)
        if speed <= 0:
            self.next_goal.setText("스피드를 기록하면 계산됩니다")
            self.milestones.setText("[성장 기록] 탭에서 현재 스피드를 남겨 보세요.")
            return
        if target is None:
            self.next_goal.setText("전 바이옴 개방 완료")
            self.milestones.setText("이제 무게와 뮤테이션 싸움입니다.")
            return
        self.next_goal.setText(target.biome.ko)
        self.milestones.setText(
            f"{fmt.compact(target.shortfall)} 더 필요 · "
            f"안전선까지 {fmt.compact(target.needed_for_safe)}"
        )

    def _refresh_activity(self) -> None:
        daily = self.ctx.hatches.daily_counts()
        recent = list(daily.items())[-14:]
        self.activity.set_bars(
            [(day[5:], float(count)) for day, count in recent],
            f"총 {sum(count for _, count in recent)}회",
        )

    def _refresh_wishlist(self) -> None:
        rows = []
        labels = {1: "높음", 2: "보통", 3: "낮음"}
        colors = {1: theme.BAD, 2: theme.WARN, 3: theme.TEXT_DIM}
        for item in self.ctx.wishlist.all(include_done=False):
            pet = self.ctx.dataset.pet(item.pet)
            rarity = self.ctx.dataset.rarity(pet.rarity) if pet else None
            biome = self.ctx.dataset.biome(pet.biome) if pet else None
            rows.append([
                widgets.cell(labels.get(item.priority, "보통"), color=colors.get(item.priority)),
                widgets.cell(pet.ko if pet else item.pet),
                widgets.cell(biome.ko if biome else (pet.biome if pet else "")),
                widgets.cell(rarity.ko if rarity else "", color=rarity.color if rarity else None),
                widgets.cell(item.note),
            ])
        widgets.fill_table(self.wish_table, rows)

    def _refresh_fuse(self) -> None:
        rows = []
        for pet_name, quantity in self.ctx.inventory.fuse_candidates():
            pet = self.ctx.dataset.pet(pet_name)
            rows.append([
                widgets.cell(pet.ko if pet else pet_name),
                widgets.cell(f"{quantity}", align_right=True),
                widgets.cell(f"{quantity // 3}회", align_right=True, color=theme.GOOD),
            ])
        widgets.fill_table(self.fuse_table, rows)
