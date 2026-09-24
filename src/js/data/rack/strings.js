/* Strings and bows.
 *
 * A bowed string is a slow-ish attack on a bright sawtooth, a lowpass that
 * opens with the bow pressure, a little vibrato that fades in, and bow noise
 * scraping across the top. Pizzicato is the same body with the envelope
 * inverted. */

import { env } from './shared.js';

export const STRINGS = [
  {
    id: 'str_ensemble', name: 'String Ensemble', tags: ['lush', 'wide'],
    oscs: [
      { wave: 'sawtooth', level: 0.75, unison: 5, spread: 15, width: 0.9 },
      { wave: 'reed', level: 0.3, cent: -8, unison: 2, spread: 9 }
    ],
    filter: { type: 'lowpass', cutoff: 2600, q: 1, env: 1.4, keytrack: 0.55 },
    ampEnv: env(0.18, 0.7, 0.92, 0.5), filtEnv: env(0.3, 0.8, 0.6, 0.4),
    lfo: { wave: 'sine', rate: 5.1, depth: 0.06, target: 'pitch', delay: 0.45, fade: 0.7 },
    gain: 0.34, sends: { reverb: 0.4 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.45, depth: 0.004, mix: 0.38 }]
  },
  {
    id: 'str_cello', name: 'Cello', tags: ['low', 'bowed'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 7 }, { wave: 'hollow', level: 0.35, cent: 5 }],
    noise: { color: 'pink', level: 0.12, bp: 2600, q: 1.6 },
    filter: { type: 'lowpass', cutoff: 1300, q: 2, env: 1.6, keytrack: 0.6 },
    ampEnv: env(0.1, 0.5, 0.9, 0.35), filtEnv: env(0.18, 0.6, 0.5, 0.3),
    lfo: { wave: 'sine', rate: 5.4, depth: 0.09, target: 'pitch', delay: 0.4, fade: 0.6 },
    shaper: { curve: 'tube', drive: 0.2 },
    gain: 0.5, sends: { reverb: 0.34 }, defaultNote: 45
  },
  {
    id: 'str_violin', name: 'Violin', tags: ['high', 'bowed'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 6 }, { wave: 'reed', level: 0.3, cent: -6 }],
    noise: { color: 'white', level: 0.12, bp: 5200, q: 1.8 },
    filter: { type: 'lowpass', cutoff: 3400, q: 1.6, env: 1.5, keytrack: 0.7 },
    ampEnv: env(0.07, 0.4, 0.9, 0.28), filtEnv: env(0.12, 0.5, 0.55, 0.24),
    lfo: { wave: 'sine', rate: 6.1, depth: 0.12, target: 'pitch', delay: 0.3, fade: 0.5 },
    gain: 0.44, sends: { reverb: 0.36 }, defaultNote: 72
  },
  {
    id: 'str_pizzicato', name: 'Pizzicato', tags: ['pluck', 'short'],
    oscs: [{ wave: 'sawtooth', level: 0.8 }, { wave: 'glass', level: 0.35, oct: 1 }],
    noise: { color: 'white', level: 0.3, bp: 3000, q: 2.4, decay: 0.01 },
    filter: { type: 'lowpass', cutoff: 2000, q: 3.4, env: 2.6, keytrack: 0.7, velToEnv: 0.85 },
    ampEnv: env(0.001, 0.26, 0.0, 0.1), filtEnv: env(0.001, 0.12, 0.05, 0.07),
    gain: 0.5, sends: { reverb: 0.26 }, defaultNote: 60
  },
  {
    id: 'str_tremolo', name: 'Tremolo Strings', tags: ['tense', 'film'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 4, spread: 18, width: 0.85 }],
    noise: { color: 'pink', level: 0.16, bp: 3400, q: 1.1 },
    filter: { type: 'lowpass', cutoff: 2400, q: 1.4, env: 1.4, keytrack: 0.55 },
    ampEnv: env(0.12, 0.6, 0.9, 0.4), filtEnv: env(0.2, 0.6, 0.5, 0.32),
    gain: 0.34, sends: { reverb: 0.42 }, defaultNote: 64,
    fx: [{ type: 'autopan', mode: 'trem', rate: 13, depth: 0.7 }]
  },
  {
    id: 'str_bowed_bass', name: 'Bowed Bass', tags: ['low', 'drone'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 2, spread: 5 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    noise: { color: 'brown', level: 0.14, lp: 700 },
    filter: { type: 'lowpass', cutoff: 620, q: 2.4, env: 1.4, keytrack: 0.5 },
    ampEnv: env(0.22, 0.8, 0.92, 0.55), filtEnv: env(0.4, 0.9, 0.5, 0.4),
    lfo: { wave: 'sine', rate: 4.6, depth: 0.06, target: 'pitch', delay: 0.6, fade: 0.8 },
    gain: 0.54, sends: { reverb: 0.3 }, defaultNote: 33
  },
  {
    id: 'str_synthstring', name: 'Synth Strings', tags: ['retro', '80s'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 6, spread: 22, width: 0.95 },
      { wave: 'pulse25', level: 0.3, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 2800, q: 1.2, env: 1.3, keytrack: 0.5 },
    ampEnv: env(0.14, 0.6, 0.9, 0.45), filtEnv: env(0.24, 0.7, 0.55, 0.35),
    gain: 0.32, sends: { reverb: 0.4, delay: 0.14 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.6, depth: 0.006, feedback: 0.2, mix: 0.5 }]
  },
  {
    id: 'str_harmonics', name: 'String Harmonics', tags: ['glassy', 'thin'],
    oscs: [{ wave: 'glass', level: 0.8, unison: 2, spread: 9 }, { wave: 'sine', level: 0.35, oct: 1 }],
    noise: { color: 'white', level: 0.12, bp: 7000, q: 2.2 },
    filter: { type: 'highpass', cutoff: 700, q: 1.2, env: 0.8, keytrack: 0.8 },
    ampEnv: env(0.06, 1.2, 0.5, 0.7), filtEnv: env(0.1, 0.8, 0.4, 0.4),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.07, target: 'pitch', delay: 0.4, fade: 0.6 },
    gain: 0.4, sends: { reverb: 0.5, delay: 0.2 }, defaultNote: 79
  },
  {
    id: 'str_swell', name: 'String Swell', tags: ['cinematic', 'slow'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 5, spread: 20, width: 0.9 }, { wave: 'hollow', level: 0.3, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 700, q: 2.6, env: 3.2, keytrack: 0.4 },
    ampEnv: env(1.1, 1.2, 0.9, 1.1), filtEnv: env(1.8, 1.4, 0.45, 0.9),
    gain: 0.32, sends: { reverb: 0.5 }, defaultNote: 48
  },
  {
    id: 'str_scratch', name: 'Bow Scratch', tags: ['noise', 'harsh'],
    oscs: [{ wave: 'grind', level: 0.5, unison: 2, spread: 16 }],
    noise: { color: 'crackle', level: 0.55, bp: 2600, q: 0.9 },
    filter: { type: 'bandpass', cutoff: 1800, q: 4.5, env: 2.2, keytrack: 0.5 },
    ampEnv: env(0.05, 0.5, 0.75, 0.3), filtEnv: env(0.1, 0.5, 0.4, 0.25),
    lfo: { wave: 'triangle', rate: 3.2, depth: 0.6, target: 'filter', fade: 0.2 },
    shaper: { curve: 'rect', drive: 0.42 },
    gain: 0.34, sends: { reverb: 0.36 }, defaultNote: 55
  },

  {
    id: 'str_viola', name: 'Viola', tags: ['mid', 'bowed'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 6 }, { wave: 'hollow', level: 0.32, cent: -5 }],
    noise: { color: 'pink', level: 0.12, bp: 3600, q: 1.7 },
    filter: { type: 'lowpass', cutoff: 2100, q: 1.8, env: 1.5, keytrack: 0.65 },
    ampEnv: env(0.08, 0.45, 0.9, 0.3), filtEnv: env(0.15, 0.55, 0.5, 0.26),
    lfo: { wave: 'sine', rate: 5.7, depth: 0.1, target: 'pitch', delay: 0.35, fade: 0.55 },
    gain: 0.46, sends: { reverb: 0.35 }, defaultNote: 55
  },
  {
    id: 'str_stab', name: 'String Stab', tags: ['short', 'cinematic'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 5, spread: 16, width: 0.9 }],
    noise: { color: 'white', level: 0.2, bp: 3800, q: 2, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 2400, q: 2.4, env: 2.2, keytrack: 0.6, velToEnv: 0.85 },
    ampEnv: env(0.006, 0.26, 0.0, 0.12), filtEnv: env(0.006, 0.18, 0.06, 0.1),
    gain: 0.36, sends: { reverb: 0.4 }, defaultNote: 60
  },
  {
    id: 'str_col_legno', name: 'Col Legno', tags: ['percussive', 'wood'],
    oscs: [{ wave: 'hollow', level: 0.5 }, { wave: 'wire', level: 0.35, oct: 1 }],
    noise: { color: 'white', level: 0.6, bp: 2600, q: 2.6, decay: 0.016 },
    filter: { type: 'bandpass', cutoff: 1900, q: 1.1, env: 2, keytrack: 0.6 },
    ampEnv: env(0.001, 0.14, 0.0, 0.06), filtEnv: env(0.001, 0.09, 0.05, 0.05),
    gain: 1.7, sends: { reverb: 0.28 }, defaultNote: 60
  },
  {
    id: 'str_gliss', name: 'Gliss Strings', tags: ['slide', 'tense'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 4, spread: 18, width: 0.9 }],
    filter: { type: 'lowpass', cutoff: 2000, q: 2, env: 1.8, keytrack: 0.55 },
    ampEnv: env(0.1, 0.5, 0.9, 0.35), filtEnv: env(0.2, 0.6, 0.5, 0.3),
    lfo: { wave: 'sine', rate: 6.2, depth: 0.14, target: 'pitch', delay: 0.2, fade: 0.4 },
    glide: 0.16, poly: 1, gain: 0.4, sends: { reverb: 0.42 }, defaultNote: 64
  },

  {
    id: 'str_contrabass', name: 'Contrabass', tags: ['low', 'orchestral'],
    oscs: [{ wave: 'sawtooth', level: 0.85, unison: 2, spread: 5 }, { wave: 'hollow', level: 0.3, cent: 4 }],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    noise: { color: 'brown', level: 0.12, lp: 900 },
    filter: { type: 'lowpass', cutoff: 520, q: 2.2, env: 1.6, keytrack: 0.55 },
    ampEnv: env(0.12, 0.6, 0.9, 0.4), filtEnv: env(0.24, 0.7, 0.5, 0.32),
    lfo: { wave: 'sine', rate: 4.4, depth: 0.07, target: 'pitch', delay: 0.5, fade: 0.7 },
    gain: 0.56, sends: { reverb: 0.34 }, defaultNote: 33
  },
  {
    id: 'str_quartet', name: 'String Quartet', tags: ['chamber', 'intimate'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 3, spread: 9, width: 0.7 },
      { wave: 'reed', level: 0.28, cent: -6 }
    ],
    noise: { color: 'pink', level: 0.1, bp: 4000, q: 1.8 },
    filter: { type: 'lowpass', cutoff: 2600, q: 1.4, env: 1.5, keytrack: 0.6 },
    ampEnv: env(0.1, 0.5, 0.9, 0.35), filtEnv: env(0.2, 0.6, 0.5, 0.3),
    lfo: { wave: 'sine', rate: 5.5, depth: 0.08, target: 'pitch', delay: 0.4, fade: 0.6 },
    gain: 0.4, sends: { reverb: 0.42 }, defaultNote: 60
  },
  {
    id: 'str_sul_pont', name: 'Sul Ponticello', tags: ['glassy', 'tense'],
    oscs: [{ wave: 'razor', level: 0.7, unison: 2, spread: 8 }, { wave: 'glass', level: 0.35, oct: 1 }],
    noise: { color: 'white', level: 0.24, bp: 6000, q: 1.6 },
    filter: { type: 'highpass', cutoff: 1400, q: 1.8, env: 1.2, keytrack: 0.7 },
    ampEnv: env(0.09, 0.5, 0.88, 0.3), filtEnv: env(0.16, 0.5, 0.5, 0.26),
    lfo: { wave: 'sine', rate: 6, depth: 0.1, target: 'pitch', delay: 0.3, fade: 0.5 },
    gain: 0.46, sends: { reverb: 0.4 }, defaultNote: 72
  },
  {
    id: 'str_spiccato', name: 'Spiccato', tags: ['short', 'bouncing'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 3, spread: 12, width: 0.8 }],
    noise: { color: 'white', level: 0.22, bp: 3400, q: 2, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 2200, q: 2.6, env: 2.4, keytrack: 0.65, velToEnv: 0.85 },
    ampEnv: env(0.004, 0.16, 0.0, 0.07), filtEnv: env(0.004, 0.1, 0.05, 0.06),
    gain: 0.44, sends: { reverb: 0.34 }, defaultNote: 60
  },
  {
    id: 'str_fiddle', name: 'Fiddle', tags: ['folk', 'raw'],
    oscs: [{ wave: 'razor', level: 0.85 }, { wave: 'reed', level: 0.35, cent: 8 }],
    noise: { color: 'white', level: 0.18, bp: 4600, q: 1.6 },
    filter: { type: 'lowpass', cutoff: 2800, q: 2.2, env: 1.6, keytrack: 0.7 },
    ampEnv: env(0.03, 0.35, 0.9, 0.2), filtEnv: env(0.06, 0.4, 0.5, 0.2),
    lfo: { wave: 'sine', rate: 6.6, depth: 0.16, target: 'pitch', delay: 0.2, fade: 0.3 },
    shaper: { curve: 'tube', drive: 0.28 },
    gain: 0.46, sends: { reverb: 0.3 }, defaultNote: 69
  },
  {
    id: 'str_bowed_pad', name: 'Bowed Pad', tags: ['sustain', 'lush'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 5, spread: 20, width: 0.92 },
      { wave: 'hollow', level: 0.3, oct: -1 }
    ],
    noise: { color: 'pink', level: 0.1, bp: 3000, q: 1.2 },
    filter: { type: 'lowpass', cutoff: 1600, q: 1.8, env: 2, keytrack: 0.5 },
    ampEnv: env(0.9, 1.4, 0.92, 1.4), filtEnv: env(1.4, 1.4, 0.5, 1),
    lfo: { wave: 'sine', rate: 4.8, depth: 0.05, target: 'pitch', delay: 0.9, fade: 1.2 },
    gain: 0.34, sends: { reverb: 0.52 }, defaultNote: 55
  },
  {
    id: 'str_octet', name: 'String Octet', tags: ['ensemble', 'full'],
    oscs: [
      { wave: 'saw', level: 0.3, unison: 5, spread: 16 },
      { wave: 'saw', level: 0.24, oct: -1, unison: 2, spread: 9 },
      { wave: 'saw', level: 0.18, oct: 1, cent: 6 }
    ],
    filter: { type: 'lowpass', cutoff: 2800, q: 1.2, env: 1.2, keytrack: 0.6 },
    ampEnv: env(0.14, 1, 0.85, 0.5), filtEnv: env(0.2, 0.9, 0.6, 0.4),
    lfo: { wave: 'sine', rate: 5, depth: 0.012, target: 'pitch', delay: 0.4 },
    gain: 0.44, sends: { reverb: 0.48 }, defaultNote: 55
  },
  {
    id: 'str_solo_warm', name: 'Warm Solo Violin', tags: ['solo', 'warm'],
    oscs: [{ wave: 'saw', level: 0.6 }, { wave: 'triangle', level: 0.25, cent: 5 }],
    filter: { type: 'lowpass', cutoff: 2400, q: 2, env: 1.4, keytrack: 0.8 },
    ampEnv: env(0.1, 0.6, 0.85, 0.3), filtEnv: env(0.14, 0.6, 0.6, 0.24),
    lfo: { wave: 'sine', rate: 5.6, depth: 0.02, target: 'pitch', delay: 0.35 },
    gain: 0.72, sends: { reverb: 0.44 }, defaultNote: 67
  },
  {
    id: 'str_marcato', name: 'Marcato', tags: ['short', 'accent'],
    oscs: [{ wave: 'saw', level: 0.5, unison: 3, spread: 12 }],
    filter: { type: 'lowpass', cutoff: 2600, q: 2, env: 2, keytrack: 0.6, velToEnv: 0.8 },
    ampEnv: env(0.008, 0.3, 0.3, 0.14), filtEnv: env(0.01, 0.2, 0.2, 0.1),
    gain: 0.56, sends: { reverb: 0.36 }, defaultNote: 55
  },
  {
    id: 'str_harmonic_high', name: 'High Harmonics', tags: ['harmonic', 'thin'],
    oscs: [{ wave: 'sine', level: 0.6, oct: 1 }, { wave: 'glass', level: 0.3, oct: 2 }],
    noise: { color: 'white', level: 0.08, hp: 6000, decay: 0.4 },
    filter: { type: 'highpass', cutoff: 1400, q: 0.8 },
    ampEnv: env(0.14, 0.8, 0.7, 0.5),
    lfo: { wave: 'sine', rate: 4.8, depth: 0.012, target: 'pitch', delay: 0.4 },
    gain: 1.05, sends: { reverb: 0.5 }, defaultNote: 76
  },
  {
    id: 'str_bartok', name: 'Bartok Snap', tags: ['pizz', 'snap'],
    oscs: [{ wave: 'saw', level: 0.55 }],
    noise: { color: 'white', level: 0.3, bp: 2600, q: 1.4, decay: 0.02 },
    filter: { type: 'lowpass', cutoff: 3000, q: 3, env: 2.6, keytrack: 0.7 },
    ampEnv: env(0.001, 0.22, 0.0, 0.07), filtEnv: env(0.002, 0.1, 0.05, 0.05),
    gain: 0.78, sends: { reverb: 0.26 }, defaultNote: 55
  },
  {
    id: 'str_cello_solo', name: 'Solo Cello', tags: ['solo', 'low'],
    oscs: [{ wave: 'saw', level: 0.6 }, { wave: 'triangle', level: 0.3, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 1500, q: 2.2, env: 1.6, keytrack: 0.8 },
    ampEnv: env(0.1, 0.7, 0.85, 0.34), filtEnv: env(0.16, 0.7, 0.6, 0.26),
    lfo: { wave: 'sine', rate: 4.8, depth: 0.018, target: 'pitch', delay: 0.4 },
    gain: 0.78, sends: { reverb: 0.42 }, defaultNote: 45
  },
  {
    id: 'str_tremolo_high', name: 'High Tremolo', tags: ['tremolo', 'tense'],
    oscs: [{ wave: 'saw', level: 0.5, unison: 3, spread: 14 }],
    filter: { type: 'lowpass', cutoff: 3000, q: 1.6, env: 1.4, keytrack: 0.7 },
    ampEnv: env(0.1, 0.6, 0.85, 0.34), filtEnv: env(0.16, 0.6, 0.6, 0.26),
    lfo: { wave: 'sine', rate: 15, depth: 0.55, target: 'amp' },
    gain: 0.6, sends: { reverb: 0.44 }, defaultNote: 72
  },
  {
    id: 'str_sul_tasto', name: 'Sul Tasto', tags: ['soft', 'flute-like'],
    oscs: [{ wave: 'sine', level: 0.6 }, { wave: 'saw', level: 0.22, cent: 6 }],
    filter: { type: 'lowpass', cutoff: 1400, q: 1.4, env: 0.8, keytrack: 0.8 },
    ampEnv: env(0.2, 0.8, 0.85, 0.5), filtEnv: env(0.3, 0.8, 0.6, 0.3),
    lfo: { wave: 'sine', rate: 4.4, depth: 0.012, target: 'pitch', delay: 0.5 },
    gain: 0.9, sends: { reverb: 0.46 }, defaultNote: 64
  },
  {
    id: 'str_synth_ensemble', name: 'Synth Ensemble', tags: ['retro', 'wide'],
    oscs: [
      { wave: 'saw', level: 0.34, cent: -12, pan: -0.4 },
      { wave: 'saw', level: 0.34, cent: 12, pan: 0.4 },
      { wave: 'saw', level: 0.2, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 2600, q: 1.2, env: 1, keytrack: 0.5 },
    ampEnv: env(0.1, 0.8, 0.85, 0.4), filtEnv: env(0.16, 0.8, 0.65, 0.3),
    gain: 0.46, sends: { reverb: 0.42 }, defaultNote: 55,
    fx: [{ type: 'chorus', rate: 0.6, depth: 0.005, delay: 0.013, feedback: 0.18, mix: 0.45 }]
  },
  {
    id: 'str_dark_ensemble', name: 'Dark Ensemble', tags: ['low', 'ominous'],
    oscs: [{ wave: 'saw', level: 0.4, unison: 4, spread: 16 }, { wave: 'sub', level: 0.3, oct: -1 }],
    filter: { type: 'lowpass', cutoff: 1200, q: 1.8, env: 1.2, keytrack: 0.5 },
    ampEnv: env(0.2, 1, 0.85, 0.6), filtEnv: env(0.3, 1, 0.5, 0.4),
    gain: 0.56, sends: { reverb: 0.48 }, defaultNote: 40
  },
  {
    id: 'str_ponticello_high', name: 'Glassy Ponticello', tags: ['harsh', 'thin'],
    oscs: [{ wave: 'razor', level: 0.4 }, { wave: 'glass', level: 0.3, oct: 1 }],
    noise: { color: 'white', level: 0.14, hp: 5000, decay: 0.5 },
    filter: { type: 'highpass', cutoff: 1800, q: 1.2, env: 1, keytrack: 0.6 },
    ampEnv: env(0.1, 0.7, 0.8, 0.34), filtEnv: env(0.16, 0.7, 0.6, 0.26),
    gain: 0.68, sends: { reverb: 0.44 }, defaultNote: 72
  },
  {
    id: 'str_hit', name: 'String Hit', tags: ['stab', 'orchestral'],
    oscs: [
      { wave: 'saw', level: 0.4, unison: 4, spread: 18 },
      { wave: 'saw', level: 0.25, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 2400, q: 2.6, env: 2.4, keytrack: 0.5 },
    ampEnv: env(0.004, 0.34, 0.0, 0.12), filtEnv: env(0.006, 0.2, 0.05, 0.1),
    gain: 0.62, sends: { reverb: 0.4 }, defaultNote: 48
  }
];
