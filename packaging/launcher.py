"""PyInstaller 전용 진입점.

`eggmate/__main__.py` 는 `python -m eggmate` 를 위해 상대 임포트를 쓰는데,
PyInstaller 는 진입 스크립트를 최상위 모듈로 실행하기 때문에 상대 임포트가 깨진다.
그래서 번들 진입점만 절대 임포트로 따로 둔다.
"""
import sys

from eggmate.ui.app import main

if __name__ == "__main__":
    sys.exit(main())
