/* Guitars — filtered saw bodies with pick noise and heavy waveshaping.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const GUITARS = [
  {
    id: 'gtr_powerchord', name: 'Power Chord', tags: ['distorted', 'chug'],
    oscs: [
      { wave: 'sawtooth', level: 0.8, unison: 2, spread: 9, width: 0.35 },
      { wave: 'sawtooth', level: 0.5, semi: 7, unison: 2, spread: 9, width: 0.35 },
      { wave: 'sawtooth', level: 0.32, oct: 1, cent: 4 }
    ],
    noise: { color: 'white', level: 0.15, bp: 3200, q: 1.4, decay: 0.02 },
    filter: { type: 'lowpass', cutoff: 2800, q: 2.2, env: 1.1, keytrack: 0.4 },
    ampEnv: env(0.003, 0.4, 0.6, 0.16), filtEnv: env(0.002, 0.2, 0.3, 0.12),
    shaper: { curve: 'fuzz', drive: 0.72, oversample: '4x' }, gain: 0.44, defaultNote: 45,
    fx: [{ type: 'eq', low: -3, mid: 3, midFreq: 900, high: 1 }]
  },
  {
    id: 'gtr_palm', name: 'Palm Mute', tags: ['tight', 'chug'],
    oscs: [{ wave: 'sawtooth', level: 0.9, unison: 2, spread: 6 }, { wave: 'square', level: 0.4, semi: 7 }],
    filter: { type: 'lowpass', cutoff: 1500, q: 3, env: 1.6, keytrack: 0.35, velToEnv: 0.8 },
    ampEnv: env(0.002, 0.11, 0.12, 0.06), filtEnv: env(0.001, 0.07, 0.08, 0.05),
    shaper: { curve: 'hard', drive: 0.68 }, gain: 0.5, defaultNote: 40
  },
  {
    id: 'gtr_clean', name: 'Clean Strat', tags: ['clean', 'bright'],
    oscs: [{ wave: 'hollow', level: 0.9 }, { wave: 'triangle', level: 0.4, cent: 7 }],
    noise: { color: 'white', level: 0.16, bp: 4200, q: 2.2, decay: 0.014 },
    filter: { type: 'lowpass', cutoff: 3600, q: 1.4, env: 1.6, keytrack: 0.6, velToEnv: 0.7 },
    ampEnv: env(0.002, 0.9, 0.18, 0.28), filtEnv: env(0.001, 0.35, 0.12, 0.2),
    shaper: { curve: 'tube', drive: 0.12 }, gain: 0.48, sends: { reverb: 0.16 }, defaultNote: 52
  },
  {
    id: 'gtr_overdrive', name: 'Overdrive', tags: ['crunch', 'lead'],
    oscs: [{ wave: 'razor', level: 0.9, unison: 2, spread: 8 }, { wave: 'sawtooth', level: 0.4, cent: -6 }],
    filter: { type: 'lowpass', cutoff: 3000, q: 2.6, env: 1.4, keytrack: 0.45 },
    ampEnv: env(0.003, 0.5, 0.55, 0.2), filtEnv: env(0.002, 0.25, 0.25, 0.14),
    shaper: { curve: 'tube', drive: 0.6, oversample: '4x' }, gain: 0.46, defaultNote: 52
  },
  {
    id: 'gtr_fuzz', name: 'Fuzz Face', tags: ['fuzz', 'vintage'],
    oscs: [{ wave: 'square', level: 0.9 }, { wave: 'sawtooth', level: 0.45, cent: 9 }],
    filter: { type: 'lowpass', cutoff: 2200, q: 3.2, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.004, 0.6, 0.5, 0.22), filtEnv: env(0.003, 0.3, 0.2, 0.15),
    shaper: { curve: 'fuzz', drive: 0.88, oversample: '4x' }, gain: 0.4, defaultNote: 52
  },
  {
    id: 'gtr_wall', name: 'Wall of Noise', tags: ['shoegaze', 'wide'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 4, spread: 22, width: 0.9 },
      { wave: 'razor', level: 0.5, oct: 1, unison: 3, spread: 18, width: 0.8 }
    ],
    noise: { color: 'pink', level: 0.2, bp: 2600, q: 0.8 },
    filter: { type: 'lowpass', cutoff: 2400, q: 1.6, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.03, 1.2, 0.7, 0.6), filtEnv: env(0.05, 0.8, 0.4, 0.4),
    shaper: { curve: 'fuzz', drive: 0.6 }, gain: 0.34, sends: { reverb: 0.4 }, defaultNote: 52,
    fx: [{ type: 'chorus', rate: 0.25, depth: 0.007, mix: 0.5, feedback: 0.2 }]
  },
  {
    id: 'gtr_harmonic', name: 'Pinch Harmonic', tags: ['squeal', 'lead'],
    oscs: [{ wave: 'glass', level: 0.8 }, { wave: 'sawtooth', level: 0.35, oct: 1 }],
    fm: { ratio: 3.01, index: 1.8, decay: 0.12, sustain: 0.3 },
    filter: { type: 'bandpass', cutoff: 2800, q: 4, env: 1.8, keytrack: 0.7 },
    ampEnv: env(0.004, 0.6, 0.45, 0.3), filtEnv: env(0.003, 0.3, 0.3, 0.2),
    shaper: { curve: 'fuzz', drive: 0.65 }, gain: 0.4, sends: { reverb: 0.2 }, defaultNote: 64
  },
  {
    id: 'gtr_acoustic', name: 'Steel String', tags: ['acoustic', 'pluck'],
    oscs: [{ wave: 'hollow', level: 0.85 }, { wave: 'glass', level: 0.35, oct: 1, cent: 4 }],
    noise: { color: 'white', level: 0.28, bp: 3400, q: 1.8, decay: 0.02 },
    filter: { type: 'lowpass', cutoff: 4200, q: 1.1, env: 1.8, keytrack: 0.7, velToEnv: 0.8 },
    ampEnv: env(0.002, 1.4, 0.06, 0.4), filtEnv: env(0.001, 0.5, 0.06, 0.25),
    gain: 0.5, sends: { reverb: 0.18 }, defaultNote: 55
  },
  {
    id: 'gtr_muted', name: 'Dead Notes', tags: ['percussive', 'tight'],
    oscs: [{ wave: 'square', level: 0.7 }],
    noise: { color: 'white', level: 0.5, bp: 1800, q: 1.2, decay: 0.05 },
    filter: { type: 'lowpass', cutoff: 1200, q: 2.4, env: 1.4, keytrack: 0.3 },
    ampEnv: env(0.001, 0.07, 0, 0.04), filtEnv: env(0.001, 0.05, 0, 0.03),
    shaper: { curve: 'hard', drive: 0.5 }, gain: 0.5, defaultNote: 45
  },
  {
    id: 'gtr_ebow', name: 'E-Bow Drone', tags: ['sustain', 'drone'],
    oscs: [{ wave: 'razor', level: 0.8, unison: 2, spread: 5 }, { wave: 'sine', level: 0.4, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 3.4, env: 0.9, keytrack: 0.5 },
    ampEnv: env(0.35, 0.8, 0.95, 0.6), filtEnv: env(0.5, 0.8, 0.7, 0.5),
    lfo: { wave: 'sine', rate: 4.6, depth: 0.09, target: 'pitch', delay: 0.4, fade: 0.6 },
    shaper: { curve: 'tube', drive: 0.5 }, gain: 0.42, sends: { reverb: 0.3 }, defaultNote: 59
  },
  {
    id: 'gtr_surf', name: 'Surf Twang', tags: ['retro', 'clean'],
    oscs: [{ wave: 'reed', level: 0.85 }, { wave: 'triangle', level: 0.35, cent: -7 }],
    noise: { color: 'white', level: 0.2, bp: 5200, q: 2.6, decay: 0.012 },
    filter: { type: 'bandpass', cutoff: 2200, q: 2.2, env: 2, keytrack: 0.6, velToEnv: 0.8 },
    ampEnv: env(0.002, 0.7, 0.14, 0.2), filtEnv: env(0.001, 0.25, 0.1, 0.14),
    gain: 0.48, sends: { reverb: 0.35, delay: 0.1 }, defaultNote: 52,
    fx: [{ type: 'reverb', kind: 'spring', size: 1.1, mix: 0.3 }]
  },
  {
    id: 'gtr_feedback', name: 'Feedback Howl', tags: ['noise', 'squeal'],
    oscs: [{ wave: 'buzz', level: 0.7, unison: 2, spread: 4 }],
    fm: { ratio: 1.005, index: 0.6, decay: 0.8, sustain: 0.9 },
    filter: { type: 'bandpass', cutoff: 1800, q: 12, env: 2.4, keytrack: 0.6 },
    ampEnv: env(0.25, 0.6, 0.95, 0.5), filtEnv: env(0.6, 1.2, 0.85, 0.4),
    lfo: { wave: 'sine', rate: 0.7, depth: 0.8, target: 'filter', fade: 0.8 },
    shaper: { curve: 'fuzz', drive: 0.8 }, gain: 0.3, sends: { reverb: 0.35 }, defaultNote: 64
  },

  {
    id: 'gtr_djent', name: 'Djent Chug', tags: ['metal', 'tight'],
    oscs: [{ wave: 'grind', level: 0.9, unison: 2, spread: 5 }, { wave: 'square', level: 0.4, semi: 7 }],
    sub: { wave: 'sine', oct: -1, level: 0.25 },
    filter: { type: 'lowpass', cutoff: 1200, q: 3.6, env: 1.8, keytrack: 0.3, velToEnv: 0.85, poles: 4 },
    ampEnv: env(0.001, 0.09, 0.08, 0.05), filtEnv: env(0.001, 0.055, 0.06, 0.04),
    shaper: { curve: 'destroy', drive: 0.72, oversample: '4x' },
    gain: 0.5, defaultNote: 33,
    fx: [{ type: 'eq', low: 2, mid: -4, midFreq: 700, high: 3 }]
  },
  {
    id: 'gtr_octave', name: 'Octave Fuzz', tags: ['fuzz', 'octave'],
    oscs: [
      { wave: 'square', level: 0.8 },
      { wave: 'sawtooth', level: 0.5, oct: 1, cent: 8 },
      { wave: 'sine', level: 0.3, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 2400, q: 2.8, env: 1.2, keytrack: 0.45 },
    ampEnv: env(0.004, 0.55, 0.5, 0.2), filtEnv: env(0.003, 0.28, 0.2, 0.14),
    shaper: { curve: 'rect', drive: 0.8, oversample: '4x' }, gain: 0.4, defaultNote: 52
  },
  {
    id: 'gtr_tremolo', name: 'Tremolo Picking', tags: ['metal', 'fast'],
    oscs: [{ wave: 'razor', level: 0.85, unison: 2, spread: 7 }],
    noise: { color: 'white', level: 0.2, bp: 3000, q: 1.6 },
    filter: { type: 'lowpass', cutoff: 2600, q: 2.4, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.004, 0.4, 0.75, 0.16), filtEnv: env(0.004, 0.24, 0.3, 0.12),
    shaper: { curve: 'fuzz', drive: 0.66 },
    gain: 0.42, defaultNote: 52,
    fx: [{ type: 'autopan', mode: 'trem', rate: 15, depth: 0.55 }]
  },
  {
    id: 'gtr_slide', name: 'Slide Guitar', tags: ['glide', 'blues'],
    oscs: [{ wave: 'reed', level: 0.85 }, { wave: 'sawtooth', level: 0.35, cent: -7 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 2.6, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.02, 0.8, 0.6, 0.3), filtEnv: env(0.03, 0.4, 0.3, 0.2),
    lfo: { wave: 'sine', rate: 5.2, depth: 0.16, target: 'pitch', delay: 0.25, fade: 0.35 },
    shaper: { curve: 'tube', drive: 0.4 },
    glide: 0.1, poly: 1, gain: 0.44, sends: { reverb: 0.28 }, defaultNote: 57
  },
  {
    id: 'gtr_resonator', name: 'Resonator', tags: ['metal body', 'twang'],
    oscs: [{ wave: 'metal', level: 0.5 }, { wave: 'hollow', level: 0.6 }],
    noise: { color: 'white', level: 0.3, bp: 3600, q: 2, decay: 0.014 },
    filter: { type: 'bandpass', cutoff: 1900, q: 2.2, env: 2.2, keytrack: 0.65, velToEnv: 0.8 },
    ampEnv: env(0.002, 0.9, 0.08, 0.26), filtEnv: env(0.001, 0.3, 0.08, 0.16),
    gain: 0.46, sends: { reverb: 0.24 }, defaultNote: 55
  },
  {
    id: 'gtr_jazz', name: 'Hollowbody', tags: ['clean', 'warm'],
    oscs: [{ wave: 'sine', level: 0.8 }, { wave: 'hollow', level: 0.45, cent: 4 }],
    noise: { color: 'pink', level: 0.14, bp: 2200, q: 2, decay: 0.014 },
    filter: { type: 'lowpass', cutoff: 1500, q: 1.2, env: 1.6, keytrack: 0.65, velToEnv: 0.8 },
    ampEnv: env(0.003, 1.1, 0.14, 0.3), filtEnv: env(0.002, 0.4, 0.1, 0.2),
    shaper: { curve: 'tube', drive: 0.14 },
    gain: 0.52, sends: { reverb: 0.22 }, defaultNote: 55
  },
  {
    id: 'gtr_12string', name: '12-String', tags: ['acoustic', 'shimmer'],
    oscs: [
      { wave: 'hollow', level: 0.7, unison: 2, spread: 11, width: 0.6 },
      { wave: 'glass', level: 0.4, oct: 1, cent: 9, unison: 2, spread: 14, width: 0.8 }
    ],
    noise: { color: 'white', level: 0.26, bp: 3800, q: 1.8, decay: 0.018 },
    filter: { type: 'lowpass', cutoff: 4400, q: 1, env: 1.8, keytrack: 0.7, velToEnv: 0.8 },
    ampEnv: env(0.002, 1.6, 0.05, 0.45), filtEnv: env(0.001, 0.5, 0.06, 0.26),
    gain: 0.44, sends: { reverb: 0.28 }, defaultNote: 57
  },
  {
    id: 'gtr_wah', name: 'Wah Guitar', tags: ['funk', 'filter'],
    oscs: [{ wave: 'sawtooth', level: 0.85 }, { wave: 'square', level: 0.35, cent: 6 }],
    filter: { type: 'bandpass', cutoff: 800, q: 4, env: 2, keytrack: 0.4 },
    ampEnv: env(0.002, 0.3, 0.3, 0.12), filtEnv: env(0.006, 0.2, 0.12, 0.1),
    lfo: { wave: 'sine', rate: 2.6, depth: 0.9, target: 'filter', fade: 0.08 },
    shaper: { curve: 'tube', drive: 0.34 },
    gain: 1.0, defaultNote: 52
  },
  {
    id: 'gtr_swell', name: 'Volume Swell', tags: ['ambient', 'slow'],
    oscs: [{ wave: 'razor', level: 0.7, unison: 3, spread: 12, width: 0.8 }],
    filter: { type: 'lowpass', cutoff: 1900, q: 2, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.9, 1, 0.85, 0.9), filtEnv: env(1.2, 1, 0.5, 0.6),
    shaper: { curve: 'tube', drive: 0.4 },
    gain: 0.38, sends: { reverb: 0.45, delay: 0.22 }, defaultNote: 55
  },
  {
    id: 'gtr_baritone', name: 'Baritone', tags: ['low', 'dark'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 6 }, { wave: 'square', level: 0.4, semi: 7 }],
    sub: { wave: 'sine', oct: -1, level: 0.22 },
    filter: { type: 'lowpass', cutoff: 1400, q: 2.8, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.003, 0.5, 0.55, 0.2), filtEnv: env(0.002, 0.26, 0.2, 0.14),
    shaper: { curve: 'tube', drive: 0.55 }, gain: 0.46, defaultNote: 40
  },

  {
    id: 'gtr_crunch', name: 'Crunch Rhythm', tags: ['rhythm', 'crunch'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 7 }, { wave: 'square', level: 0.4, semi: 7 }],
    noise: { color: 'white', level: 0.14, bp: 3000, q: 1.8, decay: 0.014 },
    filter: { type: 'lowpass', cutoff: 2200, q: 2.6, env: 1.6, keytrack: 0.4 },
    ampEnv: env(0.002, 0.28, 0.4, 0.12), filtEnv: env(0.002, 0.16, 0.16, 0.1),
    shaper: { curve: 'tube', drive: 0.6, oversample: '4x' }, gain: 0.48, defaultNote: 45
  },
  {
    id: 'gtr_sludge', name: 'Sludge', tags: ['doom', 'slow'],
    oscs: [{ wave: 'grind', level: 0.85, unison: 2, spread: 9 }, { wave: 'sawtooth', level: 0.4, semi: 7, cent: -8 }],
    sub: { wave: 'sine', oct: -1, level: 0.3 },
    filter: { type: 'lowpass', cutoff: 1100, q: 2.4, env: 1.2, keytrack: 0.35 },
    ampEnv: env(0.02, 1.2, 0.7, 0.5), filtEnv: env(0.05, 0.7, 0.3, 0.3),
    shaper: { curve: 'fuzz', drive: 0.8, oversample: '4x' },
    gain: 0.4, sends: { reverb: 0.22 }, defaultNote: 36
  },
  {
    id: 'gtr_chime', name: 'Chime Guitar', tags: ['clean', 'jangle'],
    oscs: [
      { wave: 'glass', level: 0.7, unison: 2, spread: 8, width: 0.6 },
      { wave: 'hollow', level: 0.45, cent: 5 }
    ],
    noise: { color: 'white', level: 0.2, bp: 5000, q: 2.4, decay: 0.01 },
    filter: { type: 'highpass', cutoff: 420, q: 1, env: 0.8, keytrack: 0.7 },
    ampEnv: env(0.002, 1.2, 0.1, 0.34), filtEnv: env(0.001, 0.4, 0.1, 0.2),
    gain: 0.44, sends: { reverb: 0.3, delay: 0.16 }, defaultNote: 64
  },
  {
    id: 'gtr_muff', name: 'Big Muff', tags: ['fuzz', 'sustain'],
    oscs: [{ wave: 'square', level: 0.85 }, { wave: 'razor', level: 0.45, cent: 7 }],
    filter: { type: 'lowpass', cutoff: 1800, q: 2.2, env: 1, keytrack: 0.4 },
    ampEnv: env(0.006, 1.4, 0.7, 0.4), filtEnv: env(0.01, 0.6, 0.3, 0.24),
    shaper: { curve: 'fuzz', drive: 0.9, oversample: '4x' },
    gain: 0.36, sends: { reverb: 0.2 }, defaultNote: 52
  },
  {
    id: 'gtr_country', name: 'Country Pick', tags: ['clean', 'twang'],
    oscs: [{ wave: 'reed', level: 0.8 }, { wave: 'wire', level: 0.4, cent: 6 }],
    noise: { color: 'white', level: 0.3, bp: 4400, q: 2.6, decay: 0.01 },
    filter: { type: 'bandpass', cutoff: 2400, q: 1.6, env: 2.2, keytrack: 0.7, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.7, 0.06, 0.2), filtEnv: env(0.001, 0.24, 0.06, 0.12),
    gain: 0.7, sends: { reverb: 0.26 }, defaultNote: 57
  },
  {
    id: 'gtr_shred', name: 'Shred Lead', tags: ['lead', 'metal'],
    oscs: [{ wave: 'razor', level: 0.9, unison: 2, spread: 5 }, { wave: 'sawtooth', level: 0.35, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 3200, q: 3, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.004, 0.5, 0.8, 0.22), filtEnv: env(0.004, 0.3, 0.3, 0.16),
    lfo: { wave: 'sine', rate: 5.8, depth: 0.14, target: 'pitch', delay: 0.3, fade: 0.3 },
    shaper: { curve: 'tube', drive: 0.68, oversample: '4x' },
    gain: 0.42, sends: { reverb: 0.22, delay: 0.16 }, defaultNote: 64
  },
  {
    id: 'gtr_dirtyclean', name: 'Dirty Clean', tags: ['edge', 'breakup'],
    oscs: [{ wave: 'hollow', level: 0.8 }, { wave: 'sawtooth', level: 0.35, cent: 6 }],
    noise: { color: 'white', level: 0.18, bp: 3600, q: 2, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 2800, q: 1.8, env: 1.8, keytrack: 0.6, velToEnv: 0.85 },
    ampEnv: env(0.002, 0.9, 0.2, 0.26), filtEnv: env(0.001, 0.32, 0.12, 0.18),
    shaper: { curve: 'tube', drive: 0.4 },
    gain: 0.48, sends: { reverb: 0.2 }, defaultNote: 55
  },
  {
    id: 'gtr_dronewall', name: 'Drone Wall', tags: ['drone', 'noise'],
    oscs: [
      { wave: 'buzz', level: 0.6, unison: 3, spread: 12, width: 0.9 },
      { wave: 'razor', level: 0.4, semi: 7, unison: 2, spread: 18 }
    ],
    noise: { color: 'pink', level: 0.2, bp: 2200, q: 0.8 },
    filter: { type: 'lowpass', cutoff: 2000, q: 2.4, env: 1, keytrack: 0.4 },
    ampEnv: env(0.6, 1.4, 0.9, 1.2), filtEnv: env(1, 1.4, 0.5, 0.8),
    lfo: { wave: 'sine', rate: 0.16, depth: 0.4, target: 'filter', fade: 1.5 },
    shaper: { curve: 'fuzz', drive: 0.6 },
    gain: 0.3, sends: { reverb: 0.45 }, defaultNote: 45
  },

  {
    id: 'gtr_stoner', name: 'Stoner Riff', tags: ['fuzz', 'heavy'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 10 }, { wave: 'square', level: 0.45, semi: 7 }],
    sub: { wave: 'sine', oct: -1, level: 0.28 },
    filter: { type: 'lowpass', cutoff: 1600, q: 2.4, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.006, 0.8, 0.6, 0.3), filtEnv: env(0.01, 0.4, 0.25, 0.2),
    shaper: { curve: 'fuzz', drive: 0.78, oversample: '4x' },
    gain: 0.4, sends: { reverb: 0.2 }, defaultNote: 40
  },
  {
    id: 'gtr_thrash', name: 'Thrash', tags: ['metal', 'fast'],
    oscs: [{ wave: 'razor', level: 0.9, unison: 2, spread: 6 }, { wave: 'square', level: 0.4, semi: 7 }],
    filter: { type: 'lowpass', cutoff: 2000, q: 3, env: 1.8, keytrack: 0.35, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.13, 0.12, 0.06), filtEnv: env(0.001, 0.08, 0.08, 0.05),
    shaper: { curve: 'hard', drive: 0.75, oversample: '4x' },
    gain: 0.5, defaultNote: 40
  },
  {
    id: 'gtr_emo', name: 'Emo Clean', tags: ['clean', 'chorus'],
    oscs: [{ wave: 'hollow', level: 0.8, unison: 2, spread: 7, width: 0.5 }, { wave: 'glass', level: 0.3, oct: 1 }],
    noise: { color: 'white', level: 0.18, bp: 4000, q: 2.2, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 3200, q: 1.3, env: 1.8, keytrack: 0.65, velToEnv: 0.8 },
    ampEnv: env(0.002, 1.2, 0.14, 0.34), filtEnv: env(0.001, 0.4, 0.1, 0.2),
    gain: 0.46, sends: { reverb: 0.32, delay: 0.18 }, defaultNote: 59,
    fx: [{ type: 'chorus', rate: 0.5, depth: 0.005, mix: 0.45 }]
  },
  {
    id: 'gtr_math', name: 'Math Tap', tags: ['tapping', 'bright'],
    oscs: [{ wave: 'glass', level: 0.8 }, { wave: 'wire', level: 0.35, cent: 6 }],
    noise: { color: 'white', level: 0.24, bp: 4600, q: 2.4, decay: 0.008 },
    filter: { type: 'lowpass', cutoff: 3800, q: 2.2, env: 2.4, keytrack: 0.75, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.6, 0.05, 0.18), filtEnv: env(0.001, 0.22, 0.06, 0.12),
    gain: 0.48, sends: { reverb: 0.26, delay: 0.2 }, defaultNote: 67
  },
  {
    id: 'gtr_downtune', name: 'Down Tuned', tags: ['low', 'heavy'],
    oscs: [{ wave: 'grind', level: 0.9, unison: 2, spread: 5 }, { wave: 'sawtooth', level: 0.35, semi: 7 }],
    sub: { wave: 'sine', oct: -1, level: 0.3 },
    filter: { type: 'lowpass', cutoff: 900, q: 3.2, env: 1.6, keytrack: 0.3, poles: 4 },
    ampEnv: env(0.002, 0.2, 0.2, 0.08), filtEnv: env(0.002, 0.12, 0.1, 0.06),
    shaper: { curve: 'destroy', drive: 0.75, oversample: '4x' },
    gain: 0.5, defaultNote: 28
  },
  {
    id: 'gtr_reverse', name: 'Reverse Guitar', tags: ['fx', 'swell'],
    oscs: [{ wave: 'razor', level: 0.7, unison: 2, spread: 9 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 2.2, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.7, 0.3, 0.9, 0.12), filtEnv: env(0.9, 0.3, 0.9, 0.12),
    shaper: { curve: 'tube', drive: 0.45 },
    gain: 0.42, sends: { reverb: 0.4, delay: 0.2 }, defaultNote: 55
  },
  {
    id: 'gtr_octaver', name: 'Octave Up', tags: ['octave', 'bright'],
    oscs: [
      { wave: 'sawtooth', level: 0.6 },
      { wave: 'razor', level: 0.7, oct: 1, cent: 4 },
      { wave: 'glass', level: 0.3, oct: 2 }
    ],
    filter: { type: 'lowpass', cutoff: 4200, q: 2, env: 1.4, keytrack: 0.6 },
    ampEnv: env(0.003, 0.5, 0.5, 0.2), filtEnv: env(0.003, 0.26, 0.2, 0.14),
    shaper: { curve: 'fuzz', drive: 0.6 },
    gain: 0.4, sends: { reverb: 0.22 }, defaultNote: 55
  },
  {
    id: 'gtr_lofi', name: 'Lo-Fi Guitar', tags: ['lofi', 'dusty'],
    oscs: [{ wave: 'hollow', level: 0.8 }, { wave: 'sawtooth', level: 0.3, cent: 8 }],
    noise: { color: 'vinyl', level: 0.2, lp: 5000 },
    filter: { type: 'lowpass', cutoff: 1800, q: 1.6, env: 1.4, keytrack: 0.55 },
    ampEnv: env(0.003, 0.9, 0.16, 0.26), filtEnv: env(0.002, 0.3, 0.1, 0.16),
    shaper: { curve: 'crush', drive: 0.42 },
    gain: 0.5, sends: { reverb: 0.24 }, defaultNote: 55
  },
  {
    id: 'gtr_ambient', name: 'Ambient Loop', tags: ['ambient', 'wash'],
    oscs: [
      { wave: 'razor', level: 0.6, unison: 3, spread: 16, width: 0.9 },
      { wave: 'glass', level: 0.3, oct: 1, cent: 6 }
    ],
    filter: { type: 'lowpass', cutoff: 2200, q: 1.8, env: 1.2, keytrack: 0.5 },
    ampEnv: env(1.1, 1.4, 0.85, 1.4), filtEnv: env(1.6, 1.4, 0.5, 1),
    lfo: { wave: 'sine', rate: 0.2, depth: 0.3, target: 'filter', fade: 1.6 },
    shaper: { curve: 'tube', drive: 0.32 },
    gain: 0.34, sends: { reverb: 0.55, delay: 0.3 }, defaultNote: 59
  },
  {
    id: 'gtr_strum', name: 'Strum Chord', tags: ['chord', 'wide'],
    oscs: [
      { wave: 'hollow', level: 0.6, unison: 2, spread: 9, width: 0.6 },
      { wave: 'hollow', level: 0.45, semi: 7, unison: 2, spread: 11, width: 0.8 },
      { wave: 'glass', level: 0.3, semi: 12, cent: 5 }
    ],
    noise: { color: 'white', level: 0.3, bp: 3600, q: 1.6, decay: 0.03 },
    filter: { type: 'lowpass', cutoff: 3200, q: 1.2, env: 1.8, keytrack: 0.7, velToEnv: 0.8 },
    ampEnv: env(0.008, 1.3, 0.1, 0.4), filtEnv: env(0.004, 0.45, 0.08, 0.24),
    gain: 0.4, sends: { reverb: 0.3 }, defaultNote: 52
  }
];
