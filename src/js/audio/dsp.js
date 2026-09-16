/* Raw DSP material: wavetables, distortion curves, noise, impulse responses.
 *
 * Everything here is generated per AudioContext and cached on the context
 * object itself, so the live context and each offline render context build
 * their own copies exactly once. */

import { clamp, rng } from '../lib/util.js';

const CACHE = new WeakMap();
function bank(ctx) {
  let b = CACHE.get(ctx);
  if (!b) { b = { waves: new Map(), curves: new Map(), noise: new Map(), ir: new Map() }; CACHE.set(ctx, b); }
  return b;
}

/* ------------------------------------------------------------------ *
 * Wavetables (band-limited via additive synthesis + PeriodicWave)
 * ------------------------------------------------------------------ */

const HARMONICS = 96;

/** Harmonic recipes. Each returns [real[], imag[]] of length HARMONICS+1. */
const WAVE_RECIPES = {
  /* Classic analogue shapes, additively band-limited so they never alias. */
  saw(n) { return 2 / (Math.PI * n) * (n % 2 ? 1 : -1) * -1; },
  square(n) { return n % 2 ? 4 / (Math.PI * n) : 0; },
  tri(n) { return n % 2 ? (8 / (Math.PI * Math.PI * n * n)) * ((n - 1) / 2 % 2 ? -1 : 1) : 0; },
  pulse25(n) { return (2 / (Math.PI * n)) * Math.sin(Math.PI * n * 0.25); },
  pulse12(n) { return (2 / (Math.PI * n)) * Math.sin(Math.PI * n * 0.125); },

  /* Hollow / reedy characters. */
  hollow(n) { return n % 2 ? 1 / (n * n) * 6 : 1 / (n * n * n) * 2; },
  reed(n) { return Math.sin(n * 1.7) / (n * 0.8 + 1); },
  organ(n) { return [1, 0.5, 0, 0.35, 0, 0, 0, 0.22][n - 1] || 0; },

  /* Aggressive / digital characters for the punk end of the rack. */
  razor(n) { return (1 / Math.pow(n, 0.72)) * (n % 3 === 0 ? -1 : 1); },
  grind(n) { return (1 / Math.pow(n, 0.55)) * Math.cos(n * 2.399); },
  metal(n) { return (1 / Math.pow(n, 0.4)) * (Math.sin(n * 4.1) > 0 ? 1 : -1) * (n > 3 ? 1 : 0.4); },
  glass(n) { return n <= 24 ? Math.exp(-n / 9) * (n % 2 ? 1 : 0.4) : 0; },
  bell(n) { return [1, 0, 0.6, 0, 0.45, 0, 0, 0.3, 0, 0, 0.18][n - 1] || (n < 30 ? 0.05 / n : 0); },
  vox(n) { /* crude formant stack around 700/1200/2600 Hz at a 110Hz fundamental */
    const f = [1, 0.75, 0.5, 0.85, 0.7, 0.9, 0.55, 0.3, 0.2, 0.32, 0.4, 0.28, 0.16, 0.1];
    return (f[n - 1] || 0.6 / n) / Math.pow(n, 0.35);
  },
  buzz(n) { return n <= 48 ? 1 / Math.pow(n, 0.25) : 0; },
  wire(n) { return (n % 2 ? 1 : 0.5) / Math.pow(n, 0.85) * Math.cos(n * 0.9); },
  fifth(n) { /* saw + saw a fifth up baked into one table */
    const a = 2 / (Math.PI * n) * (n % 2 ? 1 : -1) * -1;
    const b = n % 3 === 0 ? 2 / (Math.PI * (n / 3)) * 0.6 : 0;
    return a + b;
  },
  sub(n) { return n === 1 ? 1 : n === 2 ? 0.12 : n === 3 ? 0.05 : 0; }
};

/** Native oscillator types pass straight through. */
const NATIVE = new Set(['sine', 'sawtooth', 'square', 'triangle']);

export function waveFor(ctx, name) {
  if (NATIVE.has(name)) return null;
  const b = bank(ctx);
  if (b.waves.has(name)) return b.waves.get(name);

  const recipe = WAVE_RECIPES[name] || WAVE_RECIPES.saw;
  const real = new Float32Array(HARMONICS + 1);
  const imag = new Float32Array(HARMONICS + 1);
  let peak = 0;
  for (let n = 1; n <= HARMONICS; n++) {
    const v = recipe(n) || 0;
    imag[n] = v;
    peak += Math.abs(v);
  }
  if (peak > 0) for (let n = 1; n <= HARMONICS; n++) imag[n] /= peak * 0.55;

  const wave = ctx.createPeriodicWave(real, imag, { disableNormalization: false });
  b.waves.set(name, wave);
  return wave;
}

export const WAVE_NAMES = ['sine', 'sawtooth', 'square', 'triangle', ...Object.keys(WAVE_RECIPES)];

/** Apply a wave name to an oscillator node. */
export function setWave(ctx, osc, name) {
  if (NATIVE.has(name)) { osc.type = name; return; }
  const w = waveFor(ctx, name);
  if (w) osc.setPeriodicWave(w); else osc.type = 'sawtooth';
}

/* ------------------------------------------------------------------ *
 * Distortion curves
 * ------------------------------------------------------------------ */

const N_CURVE = 2048;

const CURVE_SHAPES = {
  /* k is 0..1 drive. */
  soft: (x, k) => Math.tanh(x * (1 + k * 14)),
  tube: (x, k) => {
    const d = 1 + k * 10;
    const y = x * d;
    return (y < 0 ? -1 : 1) * (1 - Math.exp(-Math.abs(y))) * (1 - 0.18 * Math.abs(Math.sin(y * 0.5)));
  },
  hard: (x, k) => clamp(x * (1 + k * 24), -0.88, 0.88) / 0.88,
  fuzz: (x, k) => {
    const d = 1 + k * 40;
    const y = x * d;
    return Math.sign(y) * Math.pow(Math.min(1, Math.abs(y)), 0.42);
  },
  diode: (x, k) => {
    const d = 1 + k * 18;
    const y = x * d;
    return (Math.exp(0.7 * y) - Math.exp(-0.3 * y)) / (Math.exp(0.7 * y) + Math.exp(-0.3 * y) + 0.5);
  },
  fold: (x, k) => {
    let y = x * (1 + k * 8);
    for (let i = 0; i < 4; i++) y = Math.abs(y) > 1 ? Math.sign(y) * (2 - Math.abs(y % 4 > 2 ? 4 - (y % 4) : y % 4)) : y;
    return Math.sin(x * (1 + k * 7) * Math.PI * 0.5) * 0.85 + y * 0.15;
  },
  rect: (x, k) => {
    const y = Math.tanh(x * (1 + k * 12));
    return y * (1 - k * 0.5) + Math.abs(y) * k * 0.5 - k * 0.22;
  },
  crush: (x, k) => {
    const steps = Math.max(2, Math.round(64 * Math.pow(1 - k, 2.4)) + 2);
    return Math.round(x * steps) / steps;
  },
  saturate: (x, k) => {
    const d = 1 + k * 5;
    const y = x * d;
    return y / Math.sqrt(1 + y * y) * 1.2;
  },
  destroy: (x, k) => {
    const y = x * (1 + k * 30);
    return Math.sign(Math.sin(y * 2.2)) * Math.min(1, Math.abs(Math.tanh(y))) * 0.8 + Math.tanh(y) * 0.2;
  }
};

export const CURVE_NAMES = Object.keys(CURVE_SHAPES);

/** Curves are quantized to 40 drive steps so we cache at most 40 per shape. */
export function curveFor(ctx, shape = 'soft', drive = 0.5) {
  const k = clamp(drive, 0, 1);
  const q = Math.round(k * 40) / 40;
  const key = shape + ':' + q;
  const b = bank(ctx);
  if (b.curves.has(key)) return b.curves.get(key);

  const fn = CURVE_SHAPES[shape] || CURVE_SHAPES.soft;
  const c = new Float32Array(N_CURVE);
  let peak = 1e-6;
  for (let i = 0; i < N_CURVE; i++) {
    const x = (i / (N_CURVE - 1)) * 2 - 1;
    const y = fn(x, q);
    c[i] = isFinite(y) ? y : 0;
    peak = Math.max(peak, Math.abs(c[i]));
  }
  /* Normalize so raising drive changes texture, not just loudness. */
  if (peak > 1e-6) for (let i = 0; i < N_CURVE; i++) c[i] /= peak;

  b.curves.set(key, c);
  return c;
}

/* ------------------------------------------------------------------ *
 * Noise
 * ------------------------------------------------------------------ */

/** color: white | pink | brown | blue | violet | metal | crackle | vinyl */
export function noiseBuffer(ctx, color = 'white', seconds = 3) {
  const key = color + ':' + seconds;
  const b = bank(ctx);
  if (b.noise.has(key)) return b.noise.get(key);

  const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  const r = rng(color.length * 7919 + 13);

  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let last = 0, brown = 0;
    for (let i = 0; i < len; i++) {
      const w = r() * 2 - 1;
      let v;
      switch (color) {
        case 'pink': {
          /* Paul Kellet's refined pink filter. */
          b0 = 0.99886 * b0 + w * 0.0555179;
          b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.96900 * b2 + w * 0.1538520;
          b3 = 0.86650 * b3 + w * 0.3104856;
          b4 = 0.55000 * b4 + w * 0.5329522;
          b5 = -0.7616 * b5 - w * 0.0168980;
          v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
          b6 = w * 0.115926;
          break;
        }
        case 'brown':
          brown = (brown + 0.02 * w) / 1.02;
          v = brown * 3.5;
          break;
        case 'blue':
          v = (w - last) * 0.6; last = w;
          break;
        case 'violet':
          v = (w - last) * 1.0; last = w;
          break;
        case 'metal': {
          /* Ring-ish noise: summed inharmonic partials plus a noise floor. */
          const t = i / ctx.sampleRate;
          v = 0;
          const P = [2371, 3142, 4189, 5231, 6473, 7919];
          for (let p = 0; p < P.length; p++) v += Math.sin(2 * Math.PI * P[p] * t + p) / P.length;
          v = v * 0.7 + w * 0.3;
          break;
        }
        case 'crackle':
          v = r() < 0.004 ? (r() * 2 - 1) * 1.6 : w * 0.06;
          break;
        case 'vinyl': {
          brown = (brown + 0.02 * w) / 1.02;
          v = brown * 1.6 + (r() < 0.0018 ? (r() * 2 - 1) * 1.2 : 0) + w * 0.05;
          break;
        }
        default:
          v = w;
      }
      d[i] = clamp(v, -1, 1);
    }
  }

  b.noise.set(key, buf);
  return buf;
}

/* ------------------------------------------------------------------ *
 * Impulse responses for the convolution reverb
 * ------------------------------------------------------------------ */

/** kind: room | hall | plate | spring | cave | gated | ruin */
export function impulse(ctx, kind = 'hall', seconds, decay) {
  const cfg = {
    room: { t: 0.9, d: 3.2, pre: 0.004, tone: 0.55, mod: 0 },
    hall: { t: 2.6, d: 2.0, pre: 0.02, tone: 0.42, mod: 0.15 },
    plate: { t: 1.7, d: 2.6, pre: 0.002, tone: 0.8, mod: 0.05 },
    spring: { t: 1.2, d: 3.6, pre: 0.006, tone: 1.15, mod: 0.6 },
    cave: { t: 4.5, d: 1.5, pre: 0.045, tone: 0.28, mod: 0.3 },
    gated: { t: 0.42, d: 0.2, pre: 0.003, tone: 0.7, mod: 0 },
    ruin: { t: 3.4, d: 1.2, pre: 0.03, tone: 0.2, mod: 0.9 }
  }[kind] || { t: 2.4, d: 2, pre: 0.01, tone: 0.5, mod: 0.1 };

  const T = seconds || cfg.t;
  const D = decay || cfg.d;
  const key = `${kind}:${T.toFixed(2)}:${D.toFixed(2)}`;
  const b = bank(ctx);
  if (b.ir.has(key)) return b.ir.get(key);

  const sr = ctx.sampleRate;
  const len = Math.max(64, Math.floor(sr * T));
  const buf = ctx.createBuffer(2, len, sr);
  const r = rng(kind.length * 104729 + 7);
  const pre = Math.floor(cfg.pre * sr);

  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      if (i < pre) { d[i] = 0; continue; }
      const t = (i - pre) / (len - pre);
      let env = Math.pow(1 - t, D);
      if (kind === 'gated') env = t < 0.72 ? Math.pow(1 - t * 0.35, 1.2) : Math.pow(1 - (t - 0.72) / 0.28, 4);
      /* Early reflections give the tail a shape instead of pure noise wash. */
      let s = r() * 2 - 1;
      if (cfg.mod > 0) s += Math.sin(i * (0.0009 + ch * 0.00013)) * cfg.mod * (r() * 2 - 1);
      lp = lp + (s - lp) * clamp(cfg.tone * (1 - t * 0.55), 0.02, 1);
      d[i] = lp * env * (1 - ch * 0.08);
    }
    /* Sparse early taps. */
    const taps = kind === 'spring' ? 3 : 7;
    for (let k = 0; k < taps; k++) {
      const pos = pre + Math.floor(r() * sr * Math.min(0.12, T * 0.1));
      if (pos < len) d[pos] += (r() * 2 - 1) * 0.55 * Math.pow(0.7, k);
    }
  }

  /* Normalize so reverb amount is predictable across kinds. */
  let peak = 1e-6;
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i]));
  }
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] /= peak * 1.6;
  }

  b.ir.set(key, buf);
  return buf;
}

/* ------------------------------------------------------------------ *
 * Envelope helpers (exponential-ish, click-free)
 * ------------------------------------------------------------------ */

const MIN = 0.0001;

/** ADSR on an AudioParam. Returns the time the sustain stage begins. */
export function applyADSR(param, t0, env, peak = 1) {
  const a = Math.max(0.0005, env.a || 0.001);
  const d = Math.max(0.001, env.d || 0.1);
  const s = clamp(env.s == null ? 0.7 : env.s, 0, 1);
  param.cancelScheduledValues(t0);
  param.setValueAtTime(MIN, t0);
  param.exponentialRampToValueAtTime(Math.max(MIN, peak), t0 + a);
  const sv = Math.max(MIN, peak * s);
  param.exponentialRampToValueAtTime(sv, t0 + a + d);
  return t0 + a + d;
}

/** Release stage. Returns the time the tail is fully silent. */
export function applyRelease(param, tRel, env, floor = MIN) {
  const r = Math.max(0.004, env.r == null ? 0.12 : env.r);
  param.cancelScheduledValues(tRel);
  /* Hold whatever value the ramp reached, then fall from there. */
  const cur = Math.max(floor, param.value);
  param.setValueAtTime(cur, tRel);
  param.exponentialRampToValueAtTime(floor, tRel + r);
  param.setValueAtTime(0, tRel + r + 0.002);
  return tRel + r + 0.01;
}

/** One-shot percussive decay: instant attack, exponential fall. */
export function applyDecay(param, t0, peak, decay, attack = 0.0008) {
  param.cancelScheduledValues(t0);
  param.setValueAtTime(MIN, t0);
  param.exponentialRampToValueAtTime(Math.max(MIN, peak), t0 + attack);
  param.exponentialRampToValueAtTime(MIN, t0 + attack + Math.max(0.005, decay));
  param.setValueAtTime(0, t0 + attack + Math.max(0.005, decay) + 0.002);
  return t0 + attack + decay + 0.01;
}

/** Pitch sweep used by every drum body. `curve` > 1 snaps harder. */
export function pitchSweep(param, t0, from, to, time, curve = 1) {
  param.cancelScheduledValues(t0);
  param.setValueAtTime(Math.max(1, from), t0);
  if (curve === 1) {
    param.exponentialRampToValueAtTime(Math.max(1, to), t0 + Math.max(0.002, time));
  } else {
    /* Multi-segment approximation of a steeper-than-exponential fall. */
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      const x = i / steps;
      const y = Math.pow(x, curve);
      param.exponentialRampToValueAtTime(Math.max(1, from + (to - from) * y), t0 + time * x);
    }
  }
}
