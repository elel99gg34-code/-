import json

import pytest

from eggmate.core import settings as settings_module
from eggmate.core.settings import Settings


def test_defaults_are_sane():
    s = Settings()
    assert s.theme == "dark" and s.font_scale == 1.0 and s.profile


@pytest.mark.parametrize("theme,expected", [("light", "light"), ("dark", "dark"), ("neon", "dark")])
def test_theme_is_validated(theme, expected):
    assert Settings(theme=theme).normalised().theme == expected


@pytest.mark.parametrize("scale,expected", [(0.1, 0.8), (99.0, 1.6), (1.2, 1.2)])
def test_font_scale_is_clamped(scale, expected):
    assert Settings(font_scale=scale).normalised().font_scale == pytest.approx(expected)


def test_safety_margin_is_clamped():
    assert Settings(safety_margin=0.1).normalised().safety_margin == 1.0
    assert Settings(safety_margin=100).normalised().safety_margin == 10.0


def test_blank_profile_falls_back_to_the_default():
    assert Settings(profile="   ").normalised().profile == settings_module.DEFAULT_PROFILE


def test_duplicate_favorites_are_removed():
    assert Settings(favorites=["a", "b", "a"]).normalised().favorites == ["a", "b"]


def test_toggle_favorite_round_trips():
    s = Settings()
    assert s.toggle_favorite("Kitsune") is True
    assert s.is_favorite("Kitsune")
    assert s.toggle_favorite("Kitsune") is False
    assert not s.is_favorite("Kitsune")


def test_recent_calculations_are_newest_first():
    s = Settings()
    s.remember_calculation("수입", "첫번째")
    s.remember_calculation("수입", "두번째")
    assert s.recent_calculations[0]["summary"] == "두번째"


def test_recent_calculations_deduplicate():
    s = Settings()
    for _ in range(3):
        s.remember_calculation("수입", "같은것")
    assert len(s.recent_calculations) == 1


def test_recent_calculations_are_capped():
    s = Settings()
    for i in range(40):
        s.remember_calculation("수입", f"계산 {i}")
    assert len(s.recent_calculations) == 20


def test_save_and_load_round_trip(tmp_path):
    path = tmp_path / "settings.json"
    original = Settings(theme="light", font_scale=1.3, favorites=["Kitsune"], profile="부캐")
    assert settings_module.save(original, path)

    loaded = settings_module.load(path)
    assert loaded.theme == "light"
    assert loaded.font_scale == pytest.approx(1.3)
    assert loaded.favorites == ["Kitsune"]
    assert loaded.profile == "부캐"


def test_load_missing_file_returns_defaults(tmp_path):
    assert settings_module.load(tmp_path / "nope.json").theme == "dark"


def test_load_broken_json_returns_defaults(tmp_path):
    path = tmp_path / "broken.json"
    path.write_text("{ not json", encoding="utf-8")
    assert settings_module.load(path).theme == "dark"


def test_load_non_object_returns_defaults(tmp_path):
    path = tmp_path / "list.json"
    path.write_text("[1, 2, 3]", encoding="utf-8")
    assert settings_module.load(path).theme == "dark"


def test_load_ignores_unknown_keys(tmp_path):
    path = tmp_path / "extra.json"
    path.write_text(json.dumps({"theme": "light", "만든이": "누군가"}), encoding="utf-8")
    assert settings_module.load(path).theme == "light"


def test_load_survives_a_wrong_type(tmp_path):
    path = tmp_path / "bad.json"
    path.write_text(json.dumps({"font_scale": "커다랗게"}), encoding="utf-8")
    assert settings_module.load(path).font_scale == 1.0


def test_save_creates_missing_directories(tmp_path):
    assert settings_module.save(Settings(), tmp_path / "a" / "b" / "settings.json")


def test_save_reports_failure_instead_of_raising(tmp_path):
    blocker = tmp_path / "blocker"
    blocker.write_text("파일이라서 폴더를 못 만든다", encoding="utf-8")
    assert settings_module.save(Settings(), blocker / "settings.json") is False


def test_saved_file_is_readable_korean(tmp_path):
    path = tmp_path / "settings.json"
    settings_module.save(Settings(profile="부캐"), path)
    assert "부캐" in path.read_text(encoding="utf-8")
