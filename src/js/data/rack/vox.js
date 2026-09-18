/* Voices — the `vox` wavetable pushed through resonant formant filters.
 * Nothing here is a sample: the vowel comes from where the band-pass sits and
 * how the LFO moves it. */

import { env } from './shared.js';

export const VOICES = [
  {
    id: 'vox_aah', name: 'Aah', tags: ['open', 'warm'],
    oscs: [{ wave: 'vox', level: 0.9, unison: 3, spread: 11, width: 0.7 }],
    /* "aah" sits around 730 Hz with a strong second formant near 1100. */
    filter: { type: 'bandpass', cutoff: 760, q: 3.2, env: 1.1, keytrack: 0.55, poles: 4 },
    ampEnv: env(0.08, 0.5, 0.88, 0.32), filtEnv: env(0.12, 0.5, 0.5, 0.26),
    lfo: { wave: 'sine', rate: 4.9, depth: 0.09, target: 'pitch', delay: 0.3, fade: 0.35 },
    gain: 0.5, sends: { reverb: 0.3 }, defaultNote: 62
  },
  {
    id: 'vox_ooh', name: 'Ooh', tags: ['dark', 'round'],
    oscs: [{ wave: 'vox', level: 0.8, unison: 2, spread: 8 }, { wave: 'sine', level: 0.35, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 420, q: 6, env: 1.4, keytrack: 0.6, poles: 4 },
    ampEnv: env(0.1, 0.5, 0.9, 0.34), filtEnv: env(0.16, 0.5, 0.55, 0.28),
    lfo: { wave: 'sine', rate: 4.4, depth: 0.08, target: 'pitch', delay: 0.35, fade: 0.4 },
    gain: 0.54, sends: { reverb: 0.32 }, defaultNote: 55
  },
  {
    id: 'vox_choir_low', name: 'Low Choir', tags: ['choir', 'deep'],
    oscs: [
      { wave: 'vox', level: 0.75, unison: 4, spread: 18, width: 0.85 },
      { wave: 'hollow', level: 0.35, oct: -1, cent: 7 }
    ],
    filter: { type: 'bandpass', cutoff: 520, q: 2.2, env: 1, keytrack: 0.6 },
    ampEnv: env(0.4, 1, 0.9, 0.9), filtEnv: env(0.6, 1, 0.6, 0.7),
    lfo: { wave: 'sine', rate: 3.8, depth: 0.07, target: 'pitch', delay: 0.6, fade: 0.8 },
    gain: 0.42, sends: { reverb: 0.48 }, defaultNote: 48
  },
  {
    id: 'vox_robot', name: 'Robot Voice', tags: ['digital', 'formant'],
    oscs: [{ wave: 'pulse25', level: 0.9 }, { wave: 'vox', level: 0.5, cent: 6 }],
    filter: { type: 'bandpass', cutoff: 900, q: 8, env: 1.6, keytrack: 0.4, poles: 4 },
    ampEnv: env(0.006, 0.2, 0.85, 0.08), filtEnv: env(0.01, 0.2, 0.4, 0.08),
    lfo: { wave: 'square', rate: 9, depth: 0.5, target: 'filter', fade: 0.05 },
    gain: 0.46, defaultNote: 55,
    fx: [{ type: 'crush', bits: 7, reduction: 4, mix: 0.6 }]
  },
  {
    id: 'vox_chant', name: 'Riot Chant', tags: ['crowd', 'shout'],
    oscs: [
      { wave: 'vox', level: 0.8, unison: 5, spread: 26, width: 0.95 },
      { wave: 'sawtooth', level: 0.3, cent: -12 }
    ],
    noise: { color: 'pink', level: 0.16, bp: 1800, q: 0.9 },
    filter: { type: 'bandpass', cutoff: 1050, q: 2.6, env: 1.8, keytrack: 0.5 },
    ampEnv: env(0.02, 0.3, 0.8, 0.22), filtEnv: env(0.03, 0.3, 0.45, 0.2),
    shaper: { curve: 'tube', drive: 0.35 },
    gain: 0.4, sends: { reverb: 0.34 }, defaultNote: 50
  },
  {
    id: 'vox_scream', name: 'Scream', tags: ['harsh', 'punk'],
    oscs: [{ wave: 'vox', level: 0.7, unison: 2, spread: 22 }, { wave: 'razor', level: 0.45, cent: 9 }],
    noise: { color: 'white', level: 0.28, bp: 3200, q: 1.1 },
    filter: { type: 'bandpass', cutoff: 1600, q: 5, env: 2.4, keytrack: 0.5, poles: 4 },
    ampEnv: env(0.012, 0.3, 0.75, 0.18), filtEnv: env(0.02, 0.3, 0.35, 0.16),
    pitchEnv: { amt: 0.6, d: 0.1 },
    shaper: { curve: 'fuzz', drive: 0.62 },
    gain: 0.34, sends: { reverb: 0.3 }, defaultNote: 67
  },
  {
    id: 'vox_whisper', name: 'Whisper', tags: ['breath', 'soft'],
    oscs: [{ wave: 'sine', level: 0.12 }],
    noise: { color: 'white', level: 0.9, bp: 1400, q: 1.4, keytrack: true },
    filter: { type: 'bandpass', cutoff: 1900, q: 2.4, env: 1.2, keytrack: 0.7 },
    ampEnv: env(0.06, 0.4, 0.7, 0.3), filtEnv: env(0.1, 0.4, 0.5, 0.24),
    lfo: { wave: 'sine', rate: 0.7, depth: 0.35, target: 'filter', fade: 0.5 },
    gain: 0.5, sends: { reverb: 0.4 }, defaultNote: 64
  },
  {
    id: 'vox_talkbox', name: 'Talkbox', tags: ['formant', 'sweep'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 7 }],
    filter: { type: 'bandpass', cutoff: 620, q: 9, env: 2.6, keytrack: 0.35, poles: 4 },
    ampEnv: env(0.01, 0.3, 0.85, 0.16), filtEnv: env(0.05, 0.45, 0.3, 0.2),
    lfo: { wave: 'triangle', rate: 1.6, depth: 0.7, target: 'filter', fade: 0.2 },
    shaper: { curve: 'tube', drive: 0.32 },
    gain: 0.44, sends: { delay: 0.16 }, defaultNote: 57
  },
  {
    id: 'vox_vocoder', name: 'Vocoder Pad', tags: ['pad', 'robotic'],
    oscs: [
      { wave: 'vox', level: 0.7, unison: 4, spread: 16, width: 0.8 },
      { wave: 'pulse12', level: 0.3, oct: 1 }
    ],
    filter: { type: 'bandpass', cutoff: 1200, q: 4, env: 1.2, keytrack: 0.6 },
    ampEnv: env(0.3, 0.9, 0.88, 0.7), filtEnv: env(0.5, 0.9, 0.5, 0.5),
    lfo: { wave: 'triangle', rate: 0.28, depth: 0.5, target: 'filter', fade: 1 },
    gain: 0.36, sends: { reverb: 0.42, delay: 0.18 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.4, depth: 0.005, mix: 0.45 }]
  },
  {
    id: 'vox_hey', name: 'Crowd Hey', tags: ['stab', 'percussive'],
    oscs: [{ wave: 'vox', level: 0.85, unison: 4, spread: 24, width: 0.9 }],
    noise: { color: 'pink', level: 0.3, bp: 2200, q: 0.8, decay: 0.06 },
    filter: { type: 'bandpass', cutoff: 1300, q: 2, env: 2.2, keytrack: 0.45 },
    ampEnv: env(0.008, 0.22, 0.0, 0.1), filtEnv: env(0.006, 0.14, 0.05, 0.08),
    shaper: { curve: 'hard', drive: 0.32 },
    gain: 0.46, sends: { reverb: 0.3 }, defaultNote: 55
  },
  {
    id: 'vox_gospel', name: 'Gospel Stack', tags: ['choir', 'lush'],
    oscs: [
      { wave: 'vox', level: 0.7, unison: 3, spread: 14, width: 0.8 },
      { wave: 'vox', level: 0.45, semi: 7, unison: 2, spread: 10 },
      { wave: 'vox', level: 0.32, oct: 1, cent: -6 }
    ],
    filter: { type: 'bandpass', cutoff: 880, q: 1.8, env: 1.2, keytrack: 0.6 },
    ampEnv: env(0.24, 0.8, 0.9, 0.6), filtEnv: env(0.4, 0.8, 0.55, 0.45),
    lfo: { wave: 'sine', rate: 4.2, depth: 0.06, target: 'pitch', delay: 0.5, fade: 0.6 },
    gain: 0.32, sends: { reverb: 0.5 }, defaultNote: 55
  },
  {
    id: 'vox_alien', name: 'Alien Voice', tags: ['fx', 'ring'],
    oscs: [{ wave: 'vox', level: 0.8, unison: 2, spread: 13 }],
    fm: { ratio: 1.732, index: 1.6, decay: 0.4, sustain: 0.5 },
    filter: { type: 'bandpass', cutoff: 1400, q: 6, env: 1.8, keytrack: 0.5 },
    ampEnv: env(0.05, 0.4, 0.8, 0.28), filtEnv: env(0.1, 0.4, 0.4, 0.22),
    lfo: { wave: 'sine', rate: 6.5, depth: 0.5, target: 'pitch', delay: 0.1, fade: 0.2 },
    gain: 0.4, sends: { reverb: 0.36, delay: 0.24 }, defaultNote: 67,
    fx: [{ type: 'ring', freq: 143, mix: 0.35 }]
  }
];
