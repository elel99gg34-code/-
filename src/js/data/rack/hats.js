/* Hats — ring partials plus filtered noise.
 * Field reference for these objects lives in ../instruments.js. */

import { env, HAT_PARTIALS } from './shared.js';

export const HATS = [
  {
    id: 'hat_closed', name: 'Closed Hat', tags: ['tight'],
    ring: { partials: HAT_PARTIALS, base: 320, wave: 'square', filter: 'highpass', cut: 7400, q: 0.9, decay: 0.05, level: 0.45 },
    noises: [{ color: 'white', level: 0.2, hp: 8000, decay: 0.035 }],
    gain: 0.5, defaultNote: 42
  },
  {
    id: 'hat_open', name: 'Open Hat', tags: ['long'],
    ring: { partials: HAT_PARTIALS, base: 320, wave: 'square', filter: 'highpass', cut: 6800, q: 0.9, decay: 0.42, level: 0.45, hold: 0.06 },
    noises: [{ color: 'white', level: 0.25, hp: 7000, decay: 0.34 }],
    gain: 0.48, defaultNote: 46
  },
  {
    id: 'hat_pedal', name: 'Pedal Hat', tags: ['short', 'dark'],
    ring: { partials: HAT_PARTIALS, base: 280, wave: 'square', filter: 'bandpass', cut: 5200, q: 1.4, decay: 0.035, level: 0.4 },
    gain: 0.45, defaultNote: 44
  },
  {
    id: 'hat_shuffle', name: 'Shuffle Tick', tags: ['tiny'],
    noises: [{ color: 'white', level: 0.6, bp: 9800, q: 2.6, decay: 0.018 }],
    click: { level: 0.3, decay: 0.002, hp: 6000 },
    gain: 0.42, defaultNote: 42
  },
  {
    id: 'hat_metal', name: 'Metal Hat', tags: ['harsh', 'metal'],
    ring: { partials: [1, 1.31, 1.83, 2.41, 3.07, 4.13], base: 460, wave: 'square', filter: 'highpass', cut: 6200, q: 1.1, decay: 0.09, level: 0.5 },
    noises: [{ color: 'metal', level: 0.3, hp: 6500, decay: 0.07 }],
    shaper: { curve: 'rect', drive: 0.4 }, gain: 0.46, defaultNote: 42
  },
  {
    id: 'hat_noise', name: 'Noise Hat', tags: ['digital'],
    noises: [{ color: 'blue', level: 0.7, hp: 7500, decay: 0.045 }],
    gain: 0.45, defaultNote: 42
  },
  {
    id: 'hat_lofi', name: 'Lo-Fi Hat', tags: ['lofi', 'dark'],
    ring: { partials: HAT_PARTIALS, base: 300, wave: 'square', filter: 'bandpass', cut: 4200, q: 1.1, decay: 0.06, level: 0.4 },
    filter: { type: 'lowpass', cutoff: 6500, q: 0.8 },
    shaper: { curve: 'crush', drive: 0.55 }, gain: 0.44, defaultNote: 42
  },
  {
    id: 'hat_sizzle', name: 'Sizzle', tags: ['bright', 'long'],
    noises: [{ color: 'violet', level: 0.55, hp: 9500, decay: 0.55, hold: 0.04, holdLevel: 0.7 }],
    ring: { partials: [1, 1.61, 2.32, 3.47], base: 720, wave: 'sine', filter: 'highpass', cut: 9000, decay: 0.4, level: 0.18 },
    gain: 0.4, sends: { reverb: 0.12 }, defaultNote: 46
  },
  {
    id: 'hat_click', name: 'Click Hat', tags: ['minimal'],
    click: { level: 0.9, decay: 0.0035, hp: 8200 },
    noises: [{ color: 'white', level: 0.25, hp: 11000, decay: 0.008 }],
    gain: 0.46, defaultNote: 42
  },
  {
    id: 'hat_glass', name: 'Glass Hat', tags: ['clean', 'tonal'],
    ring: { partials: [1, 2.756, 5.404, 8.933], base: 1100, wave: 'sine', filter: 'highpass', cut: 4200, decay: 0.16, level: 0.4 },
    noises: [{ color: 'white', level: 0.14, hp: 9800, decay: 0.03 }],
    gain: 0.44, sends: { reverb: 0.1 }, defaultNote: 42
  },
  {
    id: 'hat_grit', name: 'Grit Hat', tags: ['distorted'],
    noises: [{ color: 'white', level: 0.62, bp: 7200, q: 0.8, decay: 0.07 }],
    shaper: { curve: 'destroy', drive: 0.55 },
    filter: { type: 'highpass', cutoff: 4600, q: 1.2 }, gain: 0.42, defaultNote: 42
  },
  {
    id: 'hat_reverse', name: 'Reverse Hat', tags: ['fx', 'swell'],
    noises: [{ color: 'white', level: 0.6, hp: 6500, attack: 0.075, decay: 0.02 }],
    gain: 0.46, defaultNote: 42
  },

  {
    id: 'hat_808', name: '808 Hat', tags: ['classic', 'tight'],
    ring: { partials: HAT_PARTIALS, base: 264, wave: 'square', filter: 'highpass', cut: 8200, q: 0.8, decay: 0.04, level: 0.48 },
    gain: 0.46, defaultNote: 42
  },
  {
    id: 'hat_707', name: '707 Hat', tags: ['classic', 'bright'],
    ring: { partials: [1, 1.38, 1.86, 2.41, 3.12, 4.06], base: 380, wave: 'square', filter: 'highpass', cut: 7600, q: 1, decay: 0.055, level: 0.42 },
    noises: [{ color: 'white', level: 0.18, hp: 9000, decay: 0.03 }],
    gain: 0.45, defaultNote: 42
  },
  {
    id: 'hat_analog', name: 'Analog Hat', tags: ['warm', 'round'],
    ring: { partials: HAT_PARTIALS, base: 300, wave: 'triangle', filter: 'highpass', cut: 5600, q: 0.8, decay: 0.07, level: 0.5 },
    noises: [{ color: 'pink', level: 0.2, hp: 6000, decay: 0.05 }],
    shaper: { curve: 'tube', drive: 0.25 }, gain: 0.46, defaultNote: 42
  },
  {
    id: 'hat_dark', name: 'Dark Hat', tags: ['dark', 'muted'],
    ring: { partials: HAT_PARTIALS, base: 240, wave: 'square', filter: 'bandpass', cut: 3600, q: 1.3, decay: 0.05, level: 0.45 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.9 },
    gain: 0.46, defaultNote: 42
  },
  {
    id: 'hat_ticky', name: 'Ticky', tags: ['tiny', 'dry'],
    noises: [{ color: 'white', level: 0.65, bp: 11000, q: 3.4, decay: 0.009 }],
    gain: 0.44, defaultNote: 42
  },
  {
    id: 'hat_wide', name: 'Wide Hat', tags: ['stereo', 'airy'],
    ring: { partials: HAT_PARTIALS, base: 330, wave: 'square', filter: 'highpass', cut: 7000, q: 0.7, decay: 0.09, level: 0.42 },
    noises: [{ color: 'violet', level: 0.28, hp: 8500, decay: 0.07 }],
    gain: 0.42, pan: 0.18, sends: { reverb: 0.1 }, defaultNote: 42
  },
  {
    id: 'hat_ring', name: 'Ring Hat', tags: ['metal', 'tonal'],
    ring: { partials: [1, 1.5, 2.25, 3.375, 5.06], base: 520, wave: 'square', filter: 'highpass', cut: 6000, q: 1.1, decay: 0.08, level: 0.46 },
    shaper: { curve: 'rect', drive: 0.35 }, gain: 0.42, defaultNote: 42
  },
  {
    id: 'hat_halfopen', name: 'Half Open', tags: ['medium'],
    ring: { partials: HAT_PARTIALS, base: 320, wave: 'square', filter: 'highpass', cut: 7200, q: 0.9, decay: 0.17, level: 0.44, hold: 0.025 },
    noises: [{ color: 'white', level: 0.22, hp: 7800, decay: 0.14 }],
    gain: 0.46, defaultNote: 44
  }
];
