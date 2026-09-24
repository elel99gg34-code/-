"""GUI 스모크 테스트 — 모든 화면을 실제로 만들고 계산 경로를 한 번씩 태운다.

CI 에서 offscreen 플랫폼으로 돌린다. 임포트 누락이나 위젯 조립 실수는 단위 테스트로는
잡히지 않기 때문에 이 단계가 필요하다.
"""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
# 기록이 개발자 홈을 건드리지 않도록 임시 폴더로 돌린다.
_TEMP = tempfile.mkdtemp(prefix="eggmate-smoke-")
os.environ["APPDATA"] = _TEMP
os.environ["XDG_DATA_HOME"] = _TEMP
os.environ["HOME"] = _TEMP

from PySide6.QtWidgets import QApplication  # noqa: E402

from eggmate.core.diagnostics import configure_stdio  # noqa: E402
from eggmate.ui import context as context_module  # noqa: E402
from eggmate.ui.app import MainWindow, main as app_main  # noqa: E402

EXPECTED_SECTIONS = [
    "대시보드", "펫 도감", "도감 완성도", "인벤토리", "펜 빌더", "수입 계산기",
    "확률 계산기", "시뮬레이터", "퓨즈 판단", "부화 기록", "진행 플래너",
    "성장 기록", "설정", "정보",
]


def page(window: MainWindow, name: str):
    return window.pages.widget(window.section_names.index(name))


def main() -> int:  # noqa: C901  (스모크 테스트는 넓게 훑는 게 목적)
    configure_stdio()
    app = QApplication([])

    ctx = context_module.create()
    window = MainWindow(ctx)
    window.resize(1240, 860)
    window.show()
    app.processEvents()

    if window.section_names != EXPECTED_SECTIONS:
        print(f"FAIL: 화면 구성이 다릅니다.\n  기대: {EXPECTED_SECTIONS}\n  실제: {window.section_names}")
        return 1

    for index in range(window.sidebar.count()):
        window.sidebar.setCurrentRow(index)
        app.processEvents()

    # --- 계산 경로 ---
    income_tab = page(window, "수입 계산기")
    income_tab.base_input.setText("22000")
    income_tab.ratio_input.setValue(150)
    income_tab.target_input.setText("5m")
    income_tab.recalculate()
    assert income_tab.compare_table.rowCount() > 0, "뮤테이션 비교표가 비어 있음"
    assert income_tab._as_text(), "복사용 텍스트가 비어 있음"

    odds_tab = page(window, "확률 계산기")
    odds_tab.rate_input.setText("0.01%")
    odds_tab.attempts.setValue(5000)
    odds_tab.dry_input.setValue(2500)
    odds_tab.recalculate()
    assert odds_tab.thresholds.rowCount() == 4, "확신도 표가 4행이 아님"
    assert odds_tab.multi_table.rowCount() == 3, "다중 목표 표가 3행이 아님"
    odds_tab.rate_input.setText("완전히 잘못된 값")
    odds_tab.recalculate()   # 예외 없이 안내만 떠야 한다

    simulator = page(window, "시뮬레이터")
    simulator.trials.setValue(2000)
    simulator.run()
    simulator.run_session()
    assert simulator.percentile_table.rowCount() == 8, "분위 표가 8행이 아님"
    assert simulator.session_table.rowCount() > 0, "세션 표가 비어 있음"

    # --- 인벤토리 → 펜 빌더 연동 ---
    inventory = page(window, "인벤토리")
    for _ in range(4):
        inventory.add_item()
    assert inventory.table.rowCount() >= 4, "인벤토리에 추가되지 않음"

    pen_tab = page(window, "펜 빌더")
    pen_tab.slots.setValue(2)
    pen_tab.recalculate()
    assert pen_tab.equipped_table.rowCount() == 2, "펜 빌더가 슬롯 수만큼 채우지 않음"
    pen_tab.apply_plan()
    assert inventory.ctx.inventory.equipped(), "장착 저장이 반영되지 않음"

    collection_tab = page(window, "도감 완성도")
    collection_tab.refresh()
    assert collection_tab.biome_table.rowCount() > 0, "바이옴별 표가 비어 있음"
    collection_tab.missing_table.setCurrentCell(0, 0)
    collection_tab.add_to_wishlist()

    tracker = page(window, "부화 기록")
    tracker.add_record()
    tracker.refresh()

    growth = page(window, "성장 기록")
    growth.speed_input.setText("250k")
    growth.income_input.setText("900k")
    growth.record_point()
    growth.refresh_queue()
    growth.refresh_training()
    growth.refresh_run()
    growth.refresh_reinvest()
    assert growth.queue_table.rowCount() == 3, "업그레이드 큐가 3행이 아님"

    planner_tab = page(window, "진행 플래너")
    planner_tab.speed_input.setText("250000")
    planner_tab.refresh_speed()
    assert planner_tab.biome_table.rowCount() > 0, "바이옴 표가 비어 있음"

    fuse_tab = page(window, "퓨즈 판단")
    fuse_tab.input_base.setText("22000")
    fuse_tab.result_base.setText("120000")
    fuse_tab.recalculate()
    assert fuse_tab.verdict.text(), "퓨즈 판정이 비어 있음"

    dashboard = page(window, "대시보드")
    dashboard.refresh()
    assert dashboard.card_collection.value_label.text() != "—", "대시보드가 갱신되지 않음"

    # 대시보드와 펜 빌더는 같은 인벤토리를 보므로 총수입이 일치해야 한다.
    # (예전에 대시보드만 수량을 빠뜨려 서로 다른 값을 내놓은 적이 있다.)
    from eggmate.core.pen import build, candidates_from_inventory

    equipped = ctx.inventory.equipped()
    expected = build(
        candidates_from_inventory(ctx.dataset, equipped),
        slots=sum(i.quantity for i in equipped),
        model=ctx.dataset.income_model,
    ).total_income
    shown = dashboard.card_income.value_label.text()
    from eggmate.core import fmt as fmt_module

    if shown != fmt_module.compact(expected) + "/s":
        print(f"FAIL: 대시보드 총수입이 계산값과 다릅니다 — 표시 {shown}, 기대 {fmt_module.compact(expected)}/s")
        return 1

    # --- 설정: 테마 · 프로필 ---
    settings_tab = page(window, "설정")
    window.toggle_theme()
    app.processEvents()
    assert ctx.settings.theme == "light", "테마 전환이 반영되지 않음"
    window.toggle_theme()
    ctx.use_profile("스모크부캐")
    app.processEvents()
    assert ctx.db.profile == "스모크부캐", "프로필 전환 실패"
    assert ctx.hatches.count() == 0, "프로필이 분리되지 않음"
    ctx.use_profile("기본")
    settings_tab.refresh()

    # --- 검색 ---
    hits = window._search_hits("키츠")
    assert any(h.label == "키츠네" for h in hits), "검색이 펫을 찾지 못함"
    assert window._search_hits(""), "빈 검색이 화면 목록을 내놓지 않음"

    # --- 백업 ---
    archive = ctx.db.backup_to(Path(_TEMP) / "backup.zip")
    assert archive.exists(), "백업 파일이 만들어지지 않음"

    window.reload_dataset()
    app.processEvents()
    window.close()

    print(f"OK: 화면 {len(EXPECTED_SECTIONS)}개가 모두 정상 동작합니다 — {', '.join(EXPECTED_SECTIONS)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
