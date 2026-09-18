/* Organs and keys.
 *
 * Two recipes again: a sine carrier with a 2:1-ish FM operator gives the
 * electric-piano family its tine, and additive `organ`/`hollow` tables with
 * near-zero attack and full sustain give the drawbar family its steadiness.
 * Acoustic pianos are a bright saw body under a hard velocity-tracked filter
 * with hammer noise on the front. */

import { env } from './shared.js';

export const KEYS = [
  {
    id: 'key_rhodes_soft', name: 'Soft Rhodes', tags: ['electric', 'mellow'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 2.0, index: 1.4, decay: 0.4, sustain: 0.05 },
    filter: { type: 'lowpass', cutoff: 2000, q: 0.7, env: 1, keytrack: 0.7, velToEnv: 0.9 },
    ampEnv: env(0.004, 2.2, 0.16, 0.4), filtEnv: env(0.003, 0.7, 0.12, 0.25),
    gain: 0.52, sends: { reverb: 0.24 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.5, depth: 0.0028, mix: 0.3 }]
  },
  {
    id: 'key_wurli', name: 'Wurlitzer', tags: ['electric', 'reedy'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'triangle', level: 0.3, oct: 1 }],
    fm: { ratio: 3.0, index: 2.6, decay: 0.16, sustain: 0.1 },
    filter: { type: 'lowpass', cutoff: 2600, q: 1.2, env: 1.4, keytrack: 0.7, velToEnv: 0.9 },
    ampEnv: env(0.003, 1.5, 0.12, 0.3), filtEnv: env(0.002, 0.5, 0.12, 0.2),
    shaper: { curve: 'tube', drive: 0.3 },
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 60,
    fx: [{ type: 'autopan', mode: 'trem', rate: 6.2, depth: 0.32 }]
  },
  {
    id: 'key_wahclav', name: 'Wah Clav', tags: ['funk', 'filter'],
    oscs: [{ wave: 'pulse12', level: 0.9 }, { wave: 'sawtooth', level: 0.35, cent: 7 }],
    filter: { type: 'bandpass', cutoff: 1100, q: 3, env: 2.4, keytrack: 0.6, velToEnv: 0.9 },
    ampEnv: env(0.001, 0.4, 0.06, 0.1), filtEnv: env(0.002, 0.2, 0.08, 0.09),
    lfo: { wave: 'sine', rate: 3.4, depth: 0.7, target: 'filter', fade: 0.06 },
    shaper: { curve: 'tube', drive: 0.34 },
    gain: 0.9, defaultNote: 55
  },
  {
    id: 'key_hammond', name: 'Hammond', tags: ['organ', 'drawbar'],
    oscs: [
      { wave: 'organ', level: 0.9 },
      { wave: 'sine', level: 0.35, semi: 19 },
      { wave: 'sine', level: 0.2, semi: 28 }
    ],
    filter: { type: 'lowpass', cutoff: 4200, q: 0.7, env: 0.4, keytrack: 0.6 },
    ampEnv: env(0.004, 0.08, 0.96, 0.05), filtEnv: env(0.006, 0.15, 0.85, 0.05),
    shaper: { curve: 'tube', drive: 0.28 },
    gain: 0.44, sends: { reverb: 0.18 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 6.6, depth: 0.0016, mix: 0.4 }]
  },
  {
    id: 'key_church', name: 'Church Organ', tags: ['organ', 'huge'],
    oscs: [
      { wave: 'organ', level: 0.8, unison: 2, spread: 5 },
      { wave: 'hollow', level: 0.45, oct: -1 },
      { wave: 'sine', level: 0.3, semi: 19 }
    ],
    filter: { type: 'lowpass', cutoff: 3200, q: 0.8, env: 0.6, keytrack: 0.55 },
    ampEnv: env(0.06, 0.2, 0.96, 0.4), filtEnv: env(0.1, 0.3, 0.8, 0.3),
    gain: 0.38, sends: { reverb: 0.55 }, defaultNote: 48
  },
  {
    id: 'key_pump', name: 'Pump Organ', tags: ['reed', 'wheezy'],
    oscs: [{ wave: 'reed', level: 0.85, unison: 2, spread: 9 }, { wave: 'organ', level: 0.35, cent: -7 }],
    noise: { color: 'pink', level: 0.14, bp: 1600, q: 1.2 },
    filter: { type: 'lowpass', cutoff: 1800, q: 1.4, env: 0.8, keytrack: 0.55 },
    ampEnv: env(0.05, 0.25, 0.92, 0.22), filtEnv: env(0.08, 0.3, 0.7, 0.2),
    lfo: { wave: 'sine', rate: 4.1, depth: 0.05, target: 'pitch', delay: 0.4, fade: 0.5 },
    gain: 0.44, sends: { reverb: 0.3 }, defaultNote: 55
  },
  {
    id: 'key_accordion', name: 'Accordion', tags: ['reed', 'folk'],
    oscs: [
      { wave: 'reed', level: 0.8, unison: 2, spread: 13 },
      { wave: 'reed', level: 0.45, cent: 14, oct: 1 }
    ],
    filter: { type: 'bandpass', cutoff: 1300, q: 1.2, env: 1, keytrack: 0.6 },
    ampEnv: env(0.03, 0.2, 0.94, 0.16), filtEnv: env(0.05, 0.25, 0.75, 0.14),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.07, target: 'pitch', delay: 0.3, fade: 0.4 },
    gain: 0.6, sends: { reverb: 0.24 }, defaultNote: 60
  },
  {
    id: 'key_harpsichord', name: 'Harpsichord', tags: ['plucked', 'baroque'],
    oscs: [{ wave: 'wire', level: 0.85 }, { wave: 'razor', level: 0.3, oct: 1, cent: 5 }],
    noise: { color: 'white', level: 0.22, bp: 4600, q: 2.6, decay: 0.008 },
    filter: { type: 'highpass', cutoff: 320, q: 1, env: 0.6, keytrack: 0.7 },
    ampEnv: env(0.001, 0.9, 0.0, 0.2), filtEnv: env(0.001, 0.3, 0.1, 0.14),
    gain: 0.4, sends: { reverb: 0.3 }, defaultNote: 64
  },
  {
    id: 'key_toy', name: 'Toy Piano', tags: ['tiny', 'bell'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'glass', level: 0.4, oct: 1 }],
    fm: { ratio: 5.4, index: 1.3, decay: 0.04, sustain: 0.01 },
    noise: { color: 'white', level: 0.2, bp: 5200, q: 2.4, decay: 0.007 },
    filter: { type: 'highpass', cutoff: 480, q: 0.8, env: 0.5, keytrack: 0.8 },
    ampEnv: env(0.001, 0.7, 0.0, 0.2), filtEnv: env(0.001, 0.22, 0.08, 0.12),
    gain: 0.5, sends: { reverb: 0.3 }, defaultNote: 72
  },
  {
    id: 'key_upright', name: 'Upright Piano', tags: ['acoustic', 'boxy'],
    oscs: [
      { wave: 'hollow', level: 0.85, unison: 2, spread: 4, width: 0.35 },
      { wave: 'sawtooth', level: 0.3, cent: 6 }
    ],
    noise: { color: 'white', level: 0.24, bp: 2800, q: 2, decay: 0.008 },
    filter: { type: 'lowpass', cutoff: 2200, q: 1.4, env: 2.4, keytrack: 0.7, velToEnv: 0.9 },
    ampEnv: env(0.002, 1.6, 0.1, 0.3), filtEnv: env(0.001, 0.4, 0.08, 0.18),
    shaper: { curve: 'tube', drive: 0.16 },
    gain: 0.5, sends: { reverb: 0.22 }, defaultNote: 60
  },
  {
    id: 'key_grand', name: 'Grand Piano', tags: ['acoustic', 'open'],
    oscs: [
      { wave: 'hollow', level: 0.8, unison: 3, spread: 5, width: 0.45 },
      { wave: 'glass', level: 0.3, oct: 1, cent: 3 },
      { wave: 'sine', level: 0.3, oct: -1 }
    ],
    noise: { color: 'white', level: 0.2, bp: 3400, q: 2.2, decay: 0.009 },
    filter: { type: 'lowpass', cutoff: 3400, q: 1, env: 2.4, keytrack: 0.75, velToEnv: 0.9 },
    ampEnv: env(0.002, 2.4, 0.08, 0.45), filtEnv: env(0.001, 0.6, 0.08, 0.26),
    gain: 0.46, sends: { reverb: 0.3 }, defaultNote: 60
  },
  {
    id: 'key_honkytonk', name: 'Honky Tonk', tags: ['detuned', 'saloon'],
    oscs: [
      { wave: 'hollow', level: 0.8 },
      { wave: 'hollow', level: 0.6, cent: 19 },
      { wave: 'sawtooth', level: 0.25, cent: -14 }
    ],
    noise: { color: 'white', level: 0.24, bp: 3000, q: 2, decay: 0.008 },
    filter: { type: 'lowpass', cutoff: 2600, q: 1.6, env: 2.2, keytrack: 0.7, velToEnv: 0.9 },
    ampEnv: env(0.002, 1.2, 0.08, 0.26), filtEnv: env(0.001, 0.34, 0.08, 0.16),
    shaper: { curve: 'tube', drive: 0.24 },
    gain: 0.44, sends: { reverb: 0.26 }, defaultNote: 60
  },
  {
    id: 'key_farfisa', name: 'Farfisa', tags: ['organ', 'thin'],
    oscs: [{ wave: 'pulse25', level: 0.85 }, { wave: 'square', level: 0.4, oct: 1, cent: 6 }],
    filter: { type: 'highpass', cutoff: 380, q: 1.2, env: 0.5, keytrack: 0.6 },
    ampEnv: env(0.003, 0.08, 0.95, 0.05), filtEnv: env(0.005, 0.15, 0.85, 0.05),
    shaper: { curve: 'hard', drive: 0.26 },
    gain: 0.4, sends: { reverb: 0.22 }, defaultNote: 64,
    fx: [{ type: 'autopan', mode: 'trem', rate: 7.4, depth: 0.3 }]
  },
  {
    id: 'key_melodica', name: 'Melodica', tags: ['reed', 'breathy'],
    oscs: [{ wave: 'reed', level: 0.9 }, { wave: 'square', level: 0.3, cent: 8 }],
    noise: { color: 'pink', level: 0.2, bp: 2600, q: 1.4, keytrack: true },
    filter: { type: 'lowpass', cutoff: 2400, q: 1.6, env: 1.2, keytrack: 0.65 },
    ampEnv: env(0.02, 0.2, 0.92, 0.14), filtEnv: env(0.04, 0.25, 0.7, 0.14),
    lfo: { wave: 'sine', rate: 5.2, depth: 0.08, target: 'pitch', delay: 0.3, fade: 0.35 },
    gain: 0.54, sends: { reverb: 0.28 }, defaultNote: 67
  }
];
