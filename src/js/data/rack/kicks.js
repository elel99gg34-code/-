/* Kicks — the floor of every pattern.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const KICKS = [
  {
    id: 'kick_riot', name: 'Riot Kick', tags: ['punchy', 'analog'],
    bodies: [{ wave: 'sine', f0: 148, f1: 47, pitchDecay: 0.035, curve: 2.2, decay: 0.34, level: 1 }],
    click: { level: 0.42, decay: 0.004, hp: 1400 },
    noises: [{ color: 'white', level: 0.16, hp: 2600, decay: 0.011 }],
    shaper: { curve: 'tube', drive: 0.32 }, gain: 0.95, defaultNote: 36
  },
  {
    id: 'kick_concrete', name: 'Concrete', tags: ['hard', 'industrial'],
    bodies: [{ wave: 'triangle', f0: 210, f1: 41, pitchDecay: 0.022, curve: 3, decay: 0.28, level: 1 }],
    click: { level: 0.7, decay: 0.0035, hp: 2400 },
    noises: [{ color: 'white', level: 0.24, hp: 3400, lp: 11000, decay: 0.008 }],
    shaper: { curve: 'hard', drive: 0.55 }, gain: 0.98, defaultNote: 36
  },
  {
    id: 'kick_808', name: '808 Sub', tags: ['sub', 'long'],
    bodies: [{ wave: 'sine', f0: 96, f1: 38, pitchDecay: 0.06, curve: 1.6, decay: 1.05, level: 1 }],
    click: { level: 0.2, decay: 0.003, hp: 1100 },
    shaper: { curve: 'saturate', drive: 0.22 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_909', name: '909 Thump', tags: ['classic', 'dance'],
    bodies: [{ wave: 'sine', f0: 168, f1: 52, pitchDecay: 0.028, curve: 2, decay: 0.42, level: 1 }],
    click: { level: 0.46, decay: 0.0045, hp: 1800, tone: 'tick' },
    noises: [{ color: 'white', level: 0.12, hp: 4000, decay: 0.006 }],
    shaper: { curve: 'soft', drive: 0.3 }, gain: 0.94, defaultNote: 36
  },
  {
    id: 'kick_gabber', name: 'Gabber Core', tags: ['distorted', 'hardcore'],
    bodies: [{ wave: 'sine', f0: 260, f1: 44, pitchDecay: 0.03, curve: 2.6, decay: 0.5, level: 1 }],
    click: { level: 0.55, decay: 0.004, hp: 2000 },
    shaper: { curve: 'destroy', drive: 0.86 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.9 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_paper', name: 'Paper Cut', tags: ['tight', 'lofi'],
    bodies: [{ wave: 'sine', f0: 120, f1: 55, pitchDecay: 0.018, curve: 2, decay: 0.15, level: 0.9 }],
    click: { level: 0.5, decay: 0.005, hp: 900 },
    noises: [{ color: 'pink', level: 0.3, bp: 420, q: 1.1, decay: 0.05 }],
    filter: { type: 'lowpass', cutoff: 3200, q: 0.8 }, gain: 0.86, defaultNote: 36
  },
  {
    id: 'kick_boiler', name: 'Boiler Room', tags: ['deep', 'round'],
    bodies: [{ wave: 'sine', f0: 112, f1: 43, pitchDecay: 0.05, curve: 1.4, decay: 0.62, level: 1 }],
    noises: [{ color: 'brown', level: 0.2, lp: 260, decay: 0.09 }],
    shaper: { curve: 'tube', drive: 0.18 }, gain: 0.93, defaultNote: 36
  },
  {
    id: 'kick_sledge', name: 'Sledgehammer', tags: ['huge', 'slow'],
    bodies: [
      { wave: 'sine', f0: 180, f1: 40, pitchDecay: 0.045, curve: 2.4, decay: 0.7, level: 0.9 },
      { wave: 'triangle', f0: 78, f1: 36, pitchDecay: 0.12, decay: 0.85, level: 0.42 }
    ],
    click: { level: 0.38, decay: 0.006, hp: 700 },
    shaper: { curve: 'tube', drive: 0.45 }, gain: 0.96, defaultNote: 36
  },
  {
    id: 'kick_tin', name: 'Tin Can', tags: ['thin', 'trash'],
    bodies: [{ wave: 'square', f0: 240, f1: 88, pitchDecay: 0.02, curve: 2, decay: 0.1, level: 0.65 }],
    noises: [{ color: 'metal', level: 0.35, bp: 1400, q: 2.4, decay: 0.07 }],
    click: { level: 0.5, decay: 0.003, hp: 2600 },
    shaper: { curve: 'rect', drive: 0.5 }, gain: 0.8, defaultNote: 36
  },
  {
    id: 'kick_pitchdrop', name: 'Pitch Drop', tags: ['fx', 'long'],
    bodies: [{ wave: 'sine', f0: 420, f1: 33, pitchDecay: 0.3, curve: 1.2, decay: 0.8, level: 1 }],
    click: { level: 0.3, decay: 0.004, hp: 1600 },
    shaper: { curve: 'soft', drive: 0.25 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_click', name: 'Click Kick', tags: ['minimal', 'tight'],
    bodies: [{ wave: 'sine', f0: 130, f1: 49, pitchDecay: 0.012, curve: 2.8, decay: 0.12, level: 1 }],
    click: { level: 0.85, decay: 0.0025, hp: 3200, tone: 'tick' },
    gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_dist', name: 'Overdriver', tags: ['distorted', 'mid'],
    bodies: [{ wave: 'triangle', f0: 190, f1: 48, pitchDecay: 0.026, curve: 2.2, decay: 0.38, level: 1 }],
    noises: [{ color: 'white', level: 0.2, hp: 1800, lp: 9000, decay: 0.03 }],
    shaper: { curve: 'fuzz', drive: 0.62 },
    filter: { type: 'lowpass', cutoff: 7200, q: 1.1 }, gain: 0.9, defaultNote: 36
  },

  {
    id: 'kick_house', name: 'House Kick', tags: ['round', 'warm'],
    bodies: [{ wave: 'sine', f0: 132, f1: 50, pitchDecay: 0.04, curve: 1.8, decay: 0.44, level: 1 }],
    click: { level: 0.24, decay: 0.005, hp: 900 },
    noises: [{ color: 'pink', level: 0.1, lp: 420, decay: 0.03 }],
    shaper: { curve: 'tube', drive: 0.22 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_techno', name: 'Berlin Rumble', tags: ['techno', 'long'],
    bodies: [
      { wave: 'sine', f0: 158, f1: 46, pitchDecay: 0.03, curve: 2.2, decay: 0.3, level: 0.95 },
      { wave: 'sine', f0: 52, f1: 42, pitchDecay: 0.3, decay: 1.4, level: 0.5 }
    ],
    click: { level: 0.35, decay: 0.004, hp: 1600 },
    shaper: { curve: 'tube', drive: 0.4 },
    filter: { type: 'lowpass', cutoff: 4800, q: 0.8 },
    gain: 0.94, sends: { reverb: 0.12 }, defaultNote: 36
  },
  {
    id: 'kick_trap', name: 'Trap 808', tags: ['sub', 'glide'],
    bodies: [{ wave: 'sine', f0: 200, f1: 35, pitchDecay: 0.09, curve: 1.4, decay: 1.6, level: 1 }],
    click: { level: 0.3, decay: 0.003, hp: 1400 },
    shaper: { curve: 'saturate', drive: 0.3 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_snap', name: 'Snap Punch', tags: ['tight', 'punchy'],
    bodies: [{ wave: 'sine', f0: 155, f1: 54, pitchDecay: 0.014, curve: 3.2, decay: 0.16, level: 1 }],
    click: { level: 0.8, decay: 0.0035, hp: 2600, tone: 'tick' },
    noises: [{ color: 'white', level: 0.2, hp: 3800, decay: 0.006 }],
    shaper: { curve: 'hard', drive: 0.4 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_double', name: 'Double Hit', tags: ['layered', 'fat'],
    bodies: [
      { wave: 'sine', f0: 170, f1: 49, pitchDecay: 0.03, curve: 2.4, decay: 0.3, level: 0.9 },
      { wave: 'triangle', f0: 96, f1: 44, pitchDecay: 0.08, decay: 0.5, level: 0.5, attack: 0.012 }
    ],
    click: { level: 0.45, decay: 0.004, hp: 1800 },
    shaper: { curve: 'tube', drive: 0.34 }, gain: 0.95, defaultNote: 36
  },
  {
    id: 'kick_reverse', name: 'Reverse Kick', tags: ['fx', 'swell'],
    bodies: [{ wave: 'sine', f0: 44, f1: 150, pitchDecay: 0.24, decay: 0.02, level: 1, attack: 0.24 }],
    noises: [{ color: 'brown', level: 0.35, lp: 900, attack: 0.22, decay: 0.02 }],
    shaper: { curve: 'soft', drive: 0.25 }, gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_cassette', name: 'Cassette Kick', tags: ['lofi', 'dull'],
    bodies: [{ wave: 'sine', f0: 124, f1: 48, pitchDecay: 0.03, curve: 2, decay: 0.26, level: 1 }],
    click: { level: 0.3, decay: 0.005, hp: 700 },
    noises: [{ color: 'vinyl', level: 0.2, lp: 2600, decay: 0.08 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 0.9 },
    shaper: { curve: 'crush', drive: 0.4 }, gain: 0.86, defaultNote: 36
  },
  {
    id: 'kick_acoustic', name: 'Live Kick', tags: ['acoustic', 'beater'],
    bodies: [
      { wave: 'sine', f0: 118, f1: 58, pitchDecay: 0.045, decay: 0.3, level: 0.95 },
      { wave: 'triangle', f0: 240, f1: 140, pitchDecay: 0.02, decay: 0.07, level: 0.3 }
    ],
    noises: [{ color: 'pink', level: 0.3, bp: 1600, q: 1.1, decay: 0.035 }],
    click: { level: 0.4, decay: 0.005, hp: 2200 },
    shaper: { curve: 'tube', drive: 0.18 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_fm', name: 'FM Kick', tags: ['digital', 'metallic'],
    bodies: [{ wave: 'sine', f0: 150, f1: 47, pitchDecay: 0.03, curve: 2, decay: 0.34, level: 1, fm: 1.6, fmRatio: 2.4, fmDecay: 0.03 }],
    click: { level: 0.4, decay: 0.004, hp: 2000 },
    shaper: { curve: 'fold', drive: 0.35 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_zap', name: 'Zapper', tags: ['fx', 'ring'],
    bodies: [{ wave: 'square', f0: 620, f1: 42, pitchDecay: 0.05, curve: 2.6, decay: 0.3, level: 0.9 }],
    ring: { partials: [1, 1.63, 2.41], base: 180, wave: 'sine', filter: 'bandpass', cut: 500, q: 0.8, decay: 0.2, level: 0.3 },
    click: { level: 0.5, decay: 0.003, hp: 2400 },
    shaper: { curve: 'destroy', drive: 0.55 }, gain: 0.86, defaultNote: 36
  },

  {
    id: 'kick_minimal', name: 'Minimal', tags: ['dry', 'short'],
    bodies: [{ wave: 'sine', f0: 118, f1: 52, pitchDecay: 0.016, curve: 2.4, decay: 0.19, level: 1 }],
    click: { level: 0.35, decay: 0.003, hp: 1200 },
    gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_hardstyle', name: 'Hardstyle Kick', tags: ['hard', 'pitched'],
    bodies: [
      { wave: 'sine', f0: 210, f1: 48, pitchDecay: 0.018, curve: 3, decay: 0.12, level: 1 },
      { wave: 'sine', f0: 72, f1: 40, pitchDecay: 0.18, decay: 0.7, level: 0.7, attack: 0.02 }
    ],
    click: { level: 0.6, decay: 0.004, hp: 2400 },
    shaper: { curve: 'destroy', drive: 0.78 },
    filter: { type: 'lowpass', cutoff: 4200, q: 0.9 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_break', name: 'Break Kick', tags: ['breakbeat', 'mid'],
    bodies: [{ wave: 'triangle', f0: 142, f1: 62, pitchDecay: 0.022, curve: 2, decay: 0.2, level: 0.95 }],
    noises: [{ color: 'pink', level: 0.28, bp: 1200, q: 1.2, decay: 0.03 }],
    click: { level: 0.5, decay: 0.004, hp: 2000 },
    shaper: { curve: 'tube', drive: 0.34 },
    filter: { type: 'lowpass', cutoff: 6400, q: 0.9 }, gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_puresub', name: 'Pure Sub', tags: ['sub', 'clean'],
    bodies: [{ wave: 'sine', f0: 68, f1: 38, pitchDecay: 0.07, curve: 1.3, decay: 0.9, level: 1 }],
    gain: 0.95, defaultNote: 36
  },
  {
    id: 'kick_noisekick', name: 'Noise Kick', tags: ['industrial', 'harsh'],
    bodies: [{ wave: 'sine', f0: 140, f1: 45, pitchDecay: 0.025, curve: 2.2, decay: 0.22, level: 0.8 }],
    noises: [
      { color: 'brown', level: 0.6, lp: 700, decay: 0.16 },
      { color: 'white', level: 0.3, hp: 2400, decay: 0.03 }
    ],
    shaper: { curve: 'rect', drive: 0.6 }, gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_wood', name: 'Wood Kick', tags: ['acoustic', 'dry'],
    bodies: [
      { wave: 'sine', f0: 108, f1: 60, pitchDecay: 0.03, decay: 0.2, level: 0.9 },
      { wave: 'triangle', f0: 310, f1: 190, pitchDecay: 0.012, decay: 0.04, level: 0.28 }
    ],
    noises: [{ color: 'pink', level: 0.22, bp: 900, q: 2.2, decay: 0.02 }],
    click: { level: 0.45, decay: 0.003, hp: 1800, tone: 'tick' },
    gain: 0.86, defaultNote: 36
  },
  {
    id: 'kick_reso', name: 'Resonant Kick', tags: ['tonal', 'ring'],
    bodies: [{ wave: 'sine', f0: 150, f1: 52, pitchDecay: 0.026, curve: 2.2, decay: 0.3, level: 0.95 }],
    ring: { partials: [1, 2.02, 3.08], base: 110, wave: 'sine', filter: 'bandpass', cut: 300, q: 1.1, decay: 0.5, level: 0.26 },
    click: { level: 0.4, decay: 0.004, hp: 1600 },
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_stomp', name: 'Stomp', tags: ['huge', 'room'],
    bodies: [{ wave: 'triangle', f0: 164, f1: 42, pitchDecay: 0.05, curve: 2, decay: 0.55, level: 1 }],
    noises: [{ color: 'brown', level: 0.35, lp: 500, decay: 0.2 }],
    click: { level: 0.4, decay: 0.006, hp: 900 },
    shaper: { curve: 'tube', drive: 0.44 },
    gain: 0.94, sends: { reverb: 0.16 }, defaultNote: 36
  },

  {
    id: 'kick_uk', name: 'UK Garage Kick', tags: ['garage', 'tight'],
    bodies: [{ wave: 'sine', f0: 136, f1: 54, pitchDecay: 0.02, curve: 2.4, decay: 0.22, level: 1 }],
    click: { level: 0.52, decay: 0.0035, hp: 2000 },
    noises: [{ color: 'white', level: 0.14, hp: 3200, decay: 0.008 }],
    shaper: { curve: 'tube', drive: 0.28 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_jungle', name: 'Jungle Kick', tags: ['breakbeat', 'old'],
    bodies: [{ wave: 'triangle', f0: 128, f1: 58, pitchDecay: 0.025, decay: 0.24, level: 0.95 }],
    noises: [{ color: 'pink', level: 0.34, bp: 1500, q: 1, decay: 0.05 }],
    click: { level: 0.4, decay: 0.004, hp: 1600 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.9 },
    shaper: { curve: 'crush', drive: 0.35 }, gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_dnb', name: 'DnB Kick', tags: ['fast', 'punchy'],
    bodies: [{ wave: 'sine', f0: 168, f1: 50, pitchDecay: 0.017, curve: 2.8, decay: 0.17, level: 1 }],
    click: { level: 0.66, decay: 0.003, hp: 2800, tone: 'tick' },
    noises: [{ color: 'white', level: 0.2, hp: 4200, decay: 0.007 }],
    shaper: { curve: 'hard', drive: 0.45 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_soft', name: 'Soft Kick', tags: ['ambient', 'gentle'],
    bodies: [{ wave: 'sine', f0: 100, f1: 46, pitchDecay: 0.05, decay: 0.4, level: 0.9 }],
    gain: 0.8, velCurve: 1.3, sends: { reverb: 0.16 }, defaultNote: 36
  },
  {
    id: 'kick_dirty', name: 'Dirty Kick', tags: ['grit', 'mid'],
    bodies: [{ wave: 'triangle', f0: 158, f1: 47, pitchDecay: 0.024, curve: 2.2, decay: 0.3, level: 1 }],
    noises: [{ color: 'crackle', level: 0.28, bp: 1800, q: 1.1, decay: 0.06 }],
    shaper: { curve: 'rect', drive: 0.55 },
    filter: { type: 'lowpass', cutoff: 6800, q: 1 }, gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_ultrashort', name: 'Ultra Short', tags: ['blip', 'tiny'],
    bodies: [{ wave: 'sine', f0: 126, f1: 58, pitchDecay: 0.008, curve: 3, decay: 0.07, level: 1 }],
    click: { level: 0.7, decay: 0.002, hp: 3000, tone: 'tick' },
    gain: 0.86, defaultNote: 36
  },
  {
    id: 'kick_boom', name: 'Boom', tags: ['huge', 'sub'],
    bodies: [
      { wave: 'sine', f0: 150, f1: 38, pitchDecay: 0.06, curve: 1.8, decay: 1.1, level: 1 },
      { wave: 'sine', f0: 60, f1: 34, pitchDecay: 0.3, decay: 1.6, level: 0.5 }
    ],
    click: { level: 0.3, decay: 0.005, hp: 1200 },
    shaper: { curve: 'saturate', drive: 0.3 }, gain: 0.95, sends: { reverb: 0.12 }, defaultNote: 36
  },
  {
    id: 'kick_punchtight', name: 'Punch Tight', tags: ['tight', 'modern'],
    bodies: [{ wave: 'sine', f0: 172, f1: 53, pitchDecay: 0.015, curve: 2.6, decay: 0.2, level: 1 }],
    click: { level: 0.55, decay: 0.003, hp: 2600 },
    noises: [{ color: 'white', level: 0.16, hp: 5000, decay: 0.005 }],
    shaper: { curve: 'hard', drive: 0.5 },
    filter: { type: 'lowpass', cutoff: 8500, q: 0.9 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_analog', name: 'Analog Kick', tags: ['vintage', 'warm'],
    bodies: [{ wave: 'sine', f0: 144, f1: 49, pitchDecay: 0.033, curve: 1.9, decay: 0.46, level: 1 }],
    click: { level: 0.3, decay: 0.005, hp: 1000 },
    noises: [{ color: 'pink', level: 0.12, lp: 600, decay: 0.03 }],
    shaper: { curve: 'tube', drive: 0.36 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_digital', name: 'Digital Kick', tags: ['fm', 'clean'],
    bodies: [{ wave: 'sine', f0: 160, f1: 46, pitchDecay: 0.02, curve: 2.4, decay: 0.28, level: 1, fm: 0.8, fmRatio: 1.41, fmDecay: 0.02 }],
    click: { level: 0.5, decay: 0.0025, hp: 3400, tone: 'tick' },
    gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_clicklayer', name: 'Click Layer', tags: ['attack', 'layered'],
    bodies: [{ wave: 'sine', f0: 118, f1: 48, pitchDecay: 0.022, curve: 2.2, decay: 0.26, level: 0.9 }],
    click: { level: 0.95, decay: 0.004, hp: 4200, tone: 'tick' },
    noises: [{ color: 'blue', level: 0.24, hp: 6000, decay: 0.006 }],
    gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_bigroom', name: 'Big Room Kick', tags: ['edm', 'long'],
    bodies: [
      { wave: 'sine', f0: 190, f1: 46, pitchDecay: 0.022, curve: 2.6, decay: 0.24, level: 1 },
      { wave: 'sine', f0: 58, f1: 44, pitchDecay: 0.25, decay: 0.9, level: 0.55, attack: 0.015 }
    ],
    click: { level: 0.55, decay: 0.004, hp: 2400 },
    shaper: { curve: 'tube', drive: 0.46 }, gain: 0.94, sends: { reverb: 0.1 }, defaultNote: 36
  }
];
