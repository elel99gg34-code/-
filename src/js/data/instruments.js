/* THE RACK — 130 instruments.
 *
 * Nothing here is a sample. Every instrument is a parameter set for the
 * synthesis engine in audio/voice.js, so the whole rack is a few kilobytes
 * and renders identically at any sample rate.
 *
 * kind 'drum'  -> triggerDrum()   : bodies + ring partials + noise + click
 * kind 'synth' -> triggerSynth()  : osc bank + sub + noise + FM + filter + env
 */

export const CATEGORIES = [
  { id: 'kick', name: 'Kicks', color: '#ff3b30', icon: '●' },
  { id: 'snare', name: 'Snares', color: '#ff9f0a', icon: '◍' },
  { id: 'hat', name: 'Hats', color: '#ffd60a', icon: '×' },
  { id: 'perc', name: 'Percussion', color: '#32d74b', icon: '◆' },
  { id: 'cymbal', name: 'Cymbals', color: '#66d4cf', icon: '◎' },
  { id: 'bass', name: 'Bass', color: '#0a84ff', icon: '▬' },
  { id: 'guitar', name: 'Guitars', color: '#bf5af2', icon: '⌇' },
  { id: 'lead', name: 'Leads', color: '#ff2d95', icon: '▲' },
  { id: 'pad', name: 'Pads', color: '#5e5ce6', icon: '▭' },
  { id: 'pluck', name: 'Plucks & Keys', color: '#64d2ff', icon: '♦' },
  { id: 'fx', name: 'FX & Noise', color: '#8e8e93', icon: '∿' }
];

/* Shorthand so the table below stays readable. */
const env = (a, d, s, r) => ({ a, d, s, r });

/* ================================================================== *
 * KICKS (12)
 * ================================================================== */
const KICKS = [
  {
    id: 'kick_riot', name: 'Riot Kick', tags: ['punchy', 'analog'],
    bodies: [{ wave: 'sine', f0: 148, f1: 47, pitchDecay: 0.035, curve: 2.2, decay: 0.34, level: 1 }],
    click: { level: 0.42, decay: 0.004, hp: 1400 },
    noises: [{ color: 'white', level: 0.16, hp: 2600, decay: 0.011 }],
    shaper: { curve: 'tube', drive: 0.32 }, gain: 0.95, defaultNote: 36
  },
  {
    id: 'kick_concrete', name: 'Concrete', tags: ['hard', 'industrial'],
    bodies: [{ wave: 'triangle', f0: 210, f1: 41, pitchDecay: 0.022, curve: 3, decay: 0.28, level: 1 }],
    click: { level: 0.7, decay: 0.0035, hp: 2400 },
    noises: [{ color: 'white', level: 0.24, hp: 3400, lp: 11000, decay: 0.008 }],
    shaper: { curve: 'hard', drive: 0.55 }, gain: 0.98, defaultNote: 36
  },
  {
    id: 'kick_808', name: '808 Sub', tags: ['sub', 'long'],
    bodies: [{ wave: 'sine', f0: 96, f1: 38, pitchDecay: 0.06, curve: 1.6, decay: 1.05, level: 1 }],
    click: { level: 0.2, decay: 0.003, hp: 1100 },
    shaper: { curve: 'saturate', drive: 0.22 }, gain: 0.92, defaultNote: 36
  },
  {
    id: 'kick_909', name: '909 Thump', tags: ['classic', 'dance'],
    bodies: [{ wave: 'sine', f0: 168, f1: 52, pitchDecay: 0.028, curve: 2, decay: 0.42, level: 1 }],
    click: { level: 0.46, decay: 0.0045, hp: 1800, tone: 'tick' },
    noises: [{ color: 'white', level: 0.12, hp: 4000, decay: 0.006 }],
    shaper: { curve: 'soft', drive: 0.3 }, gain: 0.94, defaultNote: 36
  },
  {
    id: 'kick_gabber', name: 'Gabber Core', tags: ['distorted', 'hardcore'],
    bodies: [{ wave: 'sine', f0: 260, f1: 44, pitchDecay: 0.03, curve: 2.6, decay: 0.5, level: 1 }],
    click: { level: 0.55, decay: 0.004, hp: 2000 },
    shaper: { curve: 'destroy', drive: 0.86 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.9 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_paper', name: 'Paper Cut', tags: ['tight', 'lofi'],
    bodies: [{ wave: 'sine', f0: 120, f1: 55, pitchDecay: 0.018, curve: 2, decay: 0.15, level: 0.9 }],
    click: { level: 0.5, decay: 0.005, hp: 900 },
    noises: [{ color: 'pink', level: 0.3, bp: 420, q: 1.1, decay: 0.05 }],
    filter: { type: 'lowpass', cutoff: 3200, q: 0.8 }, gain: 0.86, defaultNote: 36
  },
  {
    id: 'kick_boiler', name: 'Boiler Room', tags: ['deep', 'round'],
    bodies: [{ wave: 'sine', f0: 112, f1: 43, pitchDecay: 0.05, curve: 1.4, decay: 0.62, level: 1 }],
    noises: [{ color: 'brown', level: 0.2, lp: 260, decay: 0.09 }],
    shaper: { curve: 'tube', drive: 0.18 }, gain: 0.93, defaultNote: 36
  },
  {
    id: 'kick_sledge', name: 'Sledgehammer', tags: ['huge', 'slow'],
    bodies: [
      { wave: 'sine', f0: 180, f1: 40, pitchDecay: 0.045, curve: 2.4, decay: 0.7, level: 0.9 },
      { wave: 'triangle', f0: 78, f1: 36, pitchDecay: 0.12, decay: 0.85, level: 0.42 }
    ],
    click: { level: 0.38, decay: 0.006, hp: 700 },
    shaper: { curve: 'tube', drive: 0.45 }, gain: 0.96, defaultNote: 36
  },
  {
    id: 'kick_tin', name: 'Tin Can', tags: ['thin', 'trash'],
    bodies: [{ wave: 'square', f0: 240, f1: 88, pitchDecay: 0.02, curve: 2, decay: 0.1, level: 0.65 }],
    noises: [{ color: 'metal', level: 0.35, bp: 1400, q: 2.4, decay: 0.07 }],
    click: { level: 0.5, decay: 0.003, hp: 2600 },
    shaper: { curve: 'rect', drive: 0.5 }, gain: 0.8, defaultNote: 36
  },
  {
    id: 'kick_pitchdrop', name: 'Pitch Drop', tags: ['fx', 'long'],
    bodies: [{ wave: 'sine', f0: 420, f1: 33, pitchDecay: 0.3, curve: 1.2, decay: 0.8, level: 1 }],
    click: { level: 0.3, decay: 0.004, hp: 1600 },
    shaper: { curve: 'soft', drive: 0.25 }, gain: 0.9, defaultNote: 36
  },
  {
    id: 'kick_click', name: 'Click Kick', tags: ['minimal', 'tight'],
    bodies: [{ wave: 'sine', f0: 130, f1: 49, pitchDecay: 0.012, curve: 2.8, decay: 0.12, level: 1 }],
    click: { level: 0.85, decay: 0.0025, hp: 3200, tone: 'tick' },
    gain: 0.88, defaultNote: 36
  },
  {
    id: 'kick_dist', name: 'Overdriver', tags: ['distorted', 'mid'],
    bodies: [{ wave: 'triangle', f0: 190, f1: 48, pitchDecay: 0.026, curve: 2.2, decay: 0.38, level: 1 }],
    noises: [{ color: 'white', level: 0.2, hp: 1800, lp: 9000, decay: 0.03 }],
    shaper: { curve: 'fuzz', drive: 0.62 },
    filter: { type: 'lowpass', cutoff: 7200, q: 1.1 }, gain: 0.9, defaultNote: 36
  }
];

/* ================================================================== *
 * SNARES (12)
 * ================================================================== */
const SNARES = [
  {
    id: 'snr_riot', name: 'Riot Snare', tags: ['crack', 'punk'],
    bodies: [
      { wave: 'triangle', f0: 235, f1: 172, pitchDecay: 0.03, decay: 0.13, level: 0.55 },
      { wave: 'sine', f0: 340, f1: 258, pitchDecay: 0.02, decay: 0.09, level: 0.3 }
    ],
    noises: [{ color: 'white', level: 0.8, hp: 1500, lp: 9500, decay: 0.19 }],
    shaper: { curve: 'tube', drive: 0.4 }, gain: 0.82, defaultNote: 38
  },
  {
    id: 'snr_909', name: '909 Snap', tags: ['classic', 'dance'],
    bodies: [{ wave: 'triangle', f0: 245, f1: 190, pitchDecay: 0.02, decay: 0.1, level: 0.5 }],
    noises: [{ color: 'white', level: 0.72, hp: 2400, decay: 0.16 }],
    gain: 0.8, defaultNote: 38
  },
  {
    id: 'snr_rimshot', name: 'Rimshot', tags: ['tight', 'sharp'],
    bodies: [{ wave: 'square', f0: 1700, f1: 420, pitchDecay: 0.006, curve: 2, decay: 0.04, level: 0.6 }],
    noises: [{ color: 'white', level: 0.4, bp: 2600, q: 3.2, decay: 0.035 }],
    shaper: { curve: 'hard', drive: 0.45 }, gain: 0.78, defaultNote: 38
  },
  {
    id: 'snr_brick', name: 'Brickwall', tags: ['fat', 'compressed'],
    bodies: [{ wave: 'triangle', f0: 200, f1: 155, pitchDecay: 0.04, decay: 0.22, level: 0.6 }],
    noises: [
      { color: 'white', level: 0.6, hp: 900, lp: 7200, decay: 0.26 },
      { color: 'pink', level: 0.3, bp: 3200, q: 1.1, decay: 0.12 }
    ],
    shaper: { curve: 'hard', drive: 0.6 }, gain: 0.85, defaultNote: 38
  },
  {
    id: 'snr_tape', name: 'Tape Snare', tags: ['lofi', 'warm'],
    bodies: [{ wave: 'sine', f0: 215, f1: 168, pitchDecay: 0.035, decay: 0.15, level: 0.55 }],
    noises: [{ color: 'pink', level: 0.66, hp: 800, lp: 5200, decay: 0.2 }],
    filter: { type: 'lowpass', cutoff: 5600, q: 0.8 },
    shaper: { curve: 'saturate', drive: 0.35 }, gain: 0.8, defaultNote: 38
  },
  {
    id: 'snr_gated', name: 'Gated 80s', tags: ['big', 'gated'],
    bodies: [{ wave: 'triangle', f0: 190, f1: 150, pitchDecay: 0.05, decay: 0.2, level: 0.5 }],
    noises: [{ color: 'white', level: 0.85, hp: 600, lp: 8800, hold: 0.09, holdLevel: 0.9, decay: 0.05 }],
    shaper: { curve: 'soft', drive: 0.3 }, gain: 0.86, sends: { reverb: 0.3 }, defaultNote: 38
  },
  {
    id: 'snr_trash', name: 'Trashcan', tags: ['noisy', 'metal'],
    bodies: [{ wave: 'square', f0: 310, f1: 210, pitchDecay: 0.02, decay: 0.08, level: 0.35 }],
    noises: [
      { color: 'metal', level: 0.7, hp: 1800, decay: 0.3 },
      { color: 'white', level: 0.4, bp: 5200, q: 1.4, decay: 0.12 }
    ],
    shaper: { curve: 'rect', drive: 0.55 }, gain: 0.78, defaultNote: 38
  },
  {
    id: 'snr_clapsnr', name: 'Clap Snare', tags: ['layered', 'wide'],
    bodies: [{ wave: 'triangle', f0: 225, f1: 180, pitchDecay: 0.025, decay: 0.1, level: 0.4 }],
    noises: [
      { color: 'white', level: 0.55, bp: 1400, q: 1.1, decay: 0.03 },
      { color: 'white', level: 0.6, bp: 2200, q: 0.9, attack: 0.012, decay: 0.19 }
    ],
    gain: 0.8, defaultNote: 38
  },
  {
    id: 'snr_ghost', name: 'Ghost Note', tags: ['soft', 'roll'],
    bodies: [{ wave: 'sine', f0: 190, f1: 160, pitchDecay: 0.02, decay: 0.05, level: 0.25 }],
    noises: [{ color: 'pink', level: 0.4, hp: 1600, lp: 6000, decay: 0.06 }],
    gain: 0.55, velCurve: 1.6, defaultNote: 38
  },
  {
    id: 'snr_dnb', name: 'Amen Crack', tags: ['breakbeat', 'bright'],
    bodies: [{ wave: 'triangle', f0: 268, f1: 205, pitchDecay: 0.018, decay: 0.09, level: 0.5 }],
    noises: [
      { color: 'white', level: 0.8, hp: 2800, lp: 13000, decay: 0.14 },
      { color: 'blue', level: 0.3, hp: 6000, decay: 0.05 }
    ],
    shaper: { curve: 'hard', drive: 0.5 }, gain: 0.83, defaultNote: 38
  },
  {
    id: 'snr_industrial', name: 'Steel Mill', tags: ['industrial', 'long'],
    bodies: [{ wave: 'square', f0: 165, f1: 132, pitchDecay: 0.06, decay: 0.3, level: 0.4, fm: 2.2, fmRatio: 2.7, fmDecay: 0.05 }],
    noises: [{ color: 'metal', level: 0.6, bp: 3400, q: 0.8, decay: 0.42 }],
    shaper: { curve: 'diode', drive: 0.6 }, gain: 0.8, sends: { reverb: 0.22 }, defaultNote: 38
  },
  {
    id: 'snr_pitch', name: 'Pitchbend Snare', tags: ['fx', 'sweep'],
    bodies: [{ wave: 'triangle', f0: 520, f1: 150, pitchDecay: 0.09, curve: 1.5, decay: 0.24, level: 0.55 }],
    noises: [{ color: 'white', level: 0.6, bp: 2600, q: 1.2, sweep: 3, sweepTime: 0.1, decay: 0.2 }],
    shaper: { curve: 'fuzz', drive: 0.4 }, gain: 0.8, defaultNote: 38
  }
];

/* ================================================================== *
 * HATS (12)
 * ================================================================== */
const HAT_PARTIALS = [1, 1.342, 1.7183, 2.0473, 2.6415, 3.1213];
const HATS = [
  {
    id: 'hat_closed', name: 'Closed Hat', tags: ['tight'],
    ring: { partials: HAT_PARTIALS, base: 320, wave: 'square', filter: 'highpass', cut: 7400, q: 0.9, decay: 0.05, level: 0.45 },
    noises: [{ color: 'white', level: 0.2, hp: 8000, decay: 0.035 }],
    gain: 0.5, defaultNote: 42
  },
  {
    id: 'hat_open', name: 'Open Hat', tags: ['long'],
    ring: { partials: HAT_PARTIALS, base: 320, wave: 'square', filter: 'highpass', cut: 6800, q: 0.9, decay: 0.42, level: 0.45, hold: 0.06 },
    noises: [{ color: 'white', level: 0.25, hp: 7000, decay: 0.34 }],
    gain: 0.48, defaultNote: 46
  },
  {
    id: 'hat_pedal', name: 'Pedal Hat', tags: ['short', 'dark'],
    ring: { partials: HAT_PARTIALS, base: 280, wave: 'square', filter: 'bandpass', cut: 5200, q: 1.4, decay: 0.035, level: 0.4 },
    gain: 0.45, defaultNote: 44
  },
  {
    id: 'hat_shuffle', name: 'Shuffle Tick', tags: ['tiny'],
    noises: [{ color: 'white', level: 0.6, bp: 9800, q: 2.6, decay: 0.018 }],
    click: { level: 0.3, decay: 0.002, hp: 6000 },
    gain: 0.42, defaultNote: 42
  },
  {
    id: 'hat_metal', name: 'Metal Hat', tags: ['harsh', 'metal'],
    ring: { partials: [1, 1.31, 1.83, 2.41, 3.07, 4.13], base: 460, wave: 'square', filter: 'highpass', cut: 6200, q: 1.1, decay: 0.09, level: 0.5 },
    noises: [{ color: 'metal', level: 0.3, hp: 6500, decay: 0.07 }],
    shaper: { curve: 'rect', drive: 0.4 }, gain: 0.46, defaultNote: 42
  },
  {
    id: 'hat_noise', name: 'Noise Hat', tags: ['digital'],
    noises: [{ color: 'blue', level: 0.7, hp: 7500, decay: 0.045 }],
    gain: 0.45, defaultNote: 42
  },
  {
    id: 'hat_lofi', name: 'Lo-Fi Hat', tags: ['lofi', 'dark'],
    ring: { partials: HAT_PARTIALS, base: 300, wave: 'square', filter: 'bandpass', cut: 4200, q: 1.1, decay: 0.06, level: 0.4 },
    filter: { type: 'lowpass', cutoff: 6500, q: 0.8 },
    shaper: { curve: 'crush', drive: 0.55 }, gain: 0.44, defaultNote: 42
  },
  {
    id: 'hat_sizzle', name: 'Sizzle', tags: ['bright', 'long'],
    noises: [{ color: 'violet', level: 0.55, hp: 9500, decay: 0.55, hold: 0.04, holdLevel: 0.7 }],
    ring: { partials: [1, 1.61, 2.32, 3.47], base: 720, wave: 'sine', filter: 'highpass', cut: 9000, decay: 0.4, level: 0.18 },
    gain: 0.4, sends: { reverb: 0.12 }, defaultNote: 46
  },
  {
    id: 'hat_click', name: 'Click Hat', tags: ['minimal'],
    click: { level: 0.9, decay: 0.0035, hp: 8200 },
    noises: [{ color: 'white', level: 0.25, hp: 11000, decay: 0.008 }],
    gain: 0.46, defaultNote: 42
  },
  {
    id: 'hat_glass', name: 'Glass Hat', tags: ['clean', 'tonal'],
    ring: { partials: [1, 2.756, 5.404, 8.933], base: 1100, wave: 'sine', filter: 'highpass', cut: 4200, decay: 0.16, level: 0.4 },
    noises: [{ color: 'white', level: 0.14, hp: 9800, decay: 0.03 }],
    gain: 0.44, sends: { reverb: 0.1 }, defaultNote: 42
  },
  {
    id: 'hat_grit', name: 'Grit Hat', tags: ['distorted'],
    noises: [{ color: 'white', level: 0.62, bp: 7200, q: 0.8, decay: 0.07 }],
    shaper: { curve: 'destroy', drive: 0.55 },
    filter: { type: 'highpass', cutoff: 4600, q: 1.2 }, gain: 0.42, defaultNote: 42
  },
  {
    id: 'hat_reverse', name: 'Reverse Hat', tags: ['fx', 'swell'],
    noises: [{ color: 'white', level: 0.6, hp: 6500, attack: 0.075, decay: 0.02 }],
    gain: 0.46, defaultNote: 42
  }
];

/* ================================================================== *
 * PERCUSSION (14)
 * ================================================================== */
const PERC = [
  {
    id: 'perc_clap', name: 'Riot Clap', tags: ['clap', 'wide'],
    noises: [
      { color: 'white', level: 0.5, bp: 1150, q: 1.1, decay: 0.012 },
      { color: 'white', level: 0.5, bp: 1250, q: 1.1, attack: 0.011, decay: 0.014 },
      { color: 'white', level: 0.5, bp: 1350, q: 1, attack: 0.022, decay: 0.016 },
      { color: 'white', level: 0.62, bp: 1500, q: 0.75, attack: 0.033, decay: 0.19 }
    ],
    gain: 0.68, sends: { reverb: 0.1 }, defaultNote: 39
  },
  {
    id: 'perc_clap_crowd', name: 'Crowd Clap', tags: ['clap', 'big'],
    noises: [
      { color: 'pink', level: 0.45, bp: 900, q: 0.8, decay: 0.02 },
      { color: 'pink', level: 0.5, bp: 1200, q: 0.7, attack: 0.018, decay: 0.05 },
      { color: 'pink', level: 0.55, bp: 1700, q: 0.5, attack: 0.04, decay: 0.42 }
    ],
    gain: 0.64, sends: { reverb: 0.3 }, defaultNote: 39
  },
  {
    id: 'perc_snap', name: 'Finger Snap', tags: ['clap', 'tight'],
    noises: [{ color: 'white', level: 0.7, bp: 2400, q: 2.2, decay: 0.035 }],
    click: { level: 0.4, decay: 0.002, hp: 3200 }, gain: 0.6, defaultNote: 39
  },
  {
    id: 'perc_tom_lo', name: 'Low Tom', tags: ['tom'],
    bodies: [{ wave: 'sine', f0: 138, f1: 88, pitchDecay: 0.09, decay: 0.42, level: 1 }],
    noises: [{ color: 'pink', level: 0.14, lp: 1600, decay: 0.05 }],
    shaper: { curve: 'tube', drive: 0.2 }, gain: 0.78, defaultNote: 41
  },
  {
    id: 'perc_tom_mid', name: 'Mid Tom', tags: ['tom'],
    bodies: [{ wave: 'sine', f0: 195, f1: 128, pitchDecay: 0.07, decay: 0.34, level: 1 }],
    noises: [{ color: 'pink', level: 0.14, lp: 2200, decay: 0.045 }],
    shaper: { curve: 'tube', drive: 0.2 }, gain: 0.76, defaultNote: 45
  },
  {
    id: 'perc_tom_hi', name: 'High Tom', tags: ['tom'],
    bodies: [{ wave: 'sine', f0: 268, f1: 178, pitchDecay: 0.055, decay: 0.26, level: 1 }],
    noises: [{ color: 'pink', level: 0.14, lp: 3000, decay: 0.04 }],
    shaper: { curve: 'tube', drive: 0.2 }, gain: 0.75, defaultNote: 48
  },
  {
    id: 'perc_rim', name: 'Rim Click', tags: ['tick', 'wood'],
    bodies: [{ wave: 'square', f0: 1420, f1: 900, pitchDecay: 0.005, decay: 0.03, level: 0.5 }],
    noises: [{ color: 'white', level: 0.3, bp: 3200, q: 4, decay: 0.02 }],
    gain: 0.6, defaultNote: 37
  },
  {
    id: 'perc_wood', name: 'Wood Block', tags: ['wood', 'tonal'],
    ring: { partials: [1, 2.42, 4.11], base: 780, wave: 'sine', filter: 'bandpass', cut: 1800, q: 0.9, decay: 0.09, level: 0.6 },
    click: { level: 0.35, decay: 0.002, hp: 2200 }, gain: 0.62, defaultNote: 37
  },
  {
    id: 'perc_cowbell', name: 'Riot Bell', tags: ['metal', 'tonal'],
    ring: { partials: [1, 1.5], base: 540, wave: 'square', filter: 'bandpass', cut: 2600, q: 0.7, decay: 0.28, level: 0.5 },
    shaper: { curve: 'hard', drive: 0.3 }, gain: 0.55, defaultNote: 56
  },
  {
    id: 'perc_conga', name: 'Conga', tags: ['hand', 'tonal'],
    bodies: [{ wave: 'sine', f0: 320, f1: 250, pitchDecay: 0.04, decay: 0.2, level: 0.9 }],
    noises: [{ color: 'pink', level: 0.2, bp: 1100, q: 1.2, decay: 0.03 }],
    gain: 0.68, defaultNote: 47
  },
  {
    id: 'perc_shaker', name: 'Shaker', tags: ['noise', 'tiny'],
    noises: [{ color: 'white', level: 0.55, bp: 8200, q: 1.3, attack: 0.006, decay: 0.05 }],
    gain: 0.42, defaultNote: 70
  },
  {
    id: 'perc_tambourine', name: 'Tambourine', tags: ['metal', 'jingle'],
    ring: { partials: [1, 1.73, 2.51, 3.29, 4.77], base: 1900, wave: 'square', filter: 'highpass', cut: 6800, q: 0.8, decay: 0.2, level: 0.32 },
    noises: [{ color: 'violet', level: 0.3, hp: 8000, decay: 0.16 }],
    gain: 0.42, defaultNote: 54
  },
  {
    id: 'perc_anvil', name: 'Anvil', tags: ['industrial', 'metal'],
    ring: { partials: [1, 2.13, 3.41, 5.02, 7.13], base: 620, wave: 'square', filter: 'bandpass', cut: 2800, q: 0.6, decay: 0.9, level: 0.45 },
    click: { level: 0.7, decay: 0.003, hp: 3000 },
    shaper: { curve: 'diode', drive: 0.5 }, gain: 0.6, sends: { reverb: 0.25 }, defaultNote: 53
  },
  {
    id: 'perc_glassbreak', name: 'Glass Break', tags: ['fx', 'noise'],
    noises: [
      { color: 'crackle', level: 0.8, hp: 3200, decay: 0.42 },
      { color: 'violet', level: 0.35, hp: 7000, decay: 0.18 }
    ],
    ring: { partials: [1, 2.3, 3.9, 6.1, 9.4], base: 2200, wave: 'sine', filter: 'highpass', cut: 2500, decay: 0.35, level: 0.22 },
    gain: 0.56, sends: { reverb: 0.2 }, defaultNote: 53
  }
];

/* ================================================================== *
 * CYMBALS (6)
 * ================================================================== */
const CYM_PARTIALS = [1, 1.411, 1.8372, 2.4131, 2.9631, 3.7412, 4.4419, 5.7133];
const CYMBALS = [
  {
    id: 'cym_crash', name: 'Crash', tags: ['big', 'long'],
    ring: { partials: CYM_PARTIALS, base: 296, wave: 'square', filter: 'highpass', cut: 3400, q: 0.6, decay: 1.5, level: 0.36, hold: 0.1 },
    noises: [{ color: 'white', level: 0.3, hp: 4200, decay: 1.2, hold: 0.06, holdLevel: 0.8 }],
    gain: 0.5, sends: { reverb: 0.2 }, defaultNote: 49
  },
  {
    id: 'cym_ride', name: 'Ride', tags: ['ping', 'sustain'],
    ring: { partials: CYM_PARTIALS, base: 420, wave: 'square', filter: 'bandpass', cut: 5600, q: 0.5, decay: 1.1, level: 0.3 },
    click: { level: 0.4, decay: 0.003, hp: 5200 },
    gain: 0.45, sends: { reverb: 0.12 }, defaultNote: 51
  },
  {
    id: 'cym_china', name: 'China Trash', tags: ['trashy', 'harsh'],
    ring: { partials: [1, 1.19, 1.87, 2.41, 3.33, 4.71, 6.17], base: 340, wave: 'square', filter: 'highpass', cut: 2800, q: 0.4, decay: 0.85, level: 0.42 },
    noises: [{ color: 'metal', level: 0.4, hp: 3600, decay: 0.75 }],
    shaper: { curve: 'rect', drive: 0.45 }, gain: 0.5, sends: { reverb: 0.16 }, defaultNote: 52
  },
  {
    id: 'cym_splash', name: 'Splash', tags: ['short', 'bright'],
    ring: { partials: CYM_PARTIALS, base: 520, wave: 'square', filter: 'highpass', cut: 5200, q: 0.6, decay: 0.45, level: 0.34 },
    noises: [{ color: 'violet', level: 0.28, hp: 7000, decay: 0.34 }],
    gain: 0.46, sends: { reverb: 0.16 }, defaultNote: 55
  },
  {
    id: 'cym_reverse', name: 'Reverse Crash', tags: ['fx', 'swell'],
    noises: [{ color: 'white', level: 0.7, hp: 2600, attack: 0.65, decay: 0.05 }],
    ring: { partials: CYM_PARTIALS, base: 300, wave: 'square', filter: 'highpass', cut: 3000, decay: 0.05, level: 0.3, attack: 0.62 },
    gain: 0.52, sends: { reverb: 0.25 }, defaultNote: 49
  },
  {
    id: 'cym_gong', name: 'Riot Gong', tags: ['huge', 'metal'],
    ring: { partials: [1, 1.21, 1.63, 2.17, 2.84, 3.51, 4.62, 6.03], base: 96, wave: 'sine', filter: 'bandpass', cut: 900, q: 0.35, decay: 3.4, level: 0.55, hold: 0.4 },
    noises: [{ color: 'metal', level: 0.25, bp: 1400, q: 0.5, decay: 2.6, hold: 0.3, holdLevel: 0.8 }],
    shaper: { curve: 'tube', drive: 0.28 }, gain: 0.55, sends: { reverb: 0.4 }, defaultNote: 45
  }
];

/* ================================================================== *
 * BASS (18)
 * ================================================================== */
const BASSES = [
  {
    id: 'bass_riot', name: 'Riot Bass', tags: ['distorted', 'driving'],
    oscs: [{ wave: 'sawtooth', level: 1, unison: 2, spread: 7, width: 0.25 }],
    sub: { wave: 'sine', oct: -1, level: 0.5, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 620, q: 5, env: 2.1, keytrack: 0.4, poles: 4 },
    ampEnv: env(0.004, 0.12, 0.85, 0.09), filtEnv: env(0.002, 0.14, 0.32, 0.08),
    shaper: { curve: 'tube', drive: 0.48 }, gain: 0.7, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_sub', name: 'Deep Sub', tags: ['sub', 'clean'],
    oscs: [{ wave: 'sine', level: 1 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 320, q: 0.7, env: 0.6, keytrack: 0.6 },
    ampEnv: env(0.008, 0.2, 0.95, 0.14), filtEnv: env(0.01, 0.2, 0.6, 0.1),
    shaper: { curve: 'saturate', drive: 0.12 }, gain: 0.85, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_reese', name: 'Reese', tags: ['wide', 'detuned'],
    oscs: [
      { wave: 'sawtooth', level: 0.8, cent: -14, unison: 2, spread: 9 },
      { wave: 'sawtooth', level: 0.8, cent: 15, unison: 2, spread: 9 }
    ],
    sub: { wave: 'sine', oct: -1, level: 0.42, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 760, q: 3.2, env: 1.4, keytrack: 0.35, poles: 4 },
    ampEnv: env(0.01, 0.3, 0.9, 0.16), filtEnv: env(0.02, 0.4, 0.4, 0.12),
    lfo: { wave: 'sine', rate: 0.22, depth: 0.28, target: 'filter', fade: 0.4 },
    shaper: { curve: 'soft', drive: 0.3 }, gain: 0.62, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_acid', name: 'Acid 303', tags: ['acid', 'squelch'],
    oscs: [{ wave: 'sawtooth', level: 1 }],
    filter: { type: 'lowpass', cutoff: 380, q: 14, env: 3.4, keytrack: 0.25, velToEnv: 0.8, poles: 4 },
    ampEnv: env(0.003, 0.28, 0.0, 0.05), filtEnv: env(0.003, 0.24, 0.05, 0.06),
    shaper: { curve: 'diode', drive: 0.42 }, glide: 0.055, gain: 0.66, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_acid_sq', name: 'Acid Square', tags: ['acid', 'hollow'],
    oscs: [{ wave: 'square', level: 1 }],
    filter: { type: 'lowpass', cutoff: 320, q: 16, env: 3.6, keytrack: 0.2, velToEnv: 0.85, poles: 4 },
    ampEnv: env(0.003, 0.3, 0.0, 0.05), filtEnv: env(0.002, 0.2, 0.04, 0.05),
    shaper: { curve: 'diode', drive: 0.5 }, glide: 0.06, gain: 0.64, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_fuzz', name: 'Fuzz Bass', tags: ['fuzz', 'punk'],
    oscs: [{ wave: 'razor', level: 1, unison: 2, spread: 5, width: 0.2 }],
    sub: { wave: 'square', oct: -1, level: 0.3 },
    filter: { type: 'lowpass', cutoff: 1600, q: 2.4, env: 1.1, keytrack: 0.35 },
    ampEnv: env(0.004, 0.16, 0.8, 0.1), filtEnv: env(0.003, 0.18, 0.3, 0.09),
    shaper: { curve: 'fuzz', drive: 0.72, oversample: '4x' }, gain: 0.52, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_pick', name: 'Picked Bass', tags: ['organic', 'attack'],
    oscs: [
      { wave: 'sawtooth', level: 0.8 },
      { wave: 'square', level: 0.35, cent: 6 }
    ],
    noise: { color: 'white', level: 0.2, bp: 2400, q: 1.6, decay: 0.028 },
    filter: { type: 'lowpass', cutoff: 1400, q: 2.2, env: 2.2, keytrack: 0.5, velToEnv: 0.7 },
    ampEnv: env(0.002, 0.25, 0.55, 0.12), filtEnv: env(0.001, 0.12, 0.18, 0.08),
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.62, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_slap', name: 'Slap', tags: ['funk', 'bright'],
    oscs: [{ wave: 'sawtooth', level: 0.9 }, { wave: 'pulse25', level: 0.4, oct: 1 }],
    noise: { color: 'white', level: 0.3, bp: 3800, q: 2.4, decay: 0.018 },
    filter: { type: 'lowpass', cutoff: 900, q: 6, env: 3.2, keytrack: 0.5, velToEnv: 0.9 },
    ampEnv: env(0.001, 0.2, 0.35, 0.09), filtEnv: env(0.001, 0.07, 0.1, 0.06),
    shaper: { curve: 'soft', drive: 0.28 }, gain: 0.6, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_fm', name: 'FM Growl', tags: ['fm', 'metallic'],
    oscs: [{ wave: 'sine', level: 1 }],
    fm: { ratio: 2.005, index: 5.5, wave: 'sine', decay: 0.22, sustain: 0.18 },
    filter: { type: 'lowpass', cutoff: 1800, q: 1.6, env: 1.2, keytrack: 0.4 },
    ampEnv: env(0.004, 0.22, 0.8, 0.12), filtEnv: env(0.004, 0.2, 0.3, 0.1),
    shaper: { curve: 'soft', drive: 0.25 }, gain: 0.66, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_growl', name: 'Neuro Growl', tags: ['neuro', 'modulated'],
    oscs: [{ wave: 'grind', level: 0.9, unison: 2, spread: 11 }],
    sub: { wave: 'sine', oct: -1, level: 0.4, bypassFilter: true },
    fm: { ratio: 1.5, index: 2.2, decay: 0.3, sustain: 0.4 },
    filter: { type: 'bandpass', cutoff: 520, q: 7, env: 2.6, keytrack: 0.2, poles: 4 },
    ampEnv: env(0.006, 0.3, 0.85, 0.1), filtEnv: env(0.01, 0.22, 0.4, 0.1),
    lfo: { wave: 'triangle', rate: 5.5, depth: 0.5, target: 'filter', fade: 0.06 },
    shaper: { curve: 'fold', drive: 0.55 }, gain: 0.58, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_wobble', name: 'Wobbler', tags: ['dubstep', 'lfo'],
    oscs: [{ wave: 'sawtooth', level: 0.9, unison: 3, spread: 12 }],
    sub: { wave: 'sine', oct: -1, level: 0.45, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 340, q: 9, env: 1.2, keytrack: 0.15, poles: 4 },
    ampEnv: env(0.008, 0.3, 0.95, 0.12), filtEnv: env(0.01, 0.3, 0.6, 0.1),
    lfo: { wave: 'sine', rate: 3.5, depth: 1.1, target: 'filter', fade: 0.02 },
    shaper: { curve: 'saturate', drive: 0.4 }, gain: 0.6, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_saw8', name: 'Octave Saw', tags: ['wide', 'bright'],
    oscs: [
      { wave: 'sawtooth', level: 0.8 },
      { wave: 'sawtooth', level: 0.45, oct: 1, cent: 6, unison: 2, spread: 10 }
    ],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 1500, q: 2, env: 1.4, keytrack: 0.45 },
    ampEnv: env(0.004, 0.2, 0.85, 0.1), filtEnv: env(0.004, 0.2, 0.35, 0.09),
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.6, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_synthwave', name: 'Synthwave Bass', tags: ['retro', 'pulse'],
    oscs: [{ wave: 'pulse25', level: 0.9 }, { wave: 'sawtooth', level: 0.5, cent: -8 }],
    sub: { wave: 'sine', oct: -1, level: 0.3, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 1100, q: 3.4, env: 1.7, keytrack: 0.4 },
    ampEnv: env(0.006, 0.25, 0.7, 0.14), filtEnv: env(0.005, 0.22, 0.25, 0.1),
    shaper: { curve: 'soft', drive: 0.25 }, gain: 0.6, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_rumble', name: 'Rumble', tags: ['sub', 'noise'],
    oscs: [{ wave: 'sine', level: 0.9 }],
    sub: { wave: 'sine', oct: -1, level: 0.5, bypassFilter: true },
    noise: { color: 'brown', level: 0.35, lp: 180 },
    filter: { type: 'lowpass', cutoff: 200, q: 1.4, env: 0.4, keytrack: 0.5 },
    ampEnv: env(0.05, 0.4, 1, 0.5), filtEnv: env(0.1, 0.3, 0.7, 0.3),
    gain: 0.82, poly: 1, defaultNote: 28
  },
  {
    id: 'bass_gritclick', name: 'Grit Click', tags: ['digital', 'short'],
    oscs: [{ wave: 'wire', level: 1 }],
    noise: { color: 'blue', level: 0.25, hp: 2200, decay: 0.012 },
    filter: { type: 'lowpass', cutoff: 800, q: 8, env: 2.8, keytrack: 0.3, velToEnv: 0.9 },
    ampEnv: env(0.001, 0.12, 0.2, 0.05), filtEnv: env(0.001, 0.08, 0.06, 0.04),
    shaper: { curve: 'crush', drive: 0.35 }, gain: 0.6, poly: 1, defaultNote: 36
  },
  {
    id: 'bass_organ', name: 'Organ Bass', tags: ['warm', 'round'],
    oscs: [{ wave: 'organ', level: 1 }, { wave: 'sine', level: 0.4, oct: 1 }],
    filter: { type: 'lowpass', cutoff: 1300, q: 1, env: 0.5, keytrack: 0.5 },
    ampEnv: env(0.012, 0.2, 0.92, 0.1), filtEnv: env(0.02, 0.2, 0.6, 0.1),
    shaper: { curve: 'tube', drive: 0.22 }, gain: 0.66, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_dirtysub', name: 'Dirty Sub', tags: ['sub', 'distorted'],
    oscs: [{ wave: 'sine', level: 1 }],
    sub: { wave: 'sine', oct: -1, level: 0.4, bypassFilter: true },
    filter: { type: 'lowpass', cutoff: 420, q: 2.6, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.006, 0.24, 0.9, 0.12), filtEnv: env(0.004, 0.2, 0.4, 0.1),
    shaper: { curve: 'destroy', drive: 0.5 }, gain: 0.62, poly: 1, defaultNote: 33
  },
  {
    id: 'bass_talk', name: 'Talkbox Bass', tags: ['formant', 'vocal'],
    oscs: [{ wave: 'vox', level: 1, unison: 2, spread: 6 }],
    sub: { wave: 'sine', oct: -1, level: 0.35, bypassFilter: true },
    filter: { type: 'bandpass', cutoff: 700, q: 5, env: 2.2, keytrack: 0.3, poles: 4 },
    ampEnv: env(0.008, 0.25, 0.8, 0.12), filtEnv: env(0.02, 0.3, 0.35, 0.12),
    lfo: { wave: 'triangle', rate: 2.1, depth: 0.45, target: 'filter', fade: 0.12 },
    shaper: { curve: 'tube', drive: 0.35 }, gain: 0.6, poly: 1, defaultNote: 33
  }
];

/* ================================================================== *
 * GUITARS (12) — plucked/strummed bodies built from filtered saws + noise
 * ================================================================== */
const GUITARS = [
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
  }
];

/* ================================================================== *
 * LEADS (18)
 * ================================================================== */
const LEADS = [
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
  }
];

/* ================================================================== *
 * PADS (10)
 * ================================================================== */
const PADS = [
  {
    id: 'pad_warm', name: 'Warm Wash', tags: ['soft', 'wide'],
    oscs: [
      { wave: 'sawtooth', level: 0.7, unison: 4, spread: 18, width: 0.9 },
      { wave: 'triangle', level: 0.4, oct: -1 }
    ],
    filter: { type: 'lowpass', cutoff: 1500, q: 1.2, env: 1.4, keytrack: 0.4 },
    ampEnv: env(0.6, 1.2, 0.9, 1.1), filtEnv: env(1.2, 1.5, 0.6, 0.9),
    lfo: { wave: 'sine', rate: 0.18, depth: 0.3, target: 'filter', fade: 1.5 },
    gain: 0.3, sends: { reverb: 0.4 }, defaultNote: 55,
    fx: [{ type: 'chorus', rate: 0.22, depth: 0.006, mix: 0.45 }]
  },
  {
    id: 'pad_glass', name: 'Glass House', tags: ['bright', 'shimmer'],
    oscs: [
      { wave: 'glass', level: 0.8, unison: 3, spread: 12, width: 0.8 },
      { wave: 'sine', level: 0.3, oct: 1 }
    ],
    filter: { type: 'lowpass', cutoff: 4600, q: 1, env: 1, keytrack: 0.6 },
    ampEnv: env(0.5, 1.5, 0.85, 1.4), filtEnv: env(0.9, 1.4, 0.7, 1),
    gain: 0.28, sends: { reverb: 0.5, delay: 0.16 }, defaultNote: 67
  },
  {
    id: 'pad_dark', name: 'Blackout', tags: ['dark', 'ominous'],
    oscs: [
      { wave: 'hollow', level: 0.8, unison: 3, spread: 14 },
      { wave: 'sawtooth', level: 0.4, oct: -1, cent: 8 }
    ],
    noise: { color: 'brown', level: 0.15, lp: 900 },
    filter: { type: 'lowpass', cutoff: 620, q: 2.2, env: 1.2, keytrack: 0.35 },
    ampEnv: env(1.2, 2, 0.9, 1.8), filtEnv: env(2, 2, 0.5, 1.4),
    lfo: { wave: 'sine', rate: 0.09, depth: 0.4, target: 'filter', fade: 2 },
    gain: 0.32, sends: { reverb: 0.5 }, defaultNote: 43
  },
  {
    id: 'pad_strings', name: 'Riot Strings', tags: ['strings', 'lush'],
    oscs: [
      { wave: 'sawtooth', level: 0.75, unison: 5, spread: 16, width: 0.9 },
      { wave: 'reed', level: 0.3, cent: -9 }
    ],
    filter: { type: 'lowpass', cutoff: 2400, q: 1.1, env: 1.5, keytrack: 0.5 },
    ampEnv: env(0.28, 0.9, 0.9, 0.7), filtEnv: env(0.4, 1, 0.55, 0.6),
    lfo: { wave: 'sine', rate: 4.8, depth: 0.05, target: 'pitch', delay: 0.5, fade: 0.8 },
    gain: 0.3, sends: { reverb: 0.4 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.5, depth: 0.004, mix: 0.4 }]
  },
  {
    id: 'pad_choir', name: 'Riot Choir', tags: ['vocal', 'ethereal'],
    oscs: [{ wave: 'vox', level: 0.85, unison: 4, spread: 20, width: 0.9 }],
    filter: { type: 'bandpass', cutoff: 900, q: 2, env: 1.4, keytrack: 0.6 },
    ampEnv: env(0.5, 1.2, 0.9, 1.2), filtEnv: env(0.8, 1.2, 0.6, 0.9),
    lfo: { wave: 'sine', rate: 4.4, depth: 0.06, target: 'pitch', delay: 0.6, fade: 1 },
    gain: 0.3, sends: { reverb: 0.55 }, defaultNote: 64
  },
  {
    id: 'pad_drone', name: 'Industrial Drone', tags: ['drone', 'noise'],
    oscs: [{ wave: 'buzz', level: 0.6, unison: 3, spread: 7 }, { wave: 'sine', level: 0.4, oct: -1 }],
    noise: { color: 'metal', level: 0.22, bp: 1400, q: 0.7 },
    filter: { type: 'lowpass', cutoff: 1100, q: 3, env: 0.9, keytrack: 0.3 },
    ampEnv: env(1.5, 2, 0.95, 2.2), filtEnv: env(2.5, 2, 0.6, 1.6),
    lfo: { wave: 'triangle', rate: 0.07, depth: 0.5, target: 'filter', fade: 2.5 },
    shaper: { curve: 'tube', drive: 0.3 }, gain: 0.3, sends: { reverb: 0.45 }, defaultNote: 36
  },
  {
    id: 'pad_sweep', name: 'Sweep Pad', tags: ['filter', 'movement'],
    oscs: [{ wave: 'sawtooth', level: 0.8, unison: 4, spread: 20, width: 0.9 }],
    filter: { type: 'lowpass', cutoff: 400, q: 6, env: 3.4, keytrack: 0.3 },
    ampEnv: env(0.4, 1.4, 0.88, 1.2), filtEnv: env(2.4, 2.4, 0.3, 1.5),
    gain: 0.3, sends: { reverb: 0.4, delay: 0.16 }, defaultNote: 48
  },
  {
    id: 'pad_synthwave', name: 'Neon Pad', tags: ['retro', '80s'],
    oscs: [
      { wave: 'pulse25', level: 0.7, unison: 3, spread: 14, width: 0.8 },
      { wave: 'sawtooth', level: 0.45, cent: 11, unison: 2, spread: 8 }
    ],
    filter: { type: 'lowpass', cutoff: 2200, q: 1.8, env: 1.6, keytrack: 0.5 },
    ampEnv: env(0.24, 0.9, 0.85, 0.8), filtEnv: env(0.5, 1, 0.5, 0.6),
    gain: 0.28, sends: { reverb: 0.4, delay: 0.2 }, defaultNote: 60,
    fx: [{ type: 'chorus', rate: 0.35, depth: 0.005, mix: 0.5, feedback: 0.2 }]
  },
  {
    id: 'pad_bell', name: 'Bell Field', tags: ['bell', 'sparse'],
    oscs: [{ wave: 'bell', level: 0.9, unison: 2, spread: 8 }],
    fm: { ratio: 2.41, index: 1.4, decay: 1.2, sustain: 0.2 },
    filter: { type: 'lowpass', cutoff: 5200, q: 0.8, env: 0.7, keytrack: 0.7 },
    ampEnv: env(0.02, 2.4, 0.35, 2), filtEnv: env(0.05, 1.5, 0.3, 1.2),
    gain: 0.3, sends: { reverb: 0.55, delay: 0.24 }, defaultNote: 72
  },
  {
    id: 'pad_tape', name: 'Tape Wash', tags: ['lofi', 'warm'],
    oscs: [{ wave: 'hollow', level: 0.8, unison: 3, spread: 22, width: 0.85 }],
    noise: { color: 'vinyl', level: 0.12, lp: 6000 },
    filter: { type: 'lowpass', cutoff: 1800, q: 1, env: 1, keytrack: 0.4 },
    ampEnv: env(0.7, 1.4, 0.88, 1.3), filtEnv: env(1, 1.4, 0.55, 1),
    lfo: { wave: 'sine', rate: 0.42, depth: 0.14, target: 'pitch', fade: 1.2 },
    shaper: { curve: 'saturate', drive: 0.2 }, gain: 0.3, sends: { reverb: 0.42 }, defaultNote: 55
  }
];

/* ================================================================== *
 * PLUCKS & KEYS (10)
 * ================================================================== */
const PLUCKS = [
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
  }
];

/* ================================================================== *
 * FX & NOISE (6)
 * ================================================================== */
const FXINST = [
  {
    id: 'fx_riser', name: 'Riser', tags: ['transition', 'sweep'],
    oscs: [{ wave: 'sawtooth', level: 0.7, unison: 4, spread: 26, width: 0.95 }],
    noise: { color: 'white', level: 0.4, hp: 400 },
    filter: { type: 'bandpass', cutoff: 300, q: 4, env: 5.4, keytrack: 0.1 },
    ampEnv: env(1.2, 0.5, 0.95, 0.25), filtEnv: env(2.4, 0.4, 0.95, 0.2),
    pitchEnv: { amt: -12, d: 2.4 },
    gain: 0.34, sends: { reverb: 0.4 }, defaultNote: 60
  },
  {
    id: 'fx_downlifter', name: 'Downlifter', tags: ['transition', 'fall'],
    oscs: [{ wave: 'sawtooth', level: 0.6, unison: 3, spread: 20 }],
    noise: { color: 'white', level: 0.45, hp: 300 },
    filter: { type: 'lowpass', cutoff: 8000, q: 2.4, env: -5, keytrack: 0.1 },
    ampEnv: env(0.01, 1.6, 0.3, 0.6), filtEnv: env(0.01, 1.8, 0.05, 0.4),
    pitchEnv: { amt: 24, d: 1.6 },
    gain: 0.36, sends: { reverb: 0.4 }, defaultNote: 60
  },
  {
    id: 'fx_impact', name: 'Impact', tags: ['hit', 'huge'],
    oscs: [{ wave: 'sine', level: 0.8 }],
    sub: { wave: 'sine', oct: -1, level: 0.6, bypassFilter: true },
    noise: { color: 'brown', level: 0.6, lp: 3000, decay: 1.4 },
    filter: { type: 'lowpass', cutoff: 900, q: 1.4, env: 2, keytrack: 0.2 },
    ampEnv: env(0.002, 1.6, 0.0, 0.5), filtEnv: env(0.002, 0.6, 0.08, 0.3),
    pitchEnv: { amt: 18, d: 0.35 },
    shaper: { curve: 'tube', drive: 0.4 }, gain: 0.6, sends: { reverb: 0.45 }, defaultNote: 36
  },
  {
    id: 'fx_static', name: 'Static Burst', tags: ['noise', 'digital'],
    oscs: [{ wave: 'wire', level: 0.45 }],
    noise: { color: 'crackle', level: 1, hp: 600, rate: 2.4 },
    filter: { type: 'bandpass', cutoff: 2200, q: 1.1, env: 2, keytrack: 0.2 },
    ampEnv: env(0.002, 0.4, 0.35, 0.15), filtEnv: env(0.004, 0.3, 0.3, 0.1),
    gain: 1.1, defaultNote: 60,
    fx: [{ type: 'crush', bits: 4, reduction: 8, jitter: 0.4, mix: 0.9 }]
  },
  {
    id: 'fx_vinyl', name: 'Vinyl Bed', tags: ['texture', 'lofi'],
    oscs: [{ wave: 'sine', level: 0.06 }],
    noise: { color: 'vinyl', level: 0.7, hp: 90, lp: 7000 },
    filter: { type: 'lowpass', cutoff: 7000, q: 0.6, env: 0, keytrack: 0 },
    ampEnv: env(0.4, 0.5, 0.95, 0.6), filtEnv: env(0.1, 0.3, 1, 0.2),
    gain: 0.3, defaultNote: 48
  },
  {
    id: 'fx_scream', name: 'Feedback Scream', tags: ['noise', 'harsh'],
    oscs: [{ wave: 'buzz', level: 0.5, unison: 2, spread: 30 }],
    fm: { ratio: 1.41, index: 3.2, decay: 1.2, sustain: 0.8 },
    noise: { color: 'metal', level: 0.3, bp: 3400, q: 1.1 },
    filter: { type: 'bandpass', cutoff: 2400, q: 9, env: 3, keytrack: 0.4 },
    ampEnv: env(0.15, 0.6, 0.9, 0.5), filtEnv: env(0.6, 1, 0.5, 0.4),
    lfo: { wave: 'triangle', rate: 1.6, depth: 1.1, target: 'filter', fade: 0.5 },
    shaper: { curve: 'destroy', drive: 0.7 }, gain: 0.3, sends: { reverb: 0.4 }, defaultNote: 72
  }
];

/* ================================================================== *
 * Assembly
 * ================================================================== */
function tag(list, cat, kind) {
  return list.map((i) => ({
    kind,
    cat,
    gain: 0.7,
    sends: { reverb: 0, delay: 0 },
    fx: [],
    ...i,
    sends: { reverb: 0, delay: 0, ...(i.sends || {}) },
    color: (CATEGORIES.find((c) => c.id === cat) || {}).color || '#888'
  }));
}

export const INSTRUMENTS = [
  ...tag(KICKS, 'kick', 'drum'),
  ...tag(SNARES, 'snare', 'drum'),
  ...tag(HATS, 'hat', 'drum'),
  ...tag(PERC, 'perc', 'drum'),
  ...tag(CYMBALS, 'cymbal', 'drum'),
  ...tag(BASSES, 'bass', 'synth'),
  ...tag(GUITARS, 'guitar', 'synth'),
  ...tag(LEADS, 'lead', 'synth'),
  ...tag(PADS, 'pad', 'synth'),
  ...tag(PLUCKS, 'pluck', 'synth'),
  ...tag(FXINST, 'fx', 'synth')
];

export const INSTRUMENT_MAP = new Map(INSTRUMENTS.map((i) => [i.id, i]));

export function getInstrument(id) {
  return INSTRUMENT_MAP.get(id) || INSTRUMENTS[0];
}

export function instrumentsByCategory(cat) {
  return INSTRUMENTS.filter((i) => i.cat === cat);
}

export function searchInstruments(q) {
  const s = (q || '').trim().toLowerCase();
  if (!s) return INSTRUMENTS;
  return INSTRUMENTS.filter((i) =>
    i.name.toLowerCase().includes(s) ||
    i.id.includes(s) ||
    i.cat.includes(s) ||
    (i.tags || []).some((t) => t.includes(s))
  );
}

/* Sanity check that keeps the rack honest during development. */
export const RACK_SIZE = INSTRUMENTS.length;
