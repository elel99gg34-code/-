"""빌드된 실행 파일이 실제로 뜨는지 확인한다.

GUI 앱이라 종료 코드로 판단할 수 없어서, 띄운 뒤 몇 초 살아 있는지를 본다.
바로 죽으면 DLL 누락이나 데이터 파일 누락일 가능성이 높다.
"""
from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

GRACE_SECONDS = 12


def main() -> int:
    if len(sys.argv) < 2:
        print("사용법: verify_build.py <실행파일 경로>")
        return 2

    exe = Path(sys.argv[1])
    if not exe.exists():
        print(f"FAIL: 실행 파일이 없습니다 — {exe}")
        return 1

    size_mb = exe.stat().st_size / (1024 * 1024)
    print(f"실행 파일: {exe} ({size_mb:.1f} MB)")

    bundled = exe.parent / "_internal" / "eggmate" / "data" / "gamedata.json"
    if not bundled.exists():
        bundled = exe.parent / "eggmate" / "data" / "gamedata.json"
    if not bundled.exists():
        print("FAIL: gamedata.json 이 번들에 포함되지 않았습니다.")
        return 1
    print(f"데이터 파일 확인: {bundled}")

    # 1) 창 없이 데이터 로딩만 점검 — 실패하면 즉시 이유가 찍힌다.
    #    windowed 빌드는 stdout 이 없을 수 있어서 결과를 파일로도 받는다.
    with tempfile.TemporaryDirectory() as tmp:
        report_path = Path(tmp) / "selftest.txt"
        env = dict(os.environ, EGGMATE_SELFTEST_REPORT=str(report_path))
        selftest = subprocess.run(
            [str(exe), "--selftest"], capture_output=True, timeout=180, env=env
        )
        piped = (selftest.stdout + selftest.stderr).decode(errors="replace").strip()
        written = report_path.read_text(encoding="utf-8").strip() if report_path.exists() else ""

    report = written or piped
    print(report or "(출력 없음 — windowed 빌드에서는 정상입니다)")
    if selftest.returncode != 0:
        print(f"FAIL: --selftest 가 종료 코드 {selftest.returncode} 로 끝났습니다.")
        return 1
    if report and "SELFTEST OK" not in report:
        print("FAIL: --selftest 가 성공을 보고하지 않았습니다.")
        return 1
    if not report:
        print("경고: 자체 점검 출력이 비어 있습니다. 종료 코드만으로 판단합니다.")

    # 2) 실제로 창을 띄워 보고 바로 죽지 않는지 확인
    process = subprocess.Popen([str(exe)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    deadline = time.time() + GRACE_SECONDS
    while time.time() < deadline:
        if process.poll() is not None:
            stdout, stderr = process.communicate()
            print(f"FAIL: {GRACE_SECONDS}초 안에 종료됨 (코드 {process.returncode})")
            print(stdout.decode(errors="replace")[-4000:])
            print(stderr.decode(errors="replace")[-4000:])
            return 1
        time.sleep(0.5)

    process.terminate()
    try:
        process.wait(timeout=10)
    except subprocess.TimeoutExpired:
        process.kill()

    print(f"OK: {GRACE_SECONDS}초 동안 정상적으로 떠 있었습니다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
