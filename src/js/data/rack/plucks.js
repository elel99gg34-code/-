/* Plucks and keys — short attacks, tuned decays.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const PLUCKS = [
  {
    id: 'plk_dry', name: 'Dry Pluck', tags: ['short', 'clean'],
    oscs: [{ wave: 'sawtooth', level: 0.9 }, { wave: 'triangle', level: 0.3, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 1800, q: 4, env: 2.6, keytrack: 0.6, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.3, 0.02, 0.12), filtEnv: env(0.001, 0.18, 0.04, 0.1),
    gain: 0.46, sends: { reverb: 0.16, delay: 0.14 }, defaultNote: 64
  },
  {
    id: 'plk_karplus', name: 'String Snap', tags: ['string', 'physical'],
    oscs: [{ wave: 'glass', level: 0.8 }],
    noise: { color: 'white', level: 0.45, bp: 2800, q: 2.4, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 2600, q: 5, env: 2.8, keytrack: 0.8, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.8, 0.02, 0.24), filtEnv: env(0.001, 0.32, 0.03, 0.14),
    gain: 0.46, sends: { reverb: 0.22, delay: 0.12 }, defaultNote: 64
  },
  {
    id: 'plk_marimba', name: 'Riot Marimba', tags: ['mallet', 'wood'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'sine', level: 0.25, semi: 19 }],
    fm: { ratio: 4.0, index: 1.6, decay: 0.045, sustain: 0.02 },
    filter: { type: 'lowpass', cutoff: 3600, q: 0.8, env: 0.8, keytrack: 0.8 },
    ampEnv: env(0.001, 0.46, 0.0, 0.14), filtEnv: env(0.001, 0.2, 0.05, 0.1),
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 67
  },
  {
    id: 'plk_kalimba', name: 'Kalimba', tags: ['mallet', 'tonal'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'triangle', level: 0.3, semi: 12 }],
    noise: { color: 'white', level: 0.25, bp: 4200, q: 3, decay: 0.008 },
    filter: { type: 'lowpass', cutoff: 3200, q: 1.2, env: 1.2, keytrack: 0.8 },
    ampEnv: env(0.001, 0.7, 0.0, 0.2), filtEnv: env(0.001, 0.25, 0.04, 0.12),
    gain: 0.48, sends: { reverb: 0.28 }, defaultNote: 72
  },
  {
    id: 'plk_epiano', name: 'Riot Rhodes', tags: ['keys', 'warm'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 2.0, index: 2.4, decay: 0.28, sustain: 0.09 },
    filter: { type: 'lowpass', cutoff: 3000, q: 0.7, env: 1, keytrack: 0.7, velToEnv: 0.8 },
    ampEnv: env(0.003, 1.6, 0.18, 0.34), filtEnv: env(0.002, 0.5, 0.12, 0.2),
    shaper: { curve: 'tube', drive: 0.18 }, gain: 0.5, sends: { reverb: 0.22 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.6, depth: 0.003, mix: 0.35 }]
  },
  {
    id: 'plk_clav', name: 'Clav Attack', tags: ['keys', 'funk'],
    oscs: [{ wave: 'pulse25', level: 0.9 }, { wave: 'sawtooth', level: 0.4, cent: 8 }],
    filter: { type: 'bandpass', cutoff: 1500, q: 1.8, env: 2.6, keytrack: 0.6, velToEnv: 0.9 },
    ampEnv: env(0.001, 0.32, 0.06, 0.1), filtEnv: env(0.001, 0.16, 0.06, 0.08),
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.9, defaultNote: 60
  },
  {
    id: 'plk_harp', name: 'Wire Harp', tags: ['string', 'bright'],
    oscs: [{ wave: 'wire', level: 0.85 }, { wave: 'glass', level: 0.35, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 3400, q: 2.4, env: 2, keytrack: 0.8, velToEnv: 0.8 },
    ampEnv: env(0.001, 1.1, 0.02, 0.4), filtEnv: env(0.001, 0.4, 0.04, 0.2),
    gain: 0.44, sends: { reverb: 0.36, delay: 0.18 }, defaultNote: 72
  },
  {
    id: 'plk_music_box', name: 'Music Box', tags: ['bell', 'delicate'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'bell', level: 0.4, oct: 1 }],
    fm: { ratio: 5.4, index: 1.1, decay: 0.05, sustain: 0.02 },
    filter: { type: 'highpass', cutoff: 380, q: 0.7, env: 0.3, keytrack: 0.7 },
    ampEnv: env(0.001, 1.3, 0.0, 0.4), filtEnv: env(0.001, 0.3, 0.1, 0.2),
    gain: 0.44, sends: { reverb: 0.42, delay: 0.2 }, defaultNote: 79
  },
  {
    id: 'plk_stab', name: 'Piano Stab', tags: ['keys', 'percussive'],
    oscs: [{ wave: 'hollow', level: 0.9 }, { wave: 'sawtooth', level: 0.3, cent: 5 }],
    noise: { color: 'white', level: 0.2, bp: 2600, q: 2, decay: 0.01 },
    filter: { type: 'lowpass', cutoff: 2400, q: 2.6, env: 2.4, keytrack: 0.7, velToEnv: 0.85 },
    ampEnv: env(0.002, 0.7, 0.05, 0.2), filtEnv: env(0.001, 0.26, 0.06, 0.14),
    shaper: { curve: 'tube', drive: 0.22 }, gain: 0.48, sends: { reverb: 0.2 }, defaultNote: 60
  },
  {
    id: 'plk_arp', name: 'Arp Blip', tags: ['arp', 'digital'],
    oscs: [{ wave: 'square', level: 0.9 }, { wave: 'pulse12', level: 0.4, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 6, env: 2.4, keytrack: 0.6, velToEnv: 0.7 },
    ampEnv: env(0.001, 0.16, 0.0, 0.06), filtEnv: env(0.001, 0.1, 0.05, 0.05),
    gain: 0.42, sends: { delay: 0.24, reverb: 0.16 }, defaultNote: 72
  },

  {
    id: 'plk_nylon', name: 'Nylon', tags: ['acoustic', 'soft'],
    oscs: [{ wave: 'hollow', level: 0.85 }, { wave: 'sine', level: 0.3, oct: 1 }],
    noise: { color: 'pink', level: 0.2, bp: 2400, q: 1.8, decay: 0.014 },
    filter: { type: 'lowpass', cutoff: 2600, q: 1.2, env: 1.8, keytrack: 0.7, velToEnv: 0.8 },
    ampEnv: env(0.002, 1.1, 0.04, 0.3), filtEnv: env(0.001, 0.36, 0.06, 0.2),
    gain: 0.5, sends: { reverb: 0.24 }, defaultNote: 60
  },
  {
    id: 'plk_koto', name: 'Koto', tags: ['string', 'eastern'],
    oscs: [{ wave: 'wire', level: 0.8 }, { wave: 'hollow', level: 0.35, cent: 6 }],
    noise: { color: 'white', level: 0.32, bp: 3200, q: 2.6, decay: 0.012 },
    filter: { type: 'bandpass', cutoff: 1800, q: 2, env: 2.4, keytrack: 0.75, velToEnv: 0.85 },
    ampEnv: env(0.001, 1, 0.02, 0.3), filtEnv: env(0.001, 0.34, 0.05, 0.18),
    gain: 0.48, sends: { reverb: 0.3, delay: 0.14 }, defaultNote: 64
  },
  {
    id: 'plk_banjo', name: 'Banjo', tags: ['twang', 'bright'],
    oscs: [{ wave: 'razor', level: 0.7 }, { wave: 'glass', level: 0.4, oct: 1 }],
    noise: { color: 'white', level: 0.35, bp: 4200, q: 2.4, decay: 0.01 },
    filter: { type: 'bandpass', cutoff: 2600, q: 2.4, env: 2.6, keytrack: 0.75, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.55, 0.02, 0.16), filtEnv: env(0.001, 0.2, 0.05, 0.1),
    shaper: { curve: 'tube', drive: 0.22 },
    gain: 0.46, sends: { reverb: 0.2 }, defaultNote: 62
  },
  {
    id: 'plk_synth', name: 'Synth Pluck', tags: ['digital', 'clean'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 3, spread: 12, width: 0.7 }],
    filter: { type: 'lowpass', cutoff: 1500, q: 6, env: 3.2, keytrack: 0.6, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.36, 0.0, 0.12), filtEnv: env(0.001, 0.18, 0.04, 0.09),
    gain: 0.42, sends: { reverb: 0.24, delay: 0.24 }, defaultNote: 67
  },
  {
    id: 'plk_celesta', name: 'Celesta', tags: ['bell', 'bright'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 4.01, index: 1.9, decay: 0.07, sustain: 0.02 },
    filter: { type: 'highpass', cutoff: 500, q: 0.8, env: 0.4, keytrack: 0.75 },
    ampEnv: env(0.001, 1.1, 0.0, 0.34), filtEnv: env(0.001, 0.3, 0.08, 0.18),
    gain: 0.44, sends: { reverb: 0.38, delay: 0.16 }, defaultNote: 79
  },
  {
    id: 'plk_dulcimer', name: 'Dulcimer', tags: ['hammered', 'ringing'],
    oscs: [
      { wave: 'wire', level: 0.7, unison: 2, spread: 8, width: 0.5 },
      { wave: 'glass', level: 0.35, cent: 7 }
    ],
    noise: { color: 'white', level: 0.24, bp: 3600, q: 2.2, decay: 0.009 },
    filter: { type: 'lowpass', cutoff: 3600, q: 1.8, env: 2, keytrack: 0.75, velToEnv: 0.8 },
    ampEnv: env(0.001, 1.4, 0.03, 0.5), filtEnv: env(0.001, 0.42, 0.06, 0.24),
    gain: 0.44, sends: { reverb: 0.36, delay: 0.18 }, defaultNote: 72
  },

  {
    id: 'plk_sitar', name: 'Sitar', tags: ['string', 'buzz'],
    oscs: [{ wave: 'buzz', level: 0.6 }, { wave: 'wire', level: 0.5, cent: 8 }],
    noise: { color: 'white', level: 0.3, bp: 3400, q: 2.2, decay: 0.012 },
    filter: { type: 'bandpass', cutoff: 1900, q: 1.8, env: 2.4, keytrack: 0.75, velToEnv: 0.85 },
    ampEnv: env(0.001, 1.2, 0.04, 0.35), filtEnv: env(0.001, 0.4, 0.06, 0.2),
    lfo: { wave: 'sine', rate: 5.4, depth: 0.1, target: 'pitch', delay: 0.2, fade: 0.3 },
    gain: 0.6, sends: { reverb: 0.32, delay: 0.14 }, defaultNote: 62
  },
  {
    id: 'plk_charango', name: 'Charango', tags: ['acoustic', 'small'],
    oscs: [
      { wave: 'hollow', level: 0.7, unison: 2, spread: 12, width: 0.5 },
      { wave: 'glass', level: 0.35, oct: 1, cent: 7 }
    ],
    noise: { color: 'white', level: 0.28, bp: 4000, q: 2.2, decay: 0.01 },
    filter: { type: 'lowpass', cutoff: 3600, q: 1.2, env: 2, keytrack: 0.75, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.8, 0.03, 0.24), filtEnv: env(0.001, 0.28, 0.06, 0.14),
    gain: 0.5, sends: { reverb: 0.26 }, defaultNote: 69
  },
  {
    id: 'plk_glass', name: 'Glass Pluck', tags: ['clean', 'bell'],
    oscs: [{ wave: 'glass', level: 0.9 }, { wave: 'sine', level: 0.3, oct: 1 }],
    filter: { type: 'highpass', cutoff: 420, q: 1, env: 0.6, keytrack: 0.75 },
    ampEnv: env(0.001, 0.7, 0.0, 0.22), filtEnv: env(0.001, 0.24, 0.08, 0.12),
    gain: 0.46, sends: { reverb: 0.36, delay: 0.22 }, defaultNote: 76
  },
  {
    id: 'plk_fm', name: 'FM Pluck', tags: ['digital', 'tight'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 4.02, index: 3.6, decay: 0.06, sustain: 0.02 },
    filter: { type: 'lowpass', cutoff: 5000, q: 1, env: 1, keytrack: 0.7, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.4, 0.0, 0.12), filtEnv: env(0.001, 0.18, 0.05, 0.08),
    gain: 0.5, sends: { delay: 0.22, reverb: 0.2 }, defaultNote: 72
  },
  {
    id: 'plk_muted', name: 'Muted Pluck', tags: ['short', 'dry'],
    oscs: [{ wave: 'triangle', level: 0.85 }, { wave: 'sawtooth', level: 0.3, cent: 5 }],
    noise: { color: 'pink', level: 0.24, bp: 1600, q: 2, decay: 0.01 },
    filter: { type: 'lowpass', cutoff: 1200, q: 2.4, env: 1.8, keytrack: 0.6, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.14, 0.0, 0.05), filtEnv: env(0.001, 0.09, 0.05, 0.04),
    gain: 0.62, defaultNote: 60
  },
  {
    id: 'plk_bellpluck', name: 'Bell Pluck', tags: ['bell', 'ring'],
    oscs: [{ wave: 'bell', level: 0.85 }, { wave: 'sine', level: 0.35, semi: 19 }],
    fm: { ratio: 2.41, index: 1.2, decay: 0.12, sustain: 0.03 },
    filter: { type: 'highpass', cutoff: 380, q: 0.9, env: 0.5, keytrack: 0.7 },
    ampEnv: env(0.001, 1.4, 0.0, 0.5), filtEnv: env(0.001, 0.4, 0.08, 0.24),
    gain: 0.46, sends: { reverb: 0.42, delay: 0.2 }, defaultNote: 72
  },

  {
    id: 'plk_oud', name: 'Oud', tags: ['string', 'eastern'],
    oscs: [{ wave: 'hollow', level: 0.8, unison: 2, spread: 10, width: 0.5 }, { wave: 'wire', level: 0.35, cent: 7 }],
    noise: { color: 'white', level: 0.26, bp: 2800, q: 2.2, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 2200, q: 1.6, env: 2, keytrack: 0.7, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.9, 0.03, 0.26), filtEnv: env(0.001, 0.3, 0.06, 0.16),
    gain: 0.52, sends: { reverb: 0.3 }, defaultNote: 57
  },
  {
    id: 'plk_guzheng', name: 'Guzheng', tags: ['string', 'eastern'],
    oscs: [{ wave: 'wire', level: 0.8 }, { wave: 'glass', level: 0.4, oct: 1, cent: 5 }],
    noise: { color: 'white', level: 0.3, bp: 4200, q: 2.4, decay: 0.01 },
    filter: { type: 'lowpass', cutoff: 3600, q: 1.8, env: 2.2, keytrack: 0.8, velToEnv: 0.85 },
    ampEnv: env(0.001, 1.3, 0.02, 0.4), filtEnv: env(0.001, 0.4, 0.05, 0.2),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.09, target: 'pitch', delay: 0.25, fade: 0.35 },
    gain: 0.5, sends: { reverb: 0.36, delay: 0.16 }, defaultNote: 69
  },
  {
    id: 'plk_bouzouki', name: 'Bouzouki', tags: ['string', 'bright'],
    oscs: [
      { wave: 'wire', level: 0.7, unison: 2, spread: 13, width: 0.6 },
      { wave: 'hollow', level: 0.35, cent: -8 }
    ],
    noise: { color: 'white', level: 0.3, bp: 4600, q: 2.6, decay: 0.009 },
    filter: { type: 'bandpass', cutoff: 2400, q: 1.4, env: 2.2, keytrack: 0.75, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.8, 0.03, 0.24), filtEnv: env(0.001, 0.28, 0.06, 0.14),
    gain: 0.6, sends: { reverb: 0.3 }, defaultNote: 64
  },
  {
    id: 'plk_ukulele', name: 'Ukulele', tags: ['acoustic', 'small'],
    oscs: [{ wave: 'hollow', level: 0.8 }, { wave: 'glass', level: 0.3, oct: 1, cent: 6 }],
    noise: { color: 'white', level: 0.28, bp: 4200, q: 2.4, decay: 0.008 },
    filter: { type: 'lowpass', cutoff: 3400, q: 1.2, env: 2, keytrack: 0.75, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.6, 0.03, 0.18), filtEnv: env(0.001, 0.22, 0.06, 0.12),
    gain: 0.52, sends: { reverb: 0.26 }, defaultNote: 72
  },
  {
    id: 'plk_zither', name: 'Zither', tags: ['string', 'ringing'],
    oscs: [
      { wave: 'wire', level: 0.65, unison: 2, spread: 7, width: 0.5 },
      { wave: 'glass', level: 0.35, semi: 12 }
    ],
    noise: { color: 'white', level: 0.22, bp: 3800, q: 2.2, decay: 0.008 },
    filter: { type: 'highpass', cutoff: 380, q: 1, env: 0.8, keytrack: 0.75 },
    ampEnv: env(0.001, 1.6, 0.02, 0.5), filtEnv: env(0.001, 0.4, 0.06, 0.24),
    gain: 0.48, sends: { reverb: 0.4, delay: 0.2 }, defaultNote: 72
  },
  {
    id: 'plk_soft', name: 'Soft Pluck', tags: ['gentle', 'round'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'triangle', level: 0.35, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 1800, q: 1.6, env: 2, keytrack: 0.7, velToEnv: 0.85 },
    ampEnv: env(0.002, 0.7, 0.0, 0.24), filtEnv: env(0.002, 0.26, 0.06, 0.14),
    gain: 0.56, sends: { reverb: 0.32 }, defaultNote: 67
  },
  {
    id: 'plk_wide', name: 'Wide Pluck', tags: ['stereo', 'lush'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 5, spread: 22, width: 0.95 },
      { wave: 'glass', level: 0.3, oct: 1, cent: 8 }
    ],
    filter: { type: 'lowpass', cutoff: 1800, q: 4.5, env: 2.8, keytrack: 0.6, velToEnv: 0.8 },
    ampEnv: env(0.002, 0.5, 0.0, 0.2), filtEnv: env(0.002, 0.22, 0.05, 0.12),
    gain: 0.36, sends: { reverb: 0.4, delay: 0.28 }, defaultNote: 67
  },
  {
    id: 'plk_dark', name: 'Dark Pluck', tags: ['muted', 'moody'],
    oscs: [{ wave: 'hollow', level: 0.85 }, { wave: 'sine', level: 0.4, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 900, q: 3.2, env: 2.2, keytrack: 0.6, velToEnv: 0.85 },
    ampEnv: env(0.002, 0.6, 0.0, 0.2), filtEnv: env(0.002, 0.22, 0.06, 0.12),
    gain: 0.6, sends: { reverb: 0.34 }, defaultNote: 55
  }
];
