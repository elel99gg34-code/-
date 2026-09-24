/* Toys and junk.
 *
 * Cheap plastic and found objects. Two things make something sound like a toy:
 * the partials are badly tuned (a real glockenspiel bar is machined, a toy one
 * is stamped), and the body is too small to hold low end, so everything is
 * bandpassed high and dies fast. Junk is the same trick with the tuning thrown
 * out entirely — a saucepan is a bell nobody bothered to tune. */

import { env, BELL_PARTIALS } from './shared.js';

export const TOYS = [
  {
    id: 'toy_piano', name: 'Tin Toy Piano', tags: ['plastic', 'bright'],
    oscs: [{ wave: 'glass', level: 0.6 }, { wave: 'sine', level: 0.5, cent: 14 }],
    fm: { ratio: 5.4, index: 1.9, decay: 0.09, sustain: 0.02 },
    filter: { type: 'highpass', cutoff: 420, q: 0.7 },
    ampEnv: env(0.001, 0.85, 0.0, 0.25), filtEnv: env(0.002, 0.3, 0.2, 0.2),
    gain: 0.78, sends: { reverb: 0.22 }, defaultNote: 72
  },
  {
    id: 'toy_glock', name: 'Toy Glockenspiel', tags: ['metal', 'mistuned'],
    oscs: [{ wave: 'bell', level: 0.55 }, { wave: 'sine', level: 0.45, cent: -22 }],
    fm: { ratio: 7.3, index: 2.6, decay: 0.05, sustain: 0.0 },
    filter: { type: 'highpass', cutoff: 900, q: 0.6 },
    ampEnv: env(0.001, 1.1, 0.0, 0.4),
    gain: 1.1, sends: { reverb: 0.34 }, defaultNote: 84
  },
  {
    id: 'toy_musicbox', name: 'Music Box Comb', tags: ['tine', 'fragile'],
    oscs: [{ wave: 'glass', level: 0.5 }, { wave: 'triangle', level: 0.35, oct: 1 }],
    fm: { ratio: 9.1, index: 1.4, decay: 0.03, sustain: 0.0 },
    filter: { type: 'highpass', cutoff: 1400, q: 0.7 },
    ampEnv: env(0.001, 0.7, 0.0, 0.3),
    gain: 1.25, sends: { reverb: 0.42, delay: 0.1 }, defaultNote: 84
  },
  {
    id: 'toy_xylo', name: 'Plastic Xylophone', tags: ['bar', 'dull'],
    oscs: [{ wave: 'sine', level: 0.8 }, { wave: 'triangle', level: 0.3, semi: 19 }],
    fm: { ratio: 3.1, index: 1.1, decay: 0.04, sustain: 0.0 },
    filter: { type: 'lowpass', cutoff: 4200, q: 0.9, env: 1.1, keytrack: 0.8 },
    ampEnv: env(0.001, 0.3, 0.0, 0.1), filtEnv: env(0.001, 0.1, 0.1, 0.06),
    gain: 0.85, sends: { reverb: 0.18 }, defaultNote: 76
  },
  {
    id: 'toy_kazoo', name: 'Kazoo', tags: ['buzz', 'nasal'],
    oscs: [{ wave: 'buzz', level: 0.7 }, { wave: 'reed', level: 0.4, cent: 9 }],
    filter: { type: 'bandpass', cutoff: 1500, q: 2.4, env: 0.9, keytrack: 0.7 },
    ampEnv: env(0.02, 0.1, 0.8, 0.07), filtEnv: env(0.03, 0.2, 0.5, 0.08),
    lfo: { wave: 'sine', rate: 6.4, depth: 0.035, target: 'pitch', delay: 0.06 },
    shaper: { curve: 'rect', drive: 0.3 },
    gain: 1.3, defaultNote: 67
  },
  {
    id: 'toy_tinwhistle', name: 'Tin Whistle', tags: ['breath', 'thin'],
    oscs: [{ wave: 'sine', level: 0.75 }, { wave: 'triangle', level: 0.25, oct: 1 }],
    noise: { color: 'white', level: 0.16, hp: 3600, decay: 0.09 },
    filter: { type: 'lowpass', cutoff: 5200, q: 1, env: 0.8, keytrack: 0.85 },
    ampEnv: env(0.03, 0.14, 0.85, 0.08), filtEnv: env(0.02, 0.2, 0.6, 0.08),
    lfo: { wave: 'sine', rate: 5.2, depth: 0.02, target: 'pitch', delay: 0.14 },
    gain: 0.8, sends: { reverb: 0.2 }, defaultNote: 79
  },
  {
    id: 'toy_rubberband', name: 'Rubber Band', tags: ['twang', 'slack'],
    oscs: [{ wave: 'triangle', level: 0.8 }],
    filter: { type: 'lowpass', cutoff: 1800, q: 3.4, env: 1.6, keytrack: 0.6 },
    ampEnv: env(0.001, 0.35, 0.0, 0.12), filtEnv: env(0.001, 0.12, 0.05, 0.08),
    pitchEnv: { amt: -5, d: 0.07 },
    gain: 0.9, defaultNote: 55
  },
  {
    id: 'toy_comb', name: 'Comb & Paper', tags: ['buzz', 'lofi'],
    oscs: [{ wave: 'grind', level: 0.6 }],
    noise: { color: 'white', level: 0.2, bp: 2400, q: 1.1, decay: 0.2, keytrack: 0.5 },
    filter: { type: 'bandpass', cutoff: 1900, q: 1.9, env: 1, keytrack: 0.6 },
    ampEnv: env(0.015, 0.12, 0.72, 0.06), filtEnv: env(0.02, 0.2, 0.5, 0.07),
    shaper: { curve: 'fuzz', drive: 0.28 },
    gain: 1.15, defaultNote: 64
  },
  {
    id: 'toy_bottle', name: 'Blown Bottle', tags: ['hollow', 'breath'],
    oscs: [{ wave: 'sine', level: 0.85 }],
    noise: { color: 'pink', level: 0.3, bp: 1100, q: 1.4, decay: 0.3, keytrack: 0.6 },
    filter: { type: 'lowpass', cutoff: 1700, q: 2.6, env: 0.7, keytrack: 0.8 },
    ampEnv: env(0.05, 0.3, 0.7, 0.2), filtEnv: env(0.06, 0.3, 0.6, 0.15),
    gain: 0.95, sends: { reverb: 0.28 }, defaultNote: 55
  },
  {
    id: 'toy_doorspring', name: 'Door Spring', tags: ['boing', 'junk'],
    oscs: [{ wave: 'metal', level: 0.5 }, { wave: 'sine', level: 0.4 }],
    fm: { ratio: 1.41, index: 5.5, decay: 0.3, sustain: 0.1 },
    filter: { type: 'bandpass', cutoff: 1300, q: 1.3, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.001, 0.8, 0.0, 0.25), filtEnv: env(0.002, 0.4, 0.2, 0.2),
    pitchEnv: { amt: -12, d: 0.5 },
    gain: 2.1, sends: { reverb: 0.3, delay: 0.14 }, defaultNote: 52
  },
  {
    id: 'toy_canlid', name: 'Can Lid', tags: ['junk', 'metal'],
    oscs: [{ wave: 'metal', level: 0.7 }],
    fm: { ratio: 3.77, index: 4.2, decay: 0.1, sustain: 0.02 },
    filter: { type: 'highpass', cutoff: 1100, q: 0.8 },
    ampEnv: env(0.001, 0.5, 0.0, 0.16),
    gain: 0.9, sends: { reverb: 0.2 }, defaultNote: 72
  },
  {
    id: 'toy_sawblade', name: 'Saw Blade', tags: ['junk', 'wobble'],
    oscs: [{ wave: 'metal', level: 0.55 }, { wave: 'wire', level: 0.35 }],
    fm: { ratio: 2.19, index: 6, decay: 0.35, sustain: 0.12 },
    filter: { type: 'bandpass', cutoff: 1600, q: 2, env: 1.5, keytrack: 0.55 },
    ampEnv: env(0.002, 1, 0.0, 0.4), filtEnv: env(0.004, 0.5, 0.2, 0.25),
    lfo: { wave: 'sine', rate: 7.5, depth: 0.09, target: 'pitch', fade: 0.3 },
    gain: 1.1, sends: { reverb: 0.3 }, defaultNote: 57
  },
  {
    id: 'toy_ruler', name: 'Desk Ruler', tags: ['twang', 'buzz'],
    oscs: [{ wave: 'triangle', level: 0.7 }, { wave: 'square', level: 0.2 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 4, env: 2, keytrack: 0.5 },
    ampEnv: env(0.001, 0.4, 0.0, 0.14), filtEnv: env(0.001, 0.15, 0.05, 0.1),
    pitchEnv: { amt: -14, d: 0.18 },
    lfo: { wave: 'sine', rate: 22, depth: 0.05, target: 'pitch' },
    gain: 0.92, defaultNote: 48
  },
  {
    id: 'toy_pot', name: 'Saucepan', tags: ['junk', 'clang'],
    oscs: [{ wave: 'metal', level: 0.6 }, { wave: 'bell', level: 0.35, cent: 33 }],
    fm: { ratio: 1.87, index: 5.2, decay: 0.12, sustain: 0.04 },
    filter: { type: 'highpass', cutoff: 500, q: 0.7 },
    ampEnv: env(0.001, 0.9, 0.0, 0.35),
    gain: 0.85, sends: { reverb: 0.3 }, defaultNote: 60
  },
  {
    id: 'toy_radiator', name: 'Radiator Pipe', tags: ['junk', 'ring'],
    oscs: [{ wave: 'sine', level: 0.6 }, { wave: 'metal', level: 0.3, semi: 7 }],
    fm: { ratio: 6.4, index: 3.1, decay: 0.06, sustain: 0.01 },
    filter: { type: 'bandpass', cutoff: 900, q: 1.3, env: 1.2, keytrack: 0.7 },
    ampEnv: env(0.001, 1.4, 0.0, 0.5), filtEnv: env(0.002, 0.4, 0.3, 0.3),
    gain: 2.8, sends: { reverb: 0.42, delay: 0.16 }, defaultNote: 55
  },
  {
    id: 'toy_keychain', name: 'Keychain', tags: ['jangle', 'metal'],
    oscs: [{ wave: 'metal', level: 0.3 }],
    noise: { color: 'metal', level: 0.6, hp: 4200, decay: 0.12, keytrack: 0.4 },
    filter: { type: 'highpass', cutoff: 3400, q: 0.8 },
    ampEnv: env(0.001, 0.35, 0.0, 0.12),
    gain: 1.2, sends: { reverb: 0.22 }, defaultNote: 84
  },
  {
    id: 'toy_zipper', name: 'Zipper', tags: ['scrape', 'junk'],
    noise: { color: 'white', level: 0.7, bp: 3200, q: 1.3, decay: 0.24, rate: 0.4 },
    oscs: [{ wave: 'grind', level: 0.12 }],
    filter: { type: 'bandpass', cutoff: 2800, q: 0.9, env: 2.2, keytrack: 0.3 },
    ampEnv: env(0.004, 0.3, 0.4, 0.06), filtEnv: env(0.01, 0.3, 0.3, 0.08),
    gain: 2.1, defaultNote: 72
  },
  {
    id: 'toy_squeak', name: 'Squeaky Toy', tags: ['high', 'comic'],
    oscs: [{ wave: 'reed', level: 0.8 }],
    filter: { type: 'bandpass', cutoff: 2600, q: 1.4, env: 1.6, keytrack: 0.8 },
    ampEnv: env(0.01, 0.16, 0.5, 0.05), filtEnv: env(0.01, 0.2, 0.4, 0.06),
    pitchEnv: { amt: 5, d: 0.12 },
    lfo: { wave: 'sine', rate: 9, depth: 0.05, target: 'pitch' },
    gain: 2.5, defaultNote: 84
  },
  {
    id: 'toy_wobbleboard', name: 'Wobble Board', tags: ['boing', 'wobble'],
    oscs: [{ wave: 'sine', level: 0.9 }],
    filter: { type: 'lowpass', cutoff: 1100, q: 2, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.004, 0.5, 0.0, 0.2), filtEnv: env(0.006, 0.3, 0.2, 0.14),
    lfo: { wave: 'sine', rate: 11, depth: 0.16, target: 'pitch', fade: 0.12 },
    gain: 0.95, defaultNote: 43
  },
  {
    id: 'toy_mbira', name: 'Mbira', tags: ['tine', 'buzz'],
    oscs: [{ wave: 'sine', level: 0.7 }, { wave: 'wire', level: 0.35, semi: 12 }],
    fm: { ratio: 4.2, index: 1.6, decay: 0.07, sustain: 0.02 },
    noise: { color: 'metal', level: 0.12, hp: 5000, decay: 0.16 },
    filter: { type: 'lowpass', cutoff: 3800, q: 1.2, env: 1, keytrack: 0.8 },
    ampEnv: env(0.001, 0.6, 0.0, 0.22), filtEnv: env(0.002, 0.2, 0.2, 0.14),
    gain: 0.95, sends: { reverb: 0.24 }, defaultNote: 64
  },
  {
    id: 'toy_slidewhistle', name: 'Slide Whistle', tags: ['glide', 'comic'],
    oscs: [{ wave: 'sine', level: 0.9 }],
    noise: { color: 'white', level: 0.1, hp: 4000, decay: 0.12 },
    filter: { type: 'lowpass', cutoff: 4800, q: 0.9, env: 0.7, keytrack: 0.9 },
    ampEnv: env(0.02, 0.2, 0.8, 0.1), filtEnv: env(0.02, 0.2, 0.6, 0.1),
    pitchEnv: { amt: 9, d: 0.3 },
    gain: 0.82, sends: { reverb: 0.2 }, defaultNote: 76
  },
  {
    id: 'toy_duck', name: 'Duck Call', tags: ['reed', 'comic'],
    oscs: [{ wave: 'reed', level: 0.7 }, { wave: 'buzz', level: 0.3 }],
    filter: { type: 'bandpass', cutoff: 1200, q: 2.2, env: 1.4, keytrack: 0.7 },
    ampEnv: env(0.008, 0.14, 0.6, 0.05), filtEnv: env(0.01, 0.16, 0.4, 0.06),
    lfo: { wave: 'square', rate: 18, depth: 0.04, target: 'pitch' },
    shaper: { curve: 'rect', drive: 0.34 },
    gain: 1.2, defaultNote: 62
  },
  {
    id: 'toy_banger', name: 'Cap Gun', tags: ['hit', 'snap'],
    noise: { color: 'white', level: 0.9, hp: 1800, decay: 0.03 },
    oscs: [{ wave: 'square', level: 0.25 }],
    filter: { type: 'highpass', cutoff: 900, q: 1.1, env: 1.4, keytrack: 0.2 },
    ampEnv: env(0.0005, 0.06, 0.0, 0.03), filtEnv: env(0.001, 0.05, 0.0, 0.02),
    pitchEnv: { amt: -24, d: 0.02 },
    shaper: { curve: 'hard', drive: 0.4 },
    gain: 0.75, sends: { reverb: 0.16 }, defaultNote: 60
  },
  {
    id: 'toy_organ', name: 'Bontempi Organ', tags: ['reed', 'cheap'],
    oscs: [
      { wave: 'organ', level: 0.6 },
      { wave: 'square', level: 0.3, cent: 7 },
      { wave: 'sine', level: 0.3, oct: 1, cent: -5 }
    ],
    filter: { type: 'lowpass', cutoff: 3400, q: 0.9, env: 0.4, keytrack: 0.7 },
    ampEnv: env(0.02, 0.1, 0.9, 0.09), filtEnv: env(0.03, 0.2, 0.7, 0.09),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.012, target: 'pitch', delay: 0.2 },
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 60
  }
];
