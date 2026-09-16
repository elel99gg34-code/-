#!/usr/bin/env node
/* Installer artwork: the MUI welcome/finish sidebar and header strip,
 * drawn with the same rasterizer as the icon and written as plain BMPs
 * (NSIS only accepts BMP for these slots).
 *
 *   node scripts/make-installer-art.js
 *
 * Output: build/installer-sidebar.bmp (164x314), build/installer-header.bmp (150x57)
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const OUT = path.join(__dirname, '..', 'build');
const SS = 4;

const INK = [12, 12, 15];
const RIOT = [255, 46, 99];
const ACID = [216, 255, 62];
const PAPER = [237, 236, 234];
const DIM = [110, 109, 118];

/* ------------------------------------------------------------------ *
 * Canvas (RGB, no alpha — BMP has no use for it here)
 * ------------------------------------------------------------------ */
function canvas(w, h, bg) {
  const W = w * SS;
  const H = h * SS;
  const px = new Float32Array(W * H * 3);
  for (let i = 0; i < W * H; i++) { px[i * 3] = bg[0]; px[i * 3 + 1] = bg[1]; px[i * 3 + 2] = bg[2]; }
  return {
    w, h, W, H, px,
    set(x, y, c, a = 1) {
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      const i = (y * W + x) * 3;
      px[i] = px[i] * (1 - a) + c[0] * a;
      px[i + 1] = px[i + 1] * (1 - a) + c[1] * a;
      px[i + 2] = px[i + 2] * (1 - a) + c[2] * a;
    },
    rect(x0, y0, x1, y1, c) {
      for (let y = Math.max(0, Math.round(y0)); y < Math.min(H, Math.round(y1)); y++) {
        for (let x = Math.max(0, Math.round(x0)); x < Math.min(W, Math.round(x1)); x++) this.set(x, y, c);
      }
    },
    poly(pts, c) {
      let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;
      for (const [x, y] of pts) {
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
      }
      for (let y = Math.max(0, Math.floor(minY)); y < Math.min(H, Math.ceil(maxY)); y++) {
        for (let x = Math.max(0, Math.floor(minX)); x < Math.min(W, Math.ceil(maxX)); x++) {
          if (inside(pts, x + 0.5, y + 0.5)) this.set(x, y, c);
        }
      }
    }
  };
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

/* ------------------------------------------------------------------ *
 * 5x7 bitmap type — just the glyphs the installer needs
 * ------------------------------------------------------------------ */
const FONT = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  '0': [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '3': [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  '.': [0, 0, 0, 0, 0, 0b11, 0b11],
  ' ': [0, 0, 0, 0, 0, 0, 0]
};

/** Draw text at (x,y) in canvas pixels, `px` per font dot, `track` extra gap. */
function text(c, str, x, y, px, color, track = 1) {
  let cx = x;
  for (const ch of str.toUpperCase()) {
    const g = FONT[ch];
    if (!g) { cx += (5 + track) * px; continue; }
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (g[row] & (1 << (4 - col))) c.rect(cx + col * px, y + row * px, cx + (col + 1) * px, y + (row + 1) * px, color);
      }
    }
    cx += (5 + track) * px;
  }
  return cx - x;
}

function textWidth(str, px, track = 1) { return str.length * (5 + track) * px - track * px; }

/* ------------------------------------------------------------------ *
 * Downsample + BMP
 * ------------------------------------------------------------------ */
function resolve(c) {
  const out = Buffer.alloc(c.w * c.h * 3);
  const n = SS * SS;
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * c.W + (x * SS + sx)) * 3;
          r += c.px[i]; g += c.px[i + 1]; b += c.px[i + 2];
        }
      }
      const o = (y * c.w + x) * 3;
      out[o] = Math.round(r / n); out[o + 1] = Math.round(g / n); out[o + 2] = Math.round(b / n);
    }
  }
  return out;
}

/** 24-bit BI_RGB, bottom-up, rows padded to 4 bytes — the shape NSIS wants. */
function encodeBmp(rgb, w, h) {
  const rowBytes = w * 3;
  const pad = (4 - (rowBytes % 4)) % 4;
  const dataSize = (rowBytes + pad) * h;
  const out = Buffer.alloc(54 + dataSize);

  out.write('BM', 0, 'ascii');
  out.writeUInt32LE(54 + dataSize, 2);
  out.writeUInt32LE(54, 10);
  out.writeUInt32LE(40, 14);
  out.writeInt32LE(w, 18);
  out.writeInt32LE(h, 22);
  out.writeUInt16LE(1, 26);
  out.writeUInt16LE(24, 28);
  out.writeUInt32LE(0, 30);
  out.writeUInt32LE(dataSize, 34);
  out.writeInt32LE(2835, 38);
  out.writeInt32LE(2835, 42);

  let p = 54;
  for (let y = h - 1; y >= 0; y--) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      out[p++] = rgb[i + 2];   // B
      out[p++] = rgb[i + 1];   // G
      out[p++] = rgb[i];       // R
    }
    p += pad;
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * The two pieces of art
 * ------------------------------------------------------------------ */
function pentagon(cx, cy, R) {
  return [
    [cx, cy - R],
    [cx + R * 0.951, cy - R * 0.309],
    [cx + R * 0.588, cy + R * 0.809],
    [cx - R * 0.588, cy + R * 0.809],
    [cx - R * 0.951, cy - R * 0.309]
  ];
}

function sidebar(version) {
  const c = canvas(164, 314, INK);
  const W = c.W;
  const H = c.H;

  /* a faint step-sequencer grid in the background */
  for (let i = 0; i <= 8; i++) c.rect((W / 8) * i, 0, (W / 8) * i + 1, H, [26, 26, 32]);
  for (let i = 0; i <= 16; i++) c.rect(0, (H / 16) * i, W, (H / 16) * i + 1, [22, 22, 28]);

  /* a handful of lit steps, like a pattern mid-edit */
  const lit = [[0, 2], [2, 5], [3, 9], [5, 1], [6, 12], [1, 14], [7, 7]];
  for (const [x, y] of lit) {
    c.rect((W / 8) * x + 3, (H / 16) * y + 3, (W / 8) * (x + 1) - 3, (H / 16) * (y + 1) - 3, [34, 20, 28]);
  }

  /* mark */
  const cx = W / 2;
  const cy = H * 0.34;
  const R = W * 0.30;
  c.poly(pentagon(cx, cy, R), RIOT);
  c.poly([
    [cx - R * 1.25, cy + R * 0.22],
    [cx + R * 1.25, cy + R * 0.06],
    [cx + R * 1.25, cy + R * 0.06 + H * 0.022],
    [cx - R * 1.25, cy + R * 0.22 + H * 0.022]
  ], ACID);

  /* wordmark */
  const px = 3 * SS;
  const w1 = textWidth('RIOT', px);
  text(c, 'RIOT', cx - w1 / 2, H * 0.60, px, PAPER, 1);
  const px2 = 2 * SS;
  const w2 = textWidth('MACHINE', px2, 2);
  text(c, 'MACHINE', cx - w2 / 2, H * 0.60 + px * 9, px2, RIOT, 2);

  const px3 = 1 * SS;
  const v = 'V ' + version.replace(/[^0-9.]/g, '');
  const w3 = textWidth(v, px3, 2);
  text(c, v, cx - w3 / 2, H * 0.60 + px * 9 + px2 * 12, px3, DIM, 2);

  /* bottom rule + ticks */
  c.rect(0, H - 10 * SS, W, H - 9 * SS, [40, 40, 48]);
  for (let i = 0; i < 5; i++) {
    const bw = W * 0.05;
    const x = cx - bw * 4.4 + i * bw * 2.2;
    const hgt = [0.9, 0.35, 0.6, 0.3, 0.75][i] * H * 0.022;
    c.rect(x, H - 6 * SS - hgt, x + bw, H - 6 * SS, i % 2 === 0 ? PAPER : DIM);
  }

  return encodeBmp(resolve(c), c.w, c.h);
}

function header() {
  /* The MUI header sits on a white page, so this one is light. */
  const c = canvas(150, 57, [255, 255, 255]);
  const W = c.W;
  const H = c.H;
  const cx = W * 0.22;
  const cy = H * 0.5;
  const R = H * 0.3;
  c.poly(pentagon(cx, cy, R), RIOT);
  const px = 1.6 * SS;
  text(c, 'RIOT', W * 0.42, H * 0.26, px, [24, 24, 28], 1);
  text(c, 'MACHINE', W * 0.42, H * 0.56, px * 0.8, [150, 150, 158], 1);
  return encodeBmp(resolve(c), c.w, c.h);
}

function main() {
  const version = require(path.join(__dirname, '..', 'package.json')).version;
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'installer-sidebar.bmp'), sidebar(version));
  fs.writeFileSync(path.join(OUT, 'installer-header.bmp'), header());
  console.log('installer art written to ' + OUT);
  console.log('  installer-sidebar.bmp  164x314');
  console.log('  installer-header.bmp   150x57');
}

main();
