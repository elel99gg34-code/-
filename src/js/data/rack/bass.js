/* Bass — mono by default, with a sub layer that bypasses the filter.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const BASSES = [
  {
    id: 'bass_riot', name: 'Riot Bass', tags: ['distorted', 'driving'],
    oscs: [{ wave: 'sawtooth', level: 1, unison: 2, spread: 7, width: 0.25 }],
    sub: { wave: 'sine', oct: -1, level: 0.5, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 620, q: 5, env: 2.1, keytrack: 0.4, poles: 4 },
    ampEnv: env(0.004, 0.12, 0.85, 0.09), filtEnv: env(0.002, 0.14, 0.32, 0.08),
    shaper: { curve: 'tube', drive: 0.48 }, gain: 0.7, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_sub', name: 'Deep Sub', tags: ['sub', 'clean'],
    oscs: [{ wave: 'sine', level: 1 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 320, q: 0.7, env: 0.6, keytrack: 0.6 },
    ampEnv: env(0.008, 0.2, 0.95, 0.14), filtEnv: env(0.01, 0.2, 0.6, 0.1),
    shaper: { curve: 'saturate', drive: 0.12 }, gain: 0.85, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_reese', name: 'Reese', tags: ['wide', 'detuned'],
    oscs: [
      { wave: 'sawtooth', level: 0.8, cent: -14, unison: 2, spread: 9 },
      { wave: 'sawtooth', level: 0.8, cent: 15, unison: 2, spread: 9 }
    ],
    sub: { wave: 'sine', oct: -1, level: 0.42, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 760, q: 3.2, env: 1.4, keytrack: 0.35, poles: 4 },
    ampEnv: env(0.01, 0.3, 0.9, 0.16), filtEnv: env(0.02, 0.4, 0.4, 0.12),
    lfo: { wave: 'sine', rate: 0.22, depth: 0.28, target: 'filter', fade: 0.4 },
    shaper: { curve: 'soft', drive: 0.3 }, gain: 0.62, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_acid', name: 'Acid 303', tags: ['acid', 'squelch'],
    oscs: [{ wave: 'sawtooth', level: 1 }],
    filter: { type: 'lowpass', cutoff: 380, q: 14, env: 3.4, keytrack: 0.25, velToEnv: 0.8, poles: 4 },
    ampEnv: env(0.003, 0.28, 0.0, 0.05), filtEnv: env(0.003, 0.24, 0.05, 0.06),
    shaper: { curve: 'diode', drive: 0.42 }, glide: 0.055, gain: 0.66, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_acid_sq', name: 'Acid Square', tags: ['acid', 'hollow'],
    oscs: [{ wave: 'square', level: 1 }],
    filter: { type: 'lowpass', cutoff: 320, q: 16, env: 3.6, keytrack: 0.2, velToEnv: 0.85, poles: 4 },
    ampEnv: env(0.003, 0.3, 0.0, 0.05), filtEnv: env(0.002, 0.2, 0.04, 0.05),
    shaper: { curve: 'diode', drive: 0.5 }, glide: 0.06, gain: 0.64, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_fuzz', name: 'Fuzz Bass', tags: ['fuzz', 'punk'],
    oscs: [{ wave: 'razor', level: 1, unison: 2, spread: 5, width: 0.2 }],
    sub: { wave: 'square', oct: -1, level: 0.3 },
    filter: { type: 'lowpass', cutoff: 1600, q: 2.4, env: 1.1, keytrack: 0.35 },
    ampEnv: env(0.004, 0.16, 0.8, 0.1), filtEnv: env(0.003, 0.18, 0.3, 0.09),
    shaper: { curve: 'fuzz', drive: 0.72, oversample: '4x' }, gain: 0.52, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_pick', name: 'Picked Bass', tags: ['organic', 'attack'],
    oscs: [
      { wave: 'sawtooth', level: 0.8 },
      { wave: 'square', level: 0.35, cent: 6 }
    ],
    noise: { color: 'white', level: 0.2, bp: 2400, q: 1.6, decay: 0.028 },
    filter: { type: 'lowpass', cutoff: 1400, q: 2.2, env: 2.2, keytrack: 0.5, velToEnv: 0.7 },
    ampEnv: env(0.002, 0.25, 0.55, 0.12), filtEnv: env(0.001, 0.12, 0.18, 0.08),
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.62, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_slap', name: 'Slap', tags: ['funk', 'bright'],
    oscs: [{ wave: 'sawtooth', level: 0.9 }, { wave: 'pulse25', level: 0.4, oct: 1 }],
    noise: { color: 'white', level: 0.3, bp: 3800, q: 2.4, decay: 0.018 },
    filter: { type: 'lowpass', cutoff: 900, q: 6, env: 3.2, keytrack: 0.5, velToEnv: 0.9 },
    ampEnv: env(0.001, 0.2, 0.35, 0.09), filtEnv: env(0.001, 0.07, 0.1, 0.06),
    shaper: { curve: 'soft', drive: 0.28 }, gain: 0.6, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_fm', name: 'FM Growl', tags: ['fm', 'metallic'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 2.005, index: 5.5, wave: 'sine', decay: 0.22, sustain: 0.18 },
    filter: { type: 'lowpass', cutoff: 1800, q: 1.6, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.004, 0.22, 0.8, 0.12), filtEnv: env(0.004, 0.2, 0.3, 0.1),
    shaper: { curve: 'soft', drive: 0.25 }, gain: 0.66, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_growl', name: 'Neuro Growl', tags: ['neuro', 'modulated'],
    oscs: [{ wave: 'grind', level: 0.9, unison: 2, spread: 11 }],
    sub: { wave: 'sine', oct: -1, level: 0.4, bypassFilter: true },
    fm: { ratio: 1.5, index: 2.2, decay: 0.3, sustain: 0.4 },
    filter: { type: 'bandpass', cutoff: 520, q: 7, env: 2.6, keytrack: 0.2, poles: 4 },
    ampEnv: env(0.006, 0.3, 0.85, 0.1), filtEnv: env(0.01, 0.22, 0.4, 0.1),
    lfo: { wave: 'triangle', rate: 5.5, depth: 0.5, target: 'filter', fade: 0.06 },
    shaper: { curve: 'fold', drive: 0.55 }, gain: 0.58, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_wobble', name: 'Wobbler', tags: ['dubstep', 'lfo'],
    oscs: [{ wave: 'sawtooth', level: 0.9, unison: 3, spread: 12 }],
    sub: { wave: 'sine', oct: -1, level: 0.45, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 340, q: 9, env: 1.2, keytrack: 0.15, poles: 4 },
    ampEnv: env(0.008, 0.3, 0.95, 0.12), filtEnv: env(0.01, 0.3, 0.6, 0.1),
    lfo: { wave: 'sine', rate: 3.5, depth: 1.1, target: 'filter', fade: 0.02 },
    shaper: { curve: 'saturate', drive: 0.4 }, gain: 0.6, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_saw8', name: 'Octave Saw', tags: ['wide', 'bright'],
    oscs: [
      { wave: 'sawtooth', level: 0.8 },
      { wave: 'sawtooth', level: 0.45, oct: 1, cent: 6, unison: 2, spread: 10 }
    ],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 1500, q: 2, env: 1.4, keytrack: 0.45 },
    ampEnv: env(0.004, 0.2, 0.85, 0.1), filtEnv: env(0.004, 0.2, 0.35, 0.09),
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.6, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_synthwave', name: 'Synthwave Bass', tags: ['retro', 'pulse'],
    oscs: [{ wave: 'pulse25', level: 0.9 }, { wave: 'sawtooth', level: 0.5, cent: -8 }],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 1100, q: 3.4, env: 1.7, keytrack: 0.4 },
    ampEnv: env(0.006, 0.25, 0.7, 0.14), filtEnv: env(0.005, 0.22, 0.25, 0.1),
    shaper: { curve: 'soft', drive: 0.25 }, gain: 0.6, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_rumble', name: 'Rumble', tags: ['sub', 'noise'],
    oscs: [{ wave: 'sine', level: 0.9 }],
    sub: { wave: 'sine', oct: -1, level: 0.5, bypassFilter: true },
    noise: { color: 'brown', level: 0.35, lp: 180 },
    filter: { type: 'lowpass', cutoff: 200, q: 1.4, env: 0.4, keytrack: 0.5 },
    ampEnv: env(0.05, 0.4, 1, 0.5), filtEnv: env(0.1, 0.3, 0.7, 0.3),
    gain: 0.82, poly: 1, defaultNote: 28
  },
  {
    id: 'bass_gritclick', name: 'Grit Click', tags: ['digital', 'short'],
    oscs: [{ wave: 'wire', level: 1 }],
    noise: { color: 'blue', level: 0.25, hp: 2200, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 800, q: 8, env: 2.8, keytrack: 0.3, velToEnv: 0.9 },
    ampEnv: env(0.001, 0.12, 0.2, 0.05), filtEnv: env(0.001, 0.08, 0.06, 0.04),
    shaper: { curve: 'crush', drive: 0.35 }, gain: 0.6, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_organ', name: 'Organ Bass', tags: ['warm', 'round'],
    oscs: [{ wave: 'organ', level: 1 }, { wave: 'sine', level: 0.4, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 1300, q: 1, env: 0.5, keytrack: 0.5 },
    ampEnv: env(0.012, 0.2, 0.92, 0.1), filtEnv: env(0.02, 0.2, 0.6, 0.1),
    shaper: { curve: 'tube', drive: 0.22 }, gain: 0.66, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_dirtysub', name: 'Dirty Sub', tags: ['sub', 'distorted'],
    oscs: [{ wave: 'sine', level: 1 }],
    sub: { wave: 'sine', oct: -1, level: 0.4, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 420, q: 2.6, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.006, 0.24, 0.9, 0.12), filtEnv: env(0.004, 0.2, 0.4, 0.1),
    shaper: { curve: 'destroy', drive: 0.5 }, gain: 0.62, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_talk', name: 'Talkbox Bass', tags: ['formant', 'vocal'],
    oscs: [{ wave: 'vox', level: 1, unison: 2, spread: 6 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    filter: { type: 'bandpass', cutoff: 700, q: 5, env: 2.2, keytrack: 0.3, poles: 4 },
    ampEnv: env(0.008, 0.25, 0.8, 0.12), filtEnv: env(0.02, 0.3, 0.35, 0.12),
    lfo: { wave: 'triangle', rate: 2.1, depth: 0.45, target: 'filter', fade: 0.12 },
    shaper: { curve: 'tube', drive: 0.35 }, gain: 0.6, poly: 1, defaultNote: 33
  },

  {
    id: 'bass_808glide', name: '808 Glide', tags: ['sub', 'slide'],
    oscs: [{ wave: 'sine', level: 1 }],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 380, q: 1.2, env: 0.8, keytrack: 0.55 },
    ampEnv: env(0.006, 1.2, 0.55, 0.4), filtEnv: env(0.01, 0.6, 0.4, 0.2),
    shaper: { curve: 'saturate', drive: 0.28 },
    glide: 0.12, gain: 0.82, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_moog', name: 'Moog Ladder', tags: ['analog', 'round'],
    oscs: [
      { wave: 'sawtooth', level: 0.8 },
      { wave: 'sawtooth', level: 0.5, cent: -9 },
      { wave: 'square', level: 0.35, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 520, q: 7, env: 2.2, keytrack: 0.45, poles: 4 },
    ampEnv: env(0.006, 0.3, 0.8, 0.12), filtEnv: env(0.004, 0.24, 0.3, 0.1),
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.66, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_hardstyle', name: 'Hardstyle Bass', tags: ['hard', 'pitched'],
    oscs: [{ wave: 'sawtooth', level: 0.9, unison: 2, spread: 6 }],
    filter: { type: 'lowpass', cutoff: 900, q: 3.6, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.002, 0.24, 0.0, 0.05), filtEnv: env(0.002, 0.18, 0.06, 0.05),
    pitchEnv: { amt: -7, d: 0.06 },
    shaper: { curve: 'hard', drive: 0.7 }, gain: 0.6, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_donk', name: 'Donk', tags: ['bouncy', 'short'],
    oscs: [{ wave: 'square', level: 0.9 }, { wave: 'sine', level: 0.4, oct: 1 }],
    filter: { type: 'bandpass', cutoff: 620, q: 1.9, env: 2.8, keytrack: 0.5, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.14, 0.0, 0.05), filtEnv: env(0.001, 0.09, 0.05, 0.04),
    shaper: { curve: 'diode', drive: 0.4 }, gain: 2.6, poly: 1, defaultNote: 40
  },
  {
    id: 'bass_pluckbass', name: 'Pluck Bass', tags: ['tight', 'melodic'],
    oscs: [{ wave: 'sawtooth', level: 0.85 }, { wave: 'glass', level: 0.3, oct: 1 }],
    noise: { color: 'white', level: 0.16, bp: 2600, q: 2.2, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 1100, q: 4.4, env: 2.6, keytrack: 0.5, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.4, 0.06, 0.12), filtEnv: env(0.001, 0.2, 0.06, 0.1),
    gain: 0.62, poly: 1, sends: { reverb: 0.08 }, defaultNote: 36
  },
  {
    id: 'bass_upright', name: 'Upright', tags: ['acoustic', 'woody'],
    oscs: [{ wave: 'hollow', level: 0.85 }, { wave: 'sine', level: 0.4 }],
    noise: { color: 'pink', level: 0.24, bp: 1400, q: 1.6, decay: 0.03 },
    filter: { type: 'lowpass', cutoff: 700, q: 1.8, env: 2, keytrack: 0.5, velToEnv: 0.8 },
    ampEnv: env(0.003, 0.7, 0.2, 0.2), filtEnv: env(0.002, 0.3, 0.12, 0.14),
    shaper: { curve: 'tube', drive: 0.2 }, gain: 0.66, poly: 1, sends: { reverb: 0.12 }, defaultNote: 33
  },
  {
    id: 'bass_saw3', name: 'Triple Saw', tags: ['wide', 'thick'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, cent: -11, unison: 2, spread: 6 },
      { wave: 'sawtooth', level: 0.7, cent: 0 },
      { wave: 'sawtooth', level: 0.7, cent: 12, unison: 2, spread: 6 }
    ],
    sub: { wave: 'sine', oct: -1, level: 0.4, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 900, q: 2.4, env: 1.6, keytrack: 0.4, poles: 4 },
    ampEnv: env(0.008, 0.3, 0.88, 0.14), filtEnv: env(0.01, 0.3, 0.35, 0.12),
    shaper: { curve: 'tube', drive: 0.32 }, gain: 0.56, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_metal', name: 'Metal Bass', tags: ['distorted', 'picked'],
    oscs: [{ wave: 'grind', level: 0.9 }, { wave: 'square', level: 0.4, cent: 7 }],
    noise: { color: 'white', level: 0.26, bp: 3200, q: 1.8, decay: 0.02 },
    filter: { type: 'lowpass', cutoff: 1900, q: 2.6, env: 1.8, keytrack: 0.45 },
    ampEnv: env(0.002, 0.3, 0.6, 0.12), filtEnv: env(0.002, 0.16, 0.2, 0.1),
    shaper: { curve: 'fuzz', drive: 0.68, oversample: '4x' }, gain: 0.5, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_square_sub', name: 'Square Sub', tags: ['hollow', 'deep'],
    oscs: [{ wave: 'square', level: 0.8 }],
    sub: { wave: 'sine', oct: -1, level: 0.55, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 300, q: 1.6, env: 0.9, keytrack: 0.5 },
    ampEnv: env(0.008, 0.3, 0.92, 0.16), filtEnv: env(0.01, 0.3, 0.5, 0.12),
    gain: 0.74, poly: 1, defaultNote: 28
  },
  {
    id: 'bass_formant', name: 'Formant Bass', tags: ['vowel', 'moving'],
    oscs: [{ wave: 'sawtooth', level: 0.9, unison: 2, spread: 8 }],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    filter: { type: 'bandpass', cutoff: 460, q: 8, env: 2.4, keytrack: 0.3, poles: 4 },
    ampEnv: env(0.006, 0.3, 0.85, 0.14), filtEnv: env(0.02, 0.35, 0.35, 0.14),
    lfo: { wave: 'triangle', rate: 1.3, depth: 0.8, target: 'filter', fade: 0.15 },
    shaper: { curve: 'tube', drive: 0.34 }, gain: 0.58, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_drone', name: 'Drone Bass', tags: ['sustain', 'dark'],
    oscs: [{ wave: 'buzz', level: 0.6, unison: 2, spread: 4 }, { wave: 'sine', level: 0.5 }],
    sub: { wave: 'sine', oct: -1, level: 0.45, bypassFilter: true },
    noise: { color: 'brown', level: 0.2, lp: 300 },
    filter: { type: 'lowpass', cutoff: 420, q: 3.4, env: 0.8, keytrack: 0.4 },
    ampEnv: env(0.4, 0.8, 0.95, 0.9), filtEnv: env(0.8, 1, 0.6, 0.6),
    lfo: { wave: 'sine', rate: 0.13, depth: 0.4, target: 'filter', fade: 1.2 },
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.58, poly: 1, sends: { reverb: 0.18 }, defaultNote: 28
  },
  {
    id: 'bass_click808', name: 'Click 808', tags: ['sub', 'attack'],
    oscs: [{ wave: 'sine', level: 1 }],
    noise: { color: 'white', level: 0.3, hp: 3000, decay: 0.007, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 340, q: 1, env: 0.7, keytrack: 0.5 },
    ampEnv: env(0.003, 0.9, 0.5, 0.3), filtEnv: env(0.004, 0.4, 0.4, 0.16),
    shaper: { curve: 'saturate', drive: 0.24 }, gain: 0.78, poly: 1, defaultNote: 33
  }
];
