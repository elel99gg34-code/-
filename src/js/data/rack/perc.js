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
  },

  {
    id: 'perc_cabasa', name: 'Cabasa', tags: ['shaker', 'scrape'],
    noises: [{ color: 'white', level: 0.6, bp: 6800, q: 1.1, attack: 0.004, hold: 0.02, holdLevel: 0.7, decay: 0.04 }],
    gain: 0.44, defaultNote: 69
  },
  {
    id: 'perc_djembe', name: 'Djembe', tags: ['hand', 'deep'],
    bodies: [{ wave: 'sine', f0: 210, f1: 140, pitchDecay: 0.03, decay: 0.24, level: 0.9 }],
    noises: [{ color: 'pink', level: 0.3, bp: 1400, q: 1.2, decay: 0.035 }],
    shaper: { curve: 'tube', drive: 0.24 }, gain: 0.66, defaultNote: 50
  },
  {
    id: 'perc_tabla', name: 'Tabla', tags: ['hand', 'tonal'],
    bodies: [{ wave: 'sine', f0: 340, f1: 200, pitchDecay: 0.05, curve: 1.5, decay: 0.3, level: 0.85 }],
    ring: { partials: [1, 2.0, 3.0], base: 400, wave: 'sine', filter: 'bandpass', cut: 900, q: 1.4, decay: 0.22, level: 0.22 },
    noises: [{ color: 'white', level: 0.2, bp: 2600, q: 2.2, decay: 0.014 }],
    gain: 0.62, defaultNote: 58
  },
  {
    id: 'perc_castanet', name: 'Castanet', tags: ['wood', 'snap'],
    ring: { partials: [1, 2.9, 5.2], base: 1600, wave: 'square', filter: 'bandpass', cut: 3800, q: 1.4, decay: 0.035, level: 0.55 },
    click: { level: 0.5, decay: 0.002, hp: 4200 }, gain: 0.5, defaultNote: 71
  },
  {
    id: 'perc_belltree', name: 'Bell Tree', tags: ['metal', 'cascade'],
    ring: { partials: [1, 1.9, 3.2, 4.8, 7.1, 10.4, 14.2], base: 1800, wave: 'sine', filter: 'highpass', cut: 5200, q: 0.8, decay: 1.6, level: 0.24, attack: 0.05, hold: 0.2 },
    noises: [{ color: 'violet', level: 0.2, hp: 9000, attack: 0.04, hold: 0.18, holdLevel: 0.7, decay: 0.9 }],
    gain: 0.4, sends: { reverb: 0.34 }, defaultNote: 84
  },
  {
    id: 'perc_spring', name: 'Spring Boing', tags: ['fx', 'ring'],
    ring: { partials: [1, 1.34, 1.83, 2.51], base: 320, wave: 'sine', filter: 'bandpass', cut: 800, q: 2.2, decay: 0.7, level: 0.5 },
    bodies: [{ wave: 'sine', f0: 700, f1: 180, pitchDecay: 0.18, curve: 1.4, decay: 0.4, level: 0.35 }],
    click: { level: 0.3, decay: 0.003, hp: 1800 },
    gain: 0.5, sends: { reverb: 0.22 }, defaultNote: 60
  },

  {
    id: 'perc_timpani', name: 'Timpani', tags: ['orchestral', 'deep'],
    bodies: [
      { wave: 'sine', f0: 132, f1: 104, pitchDecay: 0.06, decay: 1.1, level: 0.95 },
      { wave: 'sine', f0: 198, f1: 156, pitchDecay: 0.04, decay: 0.6, level: 0.3 }
    ],
    noises: [{ color: 'pink', level: 0.24, lp: 1400, decay: 0.03 }],
    shaper: { curve: 'tube', drive: 0.24 },
    gain: 0.72, sends: { reverb: 0.34 }, defaultNote: 48
  },
  {
    id: 'perc_grancassa', name: 'Gran Cassa', tags: ['orchestral', 'huge'],
    bodies: [{ wave: 'sine', f0: 96, f1: 52, pitchDecay: 0.08, decay: 1.4, level: 1 }],
    noises: [{ color: 'brown', level: 0.35, lp: 700, decay: 0.3 }],
    shaper: { curve: 'tube', drive: 0.26 },
    gain: 0.78, sends: { reverb: 0.4 }, defaultNote: 36
  },
  {
    id: 'perc_concerttom', name: 'Concert Tom', tags: ['tom', 'orchestral'],
    bodies: [{ wave: 'sine', f0: 230, f1: 168, pitchDecay: 0.06, decay: 0.5, level: 0.95 }],
    noises: [{ color: 'pink', level: 0.18, lp: 2400, decay: 0.04 }],
    gain: 0.72, sends: { reverb: 0.26 }, defaultNote: 47
  },
  {
    id: 'perc_snareroll', name: 'Snare Roll', tags: ['roll', 'build'],
    noises: [{ color: 'white', level: 0.75, hp: 2400, lp: 10000, attack: 0.5, hold: 0.12, holdLevel: 0.95, decay: 0.2 }],
    bodies: [{ wave: 'triangle', f0: 250, f1: 220, pitchDecay: 0.3, decay: 0.4, level: 0.2, attack: 0.45 }],
    gain: 0.66, sends: { reverb: 0.3 }, defaultNote: 38
  },
  {
    id: 'perc_udu', name: 'Udu', tags: ['hand', 'clay'],
    bodies: [{ wave: 'sine', f0: 168, f1: 118, pitchDecay: 0.045, decay: 0.3, level: 0.95 }],
    ring: { partials: [1, 2.8], base: 420, wave: 'sine', filter: 'bandpass', cut: 700, q: 2.2, decay: 0.18, level: 0.2 },
    noises: [{ color: 'pink', level: 0.18, bp: 900, q: 2, decay: 0.014 }],
    gain: 0.68, defaultNote: 50
  },
  {
    id: 'perc_cuica', name: 'Cuica', tags: ['friction', 'squeak'],
    bodies: [{ wave: 'triangle', f0: 300, f1: 560, pitchDecay: 0.14, decay: 0.24, level: 0.7 }],
    noises: [{ color: 'pink', level: 0.3, bp: 1600, q: 2.4, decay: 0.16 }],
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.6, defaultNote: 62
  },
  {
    id: 'perc_vibraslap', name: 'Vibraslap', tags: ['rattle', 'wood'],
    ring: { partials: [1, 1.74, 2.63, 3.81, 5.4], base: 620, wave: 'square', filter: 'bandpass', cut: 2200, q: 0.8, decay: 0.7, level: 0.42, hold: 0.06 },
    noises: [{ color: 'crackle', level: 0.4, bp: 3200, q: 1.2, hold: 0.06, holdLevel: 0.8, decay: 0.5 }],
    click: { level: 0.5, decay: 0.003, hp: 2400 },
    gain: 0.52, defaultNote: 58
  },
  {
    id: 'perc_woodfish', name: 'Wood Fish', tags: ['wood', 'hollow'],
    ring: { partials: [1, 2.1, 3.6], base: 520, wave: 'sine', filter: 'bandpass', cut: 1200, q: 1.8, decay: 0.1, level: 0.6 },
    click: { level: 0.4, decay: 0.002, hp: 2000 }, gain: 0.6, defaultNote: 60
  },
  {
    id: 'perc_ratchet', name: 'Ratchet', tags: ['noise', 'mechanical'],
    noises: [{ color: 'crackle', level: 0.8, bp: 3600, q: 1.4, attack: 0.004, hold: 0.14, holdLevel: 0.9, decay: 0.06 }],
    gain: 0.54, defaultNote: 66
  },
  {
    id: 'perc_whip', name: 'Whip', tags: ['crack', 'sharp'],
    noises: [{ color: 'white', level: 0.9, bp: 4200, q: 1.1, sweep: 0.35, sweepTime: 0.03, decay: 0.05 }],
    click: { level: 0.6, decay: 0.002, hp: 4000 },
    shaper: { curve: 'hard', drive: 0.4 }, gain: 0.6, defaultNote: 64
  },
  {
    id: 'perc_hammer', name: 'Hammer', tags: ['industrial', 'impact'],
    bodies: [{ wave: 'triangle', f0: 190, f1: 76, pitchDecay: 0.02, curve: 2.4, decay: 0.2, level: 0.9 }],
    ring: { partials: [1, 2.4, 4.1, 6.9], base: 480, wave: 'square', filter: 'bandpass', cut: 2000, q: 0.9, decay: 0.35, level: 0.3 },
    click: { level: 0.7, decay: 0.003, hp: 3000 },
    shaper: { curve: 'diode', drive: 0.5 }, gain: 0.66, sends: { reverb: 0.24 }, defaultNote: 45
  },
  {
    id: 'perc_bucket', name: 'Bucket Hit', tags: ['junk', 'plastic'],
    bodies: [{ wave: 'square', f0: 260, f1: 180, pitchDecay: 0.014, decay: 0.09, level: 0.5 }],
    ring: { partials: [1, 1.9, 3.1], base: 380, wave: 'sine', filter: 'bandpass', cut: 900, q: 1.6, decay: 0.16, level: 0.3 },
    noises: [{ color: 'pink', level: 0.3, bp: 1800, q: 1.4, decay: 0.03 }],
    shaper: { curve: 'crush', drive: 0.4 }, gain: 0.6, defaultNote: 52
  }
];
