# -*- mode: python ; coding: utf-8 -*-
"""PyInstaller 스펙 — onedir 빌드. Inno Setup 이 이 폴더를 그대로 담는다."""

from pathlib import Path

from PyInstaller.utils.hooks import collect_submodules

ROOT = Path(SPECPATH).parent
SRC = ROOT / "src"
DATA = SRC / "eggmate" / "data"

datas = [
    (str(DATA / "gamedata.json"), "eggmate/data"),
    (str(DATA / "icon.ico"), "eggmate/data"),
]

# 쓰지 않는 Qt 모듈을 빼서 배포 크기를 줄인다.
excludes = [
    "PySide6.Qt3DAnimation", "PySide6.Qt3DCore", "PySide6.Qt3DExtras",
    "PySide6.Qt3DInput", "PySide6.Qt3DLogic", "PySide6.Qt3DRender",
    "PySide6.QtCharts", "PySide6.QtDataVisualization", "PySide6.QtQuick",
    "PySide6.QtQuick3D", "PySide6.QtQuickWidgets", "PySide6.QtQml",
    "PySide6.QtWebEngineCore", "PySide6.QtWebEngineWidgets", "PySide6.QtWebEngineQuick",
    "PySide6.QtMultimedia", "PySide6.QtMultimediaWidgets", "PySide6.QtPdf",
    "PySide6.QtPdfWidgets", "PySide6.QtBluetooth", "PySide6.QtNfc",
    "PySide6.QtPositioning", "PySide6.QtLocation", "PySide6.QtSerialPort",
    "PySide6.QtSensors", "PySide6.QtTest", "PySide6.QtDesigner",
    "PySide6.QtHelp", "PySide6.QtSql", "PySide6.QtOpenGL", "PySide6.QtOpenGLWidgets",
    "PySide6.QtSvgWidgets", "PySide6.QtNetworkAuth", "PySide6.QtRemoteObjects",
    "PySide6.QtScxml", "PySide6.QtStateMachine", "PySide6.QtTextToSpeech",
    "PySide6.QtUiTools", "PySide6.QtXml", "PySide6.QtConcurrent",
    "PySide6.QtHttpServer", "PySide6.QtWebSockets", "PySide6.QtWebChannel",
    "tkinter", "unittest", "pydoc", "doctest", "pytest", "numpy", "PIL",
]

a = Analysis(
    [str(Path(SPECPATH) / "launcher.py")],
    pathex=[str(SRC)],
    binaries=[],
    datas=datas,
    hiddenimports=collect_submodules("eggmate"),
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=excludes,
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="EggMate",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=False,          # GUI 앱이므로 콘솔 창 없음
    # True: 예외가 나도 모달 traceback 대화상자를 띄우지 않는다.
    # 대화상자는 아무도 닫아 주지 않는 환경(CI, 자동 실행)에서 프로세스를 매달리게 한다.
    disable_windowed_traceback=True,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=str(DATA / "icon.ico"),
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=False,
    upx_exclude=[],
    name="EggMate",
)
