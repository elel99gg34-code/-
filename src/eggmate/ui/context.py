"""화면들이 공유하는 상태 묶음.

데이터셋·DB·설정을 한 군데 모아서 탭마다 따로 열지 않게 한다. 한 탭에서 바뀐 내용이
다른 탭에 바로 반영되도록 변경 신호도 여기서 쏜다.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PySide6.QtCore import QObject, Signal

from ..core import dataset as dataset_module
from ..core import settings as settings_module
from ..core.models import Dataset
from ..core.settings import Settings
from ..core.storage import Database, HatchLog, Inventory, Timeline, Wishlist


class Bus(QObject):
    """탭 사이의 변경 알림."""

    inventory_changed = Signal()
    hatches_changed = Signal()
    wishlist_changed = Signal()
    timeline_changed = Signal()
    settings_changed = Signal()
    profile_changed = Signal()
    dataset_changed = Signal()

    def everything_changed(self) -> None:
        for signal in (
            self.inventory_changed, self.hatches_changed, self.wishlist_changed,
            self.timeline_changed, self.settings_changed,
        ):
            signal.emit()


@dataclass
class AppContext:
    dataset: Dataset
    data_path: Path
    db: Database
    settings: Settings
    bus: Bus

    # --- 저장소 -------------------------------------------------------
    @property
    def hatches(self) -> HatchLog:
        return HatchLog(self.db)

    @property
    def inventory(self) -> Inventory:
        return Inventory(self.db)

    @property
    def wishlist(self) -> Wishlist:
        return Wishlist(self.db)

    @property
    def timeline(self) -> Timeline:
        return Timeline(self.db)

    # --- 설정 ---------------------------------------------------------
    def save_settings(self) -> bool:
        saved = settings_module.save(self.settings)
        self.bus.settings_changed.emit()
        return saved

    def use_profile(self, name: str) -> None:
        self.db.use_profile(name)
        self.settings.profile = self.db.profile
        settings_module.save(self.settings)
        self.bus.profile_changed.emit()
        self.bus.everything_changed()

    def reload_dataset(self) -> None:
        self.dataset, self.data_path = dataset_module.load()
        self.bus.dataset_changed.emit()

    # --- 보유 펫 집합 -------------------------------------------------
    def owned_pets(self) -> set[str]:
        """인벤토리와 부화 기록을 합친 '본 적 있는 펫' 집합."""
        return self.inventory.distinct_pets() | self.hatches.distinct_pets()

    def close(self) -> None:
        self.db.close()


def create(db_path: Path | str | None = None) -> AppContext:
    """설정을 읽고 그 설정이 가리키는 프로필로 DB 를 연다."""
    settings = settings_module.load()
    data, data_path = dataset_module.load()
    db = Database(db_path, profile=settings.profile)
    return AppContext(
        dataset=data, data_path=data_path, db=db, settings=settings, bus=Bus()
    )
