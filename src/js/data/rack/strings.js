/* Strings and bows.
 *
 * A bowed string is a slow-ish attack on a bright sawtooth, a lowpass that
 * opens with the bow pressure, a little vibrato that fades in, and bow noise
 * scraping across the top. Pizzicato is the same body with the envelope
 * inverted. */

import { env } from './shared.js';

export const STRINGS = [
  {
    id: 'str_ensemble', name: 'String Ensemble', tags: ['lush', 'wide'],
    oscs: [
      { wave: 'sawtooth', level: 0.75, unison: 5, spread: 15, width: 0.9 },
      { wave: 'reed', level: 0.3, cent: -8, unison: 2, spread: 9 }
    ],
    filter: { type: 'lowpass', cutoff: 2600, q: 1, env: 1.4, keytrack: 0.55 },
    ampEnv: env(0.18, 0.7, 0.92, 0.5), filtEnv: env(0.3, 0.8, 0.6, 0.4),
    lfo: { wave: 'sine', rate: 5.1, depth: 0.06, target: 'pitch', delay: 0.45, fade: 0.7 },
    gain: 0.34, sends: { reverb: 0.4 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.45, depth: 0.004, mix: 0.38 }]
  },
  {
    id: 'str_cello', name: 'Cello', tags: ['low', 'bowed'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 7 }, { wave: 'hollow', level: 0.35, cent: 5 }],
    noise: { color: 'pink', level: 0.12, bp: 2600, q: 1.6 },
    filter: { type: 'lowpass', cutoff: 1300, q: 2, env: 1.6, keytrack: 0.6 },
    ampEnv: env(0.1, 0.5, 0.9, 0.35), filtEnv: env(0.18, 0.6, 0.5, 0.3),
    lfo: { wave: 'sine', rate: 5.4, depth: 0.09, target: 'pitch', delay: 0.4, fade: 0.6 },
    shaper: { curve: 'tube', drive: 0.2 },
    gain: 0.5, sends: { reverb: 0.34 }, defaultNote: 45
  },
  {
    id: 'str_violin', name: 'Violin', tags: ['high', 'bowed'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 6 }, { wave: 'reed', level: 0.3, cent: -6 }],
    noise: { color: 'white', level: 0.12, bp: 5200, q: 1.8 },
    filter: { type: 'lowpass', cutoff: 3400, q: 1.6, env: 1.5, keytrack: 0.7 },
    ampEnv: env(0.07, 0.4, 0.9, 0.28), filtEnv: env(0.12, 0.5, 0.55, 0.24),
    lfo: { wave: 'sine', rate: 6.1, depth: 0.12, target: 'pitch', delay: 0.3, fade: 0.5 },
    gain: 0.44, sends: { reverb: 0.36 }, defaultNote: 72
  },
  {
    id: 'str_pizzicato', name: 'Pizzicato', tags: ['pluck', 'short'],
    oscs: [{ wave: 'sawtooth', level: 0.8 }, { wave: 'glass', level: 0.35, oct: 1 }],
    noise: { color: 'white', level: 0.3, bp: 3000, q: 2.4, decay: 0.01 },
    filter: { type: 'lowpass', cutoff: 2000, q: 3.4, env: 2.6, keytrack: 0.7, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.26, 0.0, 0.1), filtEnv: env(0.001, 0.12, 0.05, 0.07),
    gain: 0.5, sends: { reverb: 0.26 }, defaultNote: 60
  },
  {
    id: 'str_tremolo', name: 'Tremolo Strings', tags: ['tense', 'film'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 4, spread: 18, width: 0.85 }],
    noise: { color: 'pink', level: 0.16, bp: 3400, q: 1.1 },
    filter: { type: 'lowpass', cutoff: 2400, q: 1.4, env: 1.4, keytrack: 0.55 },
    ampEnv: env(0.12, 0.6, 0.9, 0.4), filtEnv: env(0.2, 0.6, 0.5, 0.32),
    gain: 0.34, sends: { reverb: 0.42 }, defaultNote: 64,
    fx: [{ type: 'autopan', mode: 'trem', rate: 13, depth: 0.7 }]
  },
  {
    id: 'str_bowed_bass', name: 'Bowed Bass', tags: ['low', 'drone'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 2, spread: 5 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    noise: { color: 'brown', level: 0.14, lp: 700 },
    filter: { type: 'lowpass', cutoff: 620, q: 2.4, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.22, 0.8, 0.92, 0.55), filtEnv: env(0.4, 0.9, 0.5, 0.4),
    lfo: { wave: 'sine', rate: 4.6, depth: 0.06, target: 'pitch', delay: 0.6, fade: 0.8 },
    gain: 0.54, sends: { reverb: 0.3 }, defaultNote: 33
  },
  {
    id: 'str_synthstring', name: 'Synth Strings', tags: ['retro', '80s'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 6, spread: 22, width: 0.95 },
      { wave: 'pulse25', level: 0.3, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 2800, q: 1.2, env: 1.3, keytrack: 0.5 },
    ampEnv: env(0.14, 0.6, 0.9, 0.45), filtEnv: env(0.24, 0.7, 0.55, 0.35),
    gain: 0.32, sends: { reverb: 0.4, delay: 0.14 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.6, depth: 0.006, feedback: 0.2, mix: 0.5 }]
  },
  {
    id: 'str_harmonics', name: 'String Harmonics', tags: ['glassy', 'thin'],
    oscs: [{ wave: 'glass', level: 0.8, unison: 2, spread: 9 }, { wave: 'sine', level: 0.35, oct: 1 }],
    noise: { color: 'white', level: 0.12, bp: 7000, q: 2.2 },
    filter: { type: 'highpass', cutoff: 700, q: 1.2, env: 0.8, keytrack: 0.8 },
    ampEnv: env(0.06, 1.2, 0.5, 0.7), filtEnv: env(0.1, 0.8, 0.4, 0.4),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.07, target: 'pitch', delay: 0.4, fade: 0.6 },
    gain: 0.4, sends: { reverb: 0.5, delay: 0.2 }, defaultNote: 79
  },
  {
    id: 'str_swell', name: 'String Swell', tags: ['cinematic', 'slow'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 5, spread: 20, width: 0.9 }, { wave: 'hollow', level: 0.3, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 700, q: 2.6, env: 3.2, keytrack: 0.4 },
    ampEnv: env(1.1, 1.2, 0.9, 1.1), filtEnv: env(1.8, 1.4, 0.45, 0.9),
    gain: 0.32, sends: { reverb: 0.5 }, defaultNote: 48
  },
  {
    id: 'str_scratch', name: 'Bow Scratch', tags: ['noise', 'harsh'],
    oscs: [{ wave: 'grind', level: 0.5, unison: 2, spread: 16 }],
    noise: { color: 'crackle', level: 0.55, bp: 2600, q: 0.9 },
    filter: { type: 'bandpass', cutoff: 1800, q: 4.5, env: 2.2, keytrack: 0.5 },
    ampEnv: env(0.05, 0.5, 0.75, 0.3), filtEnv: env(0.1, 0.5, 0.4, 0.25),
    lfo: { wave: 'triangle', rate: 3.2, depth: 0.6, target: 'filter', fade: 0.2 },
    shaper: { curve: 'rect', drive: 0.42 },
    gain: 0.34, sends: { reverb: 0.36 }, defaultNote: 55
  }
];
