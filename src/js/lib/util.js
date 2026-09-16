/* Small shared helpers. No dependencies, no side effects. */

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const dbToGain = (db) => Math.pow(10, db / 20);
export const gainToDb = (g) => 20 * Math.log10(Math.max(1e-6, g));

let _uid = 0;
export const uid = (p = 'id') => `${p}_${(Date.now() % 1e7).toString(36)}${(_uid++).toString(36)}`;

/** Deterministic PRNG (mulberry32) so "randomize" is reproducible from a seed. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (arr, r = Math.random) => arr[Math.floor(r() * arr.length) % arr.length];

/* ---------------------------------------------------------------- *
 * Pitch
 * ---------------------------------------------------------------- */
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const BLACK_KEYS = new Set([1, 3, 6, 8, 10]);

/** MIDI note -> Hz (A4 = 69 = 440Hz). */
export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
export const ftom = (f) => 69 + 12 * Math.log2(f / 440);

export function noteName(m) {
  const n = Math.round(m);
  return NOTE_NAMES[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1);
}

export const SCALES = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  minorPent: [0, 3, 5, 7, 10],
  majorPent: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  wholeTone: [0, 2, 4, 6, 8, 10],
  octatonic: [0, 1, 3, 4, 6, 7, 9, 10]
};

/** Snap a midi note into `scale` rooted at `root` (0-11). */
export function snapToScale(midi, root = 0, scaleName = 'minor') {
  const scale = SCALES[scaleName] || SCALES.chromatic;
  if (scale.length === 12) return midi;
  const rel = ((Math.round(midi) - root) % 12 + 12) % 12;
  const oct = Math.floor((Math.round(midi) - root) / 12);
  let best = scale[0];
  let bestD = 99;
  for (const s of scale) {
    const d = Math.min(Math.abs(s - rel), Math.abs(s + 12 - rel), Math.abs(s - 12 - rel));
    if (d < bestD) { bestD = d; best = s; }
  }
  return root + oct * 12 + best;
}

/* ---------------------------------------------------------------- *
 * Formatting
 * ---------------------------------------------------------------- */
export function fmtTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 100);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

export function fmtBytes(n) {
  if (!n) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
}

export function fmtDate(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  const now = Date.now();
  const diff = (now - ms) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

/* ---------------------------------------------------------------- *
 * DOM
 * ---------------------------------------------------------------- */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat(4)) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function clear(node) {
  while (node && node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/** Cheap structural clone that tolerates old JSON payloads. */
export const deepClone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

export function debounce(fn, ms = 120) {
  let t = 0;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function throttle(fn, ms = 60) {
  let last = 0; let pending = null;
  return (...a) => {
    const now = performance.now();
    if (now - last >= ms) { last = now; fn(...a); }
    else if (!pending) {
      pending = setTimeout(() => { pending = null; last = performance.now(); fn(...a); }, ms - (now - last));
    }
  };
}
