"""앱 아이콘(.ico)을 코드로 생성한다.

외부 이미지 파일을 저장소에 넣지 않으려고 Qt 로 직접 그린다.
ICO 컨테이너는 PNG 를 그대로 품을 수 있어서(Vista 이상) 각 크기를 PNG 로 렌더해 담는다.
"""
from __future__ import annotations

import struct
import sys
from pathlib import Path

from PySide6.QtCore import QBuffer, QByteArray, QPointF, QRectF, Qt
from PySide6.QtGui import QBrush, QColor, QFont, QImage, QLinearGradient, QPainter, QPainterPath
from PySide6.QtWidgets import QApplication

SIZES = (16, 24, 32, 48, 64, 128, 256)
BG_TOP = "#1b1f2b"
BG_BOTTOM = "#0e1016"
EGG_TOP = "#ffe08a"
EGG_BOTTOM = "#f5b301"


def render(size: int) -> QImage:
    image = QImage(size, size, QImage.Format_ARGB32)
    image.fill(Qt.transparent)

    painter = QPainter(image)
    painter.setRenderHint(QPainter.Antialiasing, True)
    painter.setRenderHint(QPainter.TextAntialiasing, True)

    # 둥근 사각형 배경
    backdrop = QLinearGradient(0, 0, 0, size)
    backdrop.setColorAt(0.0, QColor(BG_TOP))
    backdrop.setColorAt(1.0, QColor(BG_BOTTOM))
    radius = size * 0.22
    painter.setPen(Qt.NoPen)
    painter.setBrush(QBrush(backdrop))
    painter.drawRoundedRect(QRectF(0, 0, size, size), radius, radius)

    # 계란
    egg_width = size * 0.46
    egg_height = size * 0.60
    centre_x = size / 2
    centre_y = size * 0.50

    egg = QPainterPath()
    egg.moveTo(centre_x, centre_y - egg_height / 2)
    egg.cubicTo(
        QPointF(centre_x + egg_width * 0.62, centre_y - egg_height * 0.28),
        QPointF(centre_x + egg_width * 0.55, centre_y + egg_height / 2),
        QPointF(centre_x, centre_y + egg_height / 2),
    )
    egg.cubicTo(
        QPointF(centre_x - egg_width * 0.55, centre_y + egg_height / 2),
        QPointF(centre_x - egg_width * 0.62, centre_y - egg_height * 0.28),
        QPointF(centre_x, centre_y - egg_height / 2),
    )

    shell = QLinearGradient(0, centre_y - egg_height / 2, 0, centre_y + egg_height / 2)
    shell.setColorAt(0.0, QColor(EGG_TOP))
    shell.setColorAt(1.0, QColor(EGG_BOTTOM))
    painter.setBrush(QBrush(shell))
    painter.drawPath(egg)

    # 큰 크기에서만 하이라이트와 눈금을 넣는다 (작은 크기에선 뭉개짐)
    if size >= 48:
        painter.setBrush(QColor(255, 255, 255, 70))
        painter.drawEllipse(
            QRectF(
                centre_x - egg_width * 0.30,
                centre_y - egg_height * 0.30,
                egg_width * 0.28,
                egg_height * 0.22,
            )
        )

        painter.setPen(QColor(26, 20, 0, 190))
        font = QFont()
        font.setBold(True)
        font.setPixelSize(int(size * 0.30))
        painter.setFont(font)
        painter.drawText(
            QRectF(0, centre_y - egg_height * 0.10, size, egg_height * 0.55),
            Qt.AlignHCenter | Qt.AlignVCenter,
            "$",
        )

    painter.end()
    return image


def to_png_bytes(image: QImage) -> bytes:
    # QByteArray 를 지역 변수로 붙잡아 둬야 QBuffer 가 살아 있는 동안 해제되지 않는다.
    storage = QByteArray()
    buffer = QBuffer(storage)
    buffer.open(QBuffer.WriteOnly)
    image.save(buffer, "PNG")
    buffer.close()
    return bytes(storage)


def write_ico(target: Path, payloads: list[tuple[int, bytes]]) -> None:
    """ICONDIR + ICONDIRENTRY[] + PNG 데이터."""
    count = len(payloads)
    header = struct.pack("<HHH", 0, 1, count)
    offset = len(header) + count * 16

    entries = bytearray()
    body = bytearray()
    for size, png in payloads:
        entries += struct.pack(
            "<BBBBHHII",
            0 if size >= 256 else size,   # width  (0 == 256)
            0 if size >= 256 else size,   # height
            0,                            # 팔레트 없음
            0,                            # reserved
            1,                            # color planes
            32,                           # bits per pixel
            len(png),
            offset,
        )
        body += png
        offset += len(png)

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(header + bytes(entries) + bytes(body))


def main() -> int:
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("src/eggmate/data/icon.ico")
    _app = QApplication.instance() or QApplication([])  # QPainter 에 필요
    payloads = [(size, to_png_bytes(render(size))) for size in SIZES]
    write_ico(target, payloads)
    print(f"{target} ({target.stat().st_size:,} bytes, {len(SIZES)} sizes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
