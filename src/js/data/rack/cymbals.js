/* Cymbals — long inharmonic partial stacks.
 * Field reference for these objects lives in ../instruments.js. */

import { env, CYM_PARTIALS } from './shared.js';

export const CYMBALS = [
  {
    id: 'cym_crash', name: 'Crash', tags: ['big', 'long'],
    ring: { partials: CYM_PARTIALS, base: 296, wave: 'square', filter: 'highpass', cut: 3400, q: 0.6, decay: 1.5, level: 0.36, hold: 0.1 },
    noises: [{ color: 'white', level: 0.3, hp: 4200, decay: 1.2, hold: 0.06, holdLevel: 0.8 }],
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 49
  },
  {
    id: 'cym_ride', name: 'Ride', tags: ['ping', 'sustain'],
    ring: { partials: CYM_PARTIALS, base: 420, wave: 'square', filter: 'bandpass', cut: 5600, q: 0.5, decay: 1.1, level: 0.3 },
    click: { level: 0.4, decay: 0.003, hp: 5200 },
    gain: 0.45, sends: { reverb: 0.12 }, defaultNote: 51
  },
  {
    id: 'cym_china', name: 'China Trash', tags: ['trashy', 'harsh'],
    ring: { partials: [1, 1.19, 1.87, 2.41, 3.33, 4.71, 6.17], base: 340, wave: 'square', filter: 'highpass', cut: 2800, q: 0.4, decay: 0.85, level: 0.42 },
    noises: [{ color: 'metal', level: 0.4, hp: 3600, decay: 0.75 }],
    shaper: { curve: 'rect', drive: 0.45 }, gain: 0.5, sends: { reverb: 0.16 }, defaultNote: 52
  },
  {
    id: 'cym_splash', name: 'Splash', tags: ['short', 'bright'],
    ring: { partials: CYM_PARTIALS, base: 520, wave: 'square', filter: 'highpass', cut: 5200, q: 0.6, decay: 0.45, level: 0.34 },
    noises: [{ color: 'violet', level: 0.28, hp: 7000, decay: 0.34 }],
    gain: 0.46, sends: { reverb: 0.16 }, defaultNote: 55
  },
  {
    id: 'cym_reverse', name: 'Reverse Crash', tags: ['fx', 'swell'],
    noises: [{ color: 'white', level: 0.7, hp: 2600, attack: 0.65, decay: 0.05 }],
    ring: { partials: CYM_PARTIALS, base: 300, wave: 'square', filter: 'highpass', cut: 3000, decay: 0.05, level: 0.3, attack: 0.62 },
    gain: 0.52, sends: { reverb: 0.25 }, defaultNote: 49
  },
  {
    id: 'cym_gong', name: 'Riot Gong', tags: ['huge', 'metal'],
    ring: { partials: [1, 1.21, 1.63, 2.17, 2.84, 3.51, 4.62, 6.03], base: 96, wave: 'sine', filter: 'bandpass', cut: 900, q: 0.35, decay: 3.4, level: 0.55, hold: 0.4 },
    noises: [{ color: 'metal', level: 0.25, bp: 1400, q: 0.5, decay: 2.6, hold: 0.3, holdLevel: 0.8 }],
    shaper: { curve: 'tube', drive: 0.28 }, gain: 0.55, sends: { reverb: 0.4 }, defaultNote: 45
  },

  {
    id: 'cym_crash_dark', name: 'Dark Crash', tags: ['dark', 'wash'],
    ring: { partials: CYM_PARTIALS, base: 218, wave: 'square', filter: 'bandpass', cut: 2400, q: 0.4, decay: 1.9, level: 0.4, hold: 0.14 },
    noises: [{ color: 'pink', level: 0.26, hp: 2600, decay: 1.5, hold: 0.08, holdLevel: 0.8 }],
    gain: 0.5, sends: { reverb: 0.24 }, defaultNote: 49
  },
  {
    id: 'cym_bell', name: 'Ride Bell', tags: ['ping', 'tonal'],
    ring: { partials: [1, 2.4, 3.8, 5.6], base: 620, wave: 'square', filter: 'bandpass', cut: 3400, q: 1.2, decay: 0.7, level: 0.42 },
    click: { level: 0.55, decay: 0.003, hp: 4800 },
    gain: 0.46, sends: { reverb: 0.16 }, defaultNote: 53
  },
  {
    id: 'cym_sizzle_ride', name: 'Sizzle Ride', tags: ['rivets', 'long'],
    ring: { partials: CYM_PARTIALS, base: 430, wave: 'square', filter: 'bandpass', cut: 5200, q: 0.5, decay: 1.3, level: 0.26 },
    noises: [{ color: 'violet', level: 0.32, hp: 8500, decay: 1.1, hold: 0.1, holdLevel: 0.75 }],
    click: { level: 0.32, decay: 0.003, hp: 5200 },
    gain: 0.44, sends: { reverb: 0.2 }, defaultNote: 51
  },
  {
    id: 'cym_stack', name: 'Trash Stack', tags: ['short', 'harsh'],
    ring: { partials: [1, 1.17, 1.89, 2.44, 3.41, 4.86], base: 460, wave: 'square', filter: 'highpass', cut: 4200, q: 0.6, decay: 0.3, level: 0.46 },
    noises: [{ color: 'metal', level: 0.36, hp: 5200, decay: 0.24 }],
    shaper: { curve: 'rect', drive: 0.5 }, gain: 0.48, defaultNote: 52
  },
  {
    id: 'cym_bowed', name: 'Bowed Cymbal', tags: ['swell', 'drone'],
    ring: { partials: CYM_PARTIALS, base: 260, wave: 'sine', filter: 'bandpass', cut: 2200, q: 0.5, decay: 2.6, level: 0.4, attack: 0.9, hold: 0.5 },
    noises: [{ color: 'metal', level: 0.3, bp: 3000, q: 0.6, attack: 0.8, hold: 0.4, holdLevel: 0.9, decay: 1.4 }],
    gain: 0.46, sends: { reverb: 0.42 }, defaultNote: 49
  },
  {
    id: 'cym_tam', name: 'Tam-Tam', tags: ['huge', 'wash'],
    ring: { partials: [1, 1.18, 1.52, 2.03, 2.71, 3.44, 4.5, 5.9, 7.7], base: 128, wave: 'sine', filter: 'bandpass', cut: 1100, q: 0.3, decay: 4.2, level: 0.5, hold: 0.6 },
    noises: [{ color: 'metal', level: 0.3, bp: 1800, q: 0.4, decay: 3.4, hold: 0.5, holdLevel: 0.85 }],
    shaper: { curve: 'tube', drive: 0.22 }, gain: 0.52, sends: { reverb: 0.45 }, defaultNote: 47
  },

  {
    id: 'cym_crash_bright', name: 'Bright Crash', tags: ['bright', 'cutting'],
    ring: { partials: CYM_PARTIALS, base: 380, wave: 'square', filter: 'highpass', cut: 5200, q: 0.6, decay: 1.2, level: 0.34, hold: 0.08 },
    noises: [{ color: 'violet', level: 0.3, hp: 8000, decay: 1, hold: 0.05, holdLevel: 0.8 }],
    gain: 0.46, sends: { reverb: 0.2 }, defaultNote: 49
  },
  {
    id: 'cym_roll', name: 'Cymbal Roll', tags: ['swell', 'build'],
    noises: [{ color: 'white', level: 0.7, hp: 3600, attack: 1.1, hold: 0.1, holdLevel: 0.9, decay: 0.3 }],
    ring: { partials: CYM_PARTIALS, base: 300, wave: 'square', filter: 'highpass', cut: 4200, q: 0.5, decay: 0.4, level: 0.28, attack: 1 },
    gain: 0.48, sends: { reverb: 0.4 }, defaultNote: 49
  },
  {
    id: 'cym_choke', name: 'Choke Crash', tags: ['short', 'stab'],
    ring: { partials: CYM_PARTIALS, base: 310, wave: 'square', filter: 'highpass', cut: 3800, q: 0.6, decay: 0.16, level: 0.5 },
    noises: [{ color: 'white', level: 0.35, hp: 4600, decay: 0.12 }],
    shaper: { curve: 'hard', drive: 0.35 }, gain: 0.5, defaultNote: 49
  },
  {
    id: 'cym_mini', name: 'Mini Splash', tags: ['tiny', 'quick'],
    ring: { partials: CYM_PARTIALS, base: 760, wave: 'square', filter: 'highpass', cut: 7200, q: 0.7, decay: 0.2, level: 0.34 },
    noises: [{ color: 'violet', level: 0.25, hp: 9500, decay: 0.14 }],
    gain: 0.44, sends: { reverb: 0.14 }, defaultNote: 57
  },

  {
    id: 'cym_ride_dark', name: 'Dark Ride', tags: ['dark', 'wash'],
    ring: { partials: CYM_PARTIALS, base: 300, wave: 'square', filter: 'bandpass', cut: 3200, q: 0.5, decay: 1.4, level: 0.3 },
    click: { level: 0.3, decay: 0.003, hp: 3600 },
    gain: 0.46, sends: { reverb: 0.2 }, defaultNote: 51
  },
  {
    id: 'cym_crash_short', name: 'Short Crash', tags: ['quick', 'tight'],
    ring: { partials: CYM_PARTIALS, base: 320, wave: 'square', filter: 'highpass', cut: 4400, q: 0.6, decay: 0.5, level: 0.42, hold: 0.04 },
    noises: [{ color: 'white', level: 0.28, hp: 5200, decay: 0.4 }],
    gain: 0.48, sends: { reverb: 0.16 }, defaultNote: 49
  },
  {
    id: 'cym_bell_big', name: 'Big Bell', tags: ['tonal', 'loud'],
    ring: { partials: [1, 2.0, 3.01, 4.2, 5.4], base: 480, wave: 'square', filter: 'bandpass', cut: 2400, q: 0.9, decay: 1.5, level: 0.45 },
    click: { level: 0.55, decay: 0.003, hp: 4000 },
    shaper: { curve: 'tube', drive: 0.26 },
    gain: 0.48, sends: { reverb: 0.3 }, defaultNote: 53
  },
  {
    id: 'cym_sizzle_long', name: 'Long Sizzle', tags: ['rivets', 'wash'],
    noises: [{ color: 'violet', level: 0.45, hp: 8000, hold: 0.2, holdLevel: 0.85, decay: 2.2 }],
    ring: { partials: CYM_PARTIALS, base: 420, wave: 'square', filter: 'highpass', cut: 6200, q: 0.5, decay: 2, level: 0.22, hold: 0.2 },
    gain: 0.44, sends: { reverb: 0.28 }, defaultNote: 51
  },
  {
    id: 'cym_reverse_splash', name: 'Reverse Splash', tags: ['fx', 'swell'],
    noises: [{ color: 'violet', level: 0.7, hp: 6000, attack: 0.34, decay: 0.03 }],
    ring: { partials: CYM_PARTIALS, base: 560, wave: 'square', filter: 'highpass', cut: 6400, decay: 0.04, level: 0.34, attack: 0.32 },
    gain: 0.48, sends: { reverb: 0.26 }, defaultNote: 55
  },
  {
    id: 'cym_junklid', name: 'Junk Lid', tags: ['trash', 'clang'],
    ring: { partials: [1, 1.22, 1.71, 2.36, 3.11, 4.4], base: 390, wave: 'square', filter: 'bandpass', cut: 2600, q: 0.6, decay: 0.6, level: 0.5 },
    noises: [{ color: 'metal', level: 0.45, hp: 3200, decay: 0.5 }],
    click: { level: 0.5, decay: 0.003, hp: 3400 },
    shaper: { curve: 'diode', drive: 0.55 }, gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 52
  }
];
