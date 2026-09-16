import json

import pytest

from eggmate.core import dataset as dataset_module
from eggmate.core.dataset import DatasetError


def test_bundled_dataset_loads(dataset):
    assert dataset.pets
    assert dataset.biomes
    assert dataset.mutations
    assert dataset.data_version != "unknown"


def test_every_pet_references_known_biome_and_rarity(dataset):
    known_biomes = {b.name for b in dataset.biomes} | {"Monster Egg"}
    known_rarities = {r.name for r in dataset.rarities}
    for pet in dataset.pets:
        assert pet.biome in known_biomes, f"{pet.name} 의 바이옴 {pet.biome} 이 정의되지 않음"
        assert pet.rarity in known_rarities, f"{pet.name} 의 등급 {pet.rarity} 이 정의되지 않음"


def test_pet_names_are_unique(dataset):
    names = [p.name for p in dataset.pets]
    assert len(names) == len(set(names))


def test_biome_speeds_increase_with_order(dataset):
    ordered = sorted(dataset.biomes, key=lambda b: b.order)
    speeds = [b.speed_required for b in ordered]
    assert speeds == sorted(speeds), "바이옴 순서와 요구 스피드가 어긋남"


def test_mutation_none_is_identity(dataset):
    none = dataset.mutation("None")
    assert none is not None and none.multiplier == 1.0


def test_rainbow_is_the_strongest_mutation(dataset):
    best = max(dataset.mutations, key=lambda m: m.multiplier)
    assert best.name == "Rainbow"


def test_higher_rarity_generally_earns_more(dataset):
    """같은 바이옴 안에서는 등급이 높을수록 수입이 높아야 한다."""
    by_biome: dict[str, list] = {}
    for pet in dataset.pets_with_income:
        by_biome.setdefault(pet.biome, []).append(pet)
    for biome, pets in by_biome.items():
        ranked = sorted(pets, key=lambda p: dataset.rarity_order(p.rarity))
        incomes = [p.income for p in ranked]
        assert incomes == sorted(incomes), f"{biome} 의 등급/수입 순서가 어긋남"


def test_lookup_helpers(dataset):
    assert dataset.pet("Kitsune").income == 1_800_000_000
    assert dataset.biome("Cosmic").speed_required == 700_000_000
    assert dataset.pet("does-not-exist") is None


def test_parse_rejects_missing_sections():
    with pytest.raises(DatasetError):
        dataset_module.parse({"rarities": [], "biomes": []})


def test_parse_rejects_non_object():
    with pytest.raises(DatasetError):
        dataset_module.parse([])  # type: ignore[arg-type]


def test_parse_rejects_empty_pet_list():
    with pytest.raises(DatasetError):
        dataset_module.parse({"rarities": [], "biomes": [], "mutations": [], "pets": []})


def test_load_from_reports_bad_json(tmp_path):
    broken = tmp_path / "broken.json"
    broken.write_text("{ not json", encoding="utf-8")
    with pytest.raises(DatasetError, match="JSON 파싱 실패"):
        dataset_module.load_from(broken)


def test_load_falls_back_when_user_copy_is_broken(tmp_path, monkeypatch):
    broken = tmp_path / "gamedata.json"
    broken.write_text("{ oops", encoding="utf-8")
    monkeypatch.setattr(dataset_module, "user_data_path", lambda: broken)
    ds, path = dataset_module.load()
    assert ds.pets and path != broken


def test_install_user_copy_round_trips(tmp_path, monkeypatch):
    target = tmp_path / "sub" / "gamedata.json"
    monkeypatch.setattr(dataset_module, "user_data_path", lambda: target)
    written = dataset_module.install_user_copy()
    assert written.exists()
    assert json.loads(written.read_text(encoding="utf-8"))["pets"]
