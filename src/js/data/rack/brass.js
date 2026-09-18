/* Brass and winds.
 *
 * Brass is a saw whose filter opens *after* the note starts — that lag is the
 * whole character, so filtEnv attack is always slower than ampEnv attack.
 * Winds are near-sine bodies with breath noise band-passed around the played
 * pitch and vibrato that fades in rather than starting on. */

import { env } from './shared.js';

export const BRASS = [
  {
    id: 'brs_trumpet', name: 'Trumpet', tags: ['bright', 'solo'],
    oscs: [{ wave: 'sawtooth', level: 0.9 }, { wave: 'reed', level: 0.35, cent: 5 }],
    filter: { type: 'lowpass', cutoff: 1500, q: 2.4, env: 2.6, keytrack: 0.6, velToEnv: 0.85 },
    ampEnv: env(0.02, 0.25, 0.9, 0.14), filtEnv: env(0.06, 0.35, 0.45, 0.16),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.1, target: 'pitch', delay: 0.35, fade: 0.4 },
    shaper: { curve: 'tube', drive: 0.3 },
    gain: 0.46, sends: { reverb: 0.26 }, defaultNote: 67
  },
  {
    id: 'brs_trombone', name: 'Trombone', tags: ['mid', 'slide'],
    oscs: [{ wave: 'sawtooth', level: 0.9, unison: 2, spread: 5 }],
    filter: { type: 'lowpass', cutoff: 950, q: 2.2, env: 2.4, keytrack: 0.55, velToEnv: 0.8 },
    ampEnv: env(0.035, 0.3, 0.9, 0.18), filtEnv: env(0.09, 0.4, 0.45, 0.2),
    lfo: { wave: 'sine', rate: 4.8, depth: 0.08, target: 'pitch', delay: 0.4, fade: 0.5 },
    shaper: { curve: 'tube', drive: 0.34 },
    glide: 0.06, poly: 1, gain: 0.5, sends: { reverb: 0.28 }, defaultNote: 52
  },
  {
    id: 'brs_tuba', name: 'Tuba', tags: ['low', 'round'],
    oscs: [{ wave: 'sawtooth', level: 0.85 }, { wave: 'sine', level: 0.4, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 480, q: 1.8, env: 2, keytrack: 0.5, velToEnv: 0.8 },
    ampEnv: env(0.05, 0.3, 0.9, 0.22), filtEnv: env(0.12, 0.4, 0.45, 0.24),
    shaper: { curve: 'tube', drive: 0.3 },
    gain: 0.6, sends: { reverb: 0.24 }, defaultNote: 33
  },
  {
    id: 'brs_horn', name: 'French Horn', tags: ['warm', 'noble'],
    oscs: [{ wave: 'hollow', level: 0.8, unison: 2, spread: 6 }, { wave: 'sawtooth', level: 0.4, cent: -6 }],
    filter: { type: 'lowpass', cutoff: 1100, q: 1.6, env: 2, keytrack: 0.55, velToEnv: 0.75 },
    ampEnv: env(0.07, 0.35, 0.9, 0.3), filtEnv: env(0.16, 0.45, 0.5, 0.3),
    lfo: { wave: 'sine', rate: 4.4, depth: 0.06, target: 'pitch', delay: 0.5, fade: 0.6 },
    gain: 0.5, sends: { reverb: 0.4 }, defaultNote: 53
  },
  {
    id: 'brs_section', name: 'Brass Section', tags: ['wide', 'fat'],
    oscs: [
      { wave: 'sawtooth', level: 0.75, unison: 4, spread: 14, width: 0.85 },
      { wave: 'reed', level: 0.35, cent: -9, unison: 2, spread: 8 },
      { wave: 'sawtooth', level: 0.3, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 1200, q: 2, env: 2.4, keytrack: 0.5, velToEnv: 0.8 },
    ampEnv: env(0.04, 0.3, 0.88, 0.2), filtEnv: env(0.1, 0.4, 0.45, 0.22),
    shaper: { curve: 'tube', drive: 0.34 },
    gain: 0.34, sends: { reverb: 0.3 }, defaultNote: 55
  },
  {
    id: 'brs_stab', name: 'Brass Stab', tags: ['short', 'hit'],
    oscs: [
      { wave: 'sawtooth', level: 0.8, unison: 3, spread: 12 },
      { wave: 'square', level: 0.35, semi: 7 }
    ],
    filter: { type: 'lowpass', cutoff: 1400, q: 3.4, env: 2.6, keytrack: 0.5, velToEnv: 0.85 },
    ampEnv: env(0.008, 0.22, 0.0, 0.1), filtEnv: env(0.02, 0.18, 0.06, 0.08),
    shaper: { curve: 'hard', drive: 0.36 },
    gain: 0.4, sends: { reverb: 0.26 }, defaultNote: 55
  },
  {
    id: 'brs_sax_alto', name: 'Alto Sax', tags: ['reed', 'solo'],
    oscs: [{ wave: 'reed', level: 0.9 }, { wave: 'sawtooth', level: 0.35, cent: 7 }],
    noise: { color: 'pink', level: 0.14, bp: 2600, q: 1.6, keytrack: true },
    filter: { type: 'bandpass', cutoff: 1200, q: 1.6, env: 2.2, keytrack: 0.6, velToEnv: 0.8 },
    ampEnv: env(0.025, 0.3, 0.9, 0.16), filtEnv: env(0.06, 0.4, 0.45, 0.18),
    lfo: { wave: 'sine', rate: 5.9, depth: 0.13, target: 'pitch', delay: 0.3, fade: 0.35 },
    shaper: { curve: 'tube', drive: 0.32 },
    gain: 0.72, sends: { reverb: 0.3 }, defaultNote: 62
  },
  {
    id: 'brs_sax_bari', name: 'Bari Sax', tags: ['reed', 'low'],
    oscs: [{ wave: 'reed', level: 0.85, unison: 2, spread: 5 }, { wave: 'sawtooth', level: 0.4, cent: -6 }],
    noise: { color: 'pink', level: 0.16, bp: 1400, q: 1.4, keytrack: true },
    filter: { type: 'lowpass', cutoff: 700, q: 2.2, env: 2.2, keytrack: 0.5, velToEnv: 0.8 },
    ampEnv: env(0.03, 0.32, 0.9, 0.2), filtEnv: env(0.08, 0.42, 0.45, 0.22),
    lfo: { wave: 'sine', rate: 5.1, depth: 0.1, target: 'pitch', delay: 0.35, fade: 0.4 },
    shaper: { curve: 'tube', drive: 0.38 },
    gain: 0.58, sends: { reverb: 0.26 }, defaultNote: 45
  },
  {
    id: 'brs_flute', name: 'Flute', tags: ['breathy', 'pure'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'triangle', level: 0.2, oct: 1 }],
    noise: { color: 'white', level: 0.3, bp: 3400, q: 1.1, keytrack: true },
    filter: { type: 'lowpass', cutoff: 3000, q: 1, env: 1, keytrack: 0.75 },
    ampEnv: env(0.05, 0.25, 0.92, 0.2), filtEnv: env(0.09, 0.3, 0.6, 0.18),
    lfo: { wave: 'sine', rate: 5.4, depth: 0.09, target: 'pitch', delay: 0.35, fade: 0.45 },
    gain: 0.52, sends: { reverb: 0.36 }, defaultNote: 76
  },
  {
    id: 'brs_clarinet', name: 'Clarinet', tags: ['hollow', 'woody'],
    /* Odd harmonics only — that is what makes a clarinet sound like one. */
    oscs: [{ wave: 'square', level: 0.75 }, { wave: 'hollow', level: 0.4, cent: 4 }],
    noise: { color: 'pink', level: 0.1, bp: 2000, q: 1.8, keytrack: true },
    filter: { type: 'lowpass', cutoff: 1600, q: 1.4, env: 1.4, keytrack: 0.7 },
    ampEnv: env(0.04, 0.25, 0.92, 0.16), filtEnv: env(0.08, 0.3, 0.6, 0.16),
    lfo: { wave: 'sine', rate: 5, depth: 0.07, target: 'pitch', delay: 0.4, fade: 0.5 },
    gain: 0.5, sends: { reverb: 0.3 }, defaultNote: 62
  },
  {
    id: 'brs_oboe', name: 'Oboe', tags: ['reed', 'nasal'],
    oscs: [{ wave: 'reed', level: 0.9 }, { wave: 'pulse25', level: 0.3, cent: 6 }],
    filter: { type: 'bandpass', cutoff: 1500, q: 1.4, env: 1.6, keytrack: 0.7 },
    ampEnv: env(0.03, 0.25, 0.9, 0.14), filtEnv: env(0.06, 0.3, 0.55, 0.14),
    lfo: { wave: 'sine', rate: 6.2, depth: 0.11, target: 'pitch', delay: 0.3, fade: 0.35 },
    gain: 0.66, sends: { reverb: 0.32 }, defaultNote: 72
  },
  {
    id: 'brs_bagpipe', name: 'Bagpipe', tags: ['drone', 'folk'],
    oscs: [
      { wave: 'reed', level: 0.8, unison: 2, spread: 11 },
      { wave: 'buzz', level: 0.3, oct: -1 },
      { wave: 'reed', level: 0.25, semi: -5, oct: -1 }
    ],
    filter: { type: 'bandpass', cutoff: 1400, q: 1.3, env: 1.2, keytrack: 0.6 },
    ampEnv: env(0.02, 0.2, 0.95, 0.1), filtEnv: env(0.05, 0.25, 0.7, 0.1),
    lfo: { wave: 'sine', rate: 5.5, depth: 0.09, target: 'pitch', delay: 0.2, fade: 0.3 },
    shaper: { curve: 'tube', drive: 0.32 },
    gain: 0.56, sends: { reverb: 0.3 }, defaultNote: 69
  },
  {
    id: 'brs_didgeridoo', name: 'Didgeridoo', tags: ['drone', 'low'],
    oscs: [{ wave: 'buzz', level: 0.7 }, { wave: 'sine', level: 0.5 }],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    noise: { color: 'brown', level: 0.2, lp: 900 },
    filter: { type: 'bandpass', cutoff: 320, q: 2.4, env: 2, keytrack: 0.4 },
    ampEnv: env(0.06, 0.4, 0.92, 0.3), filtEnv: env(0.1, 0.5, 0.5, 0.3),
    lfo: { wave: 'triangle', rate: 3.4, depth: 0.7, target: 'filter', fade: 0.4 },
    shaper: { curve: 'tube', drive: 0.4 },
    gain: 0.62, sends: { reverb: 0.34 }, defaultNote: 33
  },
  {
    id: 'brs_harmonica', name: 'Harmonica', tags: ['reed', 'blues'],
    oscs: [
      { wave: 'reed', level: 0.8, unison: 2, spread: 14 },
      { wave: 'square', level: 0.3, cent: -9 }
    ],
    noise: { color: 'pink', level: 0.12, bp: 2800, q: 1.6, keytrack: true },
    filter: { type: 'bandpass', cutoff: 1500, q: 1.5, env: 1.8, keytrack: 0.65 },
    ampEnv: env(0.025, 0.25, 0.9, 0.14), filtEnv: env(0.05, 0.3, 0.5, 0.14),
    lfo: { wave: 'sine', rate: 6.8, depth: 0.15, target: 'pitch', delay: 0.15, fade: 0.25 },
    shaper: { curve: 'tube', drive: 0.36 },
    gain: 0.64, sends: { reverb: 0.3 }, defaultNote: 67
  }
];
