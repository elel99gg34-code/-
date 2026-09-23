/* Modular and experimental.
 *
 * Patches that behave more like a circuit than an instrument: filters rung
 * into self-oscillation, operators detuned just far enough off a ratio to
 * never repeat, envelopes that decay rather than sustain the way a lowpass
 * gate does. Several of these are deliberately unstable — that is the point.
 * Hold a long note and they keep changing. */

import { env } from './shared.js';

export const MODULAR = [
  {
    id: 'mod_westcoast', name: 'West Coast', tags: ['fold', 'buchla'],
    /* Sine into a wavefolder: harmonics appear as the level rises, not as a
     * filter opens. */
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 1.5, index: 1.8, decay: 0.6, sustain: 0.35 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.8, env: 0.6, keytrack: 0.6 },
    ampEnv: env(0.004, 0.5, 0.55, 0.3), filtEnv: env(0.01, 0.5, 0.4, 0.2),
    shaper: { curve: 'fold', drive: 0.62, oversample: '4x' },
    gain: 0.52, sends: { reverb: 0.22 }, defaultNote: 55
  },
  {
    id: 'mod_complex', name: 'Complex Osc', tags: ['fm', 'evolving'],
    oscs: [{ wave: 'sine', level: 0.8 }, { wave: 'triangle', level: 0.4, cent: 7 }],
    fm: { ratio: 2.003, index: 4.5, decay: 1.6, sustain: 0.5 },
    filter: { type: 'lowpass', cutoff: 3600, q: 1.6, env: 1.2, keytrack: 0.6 },
    ampEnv: env(0.02, 0.8, 0.8, 0.5), filtEnv: env(0.05, 0.9, 0.4, 0.4),
    lfo: { wave: 'triangle', rate: 0.17, depth: 0.5, target: 'filter', fade: 1.2 },
    shaper: { curve: 'fold', drive: 0.34 },
    gain: 0.5, sends: { reverb: 0.3 }, defaultNote: 55
  },
  {
    id: 'mod_selfosc', name: 'Self Oscillation', tags: ['resonant', 'pure'],
    /* Almost no source: the filter's own resonance is the voice. */
    oscs: [{ wave: 'sine', level: 0.06 }],
    noise: { color: 'white', level: 0.1, hp: 200 },
    filter: { type: 'lowpass', cutoff: 900, q: 21, env: 2.4, keytrack: 0.9, poles: 4 },
    ampEnv: env(0.01, 0.6, 0.7, 0.4), filtEnv: env(0.03, 0.8, 0.3, 0.3),
    gain: 0.5, sends: { reverb: 0.34, delay: 0.16 }, defaultNote: 60
  },
  {
    id: 'mod_wavefold', name: 'Wavefolder', tags: ['fold', 'harsh'],
    oscs: [{ wave: 'triangle', level: 1 }],
    filter: { type: 'lowpass', cutoff: 6000, q: 1.2, env: 1, keytrack: 0.6 },
    ampEnv: env(0.004, 0.4, 0.75, 0.2), filtEnv: env(0.01, 0.4, 0.4, 0.16),
    lfo: { wave: 'sine', rate: 0.6, depth: 0.5, target: 'filter', fade: 0.4 },
    shaper: { curve: 'fold', drive: 0.88, oversample: '4x' },
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 55
  },
  {
    id: 'mod_lpg', name: 'Lowpass Gate', tags: ['vactrol', 'plucky'],
    /* A vactrol opens level and brightness together and never quite sustains. */
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'triangle', level: 0.35, semi: 12 }],
    filter: { type: 'lowpass', cutoff: 900, q: 1.4, env: 2.6, keytrack: 0.7, velToEnv: 0.9 },
    ampEnv: env(0.004, 0.55, 0.0, 0.2), filtEnv: env(0.006, 0.4, 0.04, 0.16),
    gain: 0.6, sends: { reverb: 0.3 }, defaultNote: 60
  },
  {
    id: 'mod_bucket', name: 'Bucket Brigade', tags: ['analog', 'delay'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 2, spread: 7 }],
    filter: { type: 'lowpass', cutoff: 2200, q: 1.6, env: 1.2, keytrack: 0.5 },
    ampEnv: env(0.006, 0.3, 0.7, 0.18), filtEnv: env(0.01, 0.3, 0.4, 0.14),
    gain: 0.42, defaultNote: 60,
    fx: [
      { type: 'delay', timeL: 0.09, timeR: 0.13, feedback: 0.62, damp: 2600, mix: 0.5 },
      { type: 'crush', bits: 8, reduction: 3, jitter: 0.12, mix: 0.4 }
    ]
  },
  {
    id: 'mod_krell', name: 'Krell Patch', tags: ['generative', 'random'],
    oscs: [{ wave: 'hollow', level: 0.8 }, { wave: 'glass', level: 0.35, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 1400, q: 3.4, env: 2.6, keytrack: 0.7 },
    ampEnv: env(0.02, 0.9, 0.0, 0.5), filtEnv: env(0.05, 0.7, 0.05, 0.3),
    lfo: { wave: 'triangle', rate: 0.37, depth: 0.8, target: 'filter', fade: 0.2 },
    gain: 0.5, sends: { reverb: 0.45, delay: 0.24 }, defaultNote: 67
  },
  {
    id: 'mod_sampleandhold', name: 'Sample & Hold', tags: ['stepped', 'random'],
    oscs: [{ wave: 'square', level: 0.85 }],
    filter: { type: 'lowpass', cutoff: 1800, q: 5, env: 1.8, keytrack: 0.5 },
    ampEnv: env(0.004, 0.3, 0.7, 0.12), filtEnv: env(0.008, 0.3, 0.35, 0.1),
    lfo: { wave: 'square', rate: 11, depth: 0.9, target: 'filter', fade: 0.02 },
    gain: 0.44, sends: { delay: 0.22 }, defaultNote: 60,
    fx: [{ type: 'crush', bits: 6, reduction: 4, jitter: 0.5, mix: 0.6 }]
  },
  {
    id: 'mod_clockdiv', name: 'Clock Divider', tags: ['stepped', 'rhythmic'],
    oscs: [{ wave: 'pulse25', level: 0.9 }, { wave: 'square', level: 0.3, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 3, env: 1.6, keytrack: 0.55 },
    ampEnv: env(0.002, 0.3, 0.8, 0.1), filtEnv: env(0.004, 0.3, 0.4, 0.09),
    gain: 0.42, sends: { delay: 0.2 }, defaultNote: 64,
    fx: [{ type: 'gate', depth: 1, shape: 0.12, pattern: [1, 0, 1, 1, 0, 1, 0, 0] }]
  },
  {
    id: 'mod_chaos', name: 'Chaos', tags: ['unstable', 'noise'],
    oscs: [{ wave: 'grind', level: 0.6 }, { wave: 'buzz', level: 0.35, cent: 37 }],
    fm: { ratio: 1.618, index: 5.5, decay: 2.4, sustain: 0.8 },
    filter: { type: 'bandpass', cutoff: 1400, q: 2.6, env: 2.4, keytrack: 0.4 },
    ampEnv: env(0.02, 0.6, 0.8, 0.3), filtEnv: env(0.05, 0.6, 0.4, 0.26),
    lfo: { wave: 'triangle', rate: 2.7, depth: 0.9, target: 'filter', fade: 0.1 },
    shaper: { curve: 'destroy', drive: 0.55 },
    gain: 0.6, sends: { reverb: 0.3 }, defaultNote: 55
  },
  {
    id: 'mod_pingfilter', name: 'Ping Filter', tags: ['resonant', 'percussive'],
    oscs: [{ wave: 'sine', level: 0.55 }],
    noise: { color: 'white', level: 0.5, hp: 400, decay: 0.014 },
    filter: { type: 'bandpass', cutoff: 900, q: 7, env: 1.2, keytrack: 0.95 },
    ampEnv: env(0.001, 0.7, 0.0, 0.2), filtEnv: env(0.002, 0.3, 0.1, 0.12),
    gain: 1.25, sends: { reverb: 0.36, delay: 0.2 }, defaultNote: 67
  },
  {
    id: 'mod_string', name: 'Physical String', tags: ['karplus', 'plucked'],
    oscs: [{ wave: 'wire', level: 0.55 }, { wave: 'glass', level: 0.3, cent: 4 }],
    noise: { color: 'white', level: 0.55, bp: 2600, q: 1.8, decay: 0.006 },
    filter: { type: 'lowpass', cutoff: 2600, q: 6, env: 2.8, keytrack: 0.95, velToEnv: 0.9 },
    ampEnv: env(0.001, 1.4, 0.02, 0.4), filtEnv: env(0.001, 0.5, 0.04, 0.2),
    gain: 0.56, sends: { reverb: 0.3, delay: 0.14 }, defaultNote: 62
  },
  {
    id: 'mod_metallic', name: 'Metallic Resonator', tags: ['inharmonic', 'ring'],
    oscs: [{ wave: 'metal', level: 0.5 }, { wave: 'sine', level: 0.4 }],
    fm: { ratio: 3.414, index: 2.8, decay: 0.8, sustain: 0.2 },
    filter: { type: 'bandpass', cutoff: 2000, q: 2.4, env: 1.8, keytrack: 0.75 },
    ampEnv: env(0.002, 2, 0.06, 0.8), filtEnv: env(0.004, 0.7, 0.08, 0.35),
    gain: 0.66, sends: { reverb: 0.44 }, defaultNote: 64
  },
  {
    id: 'mod_drone', name: 'Modular Drone', tags: ['drone', 'slow'],
    oscs: [
      { wave: 'buzz', level: 0.5, unison: 2, spread: 4 },
      { wave: 'sawtooth', level: 0.35, cent: 9 },
      { wave: 'sine', level: 0.4, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 800, q: 4.5, env: 1.4, keytrack: 0.4 },
    ampEnv: env(1.6, 2, 0.95, 2.2), filtEnv: env(2.4, 2, 0.5, 1.6),
    lfo: { wave: 'sine', rate: 0.05, depth: 0.6, target: 'filter', fade: 3 },
    shaper: { curve: 'tube', drive: 0.34 },
    gain: 0.4, sends: { reverb: 0.45 }, defaultNote: 43
  },
  {
    id: 'mod_fmchaos', name: 'FM Chaos', tags: ['fm', 'inharmonic'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 7.37, index: 8, wave: 'triangle', decay: 1.2, sustain: 0.55 },
    filter: { type: 'lowpass', cutoff: 4200, q: 2.2, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.006, 0.6, 0.7, 0.3), filtEnv: env(0.01, 0.6, 0.35, 0.24),
    gain: 0.4, sends: { reverb: 0.3, delay: 0.2 }, defaultNote: 60
  },
  {
    id: 'mod_ringstack', name: 'Ring Stack', tags: ['ring', 'metallic'],
    oscs: [{ wave: 'square', level: 0.7 }, { wave: 'triangle', level: 0.4, semi: 5 }],
    filter: { type: 'lowpass', cutoff: 3400, q: 1.8, env: 1.4, keytrack: 0.6 },
    ampEnv: env(0.004, 0.5, 0.6, 0.24), filtEnv: env(0.008, 0.5, 0.35, 0.2),
    gain: 0.68, sends: { reverb: 0.34 }, defaultNote: 60,
    fx: [
      { type: 'ring', freq: 173, mix: 0.5 },
      { type: 'ring', freq: 419, mix: 0.3 }
    ]
  },
  {
    id: 'mod_granular', name: 'Granular Cloud', tags: ['texture', 'stutter'],
    oscs: [{ wave: 'glass', level: 0.6, unison: 3, spread: 22, width: 0.9 }],
    noise: { color: 'crackle', level: 0.3, bp: 3200, q: 1.4 },
    filter: { type: 'bandpass', cutoff: 2200, q: 2, env: 1.6, keytrack: 0.6 },
    ampEnv: env(0.3, 1.2, 0.8, 1 ), filtEnv: env(0.5, 1.2, 0.45, 0.7),
    lfo: { wave: 'triangle', rate: 0.5, depth: 0.55, target: 'filter', fade: 0.8 },
    gain: 0.56, sends: { reverb: 0.5, delay: 0.26 }, defaultNote: 72,
    fx: [{ type: 'gate', depth: 0.85, shape: 0.2, pattern: [1, 1, 0, 1, 0, 0, 1, 0] }]
  },
  {
    id: 'mod_feedback', name: 'Feedback Patch', tags: ['howl', 'unstable'],
    oscs: [{ wave: 'buzz', level: 0.5, unison: 2, spread: 3 }],
    fm: { ratio: 1.002, index: 0.9, decay: 1.4, sustain: 0.9 },
    filter: { type: 'bandpass', cutoff: 1500, q: 9, env: 2.6, keytrack: 0.6 },
    ampEnv: env(0.2, 0.8, 0.9, 0.5), filtEnv: env(0.5, 1, 0.5, 0.4),
    lfo: { wave: 'sine', rate: 0.35, depth: 0.9, target: 'filter', fade: 0.8 },
    shaper: { curve: 'fuzz', drive: 0.6 },
    gain: 0.66, sends: { reverb: 0.4 }, defaultNote: 67
  },
  {
    id: 'mod_bleep', name: 'Bleep Sequence', tags: ['stepped', 'short'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'square', level: 0.3, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 3200, q: 4, env: 2, keytrack: 0.7, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.1, 0.0, 0.04), filtEnv: env(0.001, 0.07, 0.05, 0.035),
    gain: 0.52, sends: { delay: 0.3, reverb: 0.2 }, defaultNote: 79
  },
  {
    id: 'mod_rumble', name: 'Rumble Module', tags: ['sub', 'noise'],
    oscs: [{ wave: 'sine', level: 0.7 }],
    sub: { wave: 'sine', oct: -1, level: 0.45, bypassFilter: true },
    noise: { color: 'brown', level: 0.5, lp: 260 },
    filter: { type: 'lowpass', cutoff: 220, q: 3.4, env: 1, keytrack: 0.4 },
    ampEnv: env(0.4, 1.2, 0.9, 1.2), filtEnv: env(0.8, 1.2, 0.5, 0.8),
    lfo: { wave: 'sine', rate: 0.23, depth: 0.5, target: 'filter', fade: 1.5 },
    shaper: { curve: 'saturate', drive: 0.32 },
    gain: 0.6, sends: { reverb: 0.26 }, defaultNote: 28
  },
  {
    id: 'mod_shimmer', name: 'Shimmer Cell', tags: ['bright', 'texture'],
    oscs: [
      { wave: 'glass', level: 0.6, unison: 3, spread: 16, width: 0.9 },
      { wave: 'bell', level: 0.3, oct: 1, cent: 6 }
    ],
    fm: { ratio: 4.01, index: 0.9, decay: 2, sustain: 0.25 },
    filter: { type: 'highpass', cutoff: 800, q: 1.2, env: 0.9, keytrack: 0.7 },
    ampEnv: env(0.5, 1.6, 0.8, 1.6), filtEnv: env(0.9, 1.4, 0.5, 1),
    gain: 0.4, sends: { reverb: 0.58, delay: 0.3 }, defaultNote: 79
  },
  {
    id: 'mod_burst', name: 'Burst Generator', tags: ['percussive', 'noise'],
    oscs: [{ wave: 'wire', level: 0.4 }],
    noise: { color: 'blue', level: 0.8, hp: 1600 },
    filter: { type: 'bandpass', cutoff: 2600, q: 2.2, env: 2.4, keytrack: 0.5 },
    ampEnv: env(0.001, 0.16, 0.0, 0.06), filtEnv: env(0.002, 0.12, 0.05, 0.05),
    gain: 0.9, sends: { reverb: 0.24, delay: 0.18 }, defaultNote: 72,
    fx: [{ type: 'crush', bits: 5, reduction: 6, jitter: 0.35, mix: 0.7 }]
  }
];
