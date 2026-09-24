"""펫 도감 - 검색/필터 가능한 전체 펫 목록."""
from __future__ import annotations

from PySide6.QtWidgets import (
    QCheckBox,
    QComboBox,
    QLineEdit,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from ...core import fmt
from .. import theme, widgets
from ..context import AppContext

ALL = "전체"
HEADERS = ["★", "펫", "영문명", "바이옴", "등급", "기본 수입 $/s", "한국어 표기", "비고"]


class IndexTab(QWidget):
    def __init__(self, ctx: AppContext) -> None:
        super().__init__()
        self.ctx = ctx
        dataset = ctx.dataset
        self.dataset = dataset

        self.search = QLineEdit()
        self.search.setPlaceholderText("펫 이름 검색 (한글/영문 모두 가능)")
        self.search.setClearButtonEnabled(True)

        self.biome_filter = QComboBox()
        self.biome_filter.addItem(ALL)
        for biome in sorted(dataset.biomes, key=lambda b: b.order):
            self.biome_filter.addItem(biome.label, biome.name)
        extra_biomes = {p.biome for p in dataset.pets} - {b.name for b in dataset.biomes}
        for name in sorted(extra_biomes):
            self.biome_filter.addItem(name, name)

        self.rarity_filter = QComboBox()
        self.rarity_filter.addItem(ALL)
        for rarity in sorted(dataset.rarities, key=lambda r: r.order):
            self.rarity_filter.addItem(rarity.label, rarity.name)

        self.sort_mode = QComboBox()
        self.sort_mode.addItems(["수입 높은 순", "수입 낮은 순", "바이옴 순", "이름 순"])

        self.only_favorites = QCheckBox("즐겨찾기만")
        self.only_missing = QCheckBox("아직 없는 것만")

        self.star_button = QPushButton("★ 즐겨찾기 토글")
        self.star_button.clicked.connect(self.toggle_favorite)
        self.inventory_button = QPushButton("인벤토리에 추가")
        self.inventory_button.setProperty("accent", "true")
        self.inventory_button.clicked.connect(self.add_to_inventory)
        self.wishlist_button = QPushButton("위시리스트에 추가")
        self.wishlist_button.clicked.connect(self.add_to_wishlist)

        self.count_label = widgets.hint("")
        self.table = widgets.make_table(HEADERS, stretch_column=7, min_rows=14)

        controls = widgets.form()
        controls.addRow("검색", self.search)
        controls.addRow("바이옴", self.biome_filter)
        controls.addRow("등급", self.rarity_filter)
        controls.addRow("정렬", self.sort_mode)
        controls.addRow("", widgets.row(self.only_favorites, self.only_missing))

        layout = QVBoxLayout(self)
        layout.setContentsMargins(14, 14, 14, 14)
        layout.setSpacing(10)
        layout.addWidget(widgets.group("필터", controls))
        layout.addWidget(widgets.row(self.star_button, self.inventory_button, self.wishlist_button))
        layout.addWidget(self.count_label)
        layout.addWidget(self.table, 1)
        layout.addWidget(
            widgets.hint(
                f"데이터 버전 {dataset.data_version} · 수입은 기본 무게 기준입니다. "
                "무게와 뮤테이션을 반영한 실제 수입은 [수입 계산기] 탭에서 계산하세요."
            )
        )

        for control in (self.search, self.biome_filter, self.rarity_filter, self.sort_mode,
                        self.only_favorites, self.only_missing):
            widgets.debounce_connect(control, self.refresh)
        for signal in (ctx.bus.inventory_changed, ctx.bus.hatches_changed,
                       ctx.bus.wishlist_changed, ctx.bus.settings_changed):
            signal.connect(self.refresh)
        self.refresh()

    # ------------------------------------------------------------------
    def _selected_pet(self):
        row = self.table.currentRow()
        names = getattr(self, "_visible", [])
        return names[row] if 0 <= row < len(names) else None

    def toggle_favorite(self) -> None:
        pet = self._selected_pet()
        if pet is None:
            return
        self.ctx.settings.toggle_favorite(pet.name)
        self.ctx.save_settings()
        self.refresh()

    def add_to_inventory(self) -> None:
        pet = self._selected_pet()
        if pet is None:
            return
        self.ctx.inventory.add(pet.name)
        self.ctx.bus.inventory_changed.emit()
        self.refresh()

    def add_to_wishlist(self) -> None:
        pet = self._selected_pet()
        if pet is None:
            return
        self.ctx.wishlist.add(pet.name, priority=2)
        self.ctx.bus.wishlist_changed.emit()
        self.refresh()

    def refresh(self) -> None:
        self.dataset = self.ctx.dataset
        owned = self.ctx.owned_pets()
        favorites = set(self.ctx.settings.favorites)
        query = self.search.text().strip().lower()
        biome = self.biome_filter.currentData()
        rarity = self.rarity_filter.currentData()

        pets = list(self.dataset.pets)
        if query:
            pets = [p for p in pets if query in p.name.lower() or query in p.ko.lower()]
        if biome:
            pets = [p for p in pets if p.biome == biome]
        if rarity:
            pets = [p for p in pets if p.rarity == rarity]
        if self.only_favorites.isChecked():
            pets = [p for p in pets if p.name in favorites]
        if self.only_missing.isChecked():
            pets = [p for p in pets if p.name not in owned]

        mode = self.sort_mode.currentText()
        if mode == "수입 높은 순":
            pets.sort(key=lambda p: (p.income is not None, p.income or 0), reverse=True)
        elif mode == "수입 낮은 순":
            pets.sort(key=lambda p: (p.income is None, p.income or 0))
        elif mode == "바이옴 순":
            pets.sort(key=lambda p: (self.dataset.biome_order(p.biome),
                                     self.dataset.rarity_order(p.rarity)))
        else:
            pets.sort(key=lambda p: p.ko)

        rows = []
        for pet in pets:
            rarity_def = self.dataset.rarity(pet.rarity)
            colour = rarity_def.color if rarity_def else theme.TEXT
            biome_def = self.dataset.biome(pet.biome)
            rows.append([
                widgets.cell("★" if pet.name in favorites else "",
                             color=theme.ACCENT, align_right=True),
                widgets.cell(pet.ko + ("  ✔" if pet.name in owned else ""), color=colour),
                widgets.cell(pet.name),
                widgets.cell(biome_def.ko if biome_def else pet.biome),
                widgets.cell(rarity_def.ko if rarity_def else pet.rarity, color=colour),
                widgets.cell(fmt.compact(pet.income), align_right=True),
                widgets.cell(fmt.korean(pet.income), align_right=True),
                widgets.cell(pet.note or ("수입 미확인" if not pet.has_income else "")),
            ])
        widgets.fill_table(self.table, rows)
        self._visible = pets

        unknown = sum(1 for p in pets if not p.has_income)
        suffix = f" (수입 미확인 {unknown}종 포함)" if unknown else ""
        self.count_label.setText(
            f"{len(pets)} / {len(self.dataset.pets)} 종 표시 중{suffix} · "
            f"보유 {len(owned)}종 · 즐겨찾기 {len(favorites)}종  (✔ = 보유, ★ = 즐겨찾기)"
        )
