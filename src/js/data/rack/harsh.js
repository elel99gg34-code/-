/* Noise and harsh.
 *
 * Power electronics, harsh noise wall, contact-mic scrape, blown speaker.
 * The rest of the rack treats distortion as seasoning; here it is the whole
 * dish — the source is usually noise or a collapsing oscillator and the
 * character comes entirely from what mangles it afterwards.
 *
 * These are loud by design, so the patch gains run low. They also sit almost
 * flat across the keyboard on purpose: a noise wall is not a note. */

import { env } from './shared.js';

export const HARSH = [
  {
    id: 'hrs_wall', name: 'Noise Wall', tags: ['wall', 'harsh'],
    noise: { color: 'white', level: 0.9, hp: 300, lp: 12000 },
    oscs: [{ wave: 'grind', level: 0.2 }],
    filter: { type: 'lowpass', cutoff: 6000, q: 1.2, env: 0.3, keytrack: 0.2 },
    ampEnv: env(0.01, 0.2, 1.0, 0.2), filtEnv: env(0.02, 0.4, 0.8, 0.2),
    shaper: { curve: 'destroy', drive: 0.5 },
    gain: 0.22, defaultNote: 48
  },
  {
    id: 'hrs_crackle', name: 'Crackle Field', tags: ['crackle', 'dry'],
    noise: { color: 'crackle', level: 1, hp: 700 },
    filter: { type: 'bandpass', cutoff: 2600, q: 1.1, env: 0.8, keytrack: 0.3 },
    ampEnv: env(0.006, 0.3, 0.9, 0.16), filtEnv: env(0.02, 0.4, 0.6, 0.2),
    shaper: { curve: 'hard', drive: 0.34 },
    gain: 0.6, sends: { reverb: 0.18 }, defaultNote: 48
  },
  {
    id: 'hrs_feedback', name: 'Feedback Loop', tags: ['squeal', 'loud'],
    oscs: [{ wave: 'sine', level: 0.5 }, { wave: 'sine', level: 0.3, cent: 11 }],
    fm: { ratio: 1.003, index: 9, decay: 2.5, sustain: 0.9 },
    filter: { type: 'bandpass', cutoff: 2400, q: 4, env: 1.6, keytrack: 0.8 },
    ampEnv: env(0.12, 0.6, 0.95, 0.4), filtEnv: env(0.4, 1.2, 0.7, 0.3),
    shaper: { curve: 'hard', drive: 0.45 },
    gain: 0.4, sends: { reverb: 0.3 }, defaultNote: 72
  },
  {
    id: 'hrs_contact', name: 'Contact Mic', tags: ['scrape', 'junk'],
    noise: { color: 'brown', level: 0.8, hp: 200, lp: 5000, rate: 0.7 },
    oscs: [{ wave: 'wire', level: 0.2 }],
    filter: { type: 'bandpass', cutoff: 900, q: 2.4, env: 2, keytrack: 0.4 },
    ampEnv: env(0.004, 0.4, 0.8, 0.12), filtEnv: env(0.01, 0.5, 0.4, 0.2),
    shaper: { curve: 'fuzz', drive: 0.4 },
    gain: 0.68, sends: { reverb: 0.2 }, defaultNote: 43
  },
  {
    id: 'hrs_pedal', name: 'Pedal Squeal', tags: ['squeal', 'fuzz'],
    oscs: [{ wave: 'razor', level: 0.7 }, { wave: 'buzz', level: 0.3, cent: 17 }],
    filter: { type: 'bandpass', cutoff: 3000, q: 3.4, env: 2, keytrack: 0.8 },
    ampEnv: env(0.006, 0.4, 0.9, 0.12), filtEnv: env(0.02, 0.5, 0.5, 0.16),
    lfo: { wave: 'sine', rate: 0.6, depth: 0.4, target: 'filter' },
    shaper: { curve: 'fuzz', drive: 0.55 },
    gain: 0.3, sends: { reverb: 0.22 }, defaultNote: 67
  },
  {
    id: 'hrs_metalscrape', name: 'Metal Scrape', tags: ['scrape', 'metal'],
    noise: { color: 'metal', level: 0.85, hp: 1800, rate: 0.5 },
    oscs: [{ wave: 'metal', level: 0.25 }],
    filter: { type: 'bandpass', cutoff: 3400, q: 2, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.008, 0.4, 0.85, 0.14), filtEnv: env(0.02, 0.5, 0.5, 0.18),
    shaper: { curve: 'hard', drive: 0.34 },
    gain: 0.6, sends: { reverb: 0.28 }, defaultNote: 60
  },
  {
    id: 'hrs_powerelec', name: 'Power Electronics', tags: ['wall', 'brutal'],
    oscs: [{ wave: 'grind', level: 0.5 }, { wave: 'razor', level: 0.4, cent: -23 }],
    noise: { color: 'white', level: 0.5, hp: 600 },
    filter: { type: 'bandpass', cutoff: 1600, q: 1.6, env: 1.4, keytrack: 0.3 },
    ampEnv: env(0.006, 0.3, 1.0, 0.2), filtEnv: env(0.02, 0.5, 0.7, 0.2),
    lfo: { wave: 'square', rate: 7, depth: 0.35, target: 'filter' },
    shaper: { curve: 'destroy', drive: 0.62 },
    gain: 0.22, defaultNote: 43
  },
  {
    id: 'hrs_screech', name: 'Feedback Screech', tags: ['high', 'painful'],
    oscs: [{ wave: 'buzz', level: 0.6 }],
    fm: { ratio: 5.03, index: 6, decay: 1.4, sustain: 0.7 },
    filter: { type: 'highpass', cutoff: 2400, q: 1.4, env: 1, keytrack: 0.7 },
    ampEnv: env(0.01, 0.4, 0.9, 0.16), filtEnv: env(0.04, 0.6, 0.6, 0.2),
    shaper: { curve: 'hard', drive: 0.4 },
    gain: 0.3, sends: { reverb: 0.26 }, defaultNote: 79
  },
  {
    id: 'hrs_bitrot', name: 'Bit Rot', tags: ['digital', 'broken'],
    oscs: [{ wave: 'saw', level: 0.7 }],
    filter: { type: 'lowpass', cutoff: 4000, q: 1.4, env: 1, keytrack: 0.5 },
    ampEnv: env(0.003, 0.3, 0.9, 0.1), filtEnv: env(0.01, 0.4, 0.6, 0.14),
    gain: 0.5, sends: { delay: 0.18 }, defaultNote: 55,
    fx: [
      { type: 'crush', bits: 3, reduction: 9, jitter: 0.4, mix: 1 },
      { type: 'drive', shape: 'destroy', amount: 0.5, tone: 5200, mix: 0.8 }
    ]
  },
  {
    id: 'hrs_clipwall', name: 'Clipped Wall', tags: ['wall', 'square'],
    oscs: [{ wave: 'square', level: 0.6 }, { wave: 'square', level: 0.5, cent: 31 }],
    noise: { color: 'white', level: 0.3, hp: 900 },
    filter: { type: 'lowpass', cutoff: 5000, q: 0.9, env: 0.4, keytrack: 0.3 },
    ampEnv: env(0.004, 0.2, 1.0, 0.14), filtEnv: env(0.02, 0.4, 0.8, 0.16),
    shaper: { curve: 'hard', drive: 0.75 },
    gain: 0.2, defaultNote: 48
  },
  {
    id: 'hrs_sizzle', name: 'Sizzle Field', tags: ['high', 'texture'],
    noise: { color: 'violet', level: 0.9, hp: 5000 },
    filter: { type: 'highpass', cutoff: 4200, q: 0.8, env: 0.6, keytrack: 0.3 },
    ampEnv: env(0.02, 0.4, 0.9, 0.2), filtEnv: env(0.05, 0.5, 0.7, 0.2),
    shaper: { curve: 'saturate', drive: 0.3 },
    gain: 0.85, sends: { reverb: 0.24 }, defaultNote: 72
  },
  {
    id: 'hrs_rumblewall', name: 'Rumble Wall', tags: ['low', 'wall'],
    noise: { color: 'brown', level: 0.9, lp: 700 },
    oscs: [{ wave: 'sub', level: 0.4 }],
    filter: { type: 'lowpass', cutoff: 420, q: 1.6, env: 0.8, keytrack: 0.3 },
    ampEnv: env(0.02, 0.4, 1.0, 0.3), filtEnv: env(0.06, 0.6, 0.8, 0.24),
    shaper: { curve: 'tube', drive: 0.44 },
    gain: 0.5, defaultNote: 31
  },
  {
    id: 'hrs_jammer', name: 'Radio Jammer', tags: ['radio', 'noise'],
    noise: { color: 'white', level: 0.7, bp: 1800, q: 1.2 },
    oscs: [{ wave: 'sine', level: 0.3, cent: 4 }, { wave: 'buzz', level: 0.2 }],
    filter: { type: 'bandpass', cutoff: 2000, q: 1.8, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.008, 0.3, 0.9, 0.12), filtEnv: env(0.02, 0.4, 0.6, 0.16),
    lfo: { wave: 'sine', rate: 3.4, depth: 0.5, target: 'filter' },
    shaper: { curve: 'rect', drive: 0.34 },
    gain: 0.75, defaultNote: 60
  },
  {
    id: 'hrs_grindloop', name: 'Grind Loop', tags: ['machine', 'loop'],
    oscs: [{ wave: 'grind', level: 0.65 }],
    noise: { color: 'pink', level: 0.3, bp: 800, q: 1 },
    filter: { type: 'lowpass', cutoff: 1400, q: 2.6, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.006, 0.3, 0.95, 0.14), filtEnv: env(0.02, 0.4, 0.6, 0.16),
    lfo: { wave: 'square', rate: 11, depth: 0.5, target: 'amp' },
    shaper: { curve: 'diode', drive: 0.4 },
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 40
  },
  {
    id: 'hrs_siren', name: 'Air Raid Siren', tags: ['siren', 'loud'],
    oscs: [{ wave: 'saw', level: 0.5 }, { wave: 'saw', level: 0.4, cent: 19 }],
    filter: { type: 'bandpass', cutoff: 1400, q: 2.4, env: 1.6, keytrack: 0.7 },
    ampEnv: env(0.08, 0.6, 0.95, 0.4), filtEnv: env(0.1, 0.8, 0.7, 0.3),
    lfo: { wave: 'triangle', rate: 0.45, depth: 0.28, target: 'pitch' },
    shaper: { curve: 'tube', drive: 0.36 },
    gain: 0.4, sends: { reverb: 0.34 }, defaultNote: 64
  },
  {
    id: 'hrs_overload', name: 'Input Overload', tags: ['clip', 'brutal'],
    oscs: [{ wave: 'saw', level: 0.8, unison: 3, spread: 22 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 2, env: 1.6, keytrack: 0.4 },
    ampEnv: env(0.002, 0.3, 0.9, 0.1), filtEnv: env(0.006, 0.3, 0.5, 0.12),
    shaper: { curve: 'destroy', drive: 0.7 },
    gain: 0.2, sends: { reverb: 0.16 }, defaultNote: 48
  },
  {
    id: 'hrs_tearing', name: 'Tearing', tags: ['rip', 'texture'],
    noise: { color: 'white', level: 0.8, bp: 2200, q: 0.9, sweep: 2, rate: 0.6 },
    oscs: [{ wave: 'grind', level: 0.25 }],
    filter: { type: 'bandpass', cutoff: 2400, q: 1.4, env: 2.4, keytrack: 0.3 },
    ampEnv: env(0.003, 0.35, 0.7, 0.1), filtEnv: env(0.01, 0.4, 0.3, 0.14),
    shaper: { curve: 'fuzz', drive: 0.44 },
    gain: 0.6, defaultNote: 55
  },
  {
    id: 'hrs_staticburst', name: 'Static Blast', tags: ['burst', 'digital'],
    noise: { color: 'white', level: 1, hp: 1200, decay: 0.09 },
    filter: { type: 'highpass', cutoff: 1400, q: 1.2, env: 1.8, keytrack: 0.2 },
    ampEnv: env(0.001, 0.12, 0.0, 0.04), filtEnv: env(0.002, 0.1, 0.0, 0.04),
    gain: 0.55, sends: { reverb: 0.2 }, defaultNote: 60,
    fx: [{ type: 'crush', bits: 4, reduction: 5, jitter: 0.3, mix: 0.8 }]
  },
  {
    id: 'hrs_hum50', name: 'Mains Hum', tags: ['hum', 'drone'],
    oscs: [
      { wave: 'sine', level: 0.6 },
      { wave: 'sine', level: 0.3, semi: 12 },
      { wave: 'square', level: 0.12, semi: 19 }
    ],
    noise: { color: 'pink', level: 0.1, lp: 1800 },
    filter: { type: 'lowpass', cutoff: 1200, q: 1, env: 0.2, keytrack: 0.4 },
    ampEnv: env(0.05, 0.4, 1.0, 0.3), filtEnv: env(0.1, 0.5, 0.8, 0.2),
    shaper: { curve: 'diode', drive: 0.22 },
    gain: 0.6, defaultNote: 33
  },
  {
    id: 'hrs_gargle', name: 'Gargle', tags: ['modulated', 'wet'],
    oscs: [{ wave: 'razor', level: 0.6 }],
    filter: { type: 'lowpass', cutoff: 1800, q: 4, env: 1.8, keytrack: 0.5 },
    ampEnv: env(0.006, 0.3, 0.9, 0.12), filtEnv: env(0.02, 0.4, 0.5, 0.14),
    lfo: { wave: 'square', rate: 23, depth: 0.6, target: 'filter' },
    shaper: { curve: 'fold', drive: 0.4 },
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 48
  },
  {
    id: 'hrs_pulsewall', name: 'Pulse Wall', tags: ['wall', 'rhythmic'],
    oscs: [{ wave: 'buzz', level: 0.55 }],
    noise: { color: 'white', level: 0.45, hp: 1100 },
    filter: { type: 'lowpass', cutoff: 3600, q: 1.6, env: 0.8, keytrack: 0.3 },
    ampEnv: env(0.004, 0.3, 1.0, 0.16), filtEnv: env(0.02, 0.4, 0.7, 0.16),
    lfo: { wave: 'square', rate: 14, depth: 0.7, target: 'amp' },
    shaper: { curve: 'hard', drive: 0.5 },
    gain: 0.34, defaultNote: 48
  },
  {
    id: 'hrs_collapse', name: 'Collapse', tags: ['fall', 'brutal'],
    oscs: [{ wave: 'saw', level: 0.6, unison: 2, spread: 16 }],
    noise: { color: 'white', level: 0.4, hp: 800, decay: 0.5 },
    filter: { type: 'lowpass', cutoff: 3000, q: 2.6, env: 2, keytrack: 0.3 },
    ampEnv: env(0.004, 1.4, 0.0, 0.4), filtEnv: env(0.01, 0.8, 0.05, 0.3),
    pitchEnv: { amt: -30, d: 1.1 },
    shaper: { curve: 'destroy', drive: 0.55 },
    gain: 0.26, sends: { reverb: 0.34 }, defaultNote: 55
  }
];
