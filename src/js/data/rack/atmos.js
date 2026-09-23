/* Atmospheres — beds rather than notes.
 *
 * These are mostly noise: a colour, a filter parked somewhere characteristic,
 * and an LFO slow enough that you read it as weather rather than modulation.
 * Hold one under a pattern the way you would a field recording. */

import { env } from './shared.js';

export const ATMOS = [
  {
    id: 'atm_rain', name: 'Rain', tags: ['weather', 'hiss'],
    oscs: [{ wave: 'sine', level: 0.04 }],
    noise: { color: 'white', level: 0.85, hp: 900, lp: 9000 },
    filter: { type: 'highpass', cutoff: 1200, q: 0.8, env: 0.4, keytrack: 0.2 },
    ampEnv: env(1.2, 1.5, 0.92, 1.6), filtEnv: env(1.6, 1.5, 0.7, 1.2),
    lfo: { wave: 'sine', rate: 0.09, depth: 0.3, target: 'filter', fade: 2.5 },
    gain: 0.38, sends: { reverb: 0.3 }, defaultNote: 60
  },
  {
    id: 'atm_wind', name: 'Wind', tags: ['weather', 'howl'],
    oscs: [{ wave: 'sine', level: 0.05 }],
    noise: { color: 'pink', level: 0.9, bp: 700, q: 1.6 },
    filter: { type: 'bandpass', cutoff: 800, q: 1.3, env: 2.2, keytrack: 0.3 },
    ampEnv: env(1.6, 2, 0.9, 2.2), filtEnv: env(2.4, 2, 0.5, 1.6),
    lfo: { wave: 'sine', rate: 0.13, depth: 0.7, target: 'filter', fade: 2 },
    gain: 1.9, sends: { reverb: 0.4 }, defaultNote: 55
  },
  {
    id: 'atm_ocean', name: 'Ocean', tags: ['weather', 'swell'],
    oscs: [{ wave: 'sine', level: 0.05 }],
    noise: { color: 'brown', level: 0.9, lp: 3000 },
    filter: { type: 'lowpass', cutoff: 1400, q: 1.2, env: 1.8, keytrack: 0.2 },
    ampEnv: env(2, 2.4, 0.9, 2.6), filtEnv: env(2.8, 2.4, 0.5, 2),
    lfo: { wave: 'sine', rate: 0.07, depth: 0.6, target: 'filter', fade: 3 },
    gain: 0.42, sends: { reverb: 0.42 }, defaultNote: 48
  },
  {
    id: 'atm_machine', name: 'Machine Room', tags: ['industrial', 'hum'],
    oscs: [{ wave: 'buzz', level: 0.35 }, { wave: 'sine', level: 0.3, oct: -1 }],
    noise: { color: 'metal', level: 0.4, bp: 1800, q: 1.1 },
    filter: { type: 'lowpass', cutoff: 1100, q: 2.2, env: 1, keytrack: 0.3 },
    ampEnv: env(1, 1.5, 0.94, 1.4), filtEnv: env(1.6, 1.5, 0.6, 1),
    lfo: { wave: 'triangle', rate: 0.22, depth: 0.5, target: 'filter', fade: 2 },
    shaper: { curve: 'tube', drive: 0.32 },
    gain: 0.42, sends: { reverb: 0.36 }, defaultNote: 36
  },
  {
    id: 'atm_engine', name: 'Engine Hum', tags: ['industrial', 'low'],
    oscs: [{ wave: 'sine', level: 0.6 }, { wave: 'square', level: 0.25, cent: 11 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    noise: { color: 'brown', level: 0.3, lp: 400 },
    filter: { type: 'lowpass', cutoff: 320, q: 2.6, env: 0.8, keytrack: 0.3 },
    ampEnv: env(0.8, 1.2, 0.95, 1.2), filtEnv: env(1.2, 1.2, 0.6, 0.9),
    lfo: { wave: 'sine', rate: 3.1, depth: 0.35, target: 'filter', fade: 0.8 },
    shaper: { curve: 'saturate', drive: 0.3 },
    gain: 0.52, sends: { reverb: 0.24 }, defaultNote: 31
  },
  {
    id: 'atm_crowd', name: 'Crowd Murmur', tags: ['human', 'bed'],
    oscs: [{ wave: 'vox', level: 0.22, unison: 5, spread: 40, width: 1 }],
    noise: { color: 'pink', level: 0.6, bp: 1200, q: 0.9 },
    filter: { type: 'bandpass', cutoff: 900, q: 1.2, env: 1.4, keytrack: 0.3 },
    ampEnv: env(1.2, 1.6, 0.9, 1.6), filtEnv: env(1.8, 1.6, 0.55, 1.2),
    lfo: { wave: 'triangle', rate: 0.31, depth: 0.45, target: 'filter', fade: 2 },
    gain: 0.5, sends: { reverb: 0.45 }, defaultNote: 50
  },
  {
    id: 'atm_tape', name: 'Tape Hiss', tags: ['lofi', 'texture'],
    oscs: [{ wave: 'sine', level: 0.03 }],
    noise: { color: 'vinyl', level: 0.9, hp: 200, lp: 8000 },
    filter: { type: 'lowpass', cutoff: 7000, q: 0.7, env: 0.3, keytrack: 0.1 },
    ampEnv: env(0.5, 0.8, 0.95, 0.8), filtEnv: env(0.6, 0.8, 0.8, 0.5),
    gain: 0.4, defaultNote: 48
  },
  {
    id: 'atm_neon', name: 'Neon Buzz', tags: ['electric', 'thin'],
    oscs: [{ wave: 'buzz', level: 0.45 }, { wave: 'square', level: 0.2, semi: 19 }],
    noise: { color: 'white', level: 0.25, bp: 6000, q: 2.2 },
    filter: { type: 'bandpass', cutoff: 2600, q: 3.4, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.4, 0.8, 0.94, 0.7), filtEnv: env(0.6, 0.8, 0.6, 0.5),
    lfo: { wave: 'square', rate: 7.8, depth: 0.3, target: 'amp', fade: 0.4 },
    gain: 0.4, sends: { reverb: 0.3 }, defaultNote: 67
  },
  {
    id: 'atm_underwater', name: 'Underwater', tags: ['muffled', 'deep'],
    oscs: [{ wave: 'sine', level: 0.3 }, { wave: 'hollow', level: 0.25, oct: -1 }],
    noise: { color: 'brown', level: 0.6, lp: 700 },
    filter: { type: 'lowpass', cutoff: 380, q: 3.4, env: 1.6, keytrack: 0.4 },
    ampEnv: env(1.4, 1.8, 0.92, 1.8), filtEnv: env(2, 1.8, 0.5, 1.4),
    lfo: { wave: 'sine', rate: 0.17, depth: 0.7, target: 'filter', fade: 2.4 },
    gain: 0.5, sends: { reverb: 0.5 }, defaultNote: 43
  },
  {
    id: 'atm_shortwave', name: 'Shortwave', tags: ['radio', 'noisy'],
    oscs: [{ wave: 'wire', level: 0.2 }, { wave: 'sine', level: 0.15, cent: 24 }],
    noise: { color: 'crackle', level: 0.7, bp: 2400, q: 2.2 },
    filter: { type: 'bandpass', cutoff: 1900, q: 4.5, env: 1.6, keytrack: 0.3 },
    ampEnv: env(0.5, 1, 0.9, 0.8), filtEnv: env(0.8, 1, 0.5, 0.6),
    lfo: { wave: 'triangle', rate: 0.9, depth: 0.8, target: 'filter', fade: 0.6 },
    gain: 0.6, defaultNote: 60,
    fx: [{ type: 'crush', bits: 7, reduction: 3, jitter: 0.25, mix: 0.5 }]
  },
  {
    id: 'atm_cathedral', name: 'Cathedral Air', tags: ['holy', 'huge'],
    oscs: [
      { wave: 'hollow', level: 0.4, unison: 4, spread: 24, width: 0.95 },
      { wave: 'vox', level: 0.22, oct: 1, unison: 2, spread: 14 }
    ],
    noise: { color: 'pink', level: 0.2, bp: 2600, q: 0.8 },
    filter: { type: 'lowpass', cutoff: 1900, q: 1.2, env: 1.4, keytrack: 0.5 },
    ampEnv: env(2.2, 2.4, 0.9, 2.8), filtEnv: env(3, 2.4, 0.55, 2),
    lfo: { wave: 'sine', rate: 0.06, depth: 0.35, target: 'filter', fade: 3.5 },
    gain: 0.38, sends: { reverb: 0.6 }, defaultNote: 55
  },
  {
    id: 'atm_static_field', name: 'Static Field', tags: ['harsh', 'digital'],
    oscs: [{ wave: 'grind', level: 0.25, unison: 3, spread: 34, width: 1 }],
    noise: { color: 'violet', level: 0.7, hp: 4000 },
    filter: { type: 'highpass', cutoff: 2600, q: 1.6, env: 1.4, keytrack: 0.3 },
    ampEnv: env(0.9, 1.4, 0.9, 1.2), filtEnv: env(1.4, 1.4, 0.6, 0.9),
    lfo: { wave: 'triangle', rate: 0.44, depth: 0.6, target: 'filter', fade: 1.5 },
    gain: 0.36, sends: { reverb: 0.34 }, defaultNote: 72,
    fx: [{ type: 'crush', bits: 5, reduction: 6, jitter: 0.4, mix: 0.6 }]
  },

  {
    id: 'atm_forest', name: 'Forest', tags: ['nature', 'bright'],
    oscs: [{ wave: 'sine', level: 0.04 }],
    noise: { color: 'white', level: 0.6, bp: 5200, q: 0.8 },
    filter: { type: 'highpass', cutoff: 2200, q: 1.1, env: 1, keytrack: 0.3 },
    ampEnv: env(1.2, 1.6, 0.9, 1.6), filtEnv: env(1.8, 1.6, 0.6, 1.2),
    lfo: { wave: 'triangle', rate: 0.27, depth: 0.5, target: 'filter', fade: 2 },
    gain: 0.5, sends: { reverb: 0.4 }, defaultNote: 72
  },
  {
    id: 'atm_city', name: 'City Hum', tags: ['urban', 'low'],
    oscs: [{ wave: 'sine', level: 0.35 }, { wave: 'buzz', level: 0.2, oct: -1 }],
    noise: { color: 'brown', level: 0.55, lp: 1600 },
    filter: { type: 'lowpass', cutoff: 700, q: 1.6, env: 1, keytrack: 0.3 },
    ampEnv: env(1.4, 1.8, 0.94, 1.8), filtEnv: env(2, 1.8, 0.6, 1.4),
    lfo: { wave: 'sine', rate: 0.11, depth: 0.35, target: 'filter', fade: 2.6 },
    gain: 0.46, sends: { reverb: 0.34 }, defaultNote: 40
  },
  {
    id: 'atm_fire', name: 'Fire', tags: ['crackle', 'warm'],
    oscs: [{ wave: 'sine', level: 0.05 }],
    noise: { color: 'crackle', level: 0.9, bp: 1600, q: 0.7 },
    filter: { type: 'lowpass', cutoff: 2600, q: 1.1, env: 1.2, keytrack: 0.3 },
    ampEnv: env(0.8, 1.4, 0.92, 1.4), filtEnv: env(1.2, 1.4, 0.6, 1),
    lfo: { wave: 'triangle', rate: 0.42, depth: 0.45, target: 'filter', fade: 1.4 },
    gain: 0.56, sends: { reverb: 0.3 }, defaultNote: 55
  },
  {
    id: 'atm_snow', name: 'Snowfall', tags: ['soft', 'high'],
    oscs: [{ wave: 'sine', level: 0.04 }],
    noise: { color: 'violet', level: 0.65, hp: 6000 },
    filter: { type: 'highpass', cutoff: 5000, q: 0.9, env: 0.8, keytrack: 0.3 },
    ampEnv: env(1.8, 2, 0.9, 2.2), filtEnv: env(2.4, 2, 0.6, 1.6),
    lfo: { wave: 'sine', rate: 0.08, depth: 0.35, target: 'filter', fade: 3 },
    gain: 0.5, sends: { reverb: 0.5 }, defaultNote: 84
  },
  {
    id: 'atm_subway', name: 'Subway', tags: ['industrial', 'rumble'],
    oscs: [{ wave: 'sine', level: 0.45 }, { wave: 'grind', level: 0.2, oct: -1 }],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    noise: { color: 'brown', level: 0.6, lp: 900 },
    filter: { type: 'lowpass', cutoff: 420, q: 2.4, env: 1.4, keytrack: 0.3 },
    ampEnv: env(1, 1.6, 0.94, 1.6), filtEnv: env(1.6, 1.6, 0.55, 1.2),
    lfo: { wave: 'triangle', rate: 0.33, depth: 0.5, target: 'filter', fade: 1.6 },
    shaper: { curve: 'saturate', drive: 0.28 },
    gain: 0.5, sends: { reverb: 0.4 }, defaultNote: 31
  },
  {
    id: 'atm_space', name: 'Deep Space', tags: ['drone', 'vast'],
    oscs: [
      { wave: 'sine', level: 0.35, unison: 3, spread: 20, width: 0.95 },
      { wave: 'hollow', level: 0.22, oct: -1, cent: 9 }
    ],
    noise: { color: 'pink', level: 0.2, lp: 1600 },
    filter: { type: 'lowpass', cutoff: 900, q: 2.6, env: 1.6, keytrack: 0.4 },
    ampEnv: env(2.4, 2.6, 0.92, 3), filtEnv: env(3.2, 2.6, 0.5, 2.2),
    lfo: { wave: 'sine', rate: 0.04, depth: 0.55, target: 'filter', fade: 4 },
    gain: 0.5, sends: { reverb: 0.6 }, defaultNote: 43
  }
];
