/* Percussion — claps, toms, hand drums, metal and junk.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const PERC = [
  {
    id: 'perc_clap', name: 'Riot Clap', tags: ['clap', 'wide'],
    noises: [
      { color: 'white', level: 0.5, bp: 1150, q: 1.1, decay: 0.012 },
      { color: 'white', level: 0.5, bp: 1250, q: 1.1, attack: 0.011, decay: 0.014 },
      { color: 'white', level: 0.5, bp: 1350, q: 1, attack: 0.022, decay: 0.016 },
      { color: 'white', level: 0.62, bp: 1500, q: 0.75, attack: 0.033, decay: 0.19 }
    ],
    gain: 0.68, sends: { reverb: 0.1 }, defaultNote: 39
  },
  {
    id: 'perc_clap_crowd', name: 'Crowd Clap', tags: ['clap', 'big'],
    noises: [
      { color: 'pink', level: 0.45, bp: 900, q: 0.8, decay: 0.02 },
      { color: 'pink', level: 0.5, bp: 1200, q: 0.7, attack: 0.018, decay: 0.05 },
      { color: 'pink', level: 0.55, bp: 1700, q: 0.5, attack: 0.04, decay: 0.42 }
    ],
    gain: 0.64, sends: { reverb: 0.3 }, defaultNote: 39
  },
  {
    id: 'perc_snap', name: 'Finger Snap', tags: ['clap', 'tight'],
    noises: [{ color: 'white', level: 0.7, bp: 2400, q: 2.2, decay: 0.035 }],
    click: { level: 0.4, decay: 0.002, hp: 3200 }, gain: 0.6, defaultNote: 39
  },
  {
    id: 'perc_tom_lo', name: 'Low Tom', tags: ['tom'],
    bodies: [{ wave: 'sine', f0: 138, f1: 88, pitchDecay: 0.09, decay: 0.42, level: 1 }],
    noises: [{ color: 'pink', level: 0.14, lp: 1600, decay: 0.05 }],
    shaper: { curve: 'tube', drive: 0.2 }, gain: 0.78, defaultNote: 41
  },
  {
    id: 'perc_tom_mid', name: 'Mid Tom', tags: ['tom'],
    bodies: [{ wave: 'sine', f0: 195, f1: 128, pitchDecay: 0.07, decay: 0.34, level: 1 }],
    noises: [{ color: 'pink', level: 0.14, lp: 2200, decay: 0.045 }],
    shaper: { curve: 'tube', drive: 0.2 }, gain: 0.76, defaultNote: 45
  },
  {
    id: 'perc_tom_hi', name: 'High Tom', tags: ['tom'],
    bodies: [{ wave: 'sine', f0: 268, f1: 178, pitchDecay: 0.055, decay: 0.26, level: 1 }],
    noises: [{ color: 'pink', level: 0.14, lp: 3000, decay: 0.04 }],
    shaper: { curve: 'tube', drive: 0.2 }, gain: 0.75, defaultNote: 48
  },
  {
    id: 'perc_rim', name: 'Rim Click', tags: ['tick', 'wood'],
    bodies: [{ wave: 'square', f0: 1420, f1: 900, pitchDecay: 0.005, decay: 0.03, level: 0.5 }],
    noises: [{ color: 'white', level: 0.3, bp: 3200, q: 4, decay: 0.02 }],
    gain: 0.6, defaultNote: 37
  },
  {
    id: 'perc_wood', name: 'Wood Block', tags: ['wood', 'tonal'],
    ring: { partials: [1, 2.42, 4.11], base: 780, wave: 'sine', filter: 'bandpass', cut: 1800, q: 0.9, decay: 0.09, level: 0.6 },
    click: { level: 0.35, decay: 0.002, hp: 2200 }, gain: 0.62, defaultNote: 37
  },
  {
    id: 'perc_cowbell', name: 'Riot Bell', tags: ['metal', 'tonal'],
    ring: { partials: [1, 1.5], base: 540, wave: 'square', filter: 'bandpass', cut: 2600, q: 0.7, decay: 0.28, level: 0.5 },
    shaper: { curve: 'hard', drive: 0.3 }, gain: 0.55, defaultNote: 56
  },
  {
    id: 'perc_conga', name: 'Conga', tags: ['hand', 'tonal'],
    bodies: [{ wave: 'sine', f0: 320, f1: 250, pitchDecay: 0.04, decay: 0.2, level: 0.9 }],
    noises: [{ color: 'pink', level: 0.2, bp: 1100, q: 1.2, decay: 0.03 }],
    gain: 0.68, defaultNote: 47
  },
  {
    id: 'perc_shaker', name: 'Shaker', tags: ['noise', 'tiny'],
    noises: [{ color: 'white', level: 0.55, bp: 8200, q: 1.3, attack: 0.006, decay: 0.05 }],
    gain: 0.42, defaultNote: 70
  },
  {
    id: 'perc_tambourine', name: 'Tambourine', tags: ['metal', 'jingle'],
    ring: { partials: [1, 1.73, 2.51, 3.29, 4.77], base: 1900, wave: 'square', filter: 'highpass', cut: 6800, q: 0.8, decay: 0.2, level: 0.32 },
    noises: [{ color: 'violet', level: 0.3, hp: 8000, decay: 0.16 }],
    gain: 0.42, defaultNote: 54
  },
  {
    id: 'perc_anvil', name: 'Anvil', tags: ['industrial', 'metal'],
    ring: { partials: [1, 2.13, 3.41, 5.02, 7.13], base: 620, wave: 'square', filter: 'bandpass', cut: 2800, q: 0.6, decay: 0.9, level: 0.45 },
    click: { level: 0.7, decay: 0.003, hp: 3000 },
    shaper: { curve: 'diode', drive: 0.5 }, gain: 0.6, sends: { reverb: 0.25 }, defaultNote: 53
  },
  {
    id: 'perc_glassbreak', name: 'Glass Break', tags: ['fx', 'noise'],
    noises: [
      { color: 'crackle', level: 0.8, hp: 3200, decay: 0.42 },
      { color: 'violet', level: 0.35, hp: 7000, decay: 0.18 }
    ],
    ring: { partials: [1, 2.3, 3.9, 6.1, 9.4], base: 2200, wave: 'sine', filter: 'highpass', cut: 2500, decay: 0.35, level: 0.22 },
    gain: 0.56, sends: { reverb: 0.2 }, defaultNote: 53
  },

  {
    id: 'perc_bongo', name: 'Bongo', tags: ['hand', 'high'],
    bodies: [{ wave: 'sine', f0: 480, f1: 390, pitchDecay: 0.025, decay: 0.12, level: 0.9 }],
    noises: [{ color: 'pink', level: 0.24, bp: 1800, q: 1.4, decay: 0.02 }],
    gain: 0.62, defaultNote: 60
  },
  {
    id: 'perc_timbale', name: 'Timbale', tags: ['metal', 'ring'],
    bodies: [{ wave: 'triangle', f0: 400, f1: 330, pitchDecay: 0.03, decay: 0.24, level: 0.8 }],
    ring: { partials: [1, 2.1, 3.4], base: 700, wave: 'square', filter: 'bandpass', cut: 2400, q: 1.1, decay: 0.16, level: 0.22 },
    click: { level: 0.45, decay: 0.003, hp: 2800 },
    shaper: { curve: 'hard', drive: 0.3 }, gain: 0.6, defaultNote: 59
  },
  {
    id: 'perc_clave', name: 'Clave', tags: ['wood', 'tick'],
    ring: { partials: [1, 2.6], base: 1180, wave: 'sine', filter: 'bandpass', cut: 2400, q: 1.6, decay: 0.06, level: 0.7 },
    click: { level: 0.4, decay: 0.002, hp: 3000 }, gain: 0.58, defaultNote: 61
  },
  {
    id: 'perc_agogo', name: 'Agogo', tags: ['metal', 'tonal'],
    ring: { partials: [1, 1.41, 2.3], base: 840, wave: 'square', filter: 'bandpass', cut: 2800, q: 0.9, decay: 0.22, level: 0.5 },
    shaper: { curve: 'tube', drive: 0.28 }, gain: 0.54, defaultNote: 63
  },
  {
    id: 'perc_triangle', name: 'Triangle', tags: ['metal', 'shimmer'],
    ring: { partials: [1, 2.73, 5.1, 8.9, 13.2], base: 2600, wave: 'sine', filter: 'highpass', cut: 4000, q: 0.8, decay: 1.4, level: 0.26, hold: 0.06 },
    gain: 0.38, sends: { reverb: 0.22 }, defaultNote: 81
  },
  {
    id: 'perc_guiro', name: 'Guiro', tags: ['scrape', 'noise'],
    noises: [{ color: 'crackle', level: 0.75, bp: 2600, q: 1.6, attack: 0.02, hold: 0.09, holdLevel: 0.8, decay: 0.05 }],
    gain: 0.5, defaultNote: 73
  },
  {
    id: 'perc_pipe', name: 'Scaffold Pipe', tags: ['industrial', 'metal'],
    ring: { partials: [1, 2.76, 5.4, 8.9], base: 340, wave: 'square', filter: 'bandpass', cut: 1600, q: 0.7, decay: 1.1, level: 0.45 },
    click: { level: 0.6, decay: 0.003, hp: 2600 },
    shaper: { curve: 'diode', drive: 0.45 }, gain: 0.55, sends: { reverb: 0.28 }, defaultNote: 55
  },
  {
    id: 'perc_chain', name: 'Chain Rattle', tags: ['metal', 'noise'],
    noises: [{ color: 'metal', level: 0.7, hp: 3400, attack: 0.004, hold: 0.05, holdLevel: 0.7, decay: 0.22 }],
    ring: { partials: [1, 1.83, 2.41, 4.13, 6.7], base: 1400, wave: 'square', filter: 'highpass', cut: 5200, q: 0.9, decay: 0.26, level: 0.2 },
    gain: 0.46, sends: { reverb: 0.16 }, defaultNote: 66
  }
];
