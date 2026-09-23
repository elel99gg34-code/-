/* THE RACK — 590 instruments.
 *
 * Nothing here is a sample. Every instrument is a parameter set for the
 * synthesis engine in audio/voice.js, so the whole rack is a few kilobytes
 * and renders identically at any sample rate.
 *
 * The tables live one family per module in ./rack/; this file only stitches
 * them together and fills in the defaults each entry leaves out.
 *
 * ------------------------------------------------------------------------
 * kind 'drum' -> triggerDrum()
 *   bodies  [{ wave, f0, f1, pitchDecay, curve, decay, level, attack,
 *              fm, fmRatio, fmWave, fmDecay }]   pitched layers
 *   ring    { partials[], base, wave, filter, cut, q, decay, level,
 *             attack, hold }                     inharmonic metal
 *   noises  [{ color, level, bp, q, hp, lp, sweep, sweepTime, lpSweep,
 *              attack, hold, holdLevel, decay, rate }]
 *   click   { level, decay, hp, tone }           transient
 *   filter  { type, cutoff, q, sweep, sweepTime }
 *   A drum plays as designed on its `defaultNote`; other notes transpose it.
 *
 * kind 'synth' -> triggerSynth()
 *   oscs    [{ wave, semi, oct, cent, level, unison, spread, width, pan }]
 *   sub     { wave, oct, level, bypassFilter }
 *   noise   { color, level, bp, q, hp, lp, decay, keytrack, rate }
 *   fm      { ratio, index, wave, decay, sustain }
 *   filter  { type, cutoff, q, env, keytrack, velToEnv, poles }
 *   ampEnv / filtEnv  env(a, d, s, r)      pitchEnv { amt, d }
 *   lfo     { wave, rate, depth, target: pitch|filter|amp|pan, delay, fade }
 *
 * Both kinds also take: gain, pan, tune, velCurve, shaper { curve, drive },
 * sends { reverb, delay }, fx [], tags [], defaultNote.
 * ------------------------------------------------------------------------ */

import { KICKS } from './rack/kicks.js';
import { SNARES } from './rack/snares.js';
import { HATS } from './rack/hats.js';
import { PERC } from './rack/perc.js';
import { CYMBALS } from './rack/cymbals.js';
import { BASSES } from './rack/bass.js';
import { GUITARS } from './rack/guitars.js';
import { LEADS } from './rack/leads.js';
import { PADS } from './rack/pads.js';
import { PLUCKS } from './rack/plucks.js';
import { FXINST } from './rack/fx.js';
import { VOICES } from './rack/vox.js';
import { MALLETS } from './rack/mallets.js';
import { STRINGS } from './rack/strings.js';
import { KEYS } from './rack/keys.js';
import { BRASS } from './rack/brass.js';
import { ATMOS } from './rack/atmos.js';
import { CHIP } from './rack/chip.js';
import { MODULAR } from './rack/modular.js';

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
  { id: 'pluck', name: 'Plucks', color: '#64d2ff', icon: '♦' },
  { id: 'key', name: 'Organs & Keys', color: '#efe3c8', icon: '▦' },
  { id: 'chip', name: 'Chip & Console', color: '#c3f73a', icon: '▣' },
  { id: 'mallet', name: 'Mallets & Bells', color: '#d6a35c', icon: '✦' },
  { id: 'string', name: 'Strings & Bows', color: '#a8e6cf', icon: '⌒' },
  { id: 'brass', name: 'Brass & Winds', color: '#e07a5f', icon: '◭' },
  { id: 'vox', name: 'Voices', color: '#ffb3c7', icon: '◐' },
  { id: 'modular', name: 'Modular & Experimental', color: '#b388ff', icon: '◈' },
  { id: 'atmos', name: 'Atmospheres', color: '#7c9cbf', icon: '≋' },
  { id: 'fx', name: 'FX & Noise', color: '#8e8e93', icon: '∿' }
];

const COLOR_OF = new Map(CATEGORIES.map((c) => [c.id, c.color]));

/** Fill in the defaults each table leaves out, and stamp the family colour. */
function tag(list, cat, kind) {
  return list.map((i) => ({
    kind,
    cat,
    gain: 0.7,
    fx: [],
    ...i,
    sends: { reverb: 0, delay: 0, ...(i.sends || {}) },
    color: COLOR_OF.get(cat) || '#888'
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
  ...tag(KEYS, 'key', 'synth'),
  ...tag(CHIP, 'chip', 'synth'),
  ...tag(MALLETS, 'mallet', 'synth'),
  ...tag(STRINGS, 'string', 'synth'),
  ...tag(BRASS, 'brass', 'synth'),
  ...tag(VOICES, 'vox', 'synth'),
  ...tag(MODULAR, 'modular', 'synth'),
  ...tag(ATMOS, 'atmos', 'synth'),
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
