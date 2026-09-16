/* Voice construction.
 *
 * Both synth and drum voices are built per note: a small graph is assembled,
 * fully scheduled ahead of time, and torn down when its tail ends. Because
 * nothing depends on wall-clock callbacks, the exact same code renders a live
 * performance and an offline bounce sample-for-sample.
 */

import { clamp, mtof } from '../lib/util.js';
import { curveFor, noiseBuffer, setWave } from './dsp.js';

const MIN = 0.0001;
const MAX_UNISON = 7;

/* Filters and oscillators are clamped against the context's own Nyquist, not
 * a fixed 20 kHz, so rendering at a lower sample rate stays correct. */
const ceil = (ctx) => Math.min(20000, ctx.sampleRate * 0.47);

function safeExp(param, v, t) {
  param.exponentialRampToValueAtTime(Math.max(MIN, v), t);
}

/* ------------------------------------------------------------------ *
 * Synth voice
 * ------------------------------------------------------------------ */

/**
 * @param ctx      AudioContext or OfflineAudioContext
 * @param dest     destination node
 * @param spec     instrument definition (see data/instruments.js)
 * @param o        { midi, time, dur, vel, glideFrom, mod }
 * @returns { endTime, nodes }  endTime is when the tail is silent
 */
export function triggerSynth(ctx, dest, spec, o) {
  const t0 = o.time;
  const vel = clamp(o.vel == null ? 1 : o.vel, 0.02, 1);
  const dur = Math.max(0.01, o.dur == null ? 0.25 : o.dur);
  const mod = o.mod || {};                       // live macro overrides

  const tune = (spec.tune || 0) + (mod.tune || 0);
  const midi = (o.midi == null ? 60 : o.midi) + tune;
  const baseFreq = mtof(midi);

  const ampEnv = withMod(spec.ampEnv || { a: 0.005, d: 0.2, s: 0.7, r: 0.2 }, mod.ampEnv);
  const filtEnv = withMod(spec.filtEnv || { a: 0.004, d: 0.18, s: 0.25, r: 0.15 }, mod.filtEnv);

  /* --- output stage ------------------------------------------------ */
  const amp = ctx.createGain();
  const pan = ctx.createStereoPanner();
  amp.gain.value = MIN;
  pan.pan.value = clamp((spec.pan || 0) + (mod.pan || 0), -1, 1);
  amp.connect(pan);
  pan.connect(dest);

  /* --- filter ------------------------------------------------------ */
  const fSpec = spec.filter || {};
  const filter = ctx.createBiquadFilter();
  filter.type = fSpec.type || 'lowpass';
  const keytrack = fSpec.keytrack == null ? 0.3 : fSpec.keytrack;
  const NYQ = ceil(ctx);
  const cutoffBase = clamp(
    (fSpec.cutoff == null ? 3000 : fSpec.cutoff) *
      Math.pow(2, keytrack * (midi - 60) / 12) *
      Math.pow(2, (mod.cutoff || 0)),
    22, NYQ
  );
  filter.Q.value = clamp((fSpec.q == null ? 1 : fSpec.q) * (1 + (mod.resonance || 0)), 0.0001, 28);
  filter.connect(amp);

  /* Second filter pole for steeper, more aggressive shapes. */
  let filterIn = filter;
  if (fSpec.poles === 4) {
    const f2 = ctx.createBiquadFilter();
    f2.type = filter.type;
    f2.Q.value = Math.max(0.5, filter.Q.value * 0.4);
    f2.connect(filter);
    filterIn = f2;
    scheduleFilter(ctx, f2.frequency, cutoffBase, fSpec, filtEnv, t0, dur, vel, mod, 0.92, NYQ);
  }
  scheduleFilter(ctx, filter.frequency, cutoffBase, fSpec, filtEnv, t0, dur, vel, mod, 1, NYQ);

  /* --- pre-filter drive -------------------------------------------- */
  let chainIn = filterIn;
  const shaper = spec.shaper;
  if (shaper && (shaper.drive || 0) > 0.001) {
    const ws = ctx.createWaveShaper();
    const pre = ctx.createGain();
    const post = ctx.createGain();
    const drive = clamp((shaper.drive || 0) + (mod.drive || 0), 0, 1);
    ws.curve = curveFor(ctx, shaper.curve || 'soft', drive);
    ws.oversample = shaper.oversample || '2x';
    pre.gain.value = 1 + drive * 2.4;
    post.gain.value = 1 / (1 + drive * 1.7);
    pre.connect(ws); ws.connect(post); post.connect(filterIn);
    chainIn = pre;
  }

  const sources = [];
  const stopables = [];
  let peakSum = 0;

  /* --- oscillator bank --------------------------------------------- */
  const oscs = spec.oscs || [{ wave: 'sawtooth', level: 1 }];
  const glide = Math.max(0, (spec.glide || 0) + (mod.glide || 0));
  const pitchEnv = spec.pitchEnv;

  for (const os of oscs) {
    const level = (os.level == null ? 1 : os.level);
    if (level <= 0) continue;
    const uni = clamp(os.unison || 1, 1, MAX_UNISON);
    const spread = os.spread == null ? 12 : os.spread;
    const oscGain = ctx.createGain();
    oscGain.gain.value = level / Math.sqrt(uni);
    peakSum += level;

    const target = os.pan ? ctx.createStereoPanner() : null;
    if (target) { target.pan.value = clamp(os.pan, -1, 1); oscGain.connect(target); target.connect(chainIn); }
    else oscGain.connect(chainIn);

    for (let u = 0; u < uni; u++) {
      const osc = ctx.createOscillator();
      setWave(ctx, osc, os.wave || 'sawtooth');

      const semi = (os.semi || 0) + (os.oct || 0) * 12;
      const f = baseFreq * Math.pow(2, semi / 12);
      const det = (os.cent || 0) + (uni === 1 ? 0 : ((u / (uni - 1)) * 2 - 1) * spread);

      osc.frequency.value = Math.max(0.5, f);
      osc.detune.value = det;

      if (glide > 0 && o.glideFrom) {
        const from = o.glideFrom * Math.pow(2, semi / 12);
        osc.frequency.setValueAtTime(Math.max(0.5, from), t0);
        safeExp(osc.frequency, f, t0 + glide);
      }

      if (pitchEnv && pitchEnv.amt) {
        const amt = pitchEnv.amt * 100;                       // semitones -> cents
        osc.detune.setValueAtTime(det + amt, t0);
        osc.detune.linearRampToValueAtTime(det, t0 + Math.max(0.002, pitchEnv.d || 0.08));
      }

      /* Unison voices spread across the stereo field. */
      if (uni > 1 && os.stereo !== false) {
        const p = ctx.createStereoPanner();
        p.pan.value = ((u / (uni - 1)) * 2 - 1) * (os.width == null ? 0.7 : os.width);
        osc.connect(p); p.connect(oscGain);
      } else {
        osc.connect(oscGain);
      }

      osc.start(t0);
      sources.push(osc);
      stopables.push(osc);
    }
  }

  /* --- FM operator -------------------------------------------------- */
  if (spec.fm && spec.fm.index) {
    const modOsc = ctx.createOscillator();
    const modGain = ctx.createGain();
    setWave(ctx, modOsc, spec.fm.wave || 'sine');
    modOsc.frequency.value = Math.max(0.5, baseFreq * (spec.fm.ratio || 1));
    const idx = (spec.fm.index || 0) * (1 + (mod.fm || 0)) * baseFreq;
    modGain.gain.value = idx;
    if (spec.fm.decay) {
      modGain.gain.setValueAtTime(idx, t0);
      safeExp(modGain.gain, idx * (spec.fm.sustain == null ? 0.08 : spec.fm.sustain), t0 + spec.fm.decay);
    }
    modOsc.connect(modGain);
    for (const s of sources) if (s.frequency) modGain.connect(s.frequency);
    modOsc.start(t0);
    stopables.push(modOsc);
  }

  /* --- sub oscillator ----------------------------------------------- */
  if (spec.sub && spec.sub.level > 0) {
    const sub = ctx.createOscillator();
    const g = ctx.createGain();
    setWave(ctx, sub, spec.sub.wave || 'sine');
    sub.frequency.value = Math.max(0.5, baseFreq * Math.pow(2, (spec.sub.oct == null ? -1 : spec.sub.oct)));
    g.gain.value = spec.sub.level;
    peakSum += spec.sub.level;
    sub.connect(g);
    /* The sub bypasses the filter when asked, so low end survives sweeps. */
    g.connect(spec.sub.bypassFilter ? amp : chainIn);
    sub.start(t0);
    stopables.push(sub);
  }

  /* --- noise layer --------------------------------------------------- */
  if (spec.noise && spec.noise.level > 0) {
    const n = spec.noise;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, n.color || 'white', 3);
    src.loop = true;
    src.playbackRate.value = n.rate || 1;
    const g = ctx.createGain();
    g.gain.value = MIN;
    let tail = src;
    if (n.bp) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = clamp(n.bp * (n.keytrack ? baseFreq / 261.63 : 1), 30, NYQ);
      bp.Q.value = n.q || 2;
      tail.connect(bp); tail = bp;
    }
    if (n.hp) { const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = clamp(n.hp, 20, NYQ); tail.connect(hp); tail = hp; }
    if (n.lp) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = clamp(n.lp, 40, NYQ); tail.connect(lp); tail = lp; }
    tail.connect(g);
    g.connect(n.bypassFilter ? amp : chainIn);
    peakSum += n.level * 0.6;

    if (n.decay) {
      g.gain.setValueAtTime(MIN, t0);
      safeExp(g.gain, n.level * vel, t0 + 0.002);
      safeExp(g.gain, MIN, t0 + 0.002 + n.decay);
    } else {
      /* Follows the amp envelope. */
      g.gain.setValueAtTime(MIN, t0);
      safeExp(g.gain, n.level * vel, t0 + Math.max(0.001, ampEnv.a));
      safeExp(g.gain, Math.max(MIN, n.level * vel * ampEnv.s), t0 + ampEnv.a + ampEnv.d);
      const rel = t0 + dur;
      g.gain.setValueAtTime(Math.max(MIN, n.level * vel * ampEnv.s), rel);
      safeExp(g.gain, MIN, rel + Math.max(0.005, ampEnv.r));
    }
    src.start(t0);
    stopables.push(src);
  }

  /* --- LFO ----------------------------------------------------------- */
  if (spec.lfo && spec.lfo.depth) {
    const l = spec.lfo;
    const lfo = ctx.createOscillator();
    const lg = ctx.createGain();
    setWave(ctx, lfo, l.wave || 'sine');
    lfo.frequency.value = clamp(l.rate || 5, 0.01, 60);
    const depth = l.depth * (1 + (mod.lfo || 0));
    lg.gain.value = 0;
    lfo.connect(lg);

    const onset = t0 + (l.delay || 0);
    lg.gain.setValueAtTime(0, t0);
    lg.gain.linearRampToValueAtTime(
      l.target === 'filter' ? depth * 2400 : l.target === 'amp' ? depth * 0.5 : depth * 100,
      onset + (l.fade == null ? 0.15 : l.fade)
    );

    if (l.target === 'filter') lg.connect(filter.frequency);
    else if (l.target === 'amp') lg.connect(amp.gain);
    else if (l.target === 'pan') { lg.gain.value = depth; lg.connect(pan.pan); }
    else for (const s of sources) if (s.detune) lg.connect(s.detune);

    lfo.start(t0);
    stopables.push(lfo);
  }

  /* --- amp envelope --------------------------------------------------- */
  const velCurve = spec.velCurve == null ? 1 : spec.velCurve;
  const gain = clamp((spec.gain == null ? 0.7 : spec.gain) * (mod.gain == null ? 1 : mod.gain), 0, 4);
  const norm = peakSum > 0 ? 1 / Math.max(1, Math.sqrt(peakSum)) : 1;
  const peak = Math.max(MIN, gain * norm * Math.pow(vel, velCurve));

  const a = Math.max(0.0006, ampEnv.a);
  const d = Math.max(0.004, ampEnv.d);
  const s = clamp(ampEnv.s == null ? 0.7 : ampEnv.s, 0, 1);
  const r = Math.max(0.006, ampEnv.r == null ? 0.12 : ampEnv.r);

  amp.gain.setValueAtTime(MIN, t0);
  safeExp(amp.gain, peak, t0 + a);

  let releaseAt;
  if (s <= 0.001) {
    /* Percussive: the decay stage *is* the note. */
    safeExp(amp.gain, MIN, t0 + a + d);
    releaseAt = t0 + a + d;
  } else {
    const decayEnd = t0 + a + d;
    const sustainLevel = Math.max(MIN, peak * s);
    safeExp(amp.gain, sustainLevel, decayEnd);
    releaseAt = Math.max(t0 + a + 0.005, t0 + dur);
    /* Hold whatever the envelope reached, then release. */
    const heldValue = releaseAt < decayEnd
      ? Math.max(MIN, peak * Math.pow(s, (releaseAt - t0 - a) / Math.max(0.001, d)))
      : sustainLevel;
    amp.gain.cancelScheduledValues(releaseAt);
    amp.gain.setValueAtTime(heldValue, releaseAt);
    safeExp(amp.gain, MIN, releaseAt + r);
  }

  const endTime = releaseAt + r + 0.03;
  for (const node of stopables) { try { node.stop(endTime); } catch { /* already scheduled */ } }

  /* Web Audio drops the graph once the sources end; this just breaks the
   * last reference so the panner/filter are collectable promptly. */
  const cleanup = () => { try { pan.disconnect(); } catch { /* noop */ } };
  if (stopables.length && stopables[0].addEventListener) {
    stopables[0].addEventListener('ended', cleanup, { once: true });
  }

  return { endTime, amp, pan, filter };
}

function withMod(env, m) {
  if (!m) return env;
  return {
    a: Math.max(0.0005, (env.a || 0.005) * (m.a == null ? 1 : m.a)),
    d: Math.max(0.004, (env.d || 0.2) * (m.d == null ? 1 : m.d)),
    s: clamp(m.s == null ? (env.s == null ? 0.7 : env.s) : m.s, 0, 1),
    r: Math.max(0.005, (env.r || 0.15) * (m.r == null ? 1 : m.r))
  };
}

function scheduleFilter(ctx, param, base, fSpec, env, t0, dur, vel, mod, scale, nyq) {
  const envAmt = (fSpec.env == null ? 0 : fSpec.env) * (1 + (mod.filterEnv || 0));
  const velAmt = fSpec.velToEnv == null ? 0.5 : fSpec.velToEnv;
  const depth = envAmt * (1 - velAmt + velAmt * vel);
  const top = nyq || 20000;
  const start = clamp(base * scale, 22, top);

  param.cancelScheduledValues(t0);
  if (Math.abs(depth) < 0.01) { param.setValueAtTime(start, t0); return; }

  const peakFreq = clamp(start * Math.pow(2, depth), 22, top);
  const a = Math.max(0.0008, env.a);
  const d = Math.max(0.005, env.d);
  const sLevel = clamp(env.s == null ? 0.3 : env.s, 0, 1);
  const sustain = clamp(start * Math.pow(2, depth * sLevel), 22, top);

  param.setValueAtTime(start, t0);
  safeExp(param, peakFreq, t0 + a);
  safeExp(param, sustain, t0 + a + d);
  const rel = Math.max(t0 + a + 0.004, t0 + dur);
  param.setValueAtTime(Math.max(MIN, sustain), rel);
  safeExp(param, start, rel + Math.max(0.01, env.r));
}

/* ------------------------------------------------------------------ *
 * Drum voice
 * ------------------------------------------------------------------ */

/**
 * @param o { time, vel, midi, mod, tuneOffset }
 */
export function triggerDrum(ctx, dest, spec, o) {
  const t0 = o.time;
  const vel = clamp(o.vel == null ? 1 : o.vel, 0.02, 1);
  const mod = o.mod || {};
  /* A drum plays "as designed" on its own default note; placing it higher or
   * lower on the grid transposes the whole voice from there. */
  const ref = spec.baseNote == null ? (spec.defaultNote == null ? 48 : spec.defaultNote) : spec.baseNote;
  const played = o.midi == null ? ref : o.midi;
  const pitchScale = Math.pow(2, (played - ref) / 12) *
                     Math.pow(2, ((spec.tune || 0) + (mod.tune || 0)) / 12);
  const NYQ = ceil(ctx);
  const decayScale = Math.pow(2, mod.decay || 0);

  const out = ctx.createGain();
  const pan = ctx.createStereoPanner();
  pan.pan.value = clamp((spec.pan || 0) + (mod.pan || 0), -1, 1);
  out.gain.value = clamp((spec.gain == null ? 0.8 : spec.gain) * (mod.gain == null ? 1 : mod.gain), 0, 4) *
                   Math.pow(vel, spec.velCurve == null ? 1 : spec.velCurve);
  out.connect(pan);
  pan.connect(dest);

  /* Optional per-voice drive sits between the layers and the output. */
  let bus = out;
  if (spec.shaper && spec.shaper.drive > 0.001) {
    const ws = ctx.createWaveShaper();
    const pre = ctx.createGain();
    const post = ctx.createGain();
    const drive = clamp(spec.shaper.drive + (mod.drive || 0), 0, 1);
    ws.curve = curveFor(ctx, spec.shaper.curve || 'hard', drive);
    ws.oversample = '4x';
    pre.gain.value = 1 + drive * 3;
    post.gain.value = 1 / (1 + drive * 2);
    pre.connect(ws); ws.connect(post); post.connect(out);
    bus = pre;
  }

  /* Optional voice filter (used by the lo-fi and filtered kits). */
  let dst = bus;
  if (spec.filter && spec.filter.cutoff) {
    const f = ctx.createBiquadFilter();
    f.type = spec.filter.type || 'lowpass';
    f.frequency.value = clamp(spec.filter.cutoff * Math.pow(2, mod.cutoff || 0), 22, NYQ);
    f.Q.value = clamp(spec.filter.q || 1, 0.0001, 24);
    if (spec.filter.sweep) {
      f.frequency.setValueAtTime(clamp(spec.filter.cutoff * spec.filter.sweep, 22, NYQ), t0);
      safeExp(f.frequency, clamp(spec.filter.cutoff, 22, NYQ), t0 + (spec.filter.sweepTime || 0.06));
    }
    f.connect(bus);
    dst = f;
  }

  let end = t0 + 0.05;
  const mark = (t) => { if (t > end) end = t; };

  /* --- pitched body ------------------------------------------------- */
  const bodies = spec.bodies || (spec.body ? [spec.body] : []);
  for (const b of bodies) {
    if (!b || b.level <= 0) continue;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    setWave(ctx, osc, b.wave || 'sine');
    const f0 = clamp((b.f0 || 120) * pitchScale, 0.5, NYQ);
    const f1 = clamp((b.f1 == null ? b.f0 : b.f1) * pitchScale, 0.5, NYQ);
    const pd = Math.max(0.002, (b.pitchDecay == null ? 0.05 : b.pitchDecay) * decayScale);
    const dec = Math.max(0.006, (b.decay || 0.2) * decayScale);

    osc.frequency.setValueAtTime(f0, t0);
    if (Math.abs(f1 - f0) > 0.5) {
      if (b.curve && b.curve !== 1) {
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
          const x = i / steps;
          safeExp(osc.frequency, f0 + (f1 - f0) * Math.pow(x, b.curve), t0 + pd * x);
        }
      } else {
        safeExp(osc.frequency, f1, t0 + pd);
      }
    }

    if (b.fm) {
      const m = ctx.createOscillator();
      const mg = ctx.createGain();
      setWave(ctx, m, b.fmWave || 'sine');
      m.frequency.value = clamp(f0 * (b.fmRatio || 1.41), 0.5, NYQ);
      mg.gain.setValueAtTime(f0 * b.fm, t0);
      safeExp(mg.gain, MIN, t0 + Math.max(0.004, (b.fmDecay || dec * 0.4) * decayScale));
      m.connect(mg); mg.connect(osc.frequency);
      m.start(t0); m.stop(t0 + dec + 0.05);
    }

    const att = Math.max(0.0004, b.attack || 0.001);
    g.gain.setValueAtTime(MIN, t0);
    safeExp(g.gain, b.level, t0 + att);
    safeExp(g.gain, MIN, t0 + att + dec);
    osc.connect(g); g.connect(dst);
    osc.start(t0);
    osc.stop(t0 + att + dec + 0.03);
    mark(t0 + att + dec + 0.05);
  }

  /* --- inharmonic ring partials (hats, cymbals, metal) ---------------- */
  if (spec.ring && spec.ring.partials) {
    const r = spec.ring;
    const dec = Math.max(0.006, (r.decay || 0.12) * decayScale);
    const bp = ctx.createBiquadFilter();
    bp.type = r.filter || 'highpass';
    bp.frequency.value = clamp((r.cut || 6000) * pitchScale, 30, NYQ);
    bp.Q.value = r.q || 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(MIN, t0);
    safeExp(g.gain, r.level == null ? 0.5 : r.level, t0 + Math.max(0.0004, r.attack || 0.0008));
    if (r.hold) {
      safeExp(g.gain, (r.level || 0.5) * 0.7, t0 + r.hold);
    }
    safeExp(g.gain, MIN, t0 + dec);
    bp.connect(g); g.connect(dst);

    for (const p of r.partials) {
      const osc = ctx.createOscillator();
      osc.type = r.wave || 'square';
      osc.frequency.value = clamp(p * (r.base || 1) * pitchScale, 20, NYQ);
      osc.connect(bp);
      osc.start(t0);
      osc.stop(t0 + dec + 0.03);
    }
    mark(t0 + dec + 0.05);
  }

  /* --- noise layer ----------------------------------------------------- */
  const noises = spec.noises || (spec.noise ? [spec.noise] : []);
  for (const n of noises) {
    if (!n || n.level <= 0) continue;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, n.color || 'white', 3);
    src.loop = true;
    src.playbackRate.value = n.rate || 1;
    /* Start at a random offset so repeated hits are not identical. */
    const offset = (Math.random() * 2) % Math.max(0.1, src.buffer.duration - 0.5);

    let tail = src;
    if (n.bp) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = clamp(n.bp * pitchScale, 30, NYQ);
      bp.Q.value = n.q == null ? 1.6 : n.q;
      if (n.sweep) {
        bp.frequency.setValueAtTime(clamp(n.bp * n.sweep * pitchScale, 30, NYQ), t0);
        safeExp(bp.frequency, clamp(n.bp * pitchScale, 30, NYQ), t0 + Math.max(0.004, n.sweepTime || 0.05));
      }
      tail.connect(bp); tail = bp;
    }
    if (n.hp) {
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass';
      hp.frequency.value = clamp(n.hp * pitchScale, 20, NYQ);
      hp.Q.value = n.hpQ || 0.7;
      tail.connect(hp); tail = hp;
    }
    if (n.lp) {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.value = clamp(n.lp * pitchScale, 60, NYQ);
      lp.Q.value = n.lpQ || 0.7;
      if (n.lpSweep) {
        lp.frequency.setValueAtTime(clamp(n.lp * n.lpSweep * pitchScale, 60, NYQ), t0);
        safeExp(lp.frequency, clamp(n.lp * pitchScale, 60, NYQ), t0 + Math.max(0.005, n.sweepTime || 0.08));
      }
      tail.connect(lp); tail = lp;
    }

    const g = ctx.createGain();
    const dec = Math.max(0.004, (n.decay || 0.08) * decayScale);
    const att = Math.max(0.0003, n.attack || 0.0006);
    g.gain.setValueAtTime(MIN, t0);
    safeExp(g.gain, n.level, t0 + att);
    if (n.hold) safeExp(g.gain, n.level * (n.holdLevel == null ? 0.55 : n.holdLevel), t0 + att + n.hold);
    safeExp(g.gain, MIN, t0 + att + (n.hold || 0) + dec);
    tail.connect(g); g.connect(dst);
    src.start(t0, offset);
    src.stop(t0 + att + (n.hold || 0) + dec + 0.03);
    mark(t0 + att + (n.hold || 0) + dec + 0.05);
  }

  /* --- transient click -------------------------------------------------- */
  if (spec.click && spec.click.level > 0) {
    const c = spec.click;
    const src = ctx.createBufferSource();
    const len = Math.max(4, Math.floor(ctx.sampleRate * (c.decay || 0.004)));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const x = i / len;
      d[i] = (c.tone === 'tick' ? Math.sin(x * 220) : Math.random() * 2 - 1) * Math.pow(1 - x, 2.5);
    }
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = c.level;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = c.hp || 800;
    src.connect(hp); hp.connect(g); g.connect(dst);
    src.start(t0);
    mark(t0 + (c.decay || 0.004) + 0.02);
  }

  return { endTime: end };
}
