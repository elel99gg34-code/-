"""빌드된 실행 파일이 실제로 동작하는지 확인한다.

두 단계로 나눠 본다.
  1) --selftest : 창을 띄우지 않고 번들 데이터를 읽어 본다. 종료 코드로 판정.
  2) 실제 기동  : 창을 띄운 뒤 몇 초 살아 있는지 본다. 바로 죽으면 DLL/데이터 문제.

주의: console=False 로 빌드된 Windows exe 를 subprocess 파이프로 붙잡으면
파이프가 닫히지 않아 communicate() 가 영원히 기다리는 일이 있다. 그래서 출력은
파이프 대신 임시 파일로 받고, 결과 판정은 종료 코드와 보고 파일로 한다.
"""
from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

SELFTEST_TIMEOUT = 90
GRACE_SECONDS = 12


def _read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace").strip()
    except OSError:
        return ""


def _locate_bundled_data(exe: Path) -> Path | None:
    for candidate in (
        exe.parent / "_internal" / "eggmate" / "data" / "gamedata.json",
        exe.parent / "eggmate" / "data" / "gamedata.json",
    ):
        if candidate.exists():
            return candidate
    return None


def _run_detached(exe: Path, args: list[str], workdir: Path, timeout: float | None):
    """출력을 파일로 받아서 실행한다. (종료코드 또는 None=타임아웃, 출력)"""
    out_path = workdir / "stdout.txt"
    err_path = workdir / "stderr.txt"
    env = dict(os.environ, EGGMATE_SELFTEST_REPORT=str(workdir / "selftest.txt"))

    with out_path.open("wb") as out, err_path.open("wb") as err:
        process = subprocess.Popen([str(exe), *args], stdout=out, stderr=err, env=env)
        if timeout is None:
            return process, ""
        try:
            code = process.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
            code = None

    return code, "\n".join(p for p in (_read(out_path), _read(err_path)) if p)


def check_selftest(exe: Path) -> bool:
    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)
        code, piped = _run_detached(exe, ["--selftest"], workdir, SELFTEST_TIMEOUT)
        report = _read(workdir / "selftest.txt")

    detail = report or piped
    if detail:
        print(detail)

    if code is None:
        print(f"FAIL: --selftest 가 {SELFTEST_TIMEOUT}초 안에 끝나지 않았습니다.")
        return False
    if code != 0:
        print(f"FAIL: --selftest 종료 코드 {code}")
        return False
    if detail and "SELFTEST OK" not in detail:
        print("FAIL: --selftest 가 성공을 보고하지 않았습니다.")
        return False
    if not detail:
        print("경고: 자체 점검 출력이 비어 있습니다. 종료 코드 0 만으로 통과 처리합니다.")
    return True


def check_launch(exe: Path) -> bool:
    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)
        process, _ = _run_detached(exe, [], workdir, timeout=None)

        deadline = time.time() + GRACE_SECONDS
        while time.time() < deadline:
            if process.poll() is not None:
                print(f"FAIL: {GRACE_SECONDS}초 안에 종료됨 (코드 {process.returncode})")
                for name in ("stdout.txt", "stderr.txt"):
                    text = _read(workdir / name)
                    if text:
                        print(f"--- {name} ---\n{text[-4000:]}")
                return False
            time.sleep(0.5)

        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()

    print(f"OK: {GRACE_SECONDS}초 동안 정상적으로 떠 있었습니다.")
    return True


def main() -> int:
    if len(sys.argv) < 2:
        print("사용법: verify_build.py <실행파일 경로>")
        return 2

    exe = Path(sys.argv[1])
    if not exe.exists():
        print(f"FAIL: 실행 파일이 없습니다 — {exe}")
        return 1
    print(f"실행 파일: {exe} ({exe.stat().st_size / (1024 * 1024):.1f} MB)")

    bundled = _locate_bundled_data(exe)
    if bundled is None:
        print("FAIL: gamedata.json 이 번들에 포함되지 않았습니다.")
        return 1
    print(f"데이터 파일 확인: {bundled}")

    if not check_selftest(exe):
        return 1
    if not check_launch(exe):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
