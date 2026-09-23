/* Mallets and bells — struck bars and tubes.
 *
 * Two recipes do all the work here: a sine carrier with a high, fast-decaying
 * FM operator (bars, glass, metal), and a stack of inharmonic partials with a
 * long tail (tubular and struck metal). */

import { env } from './shared.js';

export const MALLETS = [
  {
    id: 'mlt_vibraphone', name: 'Vibraphone', tags: ['bar', 'tremolo'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'sine', level: 0.22, semi: 28 }],
    fm: { ratio: 3.98, index: 1.1, decay: 0.09, sustain: 0.02 },
    filter: { type: 'lowpass', cutoff: 4200, q: 0.7, env: 0.8, keytrack: 0.8 },
    ampEnv: env(0.002, 2.2, 0.0, 0.8), filtEnv: env(0.002, 0.6, 0.06, 0.3),
    gain: 0.48, sends: { reverb: 0.3 }, defaultNote: 67,
    fx: [{ type: 'autopan', mode: 'trem', rate: 5.4, depth: 0.45 }]
  },
  {
    id: 'mlt_glockenspiel', name: 'Glockenspiel', tags: ['bright', 'short'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 5.02, index: 2.4, decay: 0.05, sustain: 0.01 },
    filter: { type: 'highpass', cutoff: 620, q: 0.7, env: 0.4, keytrack: 0.8 },
    ampEnv: env(0.001, 0.9, 0.0, 0.3), filtEnv: env(0.001, 0.2, 0.1, 0.14),
    gain: 0.42, sends: { reverb: 0.34, delay: 0.14 }, defaultNote: 84
  },
  {
    id: 'mlt_xylophone', name: 'Xylophone', tags: ['wood', 'dry'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'triangle', level: 0.2, semi: 19 }],
    fm: { ratio: 3.0, index: 2.8, decay: 0.03, sustain: 0.01 },
    noise: { color: 'white', level: 0.2, bp: 3800, q: 2.6, decay: 0.008 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.8, env: 1, keytrack: 0.8 },
    ampEnv: env(0.001, 0.3, 0.0, 0.1), filtEnv: env(0.001, 0.14, 0.05, 0.08),
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 72
  },
  {
    id: 'mlt_tubular', name: 'Tubular Bells', tags: ['bell', 'long'],
    oscs: [
      { wave: 'bell', level: 0.9 },
      { wave: 'sine', level: 0.3, semi: 19, cent: 12 }
    ],
    fm: { ratio: 1.414, index: 1.8, decay: 0.9, sustain: 0.12 },
    filter: { type: 'lowpass', cutoff: 4800, q: 0.9, env: 0.8, keytrack: 0.7 },
    ampEnv: env(0.003, 4.5, 0.0, 2.2), filtEnv: env(0.003, 1.6, 0.1, 1),
    gain: 0.44, sends: { reverb: 0.5, delay: 0.16 }, defaultNote: 60
  },
  {
    id: 'mlt_steeldrum', name: 'Steel Drum', tags: ['metal', 'tuned'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'glass', level: 0.35, oct: 1 }],
    fm: { ratio: 2.01, index: 3.2, decay: 0.12, sustain: 0.08 },
    filter: { type: 'bandpass', cutoff: 1400, q: 1.6, env: 1.6, keytrack: 0.8 },
    ampEnv: env(0.002, 1.1, 0.0, 0.4), filtEnv: env(0.002, 0.4, 0.1, 0.2),
    shaper: { curve: 'soft', drive: 0.2 },
    gain: 0.48, sends: { reverb: 0.28 }, defaultNote: 64
  },
  {
    id: 'mlt_handpan', name: 'Handpan', tags: ['warm', 'hollow'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'sine', level: 0.3, semi: 12 }, { wave: 'sine', level: 0.16, semi: 19 }],
    fm: { ratio: 1.01, index: 0.9, decay: 0.3, sustain: 0.05 },
    noise: { color: 'pink', level: 0.14, bp: 900, q: 2, decay: 0.02 },
    filter: { type: 'lowpass', cutoff: 2200, q: 1.2, env: 1.2, keytrack: 0.8 },
    ampEnv: env(0.003, 2.4, 0.0, 0.9), filtEnv: env(0.003, 0.7, 0.06, 0.4),
    gain: 0.52, sends: { reverb: 0.38 }, defaultNote: 60
  },
  {
    id: 'mlt_crotales', name: 'Crotales', tags: ['tiny', 'piercing'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 7.01, index: 1.6, decay: 0.16, sustain: 0.04 },
    filter: { type: 'highpass', cutoff: 700, q: 1, env: 0.4, keytrack: 0.8 },
    ampEnv: env(0.001, 1.6, 0.0, 0.7), filtEnv: env(0.001, 0.4, 0.1, 0.2),
    gain: 1.2, sends: { reverb: 0.46, delay: 0.2 }, defaultNote: 91
  },
  {
    id: 'mlt_gamelan', name: 'Gamelan', tags: ['inharmonic', 'metal'],
    oscs: [{ wave: 'metal', level: 0.7 }, { wave: 'sine', level: 0.5 }],
    fm: { ratio: 2.76, index: 3.4, decay: 0.24, sustain: 0.1 },
    filter: { type: 'bandpass', cutoff: 1800, q: 1.1, env: 1.8, keytrack: 0.75 },
    ampEnv: env(0.002, 1.8, 0.0, 0.7), filtEnv: env(0.002, 0.5, 0.08, 0.3),
    gain: 0.4, sends: { reverb: 0.4 }, defaultNote: 67
  },
  {
    id: 'mlt_logdrum', name: 'Log Drum', tags: ['wood', 'round'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'triangle', level: 0.25, semi: 12 }],
    fm: { ratio: 1.5, index: 1.2, decay: 0.035, sustain: 0.01 },
    noise: { color: 'pink', level: 0.16, bp: 700, q: 2.4, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 1500, q: 1.4, env: 1.2, keytrack: 0.85 },
    ampEnv: env(0.002, 0.8, 0.0, 0.26), filtEnv: env(0.002, 0.24, 0.05, 0.14),
    gain: 0.56, sends: { reverb: 0.22 }, defaultNote: 55
  },
  {
    id: 'mlt_bellchime', name: 'Bell Chime', tags: ['bell', 'shimmer'],
    oscs: [
      { wave: 'bell', level: 0.85, unison: 2, spread: 6 },
      { wave: 'glass', level: 0.3, oct: 1, cent: 4 }
    ],
    fm: { ratio: 3.51, index: 1.4, decay: 0.5, sustain: 0.08 },
    filter: { type: 'highpass', cutoff: 420, q: 0.8, env: 0.5, keytrack: 0.75 },
    ampEnv: env(0.002, 3, 0.0, 1.4), filtEnv: env(0.002, 1, 0.1, 0.6),
    gain: 0.4, sends: { reverb: 0.52, delay: 0.24 }, defaultNote: 79
  },

  {
    id: 'mlt_bassmarimba', name: 'Bass Marimba', tags: ['bar', 'low'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'sine', level: 0.2, semi: 19 }],
    fm: { ratio: 4.0, index: 1.4, decay: 0.06, sustain: 0.02 },
    filter: { type: 'lowpass', cutoff: 1400, q: 1, env: 1, keytrack: 0.85 },
    ampEnv: env(0.002, 1.2, 0.0, 0.4), filtEnv: env(0.002, 0.34, 0.06, 0.2),
    gain: 0.62, sends: { reverb: 0.26 }, defaultNote: 43
  },
  {
    id: 'mlt_carillon', name: 'Carillon', tags: ['bell', 'church'],
    oscs: [{ wave: 'bell', level: 0.9, unison: 2, spread: 5 }, { wave: 'sine', level: 0.3, semi: 12 }],
    fm: { ratio: 2.76, index: 2.2, decay: 1.4, sustain: 0.16 },
    filter: { type: 'lowpass', cutoff: 4200, q: 1, env: 0.8, keytrack: 0.7 },
    ampEnv: env(0.004, 5, 0.0, 2.6), filtEnv: env(0.004, 1.8, 0.1, 1.2),
    gain: 0.44, sends: { reverb: 0.55, delay: 0.16 }, defaultNote: 55
  },
  {
    id: 'mlt_anvilbell', name: 'Anvil Bell', tags: ['metal', 'industrial'],
    oscs: [{ wave: 'metal', level: 0.6 }, { wave: 'square', level: 0.4 }],
    fm: { ratio: 5.41, index: 2.8, decay: 0.3, sustain: 0.12 },
    filter: { type: 'bandpass', cutoff: 2200, q: 1.2, env: 1.6, keytrack: 0.7 },
    ampEnv: env(0.001, 1.6, 0.0, 0.6), filtEnv: env(0.001, 0.5, 0.08, 0.3),
    shaper: { curve: 'diode', drive: 0.4 },
    gain: 0.5, sends: { reverb: 0.4 }, defaultNote: 60
  },
  {
    id: 'mlt_chimebar', name: 'Chime Bar', tags: ['bar', 'clean'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'glass', level: 0.25, oct: 1 }],
    fm: { ratio: 6.01, index: 1.1, decay: 0.12, sustain: 0.03 },
    filter: { type: 'highpass', cutoff: 380, q: 0.8, env: 0.4, keytrack: 0.8 },
    ampEnv: env(0.001, 2.2, 0.0, 0.9), filtEnv: env(0.001, 0.6, 0.1, 0.3),
    gain: 0.5, sends: { reverb: 0.44, delay: 0.18 }, defaultNote: 76
  },

  {
    id: 'mlt_marimba_soft', name: 'Soft Marimba', tags: ['bar', 'mellow'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'sine', level: 0.18, semi: 19 }],
    fm: { ratio: 4.0, index: 0.9, decay: 0.07, sustain: 0.02 },
    filter: { type: 'lowpass', cutoff: 2600, q: 0.8, env: 0.9, keytrack: 0.85 },
    ampEnv: env(0.003, 1, 0.0, 0.3), filtEnv: env(0.003, 0.3, 0.06, 0.18),
    gain: 0.56, velCurve: 1.2, sends: { reverb: 0.3 }, defaultNote: 64
  },
  {
    id: 'mlt_balafon', name: 'Balafon', tags: ['bar', 'buzzy'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'buzz', level: 0.22, semi: 12 }],
    fm: { ratio: 3.02, index: 2.2, decay: 0.05, sustain: 0.02 },
    noise: { color: 'white', level: 0.2, bp: 3000, q: 2.4, decay: 0.01 },
    filter: { type: 'lowpass', cutoff: 3400, q: 1.2, env: 1.2, keytrack: 0.85 },
    ampEnv: env(0.001, 0.5, 0.0, 0.16), filtEnv: env(0.001, 0.18, 0.06, 0.1),
    gain: 0.56, sends: { reverb: 0.26 }, defaultNote: 67
  },
  {
    id: 'mlt_glassarmonica', name: 'Glass Armonica', tags: ['bowed', 'eerie'],
    oscs: [{ wave: 'sine', level: 0.9, unison: 2, spread: 6 }, { wave: 'glass', level: 0.35, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 3600, q: 1, env: 0.8, keytrack: 0.75 },
    ampEnv: env(0.5, 0.8, 0.9, 0.8), filtEnv: env(0.8, 0.9, 0.55, 0.5),
    lfo: { wave: 'sine', rate: 4.6, depth: 0.06, target: 'pitch', delay: 0.6, fade: 0.8 },
    gain: 0.5, sends: { reverb: 0.52 }, defaultNote: 76
  },
  {
    id: 'mlt_bowl', name: 'Singing Bowl', tags: ['bell', 'meditative'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'sine', level: 0.3, semi: 17, cent: 14 }],
    fm: { ratio: 2.76, index: 0.6, decay: 3, sustain: 0.3 },
    filter: { type: 'lowpass', cutoff: 2600, q: 1.2, env: 0.7, keytrack: 0.7 },
    ampEnv: env(0.06, 5, 0.1, 3), filtEnv: env(0.1, 1.6, 0.14, 1.2),
    lfo: { wave: 'sine', rate: 2.3, depth: 0.05, target: 'amp', delay: 0.5, fade: 1.2 },
    gain: 0.56, sends: { reverb: 0.55 }, defaultNote: 55
  },
  {
    id: 'mlt_temple_bell', name: 'Temple Bell', tags: ['bell', 'deep'],
    oscs: [{ wave: 'bell', level: 0.9 }, { wave: 'sine', level: 0.35, semi: 12 }],
    fm: { ratio: 1.732, index: 2.4, decay: 1.6, sustain: 0.14 },
    filter: { type: 'lowpass', cutoff: 3200, q: 1, env: 0.9, keytrack: 0.7 },
    ampEnv: env(0.003, 6, 0.0, 3.4), filtEnv: env(0.004, 2, 0.1, 1.4),
    shaper: { curve: 'tube', drive: 0.2 },
    gain: 0.52, sends: { reverb: 0.55 }, defaultNote: 48
  },
  {
    id: 'mlt_metallophone', name: 'Metallophone', tags: ['bar', 'metal'],
    oscs: [{ wave: 'metal', level: 0.5 }, { wave: 'sine', level: 0.6 }],
    fm: { ratio: 4.76, index: 2.2, decay: 0.2, sustain: 0.06 },
    filter: { type: 'bandpass', cutoff: 2400, q: 1.3, env: 1.6, keytrack: 0.8 },
    ampEnv: env(0.002, 1.6, 0.0, 0.6), filtEnv: env(0.002, 0.5, 0.08, 0.3),
    gain: 1.1, sends: { reverb: 0.4 }, defaultNote: 72
  }
];
