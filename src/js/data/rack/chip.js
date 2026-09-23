/* Chip and console voices.
 *
 * The old sound chips had almost no signal path: a handful of fixed duty
 * cycles, one triangle, one noise channel, and on the SID a resonant filter
 * shared by everything. So these patches keep the chain deliberately short —
 * no unison, no drive, tiny envelopes — and get their character from the
 * waveform and from bitcrushing the output back down to period resolution. */

import { env } from './shared.js';

export const CHIP = [
  {
    id: 'chp_pulse12', name: 'Pulse 12%', tags: ['nes', 'thin'],
    oscs: [{ wave: 'pulse12', level: 1 }],
    filter: { type: 'lowpass', cutoff: 9000, q: 0.5, env: 0.2, keytrack: 0.7 },
    ampEnv: env(0.001, 0.06, 0.75, 0.02), filtEnv: env(0.001, 0.1, 0.7, 0.02),
    gain: 0.4, defaultNote: 72,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_pulse25', name: 'Pulse 25%', tags: ['nes', 'hollow'],
    oscs: [{ wave: 'pulse25', level: 1 }],
    filter: { type: 'lowpass', cutoff: 9000, q: 0.5, env: 0.2, keytrack: 0.7 },
    ampEnv: env(0.001, 0.06, 0.78, 0.02), filtEnv: env(0.001, 0.1, 0.7, 0.02),
    gain: 0.4, defaultNote: 72,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_square50', name: 'Square 50%', tags: ['nes', 'full'],
    oscs: [{ wave: 'square', level: 1 }],
    filter: { type: 'lowpass', cutoff: 9000, q: 0.5, env: 0.2, keytrack: 0.7 },
    ampEnv: env(0.001, 0.06, 0.8, 0.02), filtEnv: env(0.001, 0.1, 0.7, 0.02),
    gain: 0.38, defaultNote: 72,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_triangle', name: 'Chip Triangle', tags: ['nes', 'bass'],
    /* The NES triangle was 4-bit and unfiltered — that stepping is the sound. */
    oscs: [{ wave: 'triangle', level: 1 }],
    filter: { type: 'lowpass', cutoff: 6000, q: 0.5, env: 0.2, keytrack: 0.7 },
    ampEnv: env(0.001, 0.05, 0.9, 0.015), filtEnv: env(0.001, 0.1, 0.8, 0.02),
    gain: 0.6, defaultNote: 48,
    fx: [{ type: 'crush', bits: 4, reduction: 2, mix: 1 }]
  },
  {
    id: 'chp_noise', name: 'Chip Noise', tags: ['nes', 'percussive'],
    oscs: [{ wave: 'sine', level: 0.04 }],
    noise: { color: 'white', level: 0.9, hp: 400 },
    filter: { type: 'bandpass', cutoff: 2200, q: 1.1, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.001, 0.12, 0.0, 0.03), filtEnv: env(0.001, 0.08, 0.05, 0.03),
    gain: 0.7, defaultNote: 60,
    fx: [{ type: 'crush', bits: 3, reduction: 5, mix: 1 }]
  },
  {
    id: 'chp_arp', name: 'Chip Arp', tags: ['arp', 'fast'],
    oscs: [{ wave: 'pulse25', level: 1 }],
    filter: { type: 'lowpass', cutoff: 8000, q: 0.6, env: 0.4, keytrack: 0.7 },
    ampEnv: env(0.001, 0.035, 0.0, 0.012), filtEnv: env(0.001, 0.04, 0.2, 0.012),
    gain: 0.8, sends: { delay: 0.2 }, defaultNote: 79,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_bass', name: 'Chip Bass', tags: ['bass', 'square'],
    oscs: [{ wave: 'square', level: 1 }],
    sub: { wave: 'triangle', oct: -1, level: 0.4 },
    filter: { type: 'lowpass', cutoff: 2200, q: 0.8, env: 0.6, keytrack: 0.5 },
    ampEnv: env(0.001, 0.1, 0.85, 0.02), filtEnv: env(0.001, 0.12, 0.6, 0.02),
    gain: 0.5, poly: 1, defaultNote: 36,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_lead', name: 'Chip Lead', tags: ['lead', 'vibrato'],
    oscs: [{ wave: 'pulse25', level: 1 }],
    filter: { type: 'lowpass', cutoff: 9500, q: 0.5, env: 0.3, keytrack: 0.7 },
    ampEnv: env(0.001, 0.08, 0.8, 0.02), filtEnv: env(0.001, 0.12, 0.7, 0.02),
    lfo: { wave: 'sine', rate: 7.5, depth: 0.2, target: 'pitch', delay: 0.12, fade: 0.06 },
    gain: 0.42, sends: { delay: 0.16 }, defaultNote: 76,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_sid_saw', name: 'SID Saw', tags: ['c64', 'buzzy'],
    oscs: [{ wave: 'sawtooth', level: 0.9 }, { wave: 'pulse25', level: 0.4, cent: 12 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 2.6, env: 1.4, keytrack: 0.6 },
    ampEnv: env(0.001, 0.14, 0.75, 0.04), filtEnv: env(0.002, 0.16, 0.5, 0.04),
    gain: 0.44, defaultNote: 64,
    fx: [{ type: 'crush', bits: 6, reduction: 2, mix: 0.9 }]
  },
  {
    id: 'chp_sid_ring', name: 'SID Ring', tags: ['c64', 'metallic'],
    oscs: [{ wave: 'triangle', level: 0.9 }],
    filter: { type: 'bandpass', cutoff: 1800, q: 1.6, env: 1.4, keytrack: 0.6 },
    ampEnv: env(0.001, 0.2, 0.6, 0.05), filtEnv: env(0.002, 0.2, 0.4, 0.05),
    gain: 1.35, defaultNote: 64,
    fx: [
      { type: 'ring', freq: 233, mix: 0.6 },
      { type: 'crush', bits: 6, reduction: 2, mix: 0.8 }
    ]
  },
  {
    id: 'chp_sid_filter', name: 'SID Filter', tags: ['c64', 'sweep'],
    oscs: [{ wave: 'pulse12', level: 0.9 }, { wave: 'sawtooth', level: 0.4, cent: -14 }],
    filter: { type: 'lowpass', cutoff: 700, q: 7, env: 3, keytrack: 0.5, poles: 4 },
    ampEnv: env(0.002, 0.3, 0.7, 0.06), filtEnv: env(0.004, 0.3, 0.2, 0.06),
    gain: 0.5, defaultNote: 55,
    fx: [{ type: 'crush', bits: 6, reduction: 2, mix: 0.8 }]
  },
  {
    id: 'chp_gb_wave', name: 'Wave Channel', tags: ['gameboy', 'soft'],
    /* The Game Boy's fourth channel played a 32-step, 4-bit wavetable. */
    oscs: [{ wave: 'hollow', level: 1 }],
    filter: { type: 'lowpass', cutoff: 5200, q: 0.7, env: 0.3, keytrack: 0.7 },
    ampEnv: env(0.002, 0.1, 0.85, 0.03), filtEnv: env(0.002, 0.14, 0.7, 0.03),
    gain: 0.5, defaultNote: 64,
    fx: [{ type: 'crush', bits: 4, reduction: 4, mix: 1 }]
  },
  {
    id: 'chp_fm_bell', name: 'FM Console Bell', tags: ['ym2612', 'bright'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 3.5, index: 3.4, decay: 0.12, sustain: 0.04 },
    filter: { type: 'lowpass', cutoff: 7000, q: 0.8, env: 0.6, keytrack: 0.7 },
    ampEnv: env(0.001, 0.7, 0.0, 0.2), filtEnv: env(0.001, 0.26, 0.08, 0.12),
    gain: 0.48, sends: { delay: 0.2 }, defaultNote: 76,
    fx: [{ type: 'crush', bits: 9, reduction: 2, mix: 0.7 }]
  },
  {
    id: 'chp_fm_bass', name: 'FM Console Bass', tags: ['ym2612', 'punch'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 1.0, index: 4.2, decay: 0.09, sustain: 0.18 },
    filter: { type: 'lowpass', cutoff: 1500, q: 1.4, env: 1.2, keytrack: 0.5 },
    ampEnv: env(0.001, 0.26, 0.5, 0.07), filtEnv: env(0.002, 0.16, 0.2, 0.06),
    gain: 0.66, poly: 1, defaultNote: 36,
    fx: [{ type: 'crush', bits: 9, reduction: 2, mix: 0.7 }]
  },
  {
    id: 'chp_fm_brass', name: 'FM Console Brass', tags: ['ym2612', 'fat'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'sawtooth', level: 0.3, cent: 8 }],
    fm: { ratio: 2.0, index: 2.6, decay: 0.3, sustain: 0.45 },
    filter: { type: 'lowpass', cutoff: 2400, q: 1.8, env: 1.8, keytrack: 0.55 },
    ampEnv: env(0.02, 0.24, 0.85, 0.12), filtEnv: env(0.05, 0.3, 0.45, 0.12),
    gain: 0.5, defaultNote: 60,
    fx: [{ type: 'crush', bits: 9, reduction: 2, mix: 0.7 }]
  },
  {
    id: 'chp_pling', name: 'Pling', tags: ['blip', 'short'],
    oscs: [{ wave: 'square', level: 1 }],
    filter: { type: 'highpass', cutoff: 500, q: 0.8, env: 0.4, keytrack: 0.7 },
    ampEnv: env(0.001, 0.05, 0.0, 0.015), filtEnv: env(0.001, 0.04, 0.1, 0.015),
    pitchEnv: { amt: 5, d: 0.03 },
    gain: 0.5, defaultNote: 84,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_coin', name: 'Coin', tags: ['sfx', 'arcade'],
    oscs: [{ wave: 'square', level: 1 }],
    filter: { type: 'highpass', cutoff: 700, q: 0.7, env: 0.3, keytrack: 0.7 },
    ampEnv: env(0.001, 0.26, 0.0, 0.04), filtEnv: env(0.001, 0.2, 0.2, 0.04),
    /* Up a fifth after a beat — the classic two-note coin. */
    pitchEnv: { amt: -7, d: 0.07 },
    gain: 0.52, defaultNote: 84,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_jump', name: 'Jump', tags: ['sfx', 'arcade'],
    oscs: [{ wave: 'pulse25', level: 1 }],
    filter: { type: 'lowpass', cutoff: 9000, q: 0.6, env: 0.3, keytrack: 0.7 },
    ampEnv: env(0.001, 0.18, 0.0, 0.03), filtEnv: env(0.001, 0.14, 0.2, 0.03),
    pitchEnv: { amt: -18, d: 0.14 },
    gain: 0.5, defaultNote: 67,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  },
  {
    id: 'chp_hurt', name: 'Hurt Blip', tags: ['sfx', 'noisy'],
    oscs: [{ wave: 'square', level: 0.6 }],
    noise: { color: 'white', level: 0.5, hp: 700 },
    filter: { type: 'bandpass', cutoff: 1400, q: 1.2, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.001, 0.2, 0.0, 0.04), filtEnv: env(0.001, 0.16, 0.1, 0.04),
    pitchEnv: { amt: 14, d: 0.16 },
    gain: 0.76, defaultNote: 55,
    fx: [{ type: 'crush', bits: 3, reduction: 5, mix: 1 }]
  },
  {
    id: 'chp_powerup', name: 'Power Up', tags: ['sfx', 'rise'],
    oscs: [{ wave: 'pulse12', level: 1 }],
    filter: { type: 'lowpass', cutoff: 9500, q: 0.6, env: 0.6, keytrack: 0.7 },
    ampEnv: env(0.002, 0.5, 0.4, 0.06), filtEnv: env(0.004, 0.4, 0.5, 0.06),
    pitchEnv: { amt: -24, d: 0.42 },
    gain: 0.48, sends: { delay: 0.14 }, defaultNote: 72,
    fx: [{ type: 'crush', bits: 4, reduction: 3, mix: 1 }]
  }
];
