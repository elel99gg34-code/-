#!/usr/bin/env node
/* Generates the app icon set with no image dependencies:
 * a small rasterizer -> PNG (via zlib) -> ICO container.
 *
 *   node scripts/make-icons.js
 *
 * Output: build/icon.png, build/icon.ico, build/icons/<size>x<size>.png
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const OUT = path.join(__dirname, '..', 'build');
const OUT_ICONS = path.join(OUT, 'icons');

/* ------------------------------------------------------------------ *
 * Tiny RGBA canvas with 4x supersampling
 * ------------------------------------------------------------------ */
const SS = 4;

function canvas(size) {
  const w = size * SS;
  const px = new Float32Array(w * w * 4);
  return {
    size, w, px,
    set(x, y, r, g, b, a) {
      const i = (y * w + x) * 4;
      const ia = 1 - a;
      px[i] = px[i] * ia + r * a;
      px[i + 1] = px[i + 1] * ia + g * a;
      px[i + 2] = px[i + 2] * ia + b * a;
      px[i + 3] = px[i + 3] * ia + 255 * a;
    }
  };
}

function fillRoundRect(c, x0, y0, x1, y1, radius, color) {
  const [r, g, b, a = 1] = color;
  for (let y = Math.max(0, Math.floor(y0)); y < Math.min(c.w, Math.ceil(y1)); y++) {
    for (let x = Math.max(0, Math.floor(x0)); x < Math.min(c.w, Math.ceil(x1)); x++) {
      const dx = Math.max(x0 + radius - x, 0, x - (x1 - radius));
      const dy = Math.max(y0 + radius - y, 0, y - (y1 - radius));
      if (dx * dx + dy * dy <= radius * radius) c.set(x, y, r, g, b, a);
    }
  }
}

function fillPolygon(c, pts, color) {
  const [r, g, b, a = 1] = color;
  let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;
  for (const [x, y] of pts) {
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
  }
  for (let y = Math.max(0, Math.floor(minY)); y < Math.min(c.w, Math.ceil(maxY)); y++) {
    for (let x = Math.max(0, Math.floor(minX)); x < Math.min(c.w, Math.ceil(maxX)); x++) {
      if (inside(pts, x + 0.5, y + 0.5)) c.set(x, y, r, g, b, a);
    }
  }
}

function inside(pts, x, y) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Downsample the supersampled buffer to a straight RGBA byte array. */
function resolve(c) {
  const out = Buffer.alloc(c.size * c.size * 4);
  const n = SS * SS;
  for (let y = 0; y < c.size; y++) {
    for (let x = 0; x < c.size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * c.w + (x * SS + sx)) * 4;
          r += c.px[i]; g += c.px[i + 1]; b += c.px[i + 2]; a += c.px[i + 3];
        }
      }
      const o = (y * c.size + x) * 4;
      out[o] = Math.round(r / n);
      out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n);
      out[o + 3] = Math.round(a / n);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * The mark
 * ------------------------------------------------------------------ */
const INK = [10, 10, 13];
const RIOT = [255, 46, 99];
const ACID = [216, 255, 62];
const PAPER = [237, 236, 234];

function drawIcon(size) {
  const c = canvas(size);
  const W = c.w;
  const pad = W * 0.055;

  /* plate */
  fillRoundRect(c, pad, pad, W - pad, W - pad, W * 0.14, INK);
  fillRoundRect(c, pad, pad, W - pad, W - pad * 1.0, W * 0.14, [22, 22, 27, 1]);
  fillRoundRect(c, pad * 1.35, pad * 1.35, W - pad * 1.35, W - pad * 1.35, W * 0.115, INK);

  /* pentagon mark, same geometry as the in-app logo */
  const cx = W / 2;
  const cy = W * 0.5;
  const R = W * 0.315;
  const penta = [
    [cx, cy - R],
    [cx + R * 0.951, cy - R * 0.309],
    [cx + R * 0.588, cy + R * 0.809],
    [cx - R * 0.588, cy + R * 0.809],
    [cx - R * 0.951, cy - R * 0.309]
  ];
  fillPolygon(c, penta, RIOT);

  /* xerox slashes: one thin misprint gap, one highlighter stripe that
   * deliberately overshoots the mark */
  const slash = (y, tilt, h, color, reach) => fillPolygon(c, [
    [cx - R * reach, y],
    [cx + R * reach, y - tilt],
    [cx + R * reach, y - tilt + h],
    [cx - R * reach, y + h]
  ], color);

  slash(cy - R * 0.30, R * 0.13, W * 0.030, INK, 0.92);
  slash(cy + R * 0.22, R * 0.15, W * 0.062, ACID, 1.12);

  /* bottom tick marks — the step sequencer, abstracted */
  const bw = W * 0.055;
  const by = W - pad * 2.6;
  for (let i = 0; i < 5; i++) {
    const x = cx - bw * 4.4 + i * bw * 2.2;
    const h = [0.9, 0.35, 0.6, 0.3, 0.75][i] * W * 0.06;
    fillRoundRect(c, x, by - h, x + bw, by, bw * 0.3, i % 2 === 0 ? PAPER : [110, 109, 118]);
  }

  return resolve(c);
}

/* ------------------------------------------------------------------ *
 * PNG
 * ------------------------------------------------------------------ */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(rgba, size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;                       // filter type 0
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;      // bit depth
  ihdr[9] = 6;      // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ------------------------------------------------------------------ *
 * ICO (PNG payloads, which Windows Vista and newer read natively)
 * ------------------------------------------------------------------ */
function encodeIco(entries) {
  const dir = Buffer.alloc(6 + entries.length * 16);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(entries.length, 4);

  let offset = dir.length;
  entries.forEach((e, i) => {
    const p = 6 + i * 16;
    dir[p] = e.size >= 256 ? 0 : e.size;
    dir[p + 1] = e.size >= 256 ? 0 : e.size;
    dir[p + 2] = 0;
    dir[p + 3] = 0;
    dir.writeUInt16LE(1, p + 4);        // planes
    dir.writeUInt16LE(32, p + 6);       // bits per pixel
    dir.writeUInt32LE(e.png.length, p + 8);
    dir.writeUInt32LE(offset, p + 12);
    offset += e.png.length;
  });

  return Buffer.concat([dir, ...entries.map((e) => e.png)]);
}

/* ------------------------------------------------------------------ */
function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(OUT_ICONS, { recursive: true });

  const icoSizes = [16, 24, 32, 48, 64, 128, 256];
  const pngSizes = [16, 32, 48, 64, 128, 256, 512];

  const cache = new Map();
  const png = (size) => {
    if (!cache.has(size)) cache.set(size, encodePng(drawIcon(size), size));
    return cache.get(size);
  };

  for (const s of pngSizes) {
    fs.writeFileSync(path.join(OUT_ICONS, `${s}x${s}.png`), png(s));
  }
  fs.writeFileSync(path.join(OUT, 'icon.png'), png(512));
  fs.writeFileSync(path.join(OUT, 'icon.ico'), encodeIco(icoSizes.map((s) => ({ size: s, png: png(s) }))));

  const ico = fs.statSync(path.join(OUT, 'icon.ico'));
  console.log(`icons written to ${OUT}`);
  console.log(`  icon.ico   ${icoSizes.join(', ')} px  (${(ico.size / 1024).toFixed(1)} KB)`);
  console.log(`  icon.png   512 px`);
  console.log(`  icons/     ${pngSizes.join(', ')} px`);
}

main();
