/* Sequences and gates.
 *
 * These are single voices like everything else in the rack — the sequencer is
 * still the sequencer. What makes them a family is that the rhythm lives
 * inside the patch: a trance gate chopping a held chord, an LFO on the amp, a
 * delay tuned so one note becomes a run. Hold a whole bar on one of these and
 * it plays a pattern back at you.
 *
 * Gate patterns are 8 slots long and loop; `shape` is how hard the edges are. */

import { env } from './shared.js';

export const SEQ = [
  {
    id: 'seq_gate16', name: 'Gate 16ths', tags: ['gate', 'saw'],
    oscs: [{ wave: 'saw', level: 0.55, unison: 3, spread: 12 }],
    filter: { type: 'lowpass', cutoff: 3200, q: 2.2, env: 1.2, keytrack: 0.5 },
    ampEnv: env(0.004, 0.3, 0.9, 0.08), filtEnv: env(0.01, 0.4, 0.5, 0.12),
    gain: 0.4, sends: { reverb: 0.16, delay: 0.14 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 1, shape: 0.12, pattern: [1, 1, 1, 1, 1, 1, 1, 1] }]
  },
  {
    id: 'seq_gate8', name: 'Gate 8ths', tags: ['gate', 'pad'],
    oscs: [{ wave: 'saw', level: 0.5, unison: 4, spread: 16 }, { wave: 'square', level: 0.2, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 1.6, env: 1, keytrack: 0.4 },
    ampEnv: env(0.01, 0.4, 0.9, 0.14), filtEnv: env(0.02, 0.5, 0.6, 0.16),
    gain: 0.4, sends: { reverb: 0.24, delay: 0.1 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 1, shape: 0.25, pattern: [1, 0, 1, 0, 1, 0, 1, 0] }]
  },
  {
    id: 'seq_trance', name: 'Trance Gate', tags: ['gate', 'supersaw'],
    oscs: [{ wave: 'saw', level: 0.5, unison: 7, spread: 26, width: 0.9 }],
    filter: { type: 'lowpass', cutoff: 4200, q: 1.4, env: 0.9, keytrack: 0.4 },
    ampEnv: env(0.02, 0.6, 0.95, 0.24), filtEnv: env(0.05, 0.8, 0.7, 0.2),
    gain: 0.34, sends: { reverb: 0.3, delay: 0.16 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 0.95, shape: 0.35, pattern: [1, 0, 1, 1, 0, 1, 0, 1] }]
  },
  {
    id: 'seq_stutter', name: 'Stutter Gate', tags: ['gate', 'glitch'],
    oscs: [{ wave: 'razor', level: 0.6, unison: 2, spread: 8 }],
    filter: { type: 'lowpass', cutoff: 3600, q: 3, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.002, 0.3, 0.9, 0.05), filtEnv: env(0.006, 0.3, 0.4, 0.1),
    gain: 0.38, sends: { delay: 0.2 }, defaultNote: 55,
    fx: [
      { type: 'gate', depth: 1, shape: 0.04, pattern: [1, 1, 0, 1, 1, 1, 0, 1] },
      { type: 'crush', bits: 9, reduction: 2, mix: 0.4 }
    ]
  },
  {
    id: 'seq_arpup', name: 'Arp Cascade', tags: ['arp', 'delay'],
    oscs: [{ wave: 'square', level: 0.6 }, { wave: 'saw', level: 0.25, cent: 8 }],
    filter: { type: 'lowpass', cutoff: 4000, q: 2.6, env: 2, keytrack: 0.7 },
    ampEnv: env(0.001, 0.09, 0.0, 0.03), filtEnv: env(0.002, 0.12, 0.1, 0.04),
    gain: 0.7, sends: { reverb: 0.2, delay: 0.38 }, defaultNote: 64,
    fx: [{ type: 'delay', timeL: 0.075, timeR: 0.15, feedback: 0.62, damp: 5200, mix: 0.44 }]
  },
  {
    id: 'seq_pulsegate', name: 'Pulse Gate', tags: ['gate', 'hollow'],
    oscs: [{ wave: 'pulse25', level: 0.7 }],
    filter: { type: 'lowpass', cutoff: 3000, q: 2.4, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.003, 0.3, 0.9, 0.07), filtEnv: env(0.01, 0.35, 0.5, 0.1),
    gain: 0.45, sends: { delay: 0.18 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 1, shape: 0.1, pattern: [1, 1, 0, 0, 1, 1, 0, 1] }]
  },
  {
    id: 'seq_chopchord', name: 'Chopped Chord', tags: ['gate', 'chord'],
    oscs: [
      { wave: 'saw', level: 0.4 },
      { wave: 'saw', level: 0.34, semi: 3 },
      { wave: 'saw', level: 0.3, semi: 7 }
    ],
    filter: { type: 'lowpass', cutoff: 2800, q: 1.4, env: 0.8, keytrack: 0.4 },
    ampEnv: env(0.006, 0.4, 0.9, 0.1), filtEnv: env(0.02, 0.5, 0.6, 0.14),
    gain: 0.36, sends: { reverb: 0.22, delay: 0.12 }, defaultNote: 52,
    fx: [{ type: 'gate', depth: 1, shape: 0.18, pattern: [1, 0, 0, 1, 0, 1, 0, 0] }]
  },
  {
    id: 'seq_offbeat', name: 'Offbeat Stab', tags: ['gate', 'house'],
    oscs: [{ wave: 'saw', level: 0.5, unison: 3, spread: 14 }, { wave: 'square', level: 0.2, semi: 7 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 2.8, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.004, 0.3, 0.85, 0.08), filtEnv: env(0.01, 0.3, 0.4, 0.1),
    gain: 0.42, sends: { reverb: 0.26, delay: 0.14 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 1, shape: 0.2, pattern: [0, 1, 0, 1, 0, 1, 0, 1] }]
  },
  {
    id: 'seq_triplet', name: 'Triplet Gate', tags: ['gate', 'swing'],
    oscs: [{ wave: 'saw', level: 0.55, unison: 2, spread: 10 }],
    filter: { type: 'lowpass', cutoff: 3000, q: 2, env: 1.2, keytrack: 0.5 },
    ampEnv: env(0.004, 0.3, 0.9, 0.08), filtEnv: env(0.01, 0.35, 0.5, 0.1),
    gain: 0.42, sends: { reverb: 0.2, delay: 0.16 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 1, shape: 0.14, pattern: [1, 0, 0, 1, 0, 0, 1, 0] }]
  },
  {
    id: 'seq_ratchet', name: 'Ratchet Gate', tags: ['gate', 'fast'],
    oscs: [{ wave: 'razor', level: 0.65 }],
    filter: { type: 'lowpass', cutoff: 4400, q: 3.2, env: 1.8, keytrack: 0.6 },
    ampEnv: env(0.001, 0.25, 0.85, 0.04), filtEnv: env(0.004, 0.25, 0.4, 0.07),
    gain: 0.4, sends: { delay: 0.22 }, defaultNote: 60,
    fx: [{ type: 'gate', depth: 1, shape: 0.03, pattern: [1, 1, 1, 1, 1, 1, 1, 1] }]
  },
  {
    id: 'seq_rolling', name: 'Rolling Bass', tags: ['gate', 'bass'],
    oscs: [{ wave: 'saw', level: 0.55 }],
    sub: { wave: 'sine', oct: -1, level: 0.5, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 1100, q: 3.4, env: 1.6, keytrack: 0.4 },
    ampEnv: env(0.003, 0.3, 0.9, 0.06), filtEnv: env(0.006, 0.25, 0.3, 0.08),
    gain: 0.42, defaultNote: 36,
    fx: [{ type: 'gate', depth: 0.9, shape: 0.15, pattern: [1, 1, 0, 1, 1, 0, 1, 0] }]
  },
  {
    id: 'seq_acidseq', name: 'Acid Sequence', tags: ['acid', 'gate'],
    oscs: [{ wave: 'saw', level: 0.7 }],
    filter: { type: 'lowpass', cutoff: 620, q: 9, env: 3, keytrack: 0.5 },
    ampEnv: env(0.002, 0.3, 0.7, 0.05), filtEnv: env(0.004, 0.24, 0.15, 0.09),
    shaper: { curve: 'tube', drive: 0.34 },
    gain: 0.55, sends: { delay: 0.2 }, defaultNote: 40,
    fx: [{ type: 'gate', depth: 0.85, shape: 0.1, pattern: [1, 1, 1, 0, 1, 1, 0, 1] }]
  },
  {
    id: 'seq_bleepseq', name: 'Bleep Run', tags: ['chip', 'gate'],
    oscs: [{ wave: 'pulse12', level: 0.8 }],
    filter: { type: 'lowpass', cutoff: 6000, q: 1.2, env: 0.8, keytrack: 0.7 },
    ampEnv: env(0.001, 0.2, 0.8, 0.02), filtEnv: env(0.002, 0.2, 0.6, 0.04),
    gain: 0.42, sends: { delay: 0.28 }, defaultNote: 76,
    fx: [
      { type: 'gate', depth: 1, shape: 0.02, pattern: [1, 0, 1, 1, 0, 1, 1, 0] },
      { type: 'crush', bits: 5, reduction: 3, mix: 0.9 }
    ]
  },
  {
    id: 'seq_dubchord', name: 'Dub Skank', tags: ['chord', 'dub'],
    oscs: [
      { wave: 'organ', level: 0.45 },
      { wave: 'organ', level: 0.4, semi: 3 },
      { wave: 'organ', level: 0.35, semi: 7 }
    ],
    filter: { type: 'lowpass', cutoff: 1900, q: 1.6, env: 1, keytrack: 0.5 },
    ampEnv: env(0.006, 0.14, 0.0, 0.05), filtEnv: env(0.008, 0.16, 0.1, 0.06),
    gain: 0.62, sends: { reverb: 0.3, delay: 0.46 }, defaultNote: 52,
    fx: [{ type: 'delay', timeL: 0.26, timeR: 0.38, feedback: 0.56, damp: 2400, mix: 0.4 }]
  },
  {
    id: 'seq_housestab', name: 'House Stab', tags: ['stab', 'chord'],
    oscs: [
      { wave: 'saw', level: 0.4 },
      { wave: 'saw', level: 0.36, semi: 4 },
      { wave: 'saw', level: 0.32, semi: 7 },
      { wave: 'saw', level: 0.26, semi: 11 }
    ],
    filter: { type: 'lowpass', cutoff: 2600, q: 3, env: 2, keytrack: 0.4 },
    ampEnv: env(0.003, 0.2, 0.0, 0.06), filtEnv: env(0.004, 0.16, 0.05, 0.07),
    gain: 0.52, sends: { reverb: 0.3, delay: 0.2 }, defaultNote: 52
  },
  {
    id: 'seq_technoloop', name: 'Techno Loop', tags: ['gate', 'dark'],
    oscs: [{ wave: 'grind', level: 0.55 }],
    filter: { type: 'lowpass', cutoff: 1500, q: 3.6, env: 1.8, keytrack: 0.4 },
    ampEnv: env(0.003, 0.3, 0.9, 0.06), filtEnv: env(0.008, 0.3, 0.3, 0.1),
    lfo: { wave: 'sine', rate: 0.25, depth: 0.5, target: 'filter' },
    shaper: { curve: 'saturate', drive: 0.3 },
    gain: 0.42, sends: { reverb: 0.2, delay: 0.18 }, defaultNote: 43,
    fx: [{ type: 'gate', depth: 0.9, shape: 0.12, pattern: [1, 0, 1, 1, 1, 0, 1, 1] }]
  },
  {
    id: 'seq_shufflegate', name: 'Shuffle Gate', tags: ['gate', 'swing'],
    oscs: [{ wave: 'saw', level: 0.5, unison: 3, spread: 12 }],
    filter: { type: 'lowpass', cutoff: 2800, q: 2, env: 1.2, keytrack: 0.5 },
    ampEnv: env(0.004, 0.3, 0.9, 0.08), filtEnv: env(0.01, 0.3, 0.5, 0.1),
    gain: 0.42, sends: { reverb: 0.2, delay: 0.16 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 1, shape: 0.22, pattern: [1, 0, 0, 1, 1, 0, 1, 0] }]
  },
  {
    id: 'seq_halfgate', name: 'Half Gate', tags: ['gate', 'soft'],
    oscs: [{ wave: 'saw', level: 0.45, unison: 4, spread: 18 }],
    filter: { type: 'lowpass', cutoff: 2200, q: 1.2, env: 0.8, keytrack: 0.4 },
    ampEnv: env(0.02, 0.5, 0.95, 0.2), filtEnv: env(0.05, 0.6, 0.7, 0.2),
    gain: 0.42, sends: { reverb: 0.34, delay: 0.12 }, defaultNote: 55,
    fx: [{ type: 'gate', depth: 0.55, shape: 0.5, pattern: [1, 0, 1, 0, 1, 0, 1, 0] }]
  },
  {
    id: 'seq_glitchgate', name: 'Glitch Gate', tags: ['gate', 'digital'],
    oscs: [{ wave: 'wire', level: 0.6 }],
    filter: { type: 'bandpass', cutoff: 2000, q: 2, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.001, 0.25, 0.85, 0.03), filtEnv: env(0.004, 0.25, 0.4, 0.06),
    gain: 0.7, sends: { delay: 0.24 }, defaultNote: 64,
    fx: [
      { type: 'gate', depth: 1, shape: 0.02, pattern: [1, 1, 0, 1, 0, 0, 1, 1] },
      { type: 'crush', bits: 6, reduction: 4, jitter: 0.2, mix: 0.7 }
    ]
  },
  {
    id: 'seq_pumper', name: 'Pumper', tags: ['sidechain', 'pad'],
    oscs: [{ wave: 'saw', level: 0.45, unison: 5, spread: 22 }, { wave: 'sine', level: 0.25, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 1.2, env: 0.8, keytrack: 0.4 },
    ampEnv: env(0.03, 0.6, 0.95, 0.3), filtEnv: env(0.06, 0.8, 0.7, 0.24),
    lfo: { wave: 'saw', rate: 2, depth: 0.75, target: 'amp' },
    gain: 0.4, sends: { reverb: 0.3 }, defaultNote: 48
  },
  {
    id: 'seq_strobe', name: 'Strobe', tags: ['gate', 'fast'],
    oscs: [{ wave: 'square', level: 0.6 }],
    filter: { type: 'lowpass', cutoff: 5000, q: 1.4, env: 1, keytrack: 0.6 },
    ampEnv: env(0.001, 0.3, 0.9, 0.03), filtEnv: env(0.004, 0.3, 0.6, 0.06),
    lfo: { wave: 'square', rate: 16, depth: 0.9, target: 'amp' },
    gain: 0.4, sends: { reverb: 0.18, delay: 0.14 }, defaultNote: 67
  },
  {
    id: 'seq_morse', name: 'Morse', tags: ['gate', 'radio'],
    oscs: [{ wave: 'sine', level: 0.9 }],
    filter: { type: 'bandpass', cutoff: 1400, q: 1, env: 0.4, keytrack: 0.8 },
    ampEnv: env(0.002, 0.2, 0.9, 0.02), filtEnv: env(0.004, 0.2, 0.7, 0.04),
    gain: 1.6, sends: { reverb: 0.2, delay: 0.2 }, defaultNote: 76,
    fx: [{ type: 'gate', depth: 1, shape: 0.02, pattern: [1, 0, 1, 1, 1, 0, 1, 0] }]
  },
  {
    id: 'seq_pingpong', name: 'Ping Pong Seq', tags: ['delay', 'wide'],
    oscs: [{ wave: 'triangle', level: 0.7 }, { wave: 'glass', level: 0.25, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 4600, q: 1.6, env: 1.4, keytrack: 0.7 },
    ampEnv: env(0.001, 0.12, 0.0, 0.04), filtEnv: env(0.002, 0.14, 0.1, 0.05),
    gain: 0.75, sends: { reverb: 0.3, delay: 0.42 }, defaultNote: 72,
    fx: [{ type: 'delay', timeL: 0.12, timeR: 0.24, feedback: 0.58, damp: 6400, mix: 0.46 }]
  },
  {
    id: 'seq_cascade', name: 'Cascade', tags: ['delay', 'arp'],
    oscs: [{ wave: 'glass', level: 0.55 }, { wave: 'sine', level: 0.4, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 5200, q: 1.4, env: 1.6, keytrack: 0.8 },
    ampEnv: env(0.001, 0.1, 0.0, 0.04), filtEnv: env(0.002, 0.12, 0.1, 0.05),
    gain: 0.85, sends: { reverb: 0.4, delay: 0.46 }, defaultNote: 79,
    fx: [
      { type: 'delay', timeL: 0.09, timeR: 0.135, feedback: 0.68, damp: 7200, mix: 0.5 },
      { type: 'width', width: 1.4 }
    ]
  }
];
