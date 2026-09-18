/* FX and noise — risers, impacts, textures and feedback.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const FXINST = [
  {
    id: 'fx_riser', name: 'Riser', tags: ['transition', 'sweep'],
    oscs: [{ wave: 'sawtooth', level: 0.7, unison: 4, spread: 26, width: 0.95 }],
    noise: { color: 'white', level: 0.4, hp: 400 },
    filter: { type: 'bandpass', cutoff: 300, q: 4, env: 5.4, keytrack: 0.1 },
    ampEnv: env(1.2, 0.5, 0.95, 0.25), filtEnv: env(2.4, 0.4, 0.95, 0.2),
    pitchEnv: { amt: -12, d: 2.4 },
    gain: 0.34, sends: { reverb: 0.4 }, defaultNote: 60
  },
  {
    id: 'fx_downlifter', name: 'Downlifter', tags: ['transition', 'fall'],
    oscs: [{ wave: 'sawtooth', level: 0.6, unison: 3, spread: 20 }],
    noise: { color: 'white', level: 0.45, hp: 300 },
    filter: { type: 'lowpass', cutoff: 8000, q: 2.4, env: -5, keytrack: 0.1 },
    ampEnv: env(0.01, 1.6, 0.3, 0.6), filtEnv: env(0.01, 1.8, 0.05, 0.4),
    pitchEnv: { amt: 24, d: 1.6 },
    gain: 0.36, sends: { reverb: 0.4 }, defaultNote: 60
  },
  {
    id: 'fx_impact', name: 'Impact', tags: ['hit', 'huge'],
    oscs: [{ wave: 'sine', level: 0.8 }],
    sub: { wave: 'sine', oct: -1, level: 0.6, bypassFilter: true },
    noise: { color: 'brown', level: 0.6, lp: 3000, decay: 1.4 },
    filter: { type: 'lowpass', cutoff: 900, q: 1.4, env: 2, keytrack: 0.2 },
    ampEnv: env(0.002, 1.6, 0.0, 0.5), filtEnv: env(0.002, 0.6, 0.08, 0.3),
    pitchEnv: { amt: 18, d: 0.35 },
    shaper: { curve: 'tube', drive: 0.4 }, gain: 0.6, sends: { reverb: 0.45 }, defaultNote: 36
  },
  {
    id: 'fx_static', name: 'Static Burst', tags: ['noise', 'digital'],
    oscs: [{ wave: 'wire', level: 0.45 }],
    noise: { color: 'crackle', level: 1, hp: 600, rate: 2.4 },
    filter: { type: 'bandpass', cutoff: 2200, q: 1.1, env: 2, keytrack: 0.2 },
    ampEnv: env(0.002, 0.4, 0.35, 0.15), filtEnv: env(0.004, 0.3, 0.3, 0.1),
    gain: 1.1, defaultNote: 60,
    fx: [{ type: 'crush', bits: 4, reduction: 8, jitter: 0.4, mix: 0.9 }]
  },
  {
    id: 'fx_vinyl', name: 'Vinyl Bed', tags: ['texture', 'lofi'],
    oscs: [{ wave: 'sine', level: 0.06 }],
    noise: { color: 'vinyl', level: 0.7, hp: 90, lp: 7000 },
    filter: { type: 'lowpass', cutoff: 7000, q: 0.6, env: 0, keytrack: 0 },
    ampEnv: env(0.4, 0.5, 0.95, 0.6), filtEnv: env(0.1, 0.3, 1, 0.2),
    gain: 0.3, defaultNote: 48
  },
  {
    id: 'fx_scream', name: 'Feedback Scream', tags: ['noise', 'harsh'],
    oscs: [{ wave: 'buzz', level: 0.5, unison: 2, spread: 30 }],
    fm: { ratio: 1.41, index: 3.2, decay: 1.2, sustain: 0.8 },
    noise: { color: 'metal', level: 0.3, bp: 3400, q: 1.1 },
    filter: { type: 'bandpass', cutoff: 2400, q: 9, env: 3, keytrack: 0.4 },
    ampEnv: env(0.15, 0.6, 0.9, 0.5), filtEnv: env(0.6, 1, 0.5, 0.4),
    lfo: { wave: 'triangle', rate: 1.6, depth: 1.1, target: 'filter', fade: 0.5 },
    shaper: { curve: 'destroy', drive: 0.7 }, gain: 0.3, sends: { reverb: 0.4 }, defaultNote: 72
  },

  {
    id: 'fx_noise_sweep', name: 'Noise Sweep', tags: ['transition', 'filter'],
    oscs: [{ wave: 'sine', level: 0.05 }],
    noise: { color: 'white', level: 0.9, hp: 200 },
    filter: { type: 'bandpass', cutoff: 260, q: 6, env: 6, keytrack: 0.1 },
    ampEnv: env(0.6, 0.4, 0.95, 0.35), filtEnv: env(1.8, 0.4, 0.95, 0.25),
    gain: 0.36, sends: { reverb: 0.3 }, defaultNote: 60
  },
  {
    id: 'fx_suck', name: 'Suckback', tags: ['transition', 'reverse'],
    oscs: [{ wave: 'sawtooth', level: 0.5, unison: 3, spread: 22 }],
    noise: { color: 'white', level: 0.5, hp: 400 },
    filter: { type: 'lowpass', cutoff: 9000, q: 3, env: -6, keytrack: 0.1 },
    ampEnv: env(0.9, 0.3, 0.9, 0.1), filtEnv: env(1.4, 0.3, 0.9, 0.1),
    pitchEnv: { amt: -18, d: 1.2 },
    gain: 0.34, sends: { reverb: 0.3 }, defaultNote: 60
  },
  {
    id: 'fx_zap', name: 'Laser Zap', tags: ['hit', 'digital'],
    oscs: [{ wave: 'square', level: 0.8 }, { wave: 'wire', level: 0.4, oct: 1 }],
    filter: { type: 'bandpass', cutoff: 2600, q: 1.4, env: 2, keytrack: 0.4 },
    ampEnv: env(0.001, 0.22, 0.0, 0.06), filtEnv: env(0.001, 0.14, 0.05, 0.05),
    pitchEnv: { amt: 36, d: 0.16 },
    shaper: { curve: 'fold', drive: 0.4 },
    gain: 2.0, sends: { delay: 0.24 }, defaultNote: 72
  },
  {
    id: 'fx_wail', name: 'Siren Wail', tags: ['fx', 'lfo'],
    oscs: [{ wave: 'square', level: 0.7, unison: 2, spread: 8 }, { wave: 'sawtooth', level: 0.4, semi: 5 }],
    filter: { type: 'bandpass', cutoff: 1200, q: 4, env: 1.6, keytrack: 0.3 },
    ampEnv: env(0.15, 0.5, 0.92, 0.5), filtEnv: env(0.3, 0.6, 0.6, 0.3),
    lfo: { wave: 'triangle', rate: 1.1, depth: 9, target: 'pitch', fade: 0.2 },
    shaper: { curve: 'hard', drive: 0.45 },
    gain: 0.34, sends: { reverb: 0.34 }, defaultNote: 64
  },
  {
    id: 'fx_tape_stop', name: 'Tape Stop', tags: ['fx', 'fall'],
    oscs: [{ wave: 'sawtooth', level: 0.7, unison: 2, spread: 10 }, { wave: 'hollow', level: 0.4, oct: -1 }],
    noise: { color: 'vinyl', level: 0.2, lp: 6000 },
    filter: { type: 'lowpass', cutoff: 5200, q: 1.6, env: -3.4, keytrack: 0.3 },
    ampEnv: env(0.005, 1.3, 0.1, 0.3), filtEnv: env(0.01, 1.2, 0.05, 0.25),
    pitchEnv: { amt: 30, d: 1.1 },
    shaper: { curve: 'saturate', drive: 0.3 },
    gain: 0.4, defaultNote: 60
  },
  {
    id: 'fx_radio', name: 'Radio Static', tags: ['texture', 'noise'],
    oscs: [{ wave: 'buzz', level: 0.2 }],
    noise: { color: 'white', level: 0.8, bp: 1800, q: 3 },
    filter: { type: 'bandpass', cutoff: 1500, q: 7, env: 1.2, keytrack: 0.3 },
    ampEnv: env(0.02, 0.4, 0.8, 0.2), filtEnv: env(0.05, 0.4, 0.5, 0.2),
    lfo: { wave: 'square', rate: 7.5, depth: 0.7, target: 'filter', fade: 0.05 },
    gain: 0.36, defaultNote: 60,
    fx: [{ type: 'crush', bits: 6, reduction: 5, jitter: 0.3, mix: 0.7 }]
  },
  {
    id: 'fx_subdrop', name: 'Sub Drop', tags: ['transition', 'sub'],
    oscs: [{ wave: 'sine', level: 1 }],
    sub: { wave: 'sine', oct: -1, level: 0.5, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 260, q: 1, env: 0.6, keytrack: 0.3 },
    ampEnv: env(0.006, 2.2, 0.2, 0.6), filtEnv: env(0.01, 1.4, 0.2, 0.3),
    pitchEnv: { amt: 34, d: 1.8 },
    shaper: { curve: 'saturate', drive: 0.28 },
    gain: 0.7, defaultNote: 33
  },
  {
    id: 'fx_glitchburst', name: 'Glitch Burst', tags: ['digital', 'stutter'],
    oscs: [{ wave: 'wire', level: 0.7 }, { wave: 'pulse12', level: 0.4, oct: 1, cent: 14 }],
    noise: { color: 'blue', level: 0.35, hp: 2600 },
    filter: { type: 'highpass', cutoff: 600, q: 3, env: 1.6, keytrack: 0.3 },
    ampEnv: env(0.001, 0.4, 0.5, 0.08), filtEnv: env(0.002, 0.3, 0.3, 0.08),
    gain: 0.36, defaultNote: 72,
    fx: [
      { type: 'crush', bits: 4, reduction: 12, jitter: 0.6, mix: 0.9 },
      { type: 'gate', depth: 1, shape: 0.06, pattern: [1, 0, 1, 1, 0, 0, 1, 0] }
    ]
  },

  {
    id: 'fx_whitehit', name: 'White Hit', tags: ['hit', 'noise'],
    oscs: [{ wave: 'sine', level: 0.1 }],
    noise: { color: 'white', level: 0.95, hp: 300 },
    filter: { type: 'lowpass', cutoff: 8000, q: 1.2, env: -2.6, keytrack: 0.2 },
    ampEnv: env(0.002, 0.7, 0.0, 0.25), filtEnv: env(0.002, 0.4, 0.06, 0.2),
    shaper: { curve: 'hard', drive: 0.4 },
    gain: 0.5, sends: { reverb: 0.4 }, defaultNote: 60
  },
  {
    id: 'fx_braam', name: 'Braam', tags: ['hit', 'cinematic'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 4, spread: 20, width: 0.9 },
      { wave: 'buzz', level: 0.4, oct: -1 }
    ],
    sub: { wave: 'sine', oct: -1, level: 0.4, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 900, q: 2.2, env: 2.2, keytrack: 0.3 },
    ampEnv: env(0.03, 1.8, 0.3, 0.8), filtEnv: env(0.12, 1.4, 0.2, 0.5),
    pitchEnv: { amt: 2, d: 0.6 },
    shaper: { curve: 'tube', drive: 0.5 },
    gain: 0.4, sends: { reverb: 0.5 }, defaultNote: 36
  },
  {
    id: 'fx_bitfall', name: 'Bit Fall', tags: ['digital', 'fall'],
    oscs: [{ wave: 'pulse25', level: 0.9 }, { wave: 'wire', level: 0.35, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 5200, q: 1.8, env: -2, keytrack: 0.3 },
    ampEnv: env(0.002, 0.9, 0.2, 0.2), filtEnv: env(0.004, 0.7, 0.06, 0.16),
    pitchEnv: { amt: 28, d: 0.8 },
    gain: 0.44, defaultNote: 72,
    fx: [{ type: 'crush', bits: 5, reduction: 7, mix: 0.85 }]
  },
  {
    id: 'fx_alarm', name: 'Alarm', tags: ['siren', 'harsh'],
    oscs: [{ wave: 'square', level: 0.8 }, { wave: 'square', level: 0.4, semi: 7 }],
    filter: { type: 'bandpass', cutoff: 1800, q: 2.2, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.006, 0.3, 0.9, 0.1), filtEnv: env(0.02, 0.3, 0.6, 0.1),
    lfo: { wave: 'square', rate: 4.2, depth: 5, target: 'pitch', fade: 0.02 },
    shaper: { curve: 'hard', drive: 0.4 },
    gain: 0.42, sends: { reverb: 0.26 }, defaultNote: 72
  }
];
