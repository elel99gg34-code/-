"""도감 완성도 — 얼마나 모았고, 전부 모으려면 얼마나 걸리는가."""
from __future__ import annotations

import math

from PySide6.QtWidgets import QComboBox, QLineEdit, QPushButton, QVBoxLayout, QWidget

from ...core import collection, fmt, odds
from .. import theme, widgets
from ..context import AppContext


class CollectionTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx

        self.headline = widgets.big("—")
        self.bar = widgets.progress_row(0, 1)
        self.detail = widgets.hint("")

        self.rate_input = QLineEdit("0.5%")
        self.rate_input.setPlaceholderText("남은 종 하나당 평균 확률 (0.5% / 1/200)")
        self.seconds_input = QLineEdit("45")
        self.seconds_input.setPlaceholderText("부화 1회 소요 초")
        self.estimate = widgets.metric("—")
        self.estimate_detail = widgets.hint("")

        self.biome_table = widgets.make_table(["바이옴", "보유", "전체", "완성도", "남은 펫"], min_rows=11)
        self.rarity_table = widgets.make_table(["등급", "보유", "전체", "완성도", "남은 펫"], min_rows=10)
        self.missing_table = widgets.make_table(
            ["펫", "바이옴", "등급", "기본 수입 $/s", "위시리스트"], min_rows=12
        )

        self.filter_missing = QComboBox()
        self.filter_missing.addItem("전체", None)

        wish_button = QPushButton("선택한 펫을 위시리스트에 추가")
        wish_button.setProperty("accent", "true")
        wish_button.clicked.connect(self.add_to_wishlist)

        refresh = QPushButton("새로고침")
        refresh.clicked.connect(self.refresh)

        summary = widgets.form()
        summary.addRow("전체 완성도", self.headline)
        summary.addRow("", self.bar)
        summary.addRow("", self.detail)

        estimate_form = widgets.form()
        estimate_form.addRow("남은 종 평균 확률", self.rate_input)
        estimate_form.addRow("부화 1회 소요", self.seconds_input)
        estimate_form.addRow("전부 모으기까지", self.estimate)
        estimate_form.addRow("", self.estimate_detail)

        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(12)
        layout.addWidget(widgets.row(refresh))
        layout.addWidget(widgets.group("요약", summary))
        layout.addWidget(widgets.group("전부 모으는 데 걸리는 시간 (쿠폰 수집가 계산)", estimate_form))
        layout.addWidget(widgets.group("바이옴별", self.biome_table))
        layout.addWidget(widgets.group("등급별", self.rarity_table))
        layout.addWidget(widgets.group("아직 없는 펫", widgets.column(
            widgets.row(self.filter_missing, wish_button), self.missing_table
        )))
        layout.addWidget(widgets.hint(
            "보유 판정은 [인벤토리]에 넣은 펫과 [부화 기록]에 남긴 펫을 합쳐서 합니다. "
            "'전부 모으기'가 개별 확률보다 훨씬 오래 걸리는 이유는 마지막 한 종이 안 나오기 때문입니다."
        ))

        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(widgets.scrollable(inner))

        for signal in (ctx.bus.inventory_changed, ctx.bus.hatches_changed,
                       ctx.bus.wishlist_changed, ctx.bus.dataset_changed,
                       ctx.bus.profile_changed):
            signal.connect(self.refresh)
        self.filter_missing.currentIndexChanged.connect(self._fill_missing)
        self.rate_input.textChanged.connect(self._update_estimate)
        self.seconds_input.textChanged.connect(self._update_estimate)
        self._reload_filter()
        self.refresh()

    # ------------------------------------------------------------------
    def _reload_filter(self) -> None:
        current = self.filter_missing.currentData()
        self.filter_missing.blockSignals(True)
        self.filter_missing.clear()
        self.filter_missing.addItem("전체", None)
        for biome in sorted(self.ctx.dataset.biomes, key=lambda b: b.order):
            self.filter_missing.addItem(biome.ko, biome.name)
        index = self.filter_missing.findData(current)
        if index >= 0:
            self.filter_missing.setCurrentIndex(index)
        self.filter_missing.blockSignals(False)

    def refresh(self) -> None:
        self._owned = self.ctx.owned_pets()
        data = self.ctx.dataset
        overall = collection.progress(data, self._owned)

        self.headline.setText(f"{overall.percent:.1f}%")
        self.bar.setMaximum(max(1, overall.total))
        self.bar.setValue(overall.owned)
        self.bar.setFormat(f"{overall.owned} / {overall.total}종")
        self.detail.setText(
            f"{overall.owned}종 보유 · {len(overall.missing)}종 남음"
            + ("  🎉 도감 완성!" if overall.is_complete else "")
        )

        self._fill_group(self.biome_table, collection.progress_by(data, self._owned, "biome"),
                         lambda key: (data.biome(key).ko if data.biome(key) else key),
                         lambda key: data.biome_order(key))
        self._fill_group(self.rarity_table, collection.progress_by(data, self._owned, "rarity"),
                         lambda key: (data.rarity(key).ko if data.rarity(key) else key),
                         lambda key: data.rarity_order(key))
        self._reload_filter()
        self._fill_missing()
        self._update_estimate()

    def _fill_group(self, table, groups, label_of, order_of) -> None:
        rows = []
        for key in sorted(groups, key=order_of):
            group = groups[key]
            colour = theme.GOOD if group.is_complete else (
                theme.WARN if group.ratio >= 0.5 else theme.TEXT
            )
            rows.append([
                widgets.cell(label_of(key), color=colour),
                widgets.cell(f"{group.owned}", align_right=True),
                widgets.cell(f"{group.total}", align_right=True),
                widgets.cell(f"{group.percent:.0f}%", align_right=True, color=colour),
                widgets.cell(f"{len(group.missing)}", align_right=True),
            ])
        widgets.fill_table(table, rows)

    def _fill_missing(self) -> None:
        data = self.ctx.dataset
        wanted = self.filter_missing.currentData()
        pending = self.ctx.wishlist.pending_pets()

        rows = []
        for pet in data.pets:
            if pet.name in getattr(self, "_owned", set()):
                continue
            if wanted and pet.biome != wanted:
                continue
            rarity = data.rarity(pet.rarity)
            biome = data.biome(pet.biome)
            rows.append([
                widgets.cell(pet.ko, color=rarity.color if rarity else None),
                widgets.cell(biome.ko if biome else pet.biome),
                widgets.cell(rarity.ko if rarity else pet.rarity,
                             color=rarity.color if rarity else None),
                widgets.cell(fmt.compact(pet.income), align_right=True),
                widgets.cell("★ 등록됨" if pet.name in pending else "",
                             color=theme.ACCENT if pet.name in pending else None),
            ])
        widgets.fill_table(self.missing_table, rows)
        self._missing_names = [
            p.name for p in data.pets
            if p.name not in getattr(self, "_owned", set()) and (not wanted or p.biome == wanted)
        ]

    def add_to_wishlist(self) -> None:
        row = self.missing_table.currentRow()
        names = getattr(self, "_missing_names", [])
        if row < 0 or row >= len(names):
            return
        self.ctx.wishlist.add(names[row], priority=2)
        self.ctx.bus.wishlist_changed.emit()
        self._fill_missing()

    def _update_estimate(self) -> None:
        remaining = len(getattr(self, "_missing_names", [])) or len(
            collection.progress(self.ctx.dataset, getattr(self, "_owned", set())).missing
        )
        if remaining == 0:
            self.estimate.setText("이미 전부 모았습니다")
            widgets.set_role(self.estimate, "good")
            self.estimate_detail.setText("")
            return

        try:
            rate = odds.parse_rate(self.rate_input.text())
        except ValueError:
            self.estimate.setText("—")
            self.estimate_detail.setText("확률을 0.5% 또는 1/200 형식으로 입력하세요.")
            widgets.set_role(self.estimate_detail, "bad")
            return

        attempts = collection.expected_attempts([rate] * remaining)
        try:
            seconds_each = max(0.0, float(self.seconds_input.text() or 0))
        except ValueError:
            seconds_each = 0.0

        self.estimate.setText(
            f"{attempts:,.0f}번" if math.isfinite(attempts) else "계산 불가"
        )
        widgets.set_role(self.estimate, "metric")

        single = (1 / rate) if rate > 0 else math.inf
        self.estimate_detail.setText(
            f"남은 {remaining}종 기준 · 한 종만 노릴 때({single:,.0f}번)의 "
            f"{attempts / single:.1f}배"
            + (f" · 약 {fmt.duration(attempts * seconds_each)}" if seconds_each > 0 else "")
        )
        widgets.set_role(self.estimate_detail, "hint")
