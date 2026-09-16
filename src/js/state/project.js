/* Project model, defaults, migration and the undo stack. */

import { deepClone, uid } from '../lib/util.js';
import { getInstrument } from '../data/instruments.js';

export const FILE_VERSION = 1;

export function makeTrack(instrumentId, name) {
  const inst = getInstrument(instrumentId);
  return {
    id: uid('trk'),
    name: name || inst.name,
    instrument: inst.id,
    vol: -6,
    pan: 0,
    mute: false,
    solo: false,
    sends: { reverb: (inst.sends && inst.sends.reverb) || 0, delay: (inst.sends && inst.sends.delay) || 0 },
    fx: deepClone(inst.fx || []),
    mod: {},                       // live macro offsets on top of the instrument
    color: inst.color
  };
}

export function makePattern(name, steps = 16) {
  return { id: uid('pat'), name: name || 'Pattern', steps, notes: {} };
}

export function emptyProject(name = 'Untitled Riot') {
  return {
    version: FILE_VERSION,
    name,
    bpm: 150,
    swing: 0,
    res: 4,                        // steps per beat (4 = sixteenth notes)
    key: { root: 4, scale: 'minor' },
    master: { volume: -3, drive: 0.08, width: 1, compThreshold: -14, compRatio: 3, compMakeup: 1.5, eq: { low: 0, mid: 0, high: 0 } },
    sends: {
      reverb: { kind: 'hall', size: 1.1, damp: 8200, preDelay: 0.014, lowCut: 180, return: 0.9 },
      delay: { timeL: 0.26, timeR: 0.39, feedback: 0.36, damp: 5200, lowCut: 200, return: 0.8 }
    },
    tracks: [],
    patterns: [makePattern('A', 16)],
    song: [],
    created: Date.now(),
    modified: Date.now()
  };
}

/* ------------------------------------------------------------------ *
 * Demo project — what you hear the first time the app opens
 * ------------------------------------------------------------------ */
export function demoProject() {
  const p = emptyProject('First Riot');
  p.bpm = 152;
  p.swing = 0;
  p.key = { root: 4, scale: 'minor' };   // E minor

  const def = [
    ['kick_riot', 'Kick', -4, 0, { reverb: 0, delay: 0 }],
    ['snr_riot', 'Snare', -7, 0, { reverb: 0.12, delay: 0 }],
    ['hat_closed', 'Hats', -13, 0.12, { reverb: 0.04, delay: 0 }],
    ['hat_open', 'Open Hat', -15, -0.14, { reverb: 0.08, delay: 0 }],
    ['perc_clap', 'Clap', -13, 0.2, { reverb: 0.14, delay: 0 }],
    ['bass_riot', 'Bass', -6, 0, { reverb: 0, delay: 0 }],
    ['gtr_powerchord', 'Guitar L', -11, -0.4, { reverb: 0.08, delay: 0.04 }],
    ['gtr_palm', 'Guitar R', -12, 0.4, { reverb: 0.06, delay: 0 }],
    ['lead_razor', 'Lead', -12, 0, { reverb: 0.16, delay: 0.2 }],
    ['cym_crash', 'Crash', -14, 0, { reverb: 0.26, delay: 0 }]
  ];
  for (const [inst, name, vol, pan, sends] of def) {
    const t = makeTrack(inst, name);
    t.vol = vol; t.pan = pan; t.sends = sends;
    p.tracks.push(t);
  }
  const T = {};
  p.tracks.forEach((t) => { T[t.name] = t.id; });

  const N = (s, n, v = 0.9, l = 1) => ({ s, n, v, l });

  /* ---- Pattern A : the riff ---- */
  const A = makePattern('A · riff', 16);
  A.notes[T.Kick] = [0, 3, 6, 8, 11, 14].map((s) => N(s, 36, s % 8 === 0 ? 1 : 0.82));
  A.notes[T.Snare] = [4, 12].map((s) => N(s, 38, 0.95));
  A.notes[T.Hats] = Array.from({ length: 16 }, (_, s) => N(s, 42, s % 4 === 0 ? 0.9 : s % 2 === 0 ? 0.62 : 0.42));
  A.notes[T['Open Hat']] = [7, 15].map((s) => N(s, 46, 0.6));
  A.notes[T.Clap] = [12].map((s) => N(s, 39, 0.7));
  /* E minor riff: E E E G A E D E */
  A.notes[T.Bass] = [
    N(0, 28, 1, 2), N(2, 28, 0.8, 1), N(3, 28, 0.85, 1),
    N(4, 31, 0.95, 2), N(6, 33, 0.9, 2),
    N(8, 28, 1, 2), N(10, 28, 0.8, 1), N(11, 28, 0.85, 1),
    N(12, 26, 0.95, 2), N(14, 28, 0.9, 2)
  ];
  A.notes[T['Guitar L']] = [N(0, 40, 0.85, 4), N(4, 43, 0.8, 4), N(8, 40, 0.85, 4), N(12, 38, 0.8, 4)];
  A.notes[T['Guitar R']] = [0, 2, 3, 6, 8, 10, 11, 14].map((s) => N(s, 40, 0.7, 1));
  A.notes[T.Crash] = [N(0, 49, 0.55)];

  /* ---- Pattern B : the hook ---- */
  const B = makePattern('B · hook', 16);
  B.notes[T.Kick] = [0, 4, 8, 12, 14].map((s) => N(s, 36, s === 14 ? 0.8 : 1));
  B.notes[T.Snare] = [4, 12, 15].map((s) => N(s, 38, s === 15 ? 0.6 : 0.95));
  B.notes[T.Hats] = Array.from({ length: 8 }, (_, i) => N(i * 2, 42, i % 2 === 0 ? 0.85 : 0.5));
  B.notes[T['Open Hat']] = [3, 11].map((s) => N(s, 46, 0.55));
  B.notes[T.Clap] = [4, 12].map((s) => N(s, 39, 0.75));
  B.notes[T.Bass] = [
    N(0, 28, 1, 3), N(3, 28, 0.8, 1), N(4, 28, 0.9, 2), N(6, 26, 0.9, 2),
    N(8, 31, 1, 3), N(11, 31, 0.8, 1), N(12, 33, 0.95, 2), N(14, 35, 0.9, 2)
  ];
  B.notes[T['Guitar L']] = [N(0, 40, 0.8, 8), N(8, 45, 0.8, 8)];
  B.notes[T['Guitar R']] = [0, 1, 4, 5, 8, 9, 12, 13].map((s) => N(s, 40, 0.65, 1));
  /* Lead line over the hook */
  B.notes[T.Lead] = [
    N(0, 64, 0.85, 2), N(2, 67, 0.8, 2), N(4, 71, 0.9, 3), N(7, 69, 0.75, 1),
    N(8, 67, 0.85, 2), N(10, 64, 0.8, 2), N(12, 62, 0.9, 3), N(15, 64, 0.7, 1)
  ];
  B.notes[T.Crash] = [N(0, 49, 0.6), N(8, 49, 0.45)];

  /* ---- Pattern C : breakdown ---- */
  const C = makePattern('C · breakdown', 16);
  C.notes[T.Kick] = [0, 8].map((s) => N(s, 36, 1));
  C.notes[T.Snare] = [12].map((s) => N(s, 38, 0.9));
  C.notes[T.Hats] = [2, 6, 10, 14].map((s) => N(s, 42, 0.5));
  C.notes[T.Bass] = [N(0, 28, 1, 8), N(8, 26, 1, 8)];
  C.notes[T.Lead] = [N(0, 76, 0.7, 4), N(4, 74, 0.7, 4), N(8, 71, 0.75, 6), N(14, 69, 0.6, 2)];
  C.notes[T['Guitar L']] = [N(0, 40, 0.5, 16)];

  p.patterns = [A, B, C];
  p.song = [
    { pattern: A.id, repeats: 2 },
    { pattern: B.id, repeats: 2 },
    { pattern: A.id, repeats: 1 },
    { pattern: C.id, repeats: 1 },
    { pattern: B.id, repeats: 2 }
  ];
  return p;
}

/* ------------------------------------------------------------------ *
 * Load / migrate
 * ------------------------------------------------------------------ */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('That file is not a RIOT project.');
  const base = emptyProject(raw.name || 'Imported');
  const p = { ...base, ...raw };

  p.version = FILE_VERSION;
  p.bpm = clampNum(p.bpm, 20, 300, 150);
  p.swing = clampNum(p.swing, 0, 0.75, 0);
  p.res = [1, 2, 3, 4, 6, 8].includes(p.res) ? p.res : 4;
  p.master = { ...base.master, ...(p.master || {}) };
  p.sends = {
    reverb: { ...base.sends.reverb, ...((p.sends && p.sends.reverb) || {}) },
    delay: { ...base.sends.delay, ...((p.sends && p.sends.delay) || {}) }
  };
  p.key = { ...base.key, ...(p.key || {}) };

  p.tracks = (Array.isArray(p.tracks) ? p.tracks : []).map((t) => {
    const inst = getInstrument(t.instrument);
    return {
      id: t.id || uid('trk'),
      name: t.name || inst.name,
      instrument: inst.id,
      vol: clampNum(t.vol, -60, 12, -6),
      pan: clampNum(t.pan, -1, 1, 0),
      mute: !!t.mute,
      solo: !!t.solo,
      sends: { reverb: clampNum(t.sends && t.sends.reverb, 0, 1.5, 0), delay: clampNum(t.sends && t.sends.delay, 0, 1.5, 0) },
      fx: Array.isArray(t.fx) ? t.fx : [],
      mod: t.mod && typeof t.mod === 'object' ? t.mod : {},
      color: inst.color
    };
  });

  const known = new Set(p.tracks.map((t) => t.id));
  p.patterns = (Array.isArray(p.patterns) && p.patterns.length ? p.patterns : [makePattern('A', 16)]).map((pt) => {
    const steps = clampNum(pt.steps, 1, 128, 16);
    const notes = {};
    for (const [tid, list] of Object.entries(pt.notes || {})) {
      if (!known.has(tid) || !Array.isArray(list)) continue;
      notes[tid] = list
        .filter((n) => n && typeof n.s === 'number')
        .map((n) => ({
          s: Math.max(0, Math.min(steps - 1, Math.round(n.s))),
          n: clampNum(n.n, 0, 127, 60),
          v: clampNum(n.v, 0.02, 1, 0.85),
          l: clampNum(n.l, 1, 64, 1),
          ...(n.p != null ? { p: clampNum(n.p, 0, 1, 1) } : {})
        }));
    }
    return { id: pt.id || uid('pat'), name: pt.name || 'Pattern', steps, notes };
  });

  const patIds = new Set(p.patterns.map((x) => x.id));
  p.song = (Array.isArray(p.song) ? p.song : [])
    .filter((s) => s && patIds.has(s.pattern))
    .map((s) => ({ pattern: s.pattern, repeats: clampNum(s.repeats, 1, 64, 1) }));

  p.created = p.created || Date.now();
  p.modified = Date.now();
  return p;
}

function clampNum(v, lo, hi, dflt) {
  const n = Number(v);
  if (!isFinite(n)) return dflt;
  return Math.max(lo, Math.min(hi, n));
}

/* ------------------------------------------------------------------ *
 * Undo stack
 * ------------------------------------------------------------------ */
export class History {
  constructor(limit = 80) {
    this.limit = limit;
    this.past = [];
    this.future = [];
    this.label = '';
  }

  /** Capture the state *before* a mutation. */
  push(project, label) {
    this.pushSnapshot(JSON.stringify(project), label);
  }

  /** Push an already-serialized "before" state. Continuous gestures (knobs,
   * faders) use this so one drag produces one undo step, not hundreds. */
  pushSnapshot(snap, label) {
    if (!snap) return;
    const top = this.past[this.past.length - 1];
    if (top && top.snap === snap) return;      // nothing actually changed
    this.past.push({ snap, label: label || 'edit' });
    if (this.past.length > this.limit) this.past.shift();
    this.future.length = 0;
  }

  undo(current) {
    const prev = this.past.pop();
    if (!prev) return null;
    this.future.push({ snap: JSON.stringify(current), label: prev.label });
    return { project: JSON.parse(prev.snap), label: prev.label };
  }

  redo(current) {
    const next = this.future.pop();
    if (!next) return null;
    this.past.push({ snap: JSON.stringify(current), label: next.label });
    return { project: JSON.parse(next.snap), label: next.label };
  }

  get canUndo() { return this.past.length > 0; }
  get canRedo() { return this.future.length > 0; }
  clear() { this.past.length = 0; this.future.length = 0; }
}

/* ------------------------------------------------------------------ *
 * Note helpers
 * ------------------------------------------------------------------ */
export function notesAt(pattern, trackId) {
  if (!pattern.notes[trackId]) pattern.notes[trackId] = [];
  return pattern.notes[trackId];
}

export function findNote(pattern, trackId, step, midi) {
  const list = pattern.notes[trackId];
  if (!list) return -1;
  return list.findIndex((n) => n.s === step && (midi == null || n.n === midi));
}

export function toggleStep(pattern, trackId, step, midi, vel = 0.9, len = 1) {
  const list = notesAt(pattern, trackId);
  const i = list.findIndex((n) => n.s === step && (midi == null || n.n === midi));
  if (i >= 0) { list.splice(i, 1); return false; }
  list.push({ s: step, n: midi, v: vel, l: len });
  list.sort((a, b) => a.s - b.s || a.n - b.n);
  return true;
}

export function projectStats(p) {
  let notes = 0;
  for (const pat of p.patterns) for (const k of Object.keys(pat.notes)) notes += pat.notes[k].length;
  const bars = p.song.reduce((acc, s) => {
    const pat = p.patterns.find((x) => x.id === s.pattern);
    return acc + (pat ? (pat.steps / (p.res * 4)) * s.repeats : 0);
  }, 0);
  const secPerStep = 60 / p.bpm / p.res;
  const songSteps = p.song.reduce((acc, s) => {
    const pat = p.patterns.find((x) => x.id === s.pattern);
    return acc + (pat ? pat.steps * s.repeats : 0);
  }, 0);
  return { notes, tracks: p.tracks.length, patterns: p.patterns.length, bars, seconds: songSteps * secPerStep };
}
