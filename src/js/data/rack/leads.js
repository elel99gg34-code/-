/* Leads — the top line.
 * Field reference for these objects lives in ../instruments.js. */

import { env } from './shared.js';

export const LEADS = [
  {
    id: 'lead_razor', name: 'Razorwire', tags: ['saw', 'aggressive'],
    oscs: [{ wave: 'razor', level: 1, unison: 3, spread: 14, width: 0.6 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 4, env: 2, keytrack: 0.5, velToEnv: 0.6 },
    ampEnv: env(0.004, 0.2, 0.75, 0.12), filtEnv: env(0.003, 0.18, 0.3, 0.1),
    shaper: { curve: 'tube', drive: 0.4 }, gain: 0.44, sends: { delay: 0.12 }, defaultNote: 64
  },
  {
    id: 'lead_supersaw', name: 'Supersaw', tags: ['wide', 'trance'],
    oscs: [
      { wave: 'sawtooth', level: 0.9, unison: 7, spread: 24, width: 0.95 },
      { wave: 'sawtooth', level: 0.3, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 3400, q: 1.6, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.01, 0.3, 0.85, 0.2), filtEnv: env(0.02, 0.4, 0.4, 0.2),
    shaper: { curve: 'soft', drive: 0.2 }, gain: 0.34, sends: { reverb: 0.2, delay: 0.14 }, defaultNote: 64
  },
  {
    id: 'lead_square', name: 'Square Riot', tags: ['chip', 'hollow'],
    oscs: [{ wave: 'square', level: 1 }, { wave: 'pulse25', level: 0.4, cent: 8 }],
    filter: { type: 'lowpass', cutoff: 3200, q: 3, env: 1.8, keytrack: 0.5 },
    ampEnv: env(0.002, 0.16, 0.7, 0.08), filtEnv: env(0.002, 0.14, 0.25, 0.08),
    shaper: { curve: 'hard', drive: 0.35 }, gain: 0.42, defaultNote: 67
  },
  {
    id: 'lead_chip', name: 'Chiptune', tags: ['8bit', 'retro'],
    oscs: [{ wave: 'pulse12', level: 1 }],
    filter: { type: 'lowpass', cutoff: 8000, q: 0.5, env: 0.4, keytrack: 0.6 },
    ampEnv: env(0.001, 0.09, 0.55, 0.04), filtEnv: env(0.001, 0.1, 0.5, 0.04),
    lfo: { wave: 'square', rate: 11, depth: 0.14, target: 'pitch', delay: 0.06, fade: 0.04 },
    gain: 0.4, defaultNote: 72, fx: [{ type: 'crush', bits: 6, reduction: 3, mix: 0.7 }]
  },
  {
    id: 'lead_acidlead', name: 'Acid Lead', tags: ['acid', 'squelch'],
    oscs: [{ wave: 'sawtooth', level: 1 }],
    filter: { type: 'lowpass', cutoff: 900, q: 15, env: 3.2, keytrack: 0.35, velToEnv: 0.85, poles: 4 },
    ampEnv: env(0.002, 0.3, 0.1, 0.06), filtEnv: env(0.002, 0.22, 0.06, 0.06),
    shaper: { curve: 'diode', drive: 0.45 }, glide: 0.04, gain: 0.44, poly: 1, sends: { delay: 0.18 }, defaultNote: 60
  },
  {
    id: 'lead_fm_bell', name: 'FM Bell Lead', tags: ['fm', 'bright'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 3.5, index: 4.2, decay: 0.32, sustain: 0.1 },
    filter: { type: 'lowpass', cutoff: 7000, q: 0.8, env: 0.8, keytrack: 0.6 },
    ampEnv: env(0.002, 0.7, 0.2, 0.3), filtEnv: env(0.002, 0.4, 0.2, 0.2),
    gain: 0.44, sends: { reverb: 0.24, delay: 0.16 }, defaultNote: 72
  },
  {
    id: 'lead_fm_metal', name: 'FM Metal', tags: ['fm', 'harsh'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 7.03, index: 6.5, wave: 'square', decay: 0.18, sustain: 0.45 },
    filter: { type: 'lowpass', cutoff: 4200, q: 2.4, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.003, 0.25, 0.7, 0.14), filtEnv: env(0.004, 0.2, 0.3, 0.12),
    shaper: { curve: 'fold', drive: 0.35 }, gain: 0.38, defaultNote: 64
  },
  {
    id: 'lead_hoover', name: 'Hoover', tags: ['rave', 'classic'],
    oscs: [
      { wave: 'sawtooth', level: 0.8, unison: 3, spread: 18 },
      { wave: 'pulse25', level: 0.5, semi: -12, unison: 2, spread: 10 },
      { wave: 'sawtooth', level: 0.4, semi: 7, cent: 10 }
    ],
    filter: { type: 'lowpass', cutoff: 2800, q: 3.6, env: 1.6, keytrack: 0.4 },
    ampEnv: env(0.006, 0.3, 0.8, 0.16), filtEnv: env(0.01, 0.3, 0.4, 0.14),
    pitchEnv: { amt: 0.7, d: 0.14 },
    shaper: { curve: 'tube', drive: 0.45 }, gain: 0.34, sends: { reverb: 0.2 }, defaultNote: 55
  },
  {
    id: 'lead_saw5th', name: 'Fifth Stack', tags: ['wide', 'power'],
    oscs: [{ wave: 'fifth', level: 1, unison: 3, spread: 16, width: 0.8 }],
    filter: { type: 'lowpass', cutoff: 3000, q: 2.2, env: 1.5, keytrack: 0.5 },
    ampEnv: env(0.006, 0.25, 0.8, 0.14), filtEnv: env(0.008, 0.25, 0.35, 0.12),
    shaper: { curve: 'tube', drive: 0.38 }, gain: 0.36, sends: { delay: 0.12 }, defaultNote: 60
  },
  {
    id: 'lead_vox', name: 'Vox Machine', tags: ['formant', 'vocal'],
    oscs: [{ wave: 'vox', level: 1, unison: 2, spread: 9 }],
    filter: { type: 'bandpass', cutoff: 1100, q: 4.5, env: 1.8, keytrack: 0.55, poles: 4 },
    ampEnv: env(0.02, 0.35, 0.85, 0.2), filtEnv: env(0.04, 0.4, 0.4, 0.2),
    lfo: { wave: 'sine', rate: 5.2, depth: 0.1, target: 'pitch', delay: 0.25, fade: 0.3 },
    gain: 0.42, sends: { reverb: 0.26, delay: 0.14 }, defaultNote: 64
  },
  {
    id: 'lead_glitch', name: 'Glitch Lead', tags: ['digital', 'crushed'],
    oscs: [{ wave: 'wire', level: 1 }, { wave: 'square', level: 0.4, oct: 1 }],
    filter: { type: 'highpass', cutoff: 320, q: 2, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.001, 0.12, 0.4, 0.05), filtEnv: env(0.001, 0.1, 0.2, 0.05),
    gain: 0.4, defaultNote: 72,
    fx: [{ type: 'crush', bits: 5, reduction: 6, jitter: 0.2, mix: 0.8 }]
  },
  {
    id: 'lead_pluckdist', name: 'Distorted Pluck', tags: ['pluck', 'punk'],
    oscs: [{ wave: 'razor', level: 1, unison: 2, spread: 8 }],
    filter: { type: 'lowpass', cutoff: 1400, q: 6, env: 3, keytrack: 0.5, velToEnv: 0.8 },
    ampEnv: env(0.001, 0.26, 0.04, 0.1), filtEnv: env(0.001, 0.16, 0.05, 0.08),
    shaper: { curve: 'fuzz', drive: 0.6 }, gain: 0.44, sends: { delay: 0.2, reverb: 0.14 }, defaultNote: 67
  },
  {
    id: 'lead_siren', name: 'Air Raid', tags: ['fx', 'sweep'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 2, spread: 10 }, { wave: 'square', level: 0.4, semi: 7 }],
    filter: { type: 'bandpass', cutoff: 1400, q: 5, env: 2, keytrack: 0.3 },
    ampEnv: env(0.08, 0.5, 0.9, 0.4), filtEnv: env(0.2, 0.6, 0.6, 0.3),
    lfo: { wave: 'triangle', rate: 0.55, depth: 6, target: 'pitch', fade: 0.3 },
    shaper: { curve: 'tube', drive: 0.4 }, gain: 0.38, sends: { reverb: 0.3 }, defaultNote: 60
  },
  {
    id: 'lead_flute', name: 'Ghost Flute', tags: ['soft', 'breathy'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'triangle', level: 0.25, oct: 1 }],
    noise: { color: 'pink', level: 0.18, bp: 2400, q: 1.1, keytrack: true },
    filter: { type: 'lowpass', cutoff: 2600, q: 1, env: 1, keytrack: 0.7 },
    ampEnv: env(0.06, 0.3, 0.9, 0.24), filtEnv: env(0.1, 0.3, 0.6, 0.2),
    lfo: { wave: 'sine', rate: 5, depth: 0.08, target: 'pitch', delay: 0.3, fade: 0.4 },
    gain: 0.46, sends: { reverb: 0.34, delay: 0.12 }, defaultNote: 72
  },
  {
    id: 'lead_brass', name: 'Riot Brass', tags: ['brass', 'fat'],
    oscs: [{ wave: 'sawtooth', level: 0.9, unison: 3, spread: 11 }, { wave: 'reed', level: 0.4, cent: -6 }],
    filter: { type: 'lowpass', cutoff: 1200, q: 2.6, env: 2.4, keytrack: 0.5, velToEnv: 0.7 },
    ampEnv: env(0.03, 0.3, 0.85, 0.16), filtEnv: env(0.05, 0.35, 0.4, 0.16),
    shaper: { curve: 'tube', drive: 0.35 }, gain: 0.4, sends: { reverb: 0.2 }, defaultNote: 60
  },
  {
    id: 'lead_organ', name: 'Riot Organ', tags: ['organ', 'retro'],
    oscs: [{ wave: 'organ', level: 1 }, { wave: 'sine', level: 0.3, oct: 1, cent: 3 }],
    filter: { type: 'lowpass', cutoff: 4200, q: 0.8, env: 0.5, keytrack: 0.6 },
    ampEnv: env(0.006, 0.1, 0.95, 0.06), filtEnv: env(0.01, 0.2, 0.8, 0.06),
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.42, sends: { reverb: 0.18 }, defaultNote: 60,
    fx: [{ type: 'autopan', mode: 'trem', rate: 6.2, depth: 0.35 }]
  },
  {
    id: 'lead_theremin', name: 'Theremin', tags: ['smooth', 'glide'],
    oscs: [{ wave: 'sine', level: 1 }],
    filter: { type: 'lowpass', cutoff: 3200, q: 0.7, env: 0.6, keytrack: 0.8 },
    ampEnv: env(0.08, 0.3, 0.95, 0.3), filtEnv: env(0.1, 0.3, 0.7, 0.2),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.22, target: 'pitch', delay: 0.2, fade: 0.35 },
    glide: 0.11, gain: 0.5, poly: 1, sends: { reverb: 0.36, delay: 0.16 }, defaultNote: 72
  },
  {
    id: 'lead_stab', name: 'Rave Stab', tags: ['stab', 'short'],
    oscs: [
      { wave: 'sawtooth', level: 0.8, unison: 2, spread: 12 },
      { wave: 'square', level: 0.5, semi: 3 },
      { wave: 'sawtooth', level: 0.4, semi: 7, cent: -5 }
    ],
    filter: { type: 'lowpass', cutoff: 2000, q: 5, env: 2.4, keytrack: 0.4, velToEnv: 0.8 },
    ampEnv: env(0.002, 0.2, 0.02, 0.08), filtEnv: env(0.002, 0.12, 0.05, 0.06),
    shaper: { curve: 'hard', drive: 0.4 }, gain: 0.38, sends: { reverb: 0.22, delay: 0.16 }, defaultNote: 60
  },

  {
    id: 'lead_trance', name: 'Trance Pluck', tags: ['pluck', 'bright'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 5, spread: 17, width: 0.9 }],
    filter: { type: 'lowpass', cutoff: 1600, q: 5, env: 3, keytrack: 0.5, velToEnv: 0.7 },
    ampEnv: env(0.002, 0.32, 0.02, 0.14), filtEnv: env(0.002, 0.2, 0.05, 0.1),
    gain: 0.36, sends: { reverb: 0.26, delay: 0.26 }, defaultNote: 67
  },
  {
    id: 'lead_saw_solo', name: 'Saw Solo', tags: ['classic', 'mono'],
    oscs: [{ wave: 'sawtooth', level: 0.9 }, { wave: 'sawtooth', level: 0.5, cent: -8 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 4, env: 1.6, keytrack: 0.5, poles: 4 },
    ampEnv: env(0.008, 0.25, 0.85, 0.12), filtEnv: env(0.01, 0.25, 0.35, 0.1),
    lfo: { wave: 'sine', rate: 5.5, depth: 0.12, target: 'pitch', delay: 0.35, fade: 0.3 },
    shaper: { curve: 'tube', drive: 0.35 },
    glide: 0.045, poly: 1, gain: 0.44, sends: { delay: 0.18, reverb: 0.16 }, defaultNote: 67
  },
  {
    id: 'lead_pwm', name: 'PWM Lead', tags: ['hollow', 'moving'],
    oscs: [
      { wave: 'pulse25', level: 0.7, unison: 2, spread: 8 },
      { wave: 'pulse12', level: 0.5, cent: 9 },
      { wave: 'square', level: 0.35, cent: -7 }
    ],
    filter: { type: 'lowpass', cutoff: 3000, q: 2.6, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.006, 0.28, 0.85, 0.14), filtEnv: env(0.008, 0.3, 0.4, 0.12),
    lfo: { wave: 'sine', rate: 0.6, depth: 0.35, target: 'filter', fade: 0.4 },
    gain: 0.4, sends: { reverb: 0.2, delay: 0.14 }, defaultNote: 64
  },
  {
    id: 'lead_sync', name: 'Sync Lead', tags: ['aggressive', 'sweep'],
    oscs: [{ wave: 'fifth', level: 0.8 }, { wave: 'razor', level: 0.5, cent: 11 }],
    fm: { ratio: 2.0, index: 1.2, decay: 0.5, sustain: 0.6 },
    filter: { type: 'bandpass', cutoff: 1500, q: 6, env: 2.6, keytrack: 0.5 },
    ampEnv: env(0.004, 0.3, 0.8, 0.14), filtEnv: env(0.006, 0.4, 0.3, 0.14),
    lfo: { wave: 'triangle', rate: 0.5, depth: 0.7, target: 'filter', fade: 0.3 },
    shaper: { curve: 'hard', drive: 0.45 },
    gain: 0.36, sends: { delay: 0.2 }, defaultNote: 64
  },
  {
    id: 'lead_screech', name: 'Screech', tags: ['dubstep', 'harsh'],
    oscs: [{ wave: 'grind', level: 0.8, unison: 3, spread: 16 }],
    fm: { ratio: 3.02, index: 3.4, wave: 'square', decay: 0.3, sustain: 0.6 },
    filter: { type: 'bandpass', cutoff: 1400, q: 9, env: 2.8, keytrack: 0.35, poles: 4 },
    ampEnv: env(0.005, 0.3, 0.85, 0.14), filtEnv: env(0.01, 0.3, 0.4, 0.12),
    lfo: { wave: 'triangle', rate: 4.5, depth: 1, target: 'filter', fade: 0.06 },
    shaper: { curve: 'fold', drive: 0.55 },
    gain: 0.32, sends: { reverb: 0.2 }, defaultNote: 60
  },
  {
    id: 'lead_arp_runner', name: 'Arp Runner', tags: ['arp', 'short'],
    oscs: [{ wave: 'sawtooth', level: 0.8 }, { wave: 'square', level: 0.4, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 2200, q: 7, env: 2.6, keytrack: 0.6, velToEnv: 0.7 },
    ampEnv: env(0.001, 0.14, 0.0, 0.05), filtEnv: env(0.001, 0.09, 0.04, 0.04),
    gain: 0.4, sends: { delay: 0.3, reverb: 0.18 }, defaultNote: 72
  },
  {
    id: 'lead_4bit', name: '4-Bit', tags: ['8bit', 'crushed'],
    oscs: [{ wave: 'pulse25', level: 1 }],
    filter: { type: 'lowpass', cutoff: 7000, q: 0.6, env: 0.4, keytrack: 0.7 },
    ampEnv: env(0.001, 0.07, 0.6, 0.03), filtEnv: env(0.001, 0.1, 0.6, 0.03),
    lfo: { wave: 'square', rate: 16, depth: 0.22, target: 'pitch', delay: 0.04, fade: 0.02 },
    gain: 0.4, defaultNote: 76,
    fx: [{ type: 'crush', bits: 4, reduction: 5, mix: 0.85 }]
  },
  {
    id: 'lead_whistle', name: 'Whistle', tags: ['pure', 'high'],
    oscs: [{ wave: 'sine', level: 1 }, { wave: 'sine', level: 0.12, oct: 1 }],
    noise: { color: 'white', level: 0.1, bp: 4200, q: 3 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.8, env: 0.6, keytrack: 0.8 },
    ampEnv: env(0.04, 0.3, 0.92, 0.2), filtEnv: env(0.06, 0.3, 0.6, 0.16),
    lfo: { wave: 'sine', rate: 5.8, depth: 0.14, target: 'pitch', delay: 0.25, fade: 0.3 },
    gain: 0.44, sends: { reverb: 0.34, delay: 0.16 }, defaultNote: 84
  },
  {
    id: 'lead_reedharp', name: 'Reed Harp', tags: ['reed', 'bluesy'],
    oscs: [{ wave: 'reed', level: 0.85, unison: 2, spread: 9 }, { wave: 'square', level: 0.3, cent: -8 }],
    filter: { type: 'bandpass', cutoff: 1300, q: 3.2, env: 1.8, keytrack: 0.6 },
    ampEnv: env(0.02, 0.3, 0.85, 0.16), filtEnv: env(0.04, 0.35, 0.4, 0.16),
    lfo: { wave: 'sine', rate: 6.4, depth: 0.16, target: 'pitch', delay: 0.2, fade: 0.25 },
    shaper: { curve: 'tube', drive: 0.34 },
    gain: 0.44, sends: { reverb: 0.3 }, defaultNote: 64
  },
  {
    id: 'lead_widesaw', name: 'Wide Saw', tags: ['wide', 'anthem'],
    oscs: [
      { wave: 'sawtooth', level: 0.8, unison: 7, spread: 30, width: 1 },
      { wave: 'sawtooth', level: 0.4, oct: 1, unison: 3, spread: 16, width: 0.8 }
    ],
    filter: { type: 'lowpass', cutoff: 3600, q: 1.4, env: 1.6, keytrack: 0.55 },
    ampEnv: env(0.01, 0.35, 0.88, 0.24), filtEnv: env(0.02, 0.4, 0.45, 0.2),
    gain: 0.3, sends: { reverb: 0.26, delay: 0.18 }, defaultNote: 67
  },
  {
    id: 'lead_metalbell', name: 'Metal Bell', tags: ['fm', 'bell'],
    oscs: [{ wave: 'sine', level: 0.9 }, { wave: 'bell', level: 0.35 }],
    fm: { ratio: 11.03, index: 2.6, decay: 0.2, sustain: 0.06 },
    filter: { type: 'lowpass', cutoff: 6000, q: 1, env: 0.8, keytrack: 0.7 },
    ampEnv: env(0.002, 1.1, 0.12, 0.4), filtEnv: env(0.002, 0.4, 0.14, 0.22),
    gain: 0.4, sends: { reverb: 0.34, delay: 0.2 }, defaultNote: 72
  },
  {
    id: 'lead_anthem', name: 'Riot Anthem', tags: ['fat', 'distorted'],
    oscs: [
      { wave: 'razor', level: 0.8, unison: 4, spread: 18, width: 0.85 },
      { wave: 'fifth', level: 0.4, oct: -1 }
    ],
    sub: { wave: 'sine', oct: -1, level: 0.2 },
    filter: { type: 'lowpass', cutoff: 2400, q: 3.2, env: 1.8, keytrack: 0.5, poles: 4 },
    ampEnv: env(0.006, 0.3, 0.85, 0.2), filtEnv: env(0.008, 0.3, 0.35, 0.16),
    shaper: { curve: 'tube', drive: 0.52 },
    gain: 0.32, sends: { reverb: 0.24, delay: 0.16 }, defaultNote: 60
  }
];
