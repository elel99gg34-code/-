/* Pads — slow envelopes, wide unison, long tails.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const PADS = [
  {
    id: 'pad_warm', name: 'Warm Wash', tags: ['soft', 'wide'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 4, spread: 18, width: 0.9 },
      { wave: 'triangle', level: 0.4, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 1500, q: 1.2, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.6, 1.2, 0.9, 1.1), filtEnv: env(1.2, 1.5, 0.6, 0.9),
    lfo: { wave: 'sine', rate: 0.18, depth: 0.3, target: 'filter', fade: 1.5 },
    gain: 0.3, sends: { reverb: 0.4 }, defaultNote: 55,
    fx: [{ type: 'chorus', rate: 0.22, depth: 0.006, mix: 0.45 }]
  },
  {
    id: 'pad_glass', name: 'Glass House', tags: ['bright', 'shimmer'],
    oscs: [
      { wave: 'glass', level: 0.8, unison: 3, spread: 12, width: 0.8 },
      { wave: 'sine', level: 0.3, oct: 1 }
    ],
    filter: { type: 'lowpass', cutoff: 4600, q: 1, env: 1, keytrack: 0.6 },
    ampEnv: env(0.5, 1.5, 0.85, 1.4), filtEnv: env(0.9, 1.4, 0.7, 1),
    gain: 0.28, sends: { reverb: 0.5, delay: 0.16 }, defaultNote: 67
  },
  {
    id: 'pad_dark', name: 'Blackout', tags: ['dark', 'ominous'],
    oscs: [
      { wave: 'hollow', level: 0.8, unison: 3, spread: 14 },
      { wave: 'sawtooth', level: 0.4, oct: -1, cent: 8 }
    ],
    noise: { color: 'brown', level: 0.15, lp: 900 },
    filter: { type: 'lowpass', cutoff: 620, q: 2.2, env: 1.2, keytrack: 0.35 },
    ampEnv: env(1.2, 2, 0.9, 1.8), filtEnv: env(2, 2, 0.5, 1.4),
    lfo: { wave: 'sine', rate: 0.09, depth: 0.4, target: 'filter', fade: 2 },
    gain: 0.32, sends: { reverb: 0.5 }, defaultNote: 43
  },
  {
    id: 'pad_strings', name: 'Riot Strings', tags: ['strings', 'lush'],
    oscs: [
      { wave: 'sawtooth', level: 0.75, unison: 5, spread: 16, width: 0.9 },
      { wave: 'reed', level: 0.3, cent: -9 }
    ],
    filter: { type: 'lowpass', cutoff: 2400, q: 1.1, env: 1.5, keytrack: 0.5 },
    ampEnv: env(0.28, 0.9, 0.9, 0.7), filtEnv: env(0.4, 1, 0.55, 0.6),
    lfo: { wave: 'sine', rate: 4.8, depth: 0.05, target: 'pitch', delay: 0.5, fade: 0.8 },
    gain: 0.3, sends: { reverb: 0.4 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.5, depth: 0.004, mix: 0.4 }]
  },
  {
    id: 'pad_choir', name: 'Riot Choir', tags: ['vocal', 'ethereal'],
    oscs: [{ wave: 'vox', level: 0.85, unison: 4, spread: 20, width: 0.9 }],
    filter: { type: 'bandpass', cutoff: 900, q: 2, env: 1.4, keytrack: 0.6 },
    ampEnv: env(0.5, 1.2, 0.9, 1.2), filtEnv: env(0.8, 1.2, 0.6, 0.9),
    lfo: { wave: 'sine', rate: 4.4, depth: 0.06, target: 'pitch', delay: 0.6, fade: 1 },
    gain: 0.3, sends: { reverb: 0.55 }, defaultNote: 64
  },
  {
    id: 'pad_drone', name: 'Industrial Drone', tags: ['drone', 'noise'],
    oscs: [{ wave: 'buzz', level: 0.6, unison: 3, spread: 7 }, { wave: 'sine', level: 0.4, oct: -1 }],
    noise: { color: 'metal', level: 0.22, bp: 1400, q: 0.7 },
    filter: { type: 'lowpass', cutoff: 1100, q: 3, env: 0.9, keytrack: 0.3 },
    ampEnv: env(1.5, 2, 0.95, 2.2), filtEnv: env(2.5, 2, 0.6, 1.6),
    lfo: { wave: 'triangle', rate: 0.07, depth: 0.5, target: 'filter', fade: 2.5 },
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.3, sends: { reverb: 0.45 }, defaultNote: 36
  },
  {
    id: 'pad_sweep', name: 'Sweep Pad', tags: ['filter', 'movement'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 4, spread: 20, width: 0.9 }],
    filter: { type: 'lowpass', cutoff: 400, q: 6, env: 3.4, keytrack: 0.3 },
    ampEnv: env(0.4, 1.4, 0.88, 1.2), filtEnv: env(2.4, 2.4, 0.3, 1.5),
    gain: 0.3, sends: { reverb: 0.4, delay: 0.16 }, defaultNote: 48
  },
  {
    id: 'pad_synthwave', name: 'Neon Pad', tags: ['retro', '80s'],
    oscs: [
      { wave: 'pulse25', level: 0.7, unison: 3, spread: 14, width: 0.8 },
      { wave: 'sawtooth', level: 0.45, cent: 11, unison: 2, spread: 8 }
    ],
    filter: { type: 'lowpass', cutoff: 2200, q: 1.8, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.24, 0.9, 0.85, 0.8), filtEnv: env(0.5, 1, 0.5, 0.6),
    gain: 0.28, sends: { reverb: 0.4, delay: 0.2 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.35, depth: 0.005, mix: 0.5, feedback: 0.2 }]
  },
  {
    id: 'pad_bell', name: 'Bell Field', tags: ['bell', 'sparse'],
    oscs: [{ wave: 'bell', level: 0.9, unison: 2, spread: 8 }],
    fm: { ratio: 2.41, index: 1.4, decay: 1.2, sustain: 0.2 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.8, env: 0.7, keytrack: 0.7 },
    ampEnv: env(0.02, 2.4, 0.35, 2), filtEnv: env(0.05, 1.5, 0.3, 1.2),
    gain: 0.3, sends: { reverb: 0.55, delay: 0.24 }, defaultNote: 72
  },
  {
    id: 'pad_tape', name: 'Tape Wash', tags: ['lofi', 'warm'],
    oscs: [{ wave: 'hollow', level: 0.8, unison: 3, spread: 22, width: 0.85 }],
    noise: { color: 'vinyl', level: 0.12, lp: 6000 },
    filter: { type: 'lowpass', cutoff: 1800, q: 1, env: 1, keytrack: 0.4 },
    ampEnv: env(0.7, 1.4, 0.88, 1.3), filtEnv: env(1, 1.4, 0.55, 1),
    lfo: { wave: 'sine', rate: 0.42, depth: 0.14, target: 'pitch', fade: 1.2 },
    shaper: { curve: 'saturate', drive: 0.2 }, gain: 0.3, sends: { reverb: 0.42 }, defaultNote: 55
  },

  {
    id: 'pad_air', name: 'Air', tags: ['thin', 'breath'],
    oscs: [{ wave: 'sine', level: 0.35, unison: 3, spread: 16, width: 0.9 }],
    noise: { color: 'white', level: 0.35, bp: 4200, q: 0.8 },
    filter: { type: 'highpass', cutoff: 900, q: 1.2, env: 1.2, keytrack: 0.5 },
    ampEnv: env(1, 1.4, 0.9, 1.4), filtEnv: env(1.6, 1.4, 0.6, 1),
    lfo: { wave: 'sine', rate: 0.14, depth: 0.35, target: 'filter', fade: 2 },
    gain: 0.36, sends: { reverb: 0.55 }, defaultNote: 72
  },
  {
    id: 'pad_evolve', name: 'Evolver', tags: ['movement', 'long'],
    oscs: [
      { wave: 'razor', level: 0.6, unison: 3, spread: 15, width: 0.85 },
      { wave: 'hollow', level: 0.45, cent: 9, unison: 2, spread: 11 }
    ],
    fm: { ratio: 1.005, index: 0.4, decay: 3, sustain: 0.8 },
    filter: { type: 'bandpass', cutoff: 700, q: 3.4, env: 2.6, keytrack: 0.4 },
    ampEnv: env(1.4, 2, 0.9, 1.8), filtEnv: env(2.6, 2.4, 0.4, 1.4),
    lfo: { wave: 'triangle', rate: 0.11, depth: 0.6, target: 'filter', fade: 2.5 },
    gain: 0.3, sends: { reverb: 0.5, delay: 0.2 }, defaultNote: 52
  },
  {
    id: 'pad_sub', name: 'Sub Pad', tags: ['low', 'foundation'],
    oscs: [{ wave: 'sine', level: 0.8 }, { wave: 'triangle', level: 0.4, cent: 6 }],
    sub: { wave: 'sine', oct: -1, level: 0.4, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 500, q: 1.4, env: 0.8, keytrack: 0.5 },
    ampEnv: env(0.8, 1.4, 0.92, 1.4), filtEnv: env(1.2, 1.4, 0.55, 1),
    gain: 0.4, sends: { reverb: 0.3 }, defaultNote: 40
  },
  {
    id: 'pad_grit', name: 'Grit Pad', tags: ['dirty', 'noisy'],
    oscs: [{ wave: 'grind', level: 0.6, unison: 3, spread: 19, width: 0.85 }],
    noise: { color: 'crackle', level: 0.18, bp: 2200, q: 0.9 },
    filter: { type: 'lowpass', cutoff: 1400, q: 2.4, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.8, 1.4, 0.88, 1.2), filtEnv: env(1.4, 1.4, 0.5, 0.9),
    shaper: { curve: 'saturate', drive: 0.35 },
    gain: 0.3, sends: { reverb: 0.45 }, defaultNote: 48,
    fx: [{ type: 'crush', bits: 9, reduction: 2, mix: 0.4 }]
  },
  {
    id: 'pad_ice', name: 'Ice Field', tags: ['cold', 'bright'],
    oscs: [
      { wave: 'glass', level: 0.7, unison: 4, spread: 20, width: 0.95 },
      { wave: 'bell', level: 0.3, oct: 1 }
    ],
    filter: { type: 'highpass', cutoff: 500, q: 1.4, env: 1, keytrack: 0.6 },
    ampEnv: env(0.9, 1.8, 0.85, 1.8), filtEnv: env(1.4, 1.6, 0.5, 1.2),
    lfo: { wave: 'sine', rate: 0.2, depth: 0.3, target: 'filter', fade: 2 },
    gain: 0.3, sends: { reverb: 0.58, delay: 0.24 }, defaultNote: 72
  },
  {
    id: 'pad_organpad', name: 'Organ Pad', tags: ['organ', 'steady'],
    oscs: [{ wave: 'organ', level: 0.8, unison: 2, spread: 7 }, { wave: 'sine', level: 0.35, oct: 1, cent: 4 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 1, env: 0.8, keytrack: 0.5 },
    ampEnv: env(0.3, 0.6, 0.95, 0.5), filtEnv: env(0.5, 0.8, 0.7, 0.4),
    gain: 0.34, sends: { reverb: 0.4 }, defaultNote: 55,
    fx: [{ type: 'autopan', mode: 'trem', rate: 5.8, depth: 0.28 }]
  },
  {
    id: 'pad_phase', name: 'Phase Pad', tags: ['sweeping', 'wide'],
    oscs: [{ wave: 'sawtooth', level: 0.75, unison: 5, spread: 22, width: 0.95 }],
    filter: { type: 'lowpass', cutoff: 2200, q: 1.4, env: 1.4, keytrack: 0.45 },
    ampEnv: env(0.7, 1.2, 0.9, 1.1), filtEnv: env(1.2, 1.2, 0.55, 0.8),
    gain: 0.3, sends: { reverb: 0.42 }, defaultNote: 55,
    fx: [{ type: 'phaser', rate: 0.14, depth: 1500, feedback: 0.55, mix: 0.6 }]
  },
  {
    id: 'pad_noisebed', name: 'Noise Bed', tags: ['texture', 'atmos'],
    oscs: [{ wave: 'sine', level: 0.1 }],
    noise: { color: 'brown', level: 0.7, lp: 2200 },
    filter: { type: 'bandpass', cutoff: 600, q: 1.6, env: 1.6, keytrack: 0.3 },
    ampEnv: env(1.6, 2, 0.92, 2.2), filtEnv: env(2.4, 2, 0.5, 1.6),
    lfo: { wave: 'sine', rate: 0.08, depth: 0.5, target: 'filter', fade: 3 },
    gain: 0.34, sends: { reverb: 0.5 }, defaultNote: 43
  },

  {
    id: 'pad_crystal', name: 'Crystal', tags: ['bright', 'fm'],
    oscs: [{ wave: 'glass', level: 0.7, unison: 3, spread: 14, width: 0.85 }],
    fm: { ratio: 3.02, index: 0.8, decay: 2.4, sustain: 0.3 },
    filter: { type: 'highpass', cutoff: 600, q: 1.1, env: 0.9, keytrack: 0.6 },
    ampEnv: env(0.7, 1.6, 0.85, 1.6), filtEnv: env(1.2, 1.4, 0.5, 1),
    gain: 0.32, sends: { reverb: 0.55, delay: 0.24 }, defaultNote: 72
  },
  {
    id: 'pad_reversewash', name: 'Reverse Wash', tags: ['swell', 'fx'],
    oscs: [{ wave: 'razor', level: 0.6, unison: 4, spread: 24, width: 0.95 }],
    noise: { color: 'white', level: 0.2, bp: 3000, q: 0.8 },
    filter: { type: 'bandpass', cutoff: 900, q: 1.8, env: 3, keytrack: 0.4 },
    ampEnv: env(2.4, 0.5, 0.9, 0.3), filtEnv: env(3, 0.5, 0.9, 0.25),
    gain: 0.34, sends: { reverb: 0.55 }, defaultNote: 60
  },
  {
    id: 'pad_lowdrone', name: 'Low Drone', tags: ['sub', 'dark'],
    oscs: [{ wave: 'buzz', level: 0.5 }, { wave: 'sine', level: 0.55, oct: -1 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    noise: { color: 'brown', level: 0.18, lp: 400 },
    filter: { type: 'lowpass', cutoff: 380, q: 3, env: 0.9, keytrack: 0.35 },
    ampEnv: env(1.8, 2.2, 0.95, 2.4), filtEnv: env(2.6, 2.2, 0.55, 1.8),
    lfo: { wave: 'sine', rate: 0.06, depth: 0.45, target: 'filter', fade: 3 },
    shaper: { curve: 'tube', drive: 0.3 },
    gain: 0.44, sends: { reverb: 0.4 }, defaultNote: 31
  },
  {
    id: 'pad_breath', name: 'Breath Pad', tags: ['soft', 'airy'],
    oscs: [{ wave: 'vox', level: 0.55, unison: 3, spread: 18, width: 0.9 }, { wave: 'sine', level: 0.25 }],
    noise: { color: 'white', level: 0.3, bp: 3000, q: 1, keytrack: true },
    filter: { type: 'lowpass', cutoff: 2200, q: 1.2, env: 1.2, keytrack: 0.6 },
    ampEnv: env(1, 1.4, 0.9, 1.4), filtEnv: env(1.6, 1.4, 0.55, 1),
    lfo: { wave: 'sine', rate: 0.22, depth: 0.28, target: 'filter', fade: 2 },
    gain: 0.36, sends: { reverb: 0.5 }, defaultNote: 64
  },
  {
    id: 'pad_fm', name: 'FM Pad', tags: ['digital', 'evolving'],
    oscs: [{ wave: 'sine', level: 0.9, unison: 2, spread: 8 }],
    fm: { ratio: 1.414, index: 2.2, decay: 2.6, sustain: 0.45 },
    filter: { type: 'lowpass', cutoff: 2600, q: 1.6, env: 1.4, keytrack: 0.55 },
    ampEnv: env(0.9, 1.6, 0.88, 1.5), filtEnv: env(1.4, 1.6, 0.5, 1.1),
    lfo: { wave: 'triangle', rate: 0.13, depth: 0.5, target: 'filter', fade: 2.2 },
    gain: 0.4, sends: { reverb: 0.48, delay: 0.2 }, defaultNote: 60
  },
  {
    id: 'pad_saturated', name: 'Saturated Pad', tags: ['thick', 'driven'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 5, spread: 20, width: 0.9 },
      { wave: 'razor', level: 0.35, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 1700, q: 2, env: 1.4, keytrack: 0.45 },
    ampEnv: env(0.5, 1.2, 0.9, 1.1), filtEnv: env(0.9, 1.2, 0.5, 0.8),
    shaper: { curve: 'tube', drive: 0.5 },
    gain: 0.28, sends: { reverb: 0.42 }, defaultNote: 48
  },

  {
    id: 'pad_choirpad', name: 'Choir Pad', tags: ['vocal', 'warm'],
    oscs: [
      { wave: 'vox', level: 0.65, unison: 4, spread: 18, width: 0.9 },
      { wave: 'hollow', level: 0.3, oct: -1, cent: 6 }
    ],
    filter: { type: 'bandpass', cutoff: 950, q: 1.4, env: 1.2, keytrack: 0.6 },
    ampEnv: env(0.8, 1.4, 0.9, 1.4), filtEnv: env(1.2, 1.4, 0.55, 1),
    lfo: { wave: 'sine', rate: 4.2, depth: 0.05, target: 'pitch', delay: 0.7, fade: 0.9 },
    gain: 0.44, sends: { reverb: 0.52 }, defaultNote: 55
  },
  {
    id: 'pad_void', name: 'Void', tags: ['dark', 'empty'],
    oscs: [{ wave: 'hollow', level: 0.5, unison: 3, spread: 22, width: 0.9 }],
    noise: { color: 'brown', level: 0.22, lp: 500 },
    filter: { type: 'lowpass', cutoff: 420, q: 4, env: 1.2, keytrack: 0.3 },
    ampEnv: env(2, 2.4, 0.92, 2.6), filtEnv: env(2.8, 2.4, 0.45, 1.8),
    lfo: { wave: 'sine', rate: 0.05, depth: 0.5, target: 'filter', fade: 3.5 },
    gain: 0.44, sends: { reverb: 0.55 }, defaultNote: 36
  },
  {
    id: 'pad_sunrise', name: 'Sunrise', tags: ['warm', 'rising'],
    oscs: [
      { wave: 'sawtooth', level: 0.65, unison: 4, spread: 16, width: 0.9 },
      { wave: 'glass', level: 0.3, oct: 1, cent: 5 }
    ],
    filter: { type: 'lowpass', cutoff: 800, q: 2, env: 3, keytrack: 0.5 },
    ampEnv: env(1.4, 1.6, 0.9, 1.6), filtEnv: env(2.2, 1.8, 0.6, 1.2),
    gain: 0.32, sends: { reverb: 0.5, delay: 0.2 }, defaultNote: 60
  },
  {
    id: 'pad_metal', name: 'Metal Pad', tags: ['inharmonic', 'cold'],
    oscs: [{ wave: 'metal', level: 0.45, unison: 2, spread: 12 }, { wave: 'bell', level: 0.35 }],
    fm: { ratio: 2.41, index: 1.2, decay: 2.4, sustain: 0.3 },
    filter: { type: 'bandpass', cutoff: 1600, q: 1.6, env: 1.4, keytrack: 0.6 },
    ampEnv: env(0.8, 1.6, 0.85, 1.6), filtEnv: env(1.2, 1.6, 0.5, 1.1),
    gain: 0.5, sends: { reverb: 0.52 }, defaultNote: 60
  },
  {
    id: 'pad_rain', name: 'Rain Pad', tags: ['texture', 'wet'],
    oscs: [{ wave: 'glass', level: 0.45, unison: 3, spread: 20, width: 0.9 }],
    noise: { color: 'white', level: 0.4, bp: 4200, q: 0.9 },
    filter: { type: 'bandpass', cutoff: 2600, q: 1.4, env: 1.4, keytrack: 0.55 },
    ampEnv: env(1, 1.6, 0.88, 1.6), filtEnv: env(1.6, 1.6, 0.5, 1.1),
    lfo: { wave: 'sine', rate: 0.15, depth: 0.4, target: 'filter', fade: 2.2 },
    gain: 0.44, sends: { reverb: 0.56, delay: 0.22 }, defaultNote: 67
  },
  {
    id: 'pad_octave', name: 'Octave Pad', tags: ['stacked', 'full'],
    oscs: [
      { wave: 'sawtooth', level: 0.6, unison: 3, spread: 14, width: 0.85 },
      { wave: 'sawtooth', level: 0.4, oct: 1, cent: 7, unison: 2, spread: 10 },
      { wave: 'sine', level: 0.4, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 2000, q: 1.4, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.6, 1.2, 0.9, 1.2), filtEnv: env(1, 1.2, 0.5, 0.9),
    gain: 0.3, sends: { reverb: 0.45 }, defaultNote: 48
  },
  {
    id: 'pad_soft', name: 'Soft Pad', tags: ['gentle', 'round'],
    oscs: [{ wave: 'sine', level: 0.7, unison: 3, spread: 12, width: 0.8 }, { wave: 'triangle', level: 0.35, cent: 7 }],
    filter: { type: 'lowpass', cutoff: 1600, q: 0.9, env: 1, keytrack: 0.55 },
    ampEnv: env(0.9, 1.4, 0.9, 1.4), filtEnv: env(1.4, 1.4, 0.6, 1),
    gain: 0.48, sends: { reverb: 0.48 }, defaultNote: 60
  },
  {
    id: 'pad_wide', name: 'Wide Pad', tags: ['stereo', 'huge'],
    oscs: [
      { wave: 'sawtooth', level: 0.65, unison: 7, spread: 34, width: 1 },
      { wave: 'hollow', level: 0.3, oct: -1, unison: 2, spread: 16 }
    ],
    filter: { type: 'lowpass', cutoff: 2400, q: 1.4, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.8, 1.4, 0.9, 1.4), filtEnv: env(1.2, 1.4, 0.5, 1),
    gain: 0.28, sends: { reverb: 0.5 }, defaultNote: 55,
    fx: [{ type: 'width', width: 1.6 }]
  },
  {
    id: 'pad_bright', name: 'Bright Pad', tags: ['open', 'airy'],
    oscs: [{ wave: 'razor', level: 0.6, unison: 4, spread: 18, width: 0.9 }, { wave: 'glass', level: 0.3, oct: 1 }],
    filter: { type: 'highpass', cutoff: 700, q: 1.2, env: 1, keytrack: 0.6 },
    ampEnv: env(0.6, 1.2, 0.88, 1.2), filtEnv: env(1, 1.2, 0.55, 0.9),
    gain: 0.32, sends: { reverb: 0.48, delay: 0.2 }, defaultNote: 67
  },
  {
    id: 'pad_lofi', name: 'Lo-Fi Pad', tags: ['lofi', 'dusty'],
    oscs: [{ wave: 'hollow', level: 0.7, unison: 3, spread: 24, width: 0.85 }],
    noise: { color: 'vinyl', level: 0.18, lp: 5000 },
    filter: { type: 'lowpass', cutoff: 1500, q: 1.4, env: 1.2, keytrack: 0.45 },
    ampEnv: env(0.7, 1.3, 0.88, 1.3), filtEnv: env(1.1, 1.3, 0.5, 0.9),
    lfo: { wave: 'sine', rate: 0.38, depth: 0.14, target: 'pitch', fade: 1.4 },
    shaper: { curve: 'crush', drive: 0.3 },
    gain: 0.38, sends: { reverb: 0.45 }, defaultNote: 55
  },
  {
    id: 'pad_shimmerpad', name: 'Shimmer Pad', tags: ['bright', 'wide'],
    oscs: [
      { wave: 'saw', level: 0.3, unison: 4, spread: 20 },
      { wave: 'glass', level: 0.25, oct: 1, cent: 6 },
      { wave: 'sine', level: 0.2, oct: 2 }
    ],
    filter: { type: 'lowpass', cutoff: 3600, q: 1.2, env: 1, keytrack: 0.5 },
    ampEnv: env(0.6, 1.8, 0.8, 1.4), filtEnv: env(0.9, 1.6, 0.6, 0.9),
    lfo: { wave: 'sine', rate: 0.22, depth: 0.3, target: 'filter' },
    gain: 0.4, sends: { reverb: 0.52, delay: 0.2 }, defaultNote: 60
  },
  {
    id: 'pad_dust', name: 'Dust Pad', tags: ['lofi', 'grain'],
    oscs: [{ wave: 'saw', level: 0.35, unison: 3, spread: 14 }, { wave: 'triangle', level: 0.3, oct: -1 }],
    noise: { color: 'vinyl', level: 0.16, lp: 4000 },
    filter: { type: 'lowpass', cutoff: 2000, q: 1.2, env: 0.8, keytrack: 0.4 },
    ampEnv: env(0.5, 1.6, 0.75, 1.2), filtEnv: env(0.8, 1.4, 0.6, 0.8),
    shaper: { curve: 'tube', drive: 0.24 },
    gain: 0.46, sends: { reverb: 0.44 }, defaultNote: 55
  },
  {
    id: 'pad_hollow', name: 'Hollow Pad', tags: ['hollow', 'reed'],
    oscs: [{ wave: 'hollow', level: 0.5, unison: 2, spread: 10 }, { wave: 'sine', level: 0.3, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 1.4, env: 0.9, keytrack: 0.5 },
    ampEnv: env(0.5, 1.5, 0.8, 1.1), filtEnv: env(0.7, 1.4, 0.6, 0.8),
    gain: 0.6, sends: { reverb: 0.44 }, defaultNote: 55
  },
  {
    id: 'pad_swellstrings', name: 'Swell Strings', tags: ['string', 'slow'],
    oscs: [
      { wave: 'saw', level: 0.32, unison: 5, spread: 18 },
      { wave: 'saw', level: 0.22, oct: 1, cent: -7 }
    ],
    filter: { type: 'lowpass', cutoff: 2600, q: 1.2, env: 1.2, keytrack: 0.5 },
    ampEnv: env(1.1, 2, 0.85, 1.6), filtEnv: env(1.4, 1.8, 0.6, 1 ),
    gain: 0.44, sends: { reverb: 0.52 }, defaultNote: 55
  },
  {
    id: 'pad_ghost', name: 'Ghost Pad', tags: ['vox', 'eerie'],
    oscs: [{ wave: 'vox', level: 0.45, unison: 3, spread: 16 }, { wave: 'sine', level: 0.25, oct: 1 }],
    filter: { type: 'bandpass', cutoff: 900, q: 1.6, env: 1.6, keytrack: 0.6 },
    ampEnv: env(0.8, 1.8, 0.8, 1.4), filtEnv: env(1.1, 1.6, 0.5, 0.9),
    lfo: { wave: 'sine', rate: 0.18, depth: 0.4, target: 'filter' },
    gain: 1.1, sends: { reverb: 0.56, delay: 0.2 }, defaultNote: 60
  },
  {
    id: 'pad_polysynth', name: 'Poly Pad', tags: ['classic', 'warm'],
    oscs: [{ wave: 'saw', level: 0.4, cent: -8 }, { wave: 'square', level: 0.3, cent: 8 }],
    filter: { type: 'lowpass', cutoff: 2200, q: 2, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.25, 1.2, 0.8, 0.8), filtEnv: env(0.4, 1, 0.5, 0.6),
    gain: 0.52, sends: { reverb: 0.4 }, defaultNote: 55
  },
  {
    id: 'pad_underwater', name: 'Submerged Pad', tags: ['dark', 'filtered'],
    oscs: [{ wave: 'saw', level: 0.4, unison: 4, spread: 18 }],
    filter: { type: 'lowpass', cutoff: 700, q: 3, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.7, 1.8, 0.85, 1.4), filtEnv: env(1, 1.6, 0.5, 0.9),
    lfo: { wave: 'sine', rate: 0.14, depth: 0.5, target: 'filter' },
    gain: 0.72, sends: { reverb: 0.5 }, defaultNote: 48
  },
  {
    id: 'pad_brasspad', name: 'Brass Pad', tags: ['brass', 'full'],
    oscs: [{ wave: 'saw', level: 0.45, unison: 3, spread: 12 }, { wave: 'reed', level: 0.25 }],
    filter: { type: 'lowpass', cutoff: 2000, q: 1.8, env: 2, keytrack: 0.5 },
    ampEnv: env(0.3, 1.2, 0.85, 0.8), filtEnv: env(0.5, 1.2, 0.5, 0.6),
    shaper: { curve: 'soft', drive: 0.22 },
    gain: 0.48, sends: { reverb: 0.4 }, defaultNote: 55
  },
  {
    id: 'pad_gritwall', name: 'Grit Wall Pad', tags: ['harsh', 'wide'],
    oscs: [{ wave: 'grind', level: 0.35, unison: 3, spread: 22 }, { wave: 'saw', level: 0.25, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 1800, q: 1.6, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.5, 1.6, 0.85, 1.2), filtEnv: env(0.8, 1.4, 0.6, 0.8),
    shaper: { curve: 'saturate', drive: 0.36 },
    gain: 0.4, sends: { reverb: 0.46 }, defaultNote: 48
  },
  {
    id: 'pad_bellpad', name: 'Bell Pad', tags: ['bell', 'shimmer'],
    oscs: [{ wave: 'bell', level: 0.4 }, { wave: 'sine', level: 0.35, oct: 1 }],
    fm: { ratio: 3.02, index: 1.6, decay: 1.6, sustain: 0.4 },
    filter: { type: 'lowpass', cutoff: 3800, q: 1.2, env: 1, keytrack: 0.7 },
    ampEnv: env(0.4, 2, 0.7, 1.4), filtEnv: env(0.6, 1.6, 0.5, 0.9),
    gain: 0.52, sends: { reverb: 0.54, delay: 0.2 }, defaultNote: 67
  },
  {
    id: 'pad_stringmachine', name: 'String Machine', tags: ['retro', 'chorus'],
    oscs: [
      { wave: 'saw', level: 0.35, cent: -14, pan: -0.4 },
      { wave: 'saw', level: 0.35, cent: 14, pan: 0.4 },
      { wave: 'saw', level: 0.2, oct: 1 }
    ],
    filter: { type: 'lowpass', cutoff: 2800, q: 1, env: 0.8, keytrack: 0.5 },
    ampEnv: env(0.2, 1.2, 0.85, 0.7), filtEnv: env(0.4, 1, 0.7, 0.5),
    gain: 0.44, sends: { reverb: 0.44 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.5, depth: 0.006, delay: 0.014, feedback: 0.2, mix: 0.5 }]
  },
  {
    id: 'pad_deepdrone', name: 'Deep Drone Pad', tags: ['drone', 'sub'],
    oscs: [{ wave: 'sub', level: 0.5 }, { wave: 'saw', level: 0.25, oct: 1, unison: 2, spread: 12 }],
    filter: { type: 'lowpass', cutoff: 900, q: 1.6, env: 0.6, keytrack: 0.4 },
    ampEnv: env(1.2, 2.4, 0.9, 2), filtEnv: env(1.6, 2, 0.7, 1.2),
    lfo: { wave: 'sine', rate: 0.09, depth: 0.3, target: 'filter' },
    gain: 0.5, sends: { reverb: 0.5 }, defaultNote: 36
  }
];
