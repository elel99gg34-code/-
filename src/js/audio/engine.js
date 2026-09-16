/* The audio engine.
 *
 * One graph builder serves both the live context and the offline render
 * context, so what you hear is exactly what gets exported. Live playback uses
 * a lookahead scheduler; rendering schedules the entire song up front. */

import { clamp, dbToGain } from '../lib/util.js';
import { buildChain, makeComp, makeDelay, makeDrive, makeEQ, makeReverb, makeWidth } from './fx.js';
import { getInstrument } from '../data/instruments.js';
import { triggerDrum, triggerSynth } from './voice.js';

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.12;
const WORKLET_URL = '/js/audio/worklets/crusher.js';

/* ------------------------------------------------------------------ *
 * Timing helpers
 * ------------------------------------------------------------------ */
export function stepDuration(bpm, res) {
  return 60 / clamp(bpm, 20, 300) / clamp(res, 1, 16);
}

/** Swing pushes every second step later by up to half a step. */
export function stepOffset(index, swing, dur) {
  return index % 2 === 1 ? dur * clamp(swing, 0, 0.75) * 0.5 : 0;
}

/* ------------------------------------------------------------------ *
 * Graph construction (context-agnostic)
 * ------------------------------------------------------------------ */
export function buildGraph(ctx, project, opts = {}) {
  const master = {};

  master.out = ctx.createGain();
  master.analyser = opts.meters ? ctx.createAnalyser() : null;
  if (master.analyser) { master.analyser.fftSize = 2048; master.analyser.smoothingTimeConstant = 0.6; }

  const m = project.master || {};
  master.bus = ctx.createGain();                 // everything lands here
  master.eq = makeEQ(ctx, m.eq || {});
  master.drive = makeDrive(ctx, { shape: 'tube', amount: m.drive == null ? 0.08 : m.drive, tone: 15000, mix: 1 });
  master.width = makeWidth(ctx, { width: m.width == null ? 1 : m.width });
  master.comp = makeComp(ctx, {
    threshold: m.compThreshold == null ? -14 : m.compThreshold,
    ratio: m.compRatio == null ? 3 : m.compRatio,
    attack: 0.008, release: 0.14,
    makeup: m.compMakeup == null ? 1.5 : m.compMakeup
  });
  /* Final safety limiter — fast, hard, always on. */
  master.limiter = ctx.createDynamicsCompressor();
  master.limiter.threshold.value = -1.2;
  master.limiter.knee.value = 0;
  master.limiter.ratio.value = 20;
  master.limiter.attack.value = 0.0015;
  master.limiter.release.value = 0.08;

  master.gain = ctx.createGain();
  master.gain.gain.value = dbToGain(m.volume == null ? -3 : m.volume);

  master.bus.connect(master.eq.input);
  master.eq.output.connect(master.drive.input);
  master.drive.output.connect(master.width.input);
  master.width.output.connect(master.comp.input);
  master.comp.output.connect(master.limiter);
  master.limiter.connect(master.gain);
  if (master.analyser) { master.gain.connect(master.analyser); master.analyser.connect(master.out); }
  else master.gain.connect(master.out);

  /* --- global send buses ------------------------------------------- */
  const sendCfg = project.sends || {};
  const sends = {};

  sends.reverb = { bus: ctx.createGain(), unit: makeReverb(ctx, { send: true, ...(sendCfg.reverb || { kind: 'hall', size: 1.1, mix: 1 }), mix: 1 }) };
  sends.reverb.bus.connect(sends.reverb.unit.input);
  sends.reverb.ret = ctx.createGain();
  sends.reverb.ret.gain.value = (sendCfg.reverb && sendCfg.reverb.return != null) ? sendCfg.reverb.return : 0.9;
  sends.reverb.unit.output.connect(sends.reverb.ret);
  sends.reverb.ret.connect(master.bus);

  sends.delay = { bus: ctx.createGain(), unit: makeDelay(ctx, { send: true, ...(sendCfg.delay || {}), mix: 1 }) };
  sends.delay.bus.connect(sends.delay.unit.input);
  sends.delay.ret = ctx.createGain();
  sends.delay.ret.gain.value = (sendCfg.delay && sendCfg.delay.return != null) ? sendCfg.delay.return : 0.8;
  sends.delay.unit.output.connect(sends.delay.ret);
  sends.delay.ret.connect(master.bus);

  /* --- tracks -------------------------------------------------------- */
  const tracks = new Map();
  const anySolo = (project.tracks || []).some((t) => t.solo);

  for (const t of project.tracks || []) {
    const node = {};
    node.input = ctx.createGain();
    node.chain = buildChain(ctx, t.fx || []);
    node.gain = ctx.createGain();
    node.pan = ctx.createStereoPanner();
    node.post = ctx.createGain();

    const audible = !t.mute && (!anySolo || t.solo);
    node.gain.gain.value = audible ? dbToGain(t.vol == null ? -6 : t.vol) : 0;
    node.pan.pan.value = clamp(t.pan || 0, -1, 1);

    let head = node.input;
    if (node.chain) { head.connect(node.chain.input); head = node.chain.output; }
    head.connect(node.gain);
    node.gain.connect(node.pan);
    node.pan.connect(node.post);

    if (opts.meters) {
      node.analyser = ctx.createAnalyser();
      node.analyser.fftSize = 512;
      node.analyser.smoothingTimeConstant = 0.5;
      node.post.connect(node.analyser);
    }

    node.post.connect(master.bus);

    /* Post-fader sends. */
    node.sendReverb = ctx.createGain();
    node.sendDelay = ctx.createGain();
    node.sendReverb.gain.value = clamp((t.sends && t.sends.reverb) || 0, 0, 1.5);
    node.sendDelay.gain.value = clamp((t.sends && t.sends.delay) || 0, 0, 1.5);
    node.post.connect(node.sendReverb); node.sendReverb.connect(sends.reverb.bus);
    node.post.connect(node.sendDelay); node.sendDelay.connect(sends.delay.bus);

    node.track = t;
    node.lastFreq = null;
    tracks.set(t.id, node);
  }

  return { master, sends, tracks, dispose(t) {
    if (master.eq.stop) master.eq.stop(t);
    for (const [, n] of tracks) if (n.chain && n.chain.stop) n.chain.stop(t);
    if (sends.delay.unit.stop) sends.delay.unit.stop(t);
  } };
}

/* ------------------------------------------------------------------ *
 * Note scheduling (shared by live playback and offline render)
 * ------------------------------------------------------------------ */
function fireNote(ctx, graph, track, note, when, project, rand) {
  const node = graph.tracks.get(track.id);
  if (!node || node.gain.gain.value === 0) return 0;

  const inst = getInstrument(track.instrument);
  if (!inst) return 0;

  if (note.p != null && note.p < 1 && rand() > note.p) return 0;

  const bpm = project.bpm || 140;
  const res = project.res || 4;
  const dur = Math.max(0.02, (note.l || 1) * stepDuration(bpm, res) * 0.94);
  const vel = clamp(note.v == null ? 0.85 : note.v, 0.04, 1);
  const midi = note.n == null ? (inst.defaultNote || 60) : note.n;

  /* Instrument sends are folded into the track's own send amounts once,
   * at build time; here we only need the voice itself. */
  const target = node.input;
  const mod = track.mod || {};

  if (inst.kind === 'drum') {
    const v = triggerDrum(ctx, target, inst, { time: when, vel, midi, mod });
    return v.endTime - when;
  }

  const glideFrom = (inst.poly === 1 && node.lastFreq) ? node.lastFreq : null;
  const v = triggerSynth(ctx, target, inst, { time: when, dur, vel, midi, mod, glideFrom });
  node.lastFreq = 440 * Math.pow(2, (midi + (inst.tune || 0) - 69) / 12);
  return v.endTime - when;
}

/** Ordered list of {pattern, startStep} for the whole arrangement. */
export function songTimeline(project) {
  const byId = new Map((project.patterns || []).map((p) => [p.id, p]));
  const out = [];
  let step = 0;
  for (const slot of project.song || []) {
    const p = byId.get(slot.pattern);
    if (!p) continue;
    const reps = Math.max(1, slot.repeats || 1);
    for (let r = 0; r < reps; r++) {
      out.push({ pattern: p, startStep: step });
      step += p.steps;
    }
  }
  return { slots: out, totalSteps: step };
}

/* ------------------------------------------------------------------ *
 * Engine
 * ------------------------------------------------------------------ */
export class Engine {
  constructor() {
    this.ctx = null;
    this.graph = null;
    this.project = null;
    this.playing = false;
    this.songMode = false;
    this.step = 0;              // absolute step counter since play started
    this.nextTime = 0;
    this.timer = 0;
    this.metronome = false;
    this.onStep = null;         // (stepIndex, patternId, time) => void
    this.loopStart = 0;
    this.loopEnd = 0;
    this.activePatternId = null;
    this._rand = Math.random;
    this._rebuildQueued = false;
    this.cpu = 0;
  }

  async init() {
    if (this.ctx) return this.ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctor({ latencyHint: 'interactive', sampleRate: 48000 });
    await loadWorklet(this.ctx);
    this.preview = this.ctx.createGain();
    this.preview.gain.value = 1;
    return this.ctx;
  }

  async resume() {
    await this.init();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
  }

  setProject(project) {
    this.project = project;
    this.rebuild();
  }

  /** Full graph teardown + rebuild. Used when tracks or FX change shape. */
  rebuild() {
    if (!this.ctx || !this.project) return;
    const old = this.graph;
    this.graph = buildGraph(this.ctx, this.project, { meters: true });
    this.graph.master.out.connect(this.ctx.destination);
    if (this.preview) {
      try { this.preview.disconnect(); } catch { /* not connected yet */ }
      this.preview.connect(this.graph.master.bus);
    }
    if (old) {
      const t = this.ctx.currentTime + 0.05;
      try { old.dispose(t); } catch { /* best effort */ }
      setTimeout(() => { try { old.master.out.disconnect(); } catch { /* noop */ } }, 400);
    }
  }

  /** Cheap live updates that do not need a rebuild. */
  syncMix() {
    if (!this.graph || !this.project) return;
    const anySolo = this.project.tracks.some((t) => t.solo);
    for (const t of this.project.tracks) {
      const n = this.graph.tracks.get(t.id);
      if (!n) continue;
      const audible = !t.mute && (!anySolo || t.solo);
      const g = audible ? dbToGain(t.vol == null ? -6 : t.vol) : 0;
      n.gain.gain.setTargetAtTime(g, this.ctx.currentTime, 0.01);
      n.pan.pan.setTargetAtTime(clamp(t.pan || 0, -1, 1), this.ctx.currentTime, 0.01);
      n.sendReverb.gain.setTargetAtTime(clamp((t.sends && t.sends.reverb) || 0, 0, 1.5), this.ctx.currentTime, 0.02);
      n.sendDelay.gain.setTargetAtTime(clamp((t.sends && t.sends.delay) || 0, 0, 1.5), this.ctx.currentTime, 0.02);
      n.track = t;
    }
    const m = this.project.master || {};
    this.graph.master.gain.gain.setTargetAtTime(dbToGain(m.volume == null ? -3 : m.volume), this.ctx.currentTime, 0.02);
    this.graph.master.eq.set(m.eq || {});
    this.graph.master.width.set({ width: m.width == null ? 1 : m.width });
    this.graph.master.drive.set({ shape: 'tube', amount: m.drive == null ? 0.08 : m.drive, tone: 15000, mix: 1 });
    this.graph.master.comp.set({
      threshold: m.compThreshold == null ? -14 : m.compThreshold,
      ratio: m.compRatio == null ? 3 : m.compRatio,
      attack: 0.008, release: 0.14, makeup: m.compMakeup == null ? 1.5 : m.compMakeup
    });
    const s = this.project.sends || {};
    if (s.reverb) { this.graph.sends.reverb.unit.set({ send: true, ...s.reverb, mix: 1 }); this.graph.sends.reverb.ret.gain.value = s.reverb.return == null ? 0.9 : s.reverb.return; }
    if (s.delay) { this.graph.sends.delay.unit.set({ send: true, ...s.delay, mix: 1 }); this.graph.sends.delay.ret.gain.value = s.delay.return == null ? 0.8 : s.delay.return; }
  }

  /** Update one track's insert FX parameters in place. */
  syncTrackFx(trackId) {
    const t = this.project.tracks.find((x) => x.id === trackId);
    const n = this.graph && this.graph.tracks.get(trackId);
    if (!t || !n || !n.chain) return;
    t.fx.forEach((spec, i) => { if (n.chain.units[i]) n.chain.units[i].set(spec); });
  }

  /* ---------------- transport ---------------- */

  async play(opts = {}) {
    await this.resume();
    if (!this.graph) this.rebuild();
    if (this.playing) return;

    this.songMode = !!opts.song;
    this.playing = true;
    this.step = opts.fromStep || 0;
    this.nextTime = this.ctx.currentTime + 0.08;

    if (this.songMode) {
      const tl = songTimeline(this.project);
      this.timeline = tl;
      this.totalSteps = tl.totalSteps || 1;
    } else {
      this.timeline = null;
      const p = this.currentPattern();
      this.totalSteps = p ? p.steps : 16;
    }

    const tick = () => {
      if (!this.playing) return;
      this.scheduleWindow();
      this.timer = setTimeout(tick, LOOKAHEAD_MS);
    };
    tick();
  }

  stop() {
    this.playing = false;
    clearTimeout(this.timer);
    this.timer = 0;
    this.step = 0;
    /* Mute momentarily so long tails do not hang around. */
    if (this.graph) {
      const t = this.ctx.currentTime;
      for (const [, n] of this.graph.tracks) n.lastFreq = null;
    }
  }

  currentPattern() {
    if (!this.project) return null;
    const id = this.activePatternId || (this.project.patterns[0] && this.project.patterns[0].id);
    return this.project.patterns.find((p) => p.id === id) || this.project.patterns[0] || null;
  }

  scheduleWindow() {
    const ctx = this.ctx;
    const horizon = ctx.currentTime + SCHEDULE_AHEAD;
    const bpm = this.project.bpm || 140;
    const res = this.project.res || 4;
    const dur = stepDuration(bpm, res);
    let guard = 0;

    while (this.nextTime < horizon && guard++ < 128) {
      const swing = stepOffset(this.step, this.project.swing || 0, dur);
      const when = this.nextTime + swing;

      let pattern = null;
      let localStep = 0;
      if (this.songMode && this.timeline) {
        const total = Math.max(1, this.timeline.totalSteps);
        const abs = this.step % total;
        const slot = findSlot(this.timeline.slots, abs);
        if (slot) { pattern = slot.pattern; localStep = abs - slot.startStep; }
      } else {
        pattern = this.currentPattern();
        if (pattern) localStep = this.step % Math.max(1, pattern.steps);
      }

      if (pattern) {
        this.fireStep(pattern, localStep, when);
        if (this.onStep) this.onStep(localStep, pattern.id, when, this.step);
      }

      if (this.metronome) this.clickMetronome(when, this.step % res === 0);

      this.step += 1;
      this.nextTime += dur;
    }
  }

  fireStep(pattern, localStep, when) {
    const notes = pattern.notes || {};
    for (const track of this.project.tracks) {
      const list = notes[track.id];
      if (!list || !list.length) continue;
      for (const nt of list) {
        if (nt.s !== localStep) continue;
        fireNote(this.ctx, this.graph, track, nt, when, this.project, this._rand);
      }
    }
    /* Drive any rhythmic gates on track FX. */
    const dur = stepDuration(this.project.bpm || 140, this.project.res || 4);
    for (const [, n] of this.graph.tracks) {
      if (!n.chain) continue;
      for (const u of n.chain.units) if (u.kind === 'gate') u.step(when, localStep, dur);
    }
  }

  clickMetronome(when, accent) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = accent ? 1600 : 1050;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(accent ? 0.16 : 0.08, when + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.035);
    o.connect(g); g.connect(this.graph.master.gain);
    o.start(when); o.stop(when + 0.06);
  }

  /* ---------------- auditioning ---------------- */

  /** Play one note of an instrument straight to the master bus. */
  async preview(instrumentId, midi, vel = 0.9, dur = 0.5) {
    await this.resume();
    if (!this.graph) this.rebuild();
    const inst = getInstrument(instrumentId);
    if (!inst) return;
    const t = this.ctx.currentTime + 0.01;
    const target = this.preview;
    if (inst.kind === 'drum') triggerDrum(this.ctx, target, inst, { time: t, vel, midi: midi == null ? inst.defaultNote : midi });
    else triggerSynth(this.ctx, target, inst, { time: t, vel, dur, midi: midi == null ? (inst.defaultNote || 60) : midi });
  }

  /** Play one note through a real track, so its FX and mix apply. */
  async previewTrack(trackId, midi, vel = 0.9, dur = 0.4) {
    await this.resume();
    if (!this.graph) this.rebuild();
    const track = this.project.tracks.find((t) => t.id === trackId);
    if (!track) return;
    fireNote(this.ctx, this.graph, track, { s: 0, n: midi, v: vel, l: Math.max(1, Math.round(dur / stepDuration(this.project.bpm, this.project.res))) },
      this.ctx.currentTime + 0.01, this.project, () => 0);
  }

  /* ---------------- metering ---------------- */

  trackLevel(trackId) {
    const n = this.graph && this.graph.tracks.get(trackId);
    if (!n || !n.analyser) return 0;
    return rms(n.analyser);
  }

  masterLevel() {
    const a = this.graph && this.graph.master.analyser;
    return a ? rms(a) : 0;
  }
}

const _bufCache = new WeakMap();
function rms(analyser) {
  let buf = _bufCache.get(analyser);
  if (!buf || buf.length !== analyser.fftSize) { buf = new Float32Array(analyser.fftSize); _bufCache.set(analyser, buf); }
  analyser.getFloatTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
  return Math.sqrt(sum / buf.length);
}

function findSlot(slots, abs) {
  for (let i = slots.length - 1; i >= 0; i--) if (abs >= slots[i].startStep) return slots[i];
  return slots[0] || null;
}

export async function loadWorklet(ctx) {
  if (ctx.__riotWorklet) return true;
  try {
    await ctx.audioWorklet.addModule(WORKLET_URL);
    ctx.__riotWorklet = true;
    return true;
  } catch (e) {
    console.warn('AudioWorklet unavailable, falling back to waveshaper crush:', e && e.message);
    ctx.__riotWorklet = false;
    return false;
  }
}

/* ------------------------------------------------------------------ *
 * Offline render
 * ------------------------------------------------------------------ */

/**
 * @param project
 * @param opts { mode:'song'|'pattern', patternId, loops, sampleRate, tail,
 *               soloTrack, onProgress }
 * @returns AudioBuffer
 */
export async function renderProject(project, opts = {}) {
  const sampleRate = opts.sampleRate || 48000;
  const bpm = project.bpm || 140;
  const res = project.res || 4;
  const dur = stepDuration(bpm, res);
  const tail = opts.tail == null ? 3.5 : opts.tail;

  /* Work out the step list up front. */
  const events = [];   // { track, note, step }
  let totalSteps = 0;

  if (opts.mode === 'song') {
    const tl = songTimeline(project);
    totalSteps = tl.totalSteps;
    for (const slot of tl.slots) {
      for (const track of project.tracks) {
        const list = (slot.pattern.notes || {})[track.id];
        if (!list) continue;
        for (const n of list) events.push({ track, note: n, step: slot.startStep + n.s });
      }
    }
  } else {
    const p = project.patterns.find((x) => x.id === opts.patternId) || project.patterns[0];
    if (!p) throw new Error('Nothing to render: this project has no patterns.');
    const loops = Math.max(1, opts.loops || 1);
    totalSteps = p.steps * loops;
    for (let l = 0; l < loops; l++) {
      for (const track of project.tracks) {
        const list = (p.notes || {})[track.id];
        if (!list) continue;
        for (const n of list) events.push({ track, note: n, step: l * p.steps + n.s });
      }
    }
  }

  if (totalSteps <= 0) throw new Error('Nothing to render: the arrangement is empty.');

  const lengthSec = totalSteps * dur + tail;
  const frames = Math.ceil(lengthSec * sampleRate);
  const ctx = new OfflineAudioContext(2, frames, sampleRate);
  await loadWorklet(ctx);

  /* Solo/mute is honoured by cloning the project with the solo applied. */
  const proj = opts.soloTrack
    ? { ...project, tracks: project.tracks.map((t) => ({ ...t, solo: t.id === opts.soloTrack, mute: t.id !== opts.soloTrack })) }
    : project;

  const graph = buildGraph(ctx, proj, { meters: false });
  graph.master.out.connect(ctx.destination);

  /* Deterministic probability so a render matches itself every time. */
  let seed = 0x9e3779b9;
  const rand = () => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return ((seed >>> 0) % 100000) / 100000;
  };

  events.sort((a, b) => a.step - b.step);
  const gateTracks = [];
  for (const [, n] of graph.tracks) if (n.chain) for (const u of n.chain.units) if (u.kind === 'gate') gateTracks.push(u);

  const START = 0.02;
  for (const ev of events) {
    const when = START + ev.step * dur + stepOffset(ev.step, project.swing || 0, dur);
    fireNote(ctx, graph, ev.track, ev.note, when, proj, rand);
  }
  for (let s = 0; s < totalSteps; s++) {
    const when = START + s * dur + stepOffset(s, project.swing || 0, dur);
    for (const u of gateTracks) u.step(when, s, dur);
  }

  if (opts.onProgress) opts.onProgress(0.1);
  const buffer = await ctx.startRendering();
  if (opts.onProgress) opts.onProgress(1);
  return buffer;
}

/** Render one instrument's single note — used by the "export instrument" action. */
export async function renderInstrument(instrumentId, opts = {}) {
  const sampleRate = opts.sampleRate || 48000;
  const midi = opts.midi;
  const dur = opts.dur || 1.2;
  const tail = opts.tail || 2.2;
  const ctx = new OfflineAudioContext(2, Math.ceil((dur + tail) * sampleRate), sampleRate);
  await loadWorklet(ctx);
  const inst = getInstrument(instrumentId);
  const chain = buildChain(ctx, inst.fx || []);
  const out = ctx.createGain();
  out.gain.value = 0.9;
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -1.2; limiter.ratio.value = 20; limiter.attack.value = 0.002; limiter.knee.value = 0;
  out.connect(limiter); limiter.connect(ctx.destination);
  const target = chain ? chain.input : out;
  if (chain) chain.output.connect(out);

  const note = midi == null ? (inst.defaultNote || 60) : midi;
  if (inst.kind === 'drum') triggerDrum(ctx, target, inst, { time: 0.02, vel: 0.95, midi: note });
  else triggerSynth(ctx, target, inst, { time: 0.02, vel: 0.95, dur, midi: note });
  return ctx.startRendering();
}
