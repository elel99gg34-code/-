/* Snares — the backbeat, from tight cracks to steel-mill clangs.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const SNARES = [
  {
    id: 'snr_riot', name: 'Riot Snare', tags: ['crack', 'punk'],
    bodies: [
      { wave: 'triangle', f0: 235, f1: 172, pitchDecay: 0.03, decay: 0.13, level: 0.55 },
      { wave: 'sine', f0: 340, f1: 258, pitchDecay: 0.02, decay: 0.09, level: 0.3 }
    ],
    noises: [{ color: 'white', level: 0.8, hp: 1500, lp: 9500, decay: 0.19 }],
    shaper: { curve: 'tube', drive: 0.4 }, gain: 0.82, defaultNote: 38
  },
  {
    id: 'snr_909', name: '909 Snap', tags: ['classic', 'dance'],
    bodies: [{ wave: 'triangle', f0: 245, f1: 190, pitchDecay: 0.02, decay: 0.1, level: 0.5 }],
    noises: [{ color: 'white', level: 0.72, hp: 2400, decay: 0.16 }],
    gain: 0.8, defaultNote: 38
  },
  {
    id: 'snr_rimshot', name: 'Rimshot', tags: ['tight', 'sharp'],
    bodies: [{ wave: 'square', f0: 1700, f1: 420, pitchDecay: 0.006, curve: 2, decay: 0.04, level: 0.6 }],
    noises: [{ color: 'white', level: 0.4, bp: 2600, q: 3.2, decay: 0.035 }],
    shaper: { curve: 'hard', drive: 0.45 }, gain: 0.78, defaultNote: 38
  },
  {
    id: 'snr_brick', name: 'Brickwall', tags: ['fat', 'compressed'],
    bodies: [{ wave: 'triangle', f0: 200, f1: 155, pitchDecay: 0.04, decay: 0.22, level: 0.6 }],
    noises: [
      { color: 'white', level: 0.6, hp: 900, lp: 7200, decay: 0.26 },
      { color: 'pink', level: 0.3, bp: 3200, q: 1.1, decay: 0.12 }
    ],
    shaper: { curve: 'hard', drive: 0.6 }, gain: 0.85, defaultNote: 38
  },
  {
    id: 'snr_tape', name: 'Tape Snare', tags: ['lofi', 'warm'],
    bodies: [{ wave: 'sine', f0: 215, f1: 168, pitchDecay: 0.035, decay: 0.15, level: 0.55 }],
    noises: [{ color: 'pink', level: 0.66, hp: 800, lp: 5200, decay: 0.2 }],
    filter: { type: 'lowpass', cutoff: 5600, q: 0.8 },
    shaper: { curve: 'saturate', drive: 0.35 }, gain: 0.8, defaultNote: 38
  },
  {
    id: 'snr_gated', name: 'Gated 80s', tags: ['big', 'gated'],
    bodies: [{ wave: 'triangle', f0: 190, f1: 150, pitchDecay: 0.05, decay: 0.2, level: 0.5 }],
    noises: [{ color: 'white', level: 0.85, hp: 600, lp: 8800, hold: 0.09, holdLevel: 0.9, decay: 0.05 }],
    shaper: { curve: 'soft', drive: 0.3 }, gain: 0.86, sends: { reverb: 0.3 }, defaultNote: 38
  },
  {
    id: 'snr_trash', name: 'Trashcan', tags: ['noisy', 'metal'],
    bodies: [{ wave: 'square', f0: 310, f1: 210, pitchDecay: 0.02, decay: 0.08, level: 0.35 }],
    noises: [
      { color: 'metal', level: 0.7, hp: 1800, decay: 0.3 },
      { color: 'white', level: 0.4, bp: 5200, q: 1.4, decay: 0.12 }
    ],
    shaper: { curve: 'rect', drive: 0.55 }, gain: 0.78, defaultNote: 38
  },
  {
    id: 'snr_clapsnr', name: 'Clap Snare', tags: ['layered', 'wide'],
    bodies: [{ wave: 'triangle', f0: 225, f1: 180, pitchDecay: 0.025, decay: 0.1, level: 0.4 }],
    noises: [
      { color: 'white', level: 0.55, bp: 1400, q: 1.1, decay: 0.03 },
      { color: 'white', level: 0.6, bp: 2200, q: 0.9, attack: 0.012, decay: 0.19 }
    ],
    gain: 0.8, defaultNote: 38
  },
  {
    id: 'snr_ghost', name: 'Ghost Note', tags: ['soft', 'roll'],
    bodies: [{ wave: 'sine', f0: 190, f1: 160, pitchDecay: 0.02, decay: 0.05, level: 0.25 }],
    noises: [{ color: 'pink', level: 0.4, hp: 1600, lp: 6000, decay: 0.06 }],
    gain: 0.55, velCurve: 1.6, defaultNote: 38
  },
  {
    id: 'snr_dnb', name: 'Amen Crack', tags: ['breakbeat', 'bright'],
    bodies: [{ wave: 'triangle', f0: 268, f1: 205, pitchDecay: 0.018, decay: 0.09, level: 0.5 }],
    noises: [
      { color: 'white', level: 0.8, hp: 2800, lp: 13000, decay: 0.14 },
      { color: 'blue', level: 0.3, hp: 6000, decay: 0.05 }
    ],
    shaper: { curve: 'hard', drive: 0.5 }, gain: 0.83, defaultNote: 38
  },
  {
    id: 'snr_industrial', name: 'Steel Mill', tags: ['industrial', 'long'],
    bodies: [{ wave: 'square', f0: 165, f1: 132, pitchDecay: 0.06, decay: 0.3, level: 0.4, fm: 2.2, fmRatio: 2.7, fmDecay: 0.05 }],
    noises: [{ color: 'metal', level: 0.6, bp: 3400, q: 0.8, decay: 0.42 }],
    shaper: { curve: 'diode', drive: 0.6 }, gain: 0.8, sends: { reverb: 0.22 }, defaultNote: 38
  },
  {
    id: 'snr_pitch', name: 'Pitchbend Snare', tags: ['fx', 'sweep'],
    bodies: [{ wave: 'triangle', f0: 520, f1: 150, pitchDecay: 0.09, curve: 1.5, decay: 0.24, level: 0.55 }],
    noises: [{ color: 'white', level: 0.6, bp: 2600, q: 1.2, sweep: 3, sweepTime: 0.1, decay: 0.2 }],
    shaper: { curve: 'fuzz', drive: 0.4 }, gain: 0.8, defaultNote: 38
  },

  {
    id: 'snr_808', name: '808 Snare', tags: ['classic', 'thin'],
    bodies: [
      { wave: 'triangle', f0: 238, f1: 238, pitchDecay: 0.01, decay: 0.12, level: 0.45 },
      { wave: 'triangle', f0: 476, f1: 476, pitchDecay: 0.01, decay: 0.09, level: 0.22 }
    ],
    noises: [{ color: 'white', level: 0.6, hp: 2000, lp: 9000, decay: 0.13 }],
    gain: 0.76, defaultNote: 38
  },
  {
    id: 'snr_acoustic', name: 'Live Snare', tags: ['acoustic', 'room'],
    bodies: [
      { wave: 'triangle', f0: 205, f1: 168, pitchDecay: 0.03, decay: 0.16, level: 0.5 },
      { wave: 'sine', f0: 318, f1: 262, pitchDecay: 0.02, decay: 0.1, level: 0.22 }
    ],
    noises: [
      { color: 'pink', level: 0.6, hp: 1100, lp: 8000, decay: 0.2 },
      { color: 'white', level: 0.3, bp: 4200, q: 0.9, decay: 0.09 }
    ],
    shaper: { curve: 'tube', drive: 0.24 }, gain: 0.8, sends: { reverb: 0.18 }, defaultNote: 38
  },
  {
    id: 'snr_piccolo', name: 'Piccolo', tags: ['high', 'crack'],
    bodies: [{ wave: 'triangle', f0: 340, f1: 280, pitchDecay: 0.015, decay: 0.07, level: 0.5 }],
    noises: [{ color: 'white', level: 0.72, hp: 3400, decay: 0.1 }],
    shaper: { curve: 'hard', drive: 0.4 }, gain: 0.78, defaultNote: 38
  },
  {
    id: 'snr_deep', name: 'Deep Snare', tags: ['low', 'fat'],
    bodies: [{ wave: 'triangle', f0: 162, f1: 130, pitchDecay: 0.05, decay: 0.3, level: 0.65 }],
    noises: [{ color: 'pink', level: 0.55, hp: 600, lp: 5200, decay: 0.28 }],
    shaper: { curve: 'tube', drive: 0.34 }, gain: 0.84, defaultNote: 38
  },
  {
    id: 'snr_white', name: 'White Slap', tags: ['noise', 'pure'],
    noises: [{ color: 'white', level: 0.9, hp: 1400, decay: 0.15 }],
    click: { level: 0.4, decay: 0.003, hp: 4000 },
    gain: 0.74, defaultNote: 38
  },
  {
    id: 'snr_electro', name: 'Electro Snare', tags: ['fm', 'digital'],
    bodies: [{ wave: 'sine', f0: 260, f1: 190, pitchDecay: 0.02, decay: 0.12, level: 0.5, fm: 3.2, fmRatio: 3.7, fmDecay: 0.04 }],
    noises: [{ color: 'blue', level: 0.5, hp: 3000, decay: 0.12 }],
    shaper: { curve: 'fold', drive: 0.4 }, gain: 0.78, defaultNote: 38
  },
  {
    id: 'snr_reverse', name: 'Reverse Snare', tags: ['fx', 'swell'],
    noises: [{ color: 'white', level: 0.8, hp: 1200, attack: 0.3, decay: 0.02 }],
    bodies: [{ wave: 'triangle', f0: 200, f1: 240, pitchDecay: 0.28, decay: 0.02, level: 0.35, attack: 0.28 }],
    gain: 0.8, sends: { reverb: 0.2 }, defaultNote: 38
  },
  {
    id: 'snr_stack', name: 'Stacked', tags: ['layered', 'huge'],
    bodies: [
      { wave: 'triangle', f0: 230, f1: 180, pitchDecay: 0.025, decay: 0.13, level: 0.45 },
      { wave: 'square', f0: 148, f1: 120, pitchDecay: 0.04, decay: 0.2, level: 0.25 }
    ],
    noises: [
      { color: 'white', level: 0.55, hp: 2400, decay: 0.16 },
      { color: 'pink', level: 0.4, bp: 900, q: 1, decay: 0.24 },
      { color: 'violet', level: 0.25, hp: 8000, decay: 0.06 }
    ],
    shaper: { curve: 'hard', drive: 0.52 }, gain: 0.84, sends: { reverb: 0.14 }, defaultNote: 38
  },
  {
    id: 'snr_tight', name: 'Tight Crack', tags: ['short', 'dry'],
    bodies: [{ wave: 'triangle', f0: 255, f1: 210, pitchDecay: 0.012, decay: 0.05, level: 0.5 }],
    noises: [{ color: 'white', level: 0.7, bp: 3600, q: 0.9, decay: 0.06 }],
    shaper: { curve: 'hard', drive: 0.44 }, gain: 0.78, defaultNote: 38
  },
  {
    id: 'snr_hardcore', name: 'Hardcore Snare', tags: ['distorted', 'clipped'],
    bodies: [{ wave: 'square', f0: 280, f1: 196, pitchDecay: 0.02, decay: 0.14, level: 0.55 }],
    noises: [{ color: 'white', level: 0.8, hp: 1800, decay: 0.22 }],
    shaper: { curve: 'destroy', drive: 0.82 },
    filter: { type: 'lowpass', cutoff: 9000, q: 1 },
    gain: 0.76, defaultNote: 38
  }
];
