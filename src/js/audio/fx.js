/* Effect units. Every builder returns { input, output, set(params), nodes }
 * and works identically in a live AudioContext and an OfflineAudioContext. */

import { clamp, dbToGain } from '../lib/util.js';
import { curveFor, impulse, noiseBuffer, setWave } from './dsp.js';

const now = (ctx) => ctx.currentTime;
const ramp = (param, v, ctx, t = 0.02) => {
  const value = isFinite(v) ? v : 0;
  try { param.setTargetAtTime(value, now(ctx), Math.max(0.001, t / 3)); }
  catch { param.value = value; }
};

/* ------------------------------------------------------------------ *
 * Distortion / drive
 * ------------------------------------------------------------------ */
export function makeDrive(ctx, o = {}) {
  const input = ctx.createGain();
  const pre = ctx.createGain();
  const shaper = ctx.createWaveShaper();
  const tone = ctx.createBiquadFilter();
  const lowCut = ctx.createBiquadFilter();
  const post = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const output = ctx.createGain();

  shaper.oversample = '4x';
  tone.type = 'lowpass';
  lowCut.type = 'highpass';

  input.connect(pre); pre.connect(shaper); shaper.connect(lowCut);
  lowCut.connect(tone); tone.connect(post); post.connect(wet); wet.connect(output);
  input.connect(dry); dry.connect(output);

  const unit = {
    input, output, kind: 'drive',
    nodes: { pre, shaper, tone, post },
    set(p = {}) {
      const amount = clamp(p.amount == null ? 0.5 : p.amount, 0, 1);
      const shape = p.shape || 'soft';
      shaper.curve = curveFor(ctx, shape, amount);
      ramp(pre.gain, 1 + amount * 3.2, ctx);
      ramp(tone.frequency, clamp(p.tone == null ? 7000 : p.tone, 200, 18000), ctx);
      tone.Q.value = 0.4;
      ramp(lowCut.frequency, clamp(p.lowCut == null ? 28 : p.lowCut, 10, 1200), ctx);
      /* Drive should not double as a volume knob. */
      ramp(post.gain, (p.level == null ? 1 : p.level) / (1 + amount * 1.5), ctx);
      const mix = clamp(p.mix == null ? 1 : p.mix, 0, 1);
      ramp(wet.gain, mix, ctx);
      ramp(dry.gain, 1 - mix, ctx);
    }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Bitcrusher (AudioWorklet, with a waveshaper fallback)
 * ------------------------------------------------------------------ */
export function makeCrush(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  let node = null;

  if (ctx.__riotWorklet) {
    try {
      node = new AudioWorkletNode(ctx, 'riot-crush', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2] });
      input.connect(node); node.connect(output);
    } catch { node = null; }
  }

  if (!node) {
    /* Fallback: quantization only, no decimation. */
    const shaper = ctx.createWaveShaper();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    input.connect(shaper); shaper.connect(lp); lp.connect(output);
    const unit = {
      input, output, kind: 'crush', fallback: true,
      set(p = {}) {
        const bits = clamp(p.bits == null ? 8 : p.bits, 1, 16);
        shaper.curve = curveFor(ctx, 'crush', 1 - (bits - 1) / 15);
        ramp(lp.frequency, clamp(ctx.sampleRate / 2 / clamp(p.reduction || 1, 1, 60), 200, 20000), ctx);
      }
    };
    unit.set(o);
    return unit;
  }

  const unit = {
    input, output, kind: 'crush', nodes: { node },
    set(p = {}) {
      ramp(node.parameters.get('bits'), clamp(p.bits == null ? 8 : p.bits, 1, 16), ctx, 0.01);
      ramp(node.parameters.get('reduction'), clamp(p.reduction == null ? 1 : p.reduction, 1, 100), ctx, 0.01);
      ramp(node.parameters.get('jitter'), clamp(p.jitter || 0, 0, 1), ctx, 0.01);
      ramp(node.parameters.get('mix'), clamp(p.mix == null ? 1 : p.mix, 0, 1), ctx, 0.01);
    }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Filter with its own LFO
 * ------------------------------------------------------------------ */
export function makeFilter(ctx, o = {}) {
  const input = ctx.createGain();
  const f1 = ctx.createBiquadFilter();
  const output = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoAmt = ctx.createGain();

  input.connect(f1); f1.connect(output);
  lfo.connect(lfoAmt); lfoAmt.connect(f1.detune);
  lfo.start();

  const unit = {
    input, output, kind: 'filter', nodes: { f1, lfo },
    set(p = {}) {
      f1.type = p.type || 'lowpass';
      ramp(f1.frequency, clamp(p.freq == null ? 2000 : p.freq, 20, 20000), ctx);
      f1.Q.value = clamp(p.q == null ? 1 : p.q, 0.0001, 30);
      f1.gain.value = clamp(p.gain || 0, -40, 40);
      ramp(lfo.frequency, clamp(p.lfoRate || 0.5, 0.01, 40), ctx);
      ramp(lfoAmt.gain, clamp(p.lfoDepth || 0, 0, 4800), ctx);
    },
    stop(t) { try { lfo.stop(t); } catch { /* already stopped */ } }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Chorus / flanger (modulated short delays, true stereo)
 * ------------------------------------------------------------------ */
export function makeChorus(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const merger = ctx.createChannelMerger(2);
  const fb = ctx.createGain();
  const fbFilter = ctx.createBiquadFilter();
  fbFilter.type = 'highpass';
  fbFilter.frequency.value = 180;

  const voices = [];
  const N = 3;
  for (let i = 0; i < N; i++) {
    const d = ctx.createDelay(0.12);
    const lfo = ctx.createOscillator();
    const amt = ctx.createGain();
    const pan = ctx.createStereoPanner();
    lfo.type = 'sine';
    lfo.frequency.value = 0.4 + i * 0.13;
    lfo.connect(amt); amt.connect(d.delayTime);
    input.connect(d); d.connect(pan); pan.connect(wet);
    pan.pan.value = N === 1 ? 0 : (i / (N - 1)) * 2 - 1;
    lfo.start();
    voices.push({ d, lfo, amt, pan });
  }

  wet.connect(fbFilter); fbFilter.connect(fb); fb.connect(voices[0].d);
  input.connect(dry); dry.connect(output); wet.connect(output);

  const unit = {
    input, output, kind: 'chorus', nodes: { voices },
    set(p = {}) {
      const base = clamp(p.delay == null ? 0.012 : p.delay, 0.0005, 0.08);
      const depth = clamp(p.depth == null ? 0.004 : p.depth, 0, 0.02);
      const rate = clamp(p.rate == null ? 0.6 : p.rate, 0.01, 12);
      const spread = clamp(p.spread == null ? 1 : p.spread, 0, 1);
      voices.forEach((v, i) => {
        ramp(v.d.delayTime, base * (1 + i * 0.32), ctx, 0.05);
        ramp(v.amt.gain, depth * (1 - i * 0.12), ctx, 0.05);
        ramp(v.lfo.frequency, rate * (1 + i * 0.21), ctx, 0.05);
        v.pan.pan.value = (N === 1 ? 0 : (i / (N - 1)) * 2 - 1) * spread;
      });
      ramp(fb.gain, clamp(p.feedback || 0, 0, 0.92), ctx);
      const mix = clamp(p.mix == null ? 0.5 : p.mix, 0, 1);
      ramp(wet.gain, mix, ctx);
      ramp(dry.gain, 1 - mix * 0.6, ctx);
    },
    stop(t) { voices.forEach((v) => { try { v.lfo.stop(t); } catch { /* noop */ } }); }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Phaser (cascaded all-pass)
 * ------------------------------------------------------------------ */
export function makePhaser(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const fb = ctx.createGain();
  const lfo = ctx.createOscillator();
  const amt = ctx.createGain();

  const stages = [];
  let node = input;
  for (let i = 0; i < 6; i++) {
    const ap = ctx.createBiquadFilter();
    ap.type = 'allpass';
    ap.frequency.value = 400 * Math.pow(1.7, i);
    ap.Q.value = 0.7;
    node.connect(ap);
    amt.connect(ap.frequency);
    node = ap;
    stages.push(ap);
  }
  node.connect(wet);
  wet.connect(fb); fb.connect(stages[0]);
  input.connect(dry); dry.connect(output); wet.connect(output);
  lfo.connect(amt); lfo.start();

  const unit = {
    input, output, kind: 'phaser', nodes: { stages, lfo },
    set(p = {}) {
      ramp(lfo.frequency, clamp(p.rate == null ? 0.3 : p.rate, 0.01, 12), ctx);
      ramp(amt.gain, clamp(p.depth == null ? 900 : p.depth, 0, 4000), ctx);
      const base = clamp(p.freq == null ? 400 : p.freq, 60, 4000);
      stages.forEach((s, i) => { ramp(s.frequency, base * Math.pow(1.7, i), ctx); s.Q.value = clamp(p.q || 0.7, 0.05, 12); });
      ramp(fb.gain, clamp(p.feedback == null ? 0.4 : p.feedback, 0, 0.9), ctx);
      const mix = clamp(p.mix == null ? 0.5 : p.mix, 0, 1);
      ramp(wet.gain, mix, ctx); ramp(dry.gain, 1 - mix, ctx);
    },
    stop(t) { try { lfo.stop(t); } catch { /* noop */ } }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Stereo / ping-pong delay with filtered, saturated feedback
 * ------------------------------------------------------------------ */
export function makeDelay(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();

  const splitL = ctx.createGain();
  const splitR = ctx.createGain();
  const dL = ctx.createDelay(4);
  const dR = ctx.createDelay(4);
  const fbL = ctx.createGain();
  const fbR = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  const hp = ctx.createBiquadFilter();
  const sat = ctx.createWaveShaper();
  const panL = ctx.createStereoPanner();
  const panR = ctx.createStereoPanner();
  const wobble = ctx.createOscillator();
  const wobbleAmt = ctx.createGain();

  lp.type = 'lowpass'; lp.frequency.value = 5200;
  hp.type = 'highpass'; hp.frequency.value = 180;
  sat.curve = curveFor(ctx, 'soft', 0.25);
  sat.oversample = '2x';
  panL.pan.value = -0.85;
  panR.pan.value = 0.85;
  wobble.frequency.value = 0.27;
  wobble.connect(wobbleAmt);
  wobbleAmt.connect(dL.delayTime);
  wobbleAmt.connect(dR.delayTime);
  wobble.start();

  input.connect(splitL); input.connect(splitR);
  splitL.connect(dL); splitR.connect(dR);
  dL.connect(panL); dR.connect(panR);
  panL.connect(wet); panR.connect(wet);
  /* Cross-feed makes it ping-pong; self-feed makes it a plain stereo delay. */
  dL.connect(hp); hp.connect(lp); lp.connect(sat);
  sat.connect(fbL); sat.connect(fbR);
  dR.connect(hp);
  fbL.connect(dR); fbR.connect(dL);

  input.connect(dry); dry.connect(output); wet.connect(output);

  const unit = {
    input, output, kind: 'delay', nodes: { dL, dR },
    set(p = {}) {
      const tL = clamp(p.timeL == null ? 0.3 : p.timeL, 0.001, 3.9);
      const tR = clamp(p.timeR == null ? tL * 1.5 : p.timeR, 0.001, 3.9);
      ramp(dL.delayTime, tL, ctx, 0.08);
      ramp(dR.delayTime, tR, ctx, 0.08);
      const f = clamp(p.feedback == null ? 0.35 : p.feedback, 0, 0.95);
      ramp(fbL.gain, f, ctx); ramp(fbR.gain, f, ctx);
      ramp(lp.frequency, clamp(p.damp == null ? 5200 : p.damp, 200, 18000), ctx);
      ramp(hp.frequency, clamp(p.lowCut == null ? 180 : p.lowCut, 20, 2000), ctx);
      ramp(wobbleAmt.gain, clamp(p.wobble || 0, 0, 0.01), ctx);
      const spread = clamp(p.spread == null ? 0.85 : p.spread, 0, 1);
      panL.pan.value = -spread; panR.pan.value = spread;
      const mix = clamp(p.mix == null ? 0.3 : p.mix, 0, 1);
      ramp(wet.gain, mix, ctx);
      ramp(dry.gain, p.send ? 0 : 1 - mix * 0.5, ctx);
    },
    stop(t) { try { wobble.stop(t); } catch { /* noop */ } }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Convolution reverb with pre-delay and tone shaping
 * ------------------------------------------------------------------ */
export function makeReverb(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const preDelay = ctx.createDelay(0.5);
  const hp = ctx.createBiquadFilter();
  const lp = ctx.createBiquadFilter();
  const conv = ctx.createConvolver();
  const width = ctx.createStereoPanner();

  hp.type = 'highpass'; hp.frequency.value = 160;
  lp.type = 'lowpass'; lp.frequency.value = 9000;
  conv.normalize = false;

  input.connect(preDelay); preDelay.connect(hp); hp.connect(lp); lp.connect(conv);
  conv.connect(width); width.connect(wet); wet.connect(output);
  input.connect(dry); dry.connect(output);

  let lastKind = null;
  const unit = {
    input, output, kind: 'reverb', nodes: { conv },
    set(p = {}) {
      const kind = p.kind || 'hall';
      const size = clamp(p.size == null ? 1 : p.size, 0.15, 3);
      const key = kind + ':' + size.toFixed(2) + ':' + (p.decay || 0).toFixed(2);
      if (key !== lastKind) {
        const base = { room: 0.9, hall: 2.6, plate: 1.7, spring: 1.2, cave: 4.5, gated: 0.42, ruin: 3.4 }[kind] || 2.4;
        conv.buffer = impulse(ctx, kind, clamp(base * size, 0.08, 8), p.decay || undefined);
        lastKind = key;
      }
      ramp(preDelay.delayTime, clamp(p.preDelay || 0.01, 0, 0.45), ctx, 0.05);
      ramp(hp.frequency, clamp(p.lowCut == null ? 160 : p.lowCut, 20, 2000), ctx);
      ramp(lp.frequency, clamp(p.damp == null ? 9000 : p.damp, 400, 19000), ctx);
      const mix = clamp(p.mix == null ? 0.25 : p.mix, 0, 1);
      ramp(wet.gain, mix * 1.2, ctx);
      ramp(dry.gain, p.send ? 0 : 1 - mix * 0.4, ctx);
    }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Compressor / glue
 * ------------------------------------------------------------------ */
export function makeComp(ctx, o = {}) {
  const input = ctx.createGain();
  const comp = ctx.createDynamicsCompressor();
  const makeup = ctx.createGain();
  const output = ctx.createGain();
  input.connect(comp); comp.connect(makeup); makeup.connect(output);

  const unit = {
    input, output, kind: 'comp', nodes: { comp },
    reduction: () => comp.reduction,
    set(p = {}) {
      comp.threshold.value = clamp(p.threshold == null ? -18 : p.threshold, -100, 0);
      comp.knee.value = clamp(p.knee == null ? 12 : p.knee, 0, 40);
      comp.ratio.value = clamp(p.ratio == null ? 4 : p.ratio, 1, 20);
      comp.attack.value = clamp(p.attack == null ? 0.006 : p.attack, 0, 1);
      comp.release.value = clamp(p.release == null ? 0.16 : p.release, 0.01, 1);
      ramp(makeup.gain, dbToGain(clamp(p.makeup == null ? 0 : p.makeup, -24, 24)), ctx);
    }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * 3-band EQ
 * ------------------------------------------------------------------ */
export function makeEQ(ctx, o = {}) {
  const input = ctx.createGain();
  const low = ctx.createBiquadFilter();
  const mid = ctx.createBiquadFilter();
  const high = ctx.createBiquadFilter();
  const output = ctx.createGain();
  low.type = 'lowshelf'; mid.type = 'peaking'; high.type = 'highshelf';
  input.connect(low); low.connect(mid); mid.connect(high); high.connect(output);

  const unit = {
    input, output, kind: 'eq', nodes: { low, mid, high },
    set(p = {}) {
      low.frequency.value = clamp(p.lowFreq || 160, 30, 800);
      ramp(low.gain, clamp(p.low || 0, -24, 24), ctx);
      mid.frequency.value = clamp(p.midFreq || 1100, 150, 8000);
      mid.Q.value = clamp(p.midQ || 0.9, 0.1, 12);
      ramp(mid.gain, clamp(p.mid || 0, -24, 24), ctx);
      high.frequency.value = clamp(p.highFreq || 5200, 1200, 16000);
      ramp(high.gain, clamp(p.high || 0, -24, 24), ctx);
    }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Trance gate — rhythmic chopping, synced by the engine
 * ------------------------------------------------------------------ */
export function makeGate(ctx, o = {}) {
  const input = ctx.createGain();
  const vca = ctx.createGain();
  const output = ctx.createGain();
  input.connect(vca); vca.connect(output);
  vca.gain.value = 1;

  const unit = {
    input, output, kind: 'gate', nodes: { vca },
    pattern: o.pattern || [1, 0, 1, 0, 1, 0, 1, 0],
    depth: o.depth == null ? 1 : o.depth,
    shape: o.shape == null ? 0.35 : o.shape,
    set(p = {}) {
      if (p.pattern) unit.pattern = p.pattern;
      if (p.depth != null) unit.depth = clamp(p.depth, 0, 1);
      if (p.shape != null) unit.shape = clamp(p.shape, 0.01, 1);
    },
    /** Called by the scheduler for every 16th note. */
    step(t, index, stepDur) {
      const pat = unit.pattern;
      if (!pat || !pat.length) return;
      const on = pat[index % pat.length] ? 1 : 1 - unit.depth;
      const g = vca.gain;
      const edge = Math.max(0.0015, stepDur * unit.shape * 0.5);
      g.cancelScheduledValues(t);
      g.setValueAtTime(Math.max(0.0001, g.value), t);
      g.linearRampToValueAtTime(Math.max(0.0001, on), t + edge);
    }
  };
  return unit;
}

/* ------------------------------------------------------------------ *
 * Auto-pan / tremolo
 * ------------------------------------------------------------------ */
export function makeAutoPan(ctx, o = {}) {
  const input = ctx.createGain();
  const pan = ctx.createStereoPanner();
  const trem = ctx.createGain();
  const output = ctx.createGain();
  const lfo = ctx.createOscillator();
  const panAmt = ctx.createGain();
  const tremAmt = ctx.createGain();
  const tremBias = ctx.createConstantSource();

  input.connect(pan); pan.connect(trem); trem.connect(output);
  lfo.connect(panAmt); panAmt.connect(pan.pan);
  lfo.connect(tremAmt); tremAmt.connect(trem.gain);
  tremBias.connect(trem.gain);
  trem.gain.value = 0;
  lfo.start(); tremBias.start();

  const unit = {
    input, output, kind: 'autopan', nodes: { lfo },
    set(p = {}) {
      setWave(ctx, lfo, p.shape || 'sine');
      ramp(lfo.frequency, clamp(p.rate == null ? 2 : p.rate, 0.01, 40), ctx);
      const d = clamp(p.depth == null ? 0.7 : p.depth, 0, 1);
      if (p.mode === 'trem') {
        ramp(panAmt.gain, 0, ctx);
        ramp(tremAmt.gain, d * 0.5, ctx);
        ramp(tremBias.offset, 1 - d * 0.5, ctx);
      } else {
        ramp(panAmt.gain, d, ctx);
        ramp(tremAmt.gain, 0, ctx);
        ramp(tremBias.offset, 1, ctx);
      }
    },
    stop(t) { try { lfo.stop(t); tremBias.stop(t); } catch { /* noop */ } }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Ring modulator
 * ------------------------------------------------------------------ */
export function makeRing(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const vca = ctx.createGain();
  const osc = ctx.createOscillator();

  vca.gain.value = 0;
  input.connect(vca); vca.connect(wet); wet.connect(output);
  input.connect(dry); dry.connect(output);
  osc.connect(vca.gain);
  osc.start();

  const unit = {
    input, output, kind: 'ring', nodes: { osc },
    set(p = {}) {
      setWave(ctx, osc, p.shape || 'sine');
      ramp(osc.frequency, clamp(p.freq == null ? 220 : p.freq, 0.1, 8000), ctx);
      const mix = clamp(p.mix == null ? 0.5 : p.mix, 0, 1);
      ramp(wet.gain, mix, ctx); ramp(dry.gain, 1 - mix, ctx);
    },
    stop(t) { try { osc.stop(t); } catch { /* noop */ } }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Stereo width (mid/side)
 * ------------------------------------------------------------------ */
export function makeWidth(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const splitter = ctx.createChannelSplitter(2);
  const merger = ctx.createChannelMerger(2);
  const midG = ctx.createGain();
  const sideG = ctx.createGain();
  const invert = ctx.createGain();
  const lInv = ctx.createGain();
  invert.gain.value = -1; lInv.gain.value = -1;

  /* M = (L+R)/2, S = (L-R)/2, then L' = M+S*w, R' = M-S*w */
  input.connect(splitter);
  splitter.connect(midG, 0); splitter.connect(midG, 1);
  splitter.connect(sideG, 0);
  splitter.connect(invert, 1); invert.connect(sideG);
  midG.connect(merger, 0, 0); midG.connect(merger, 0, 1);
  sideG.connect(merger, 0, 0);
  sideG.connect(lInv); lInv.connect(merger, 0, 1);
  merger.connect(output);

  const unit = {
    input, output, kind: 'width',
    set(p = {}) {
      const w = clamp(p.width == null ? 1 : p.width, 0, 2);
      ramp(midG.gain, 0.5, ctx);
      ramp(sideG.gain, 0.5 * w, ctx);
      ramp(output.gain, 1 / (0.75 + w * 0.25), ctx);
    }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Vinyl / tape noise floor — a texture layer, not a filter
 * ------------------------------------------------------------------ */
export function makeNoiseFloor(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 60;
  src.buffer = noiseBuffer(ctx, o.color || 'vinyl', 4);
  src.loop = true;
  src.connect(hp); hp.connect(g); g.connect(output);
  input.connect(output);
  g.gain.value = 0;
  src.start();

  const unit = {
    input, output, kind: 'noisefloor',
    set(p = {}) { ramp(g.gain, clamp(p.level || 0, 0, 0.5), ctx); },
    stop(t) { try { src.stop(t); } catch { /* noop */ } }
  };
  unit.set(o);
  return unit;
}

/* ------------------------------------------------------------------ *
 * Registry
 * ------------------------------------------------------------------ */
export const FX_BUILDERS = {
  drive: makeDrive,
  crush: makeCrush,
  filter: makeFilter,
  chorus: makeChorus,
  phaser: makePhaser,
  delay: makeDelay,
  reverb: makeReverb,
  comp: makeComp,
  eq: makeEQ,
  gate: makeGate,
  autopan: makeAutoPan,
  ring: makeRing,
  width: makeWidth,
  noisefloor: makeNoiseFloor
};

export const FX_LABELS = {
  drive: 'Drive',
  crush: 'Bitcrush',
  filter: 'Filter',
  chorus: 'Chorus',
  phaser: 'Phaser',
  delay: 'Delay',
  reverb: 'Reverb',
  comp: 'Compressor',
  eq: 'EQ',
  gate: 'Gate',
  autopan: 'Auto-pan',
  ring: 'Ring mod',
  width: 'Width',
  noisefloor: 'Noise floor'
};

/** Build a serial chain of effect units. Returns null for an empty list. */
export function buildChain(ctx, specs) {
  if (!specs || !specs.length) return null;
  const units = [];
  for (const s of specs) {
    const b = FX_BUILDERS[s.type];
    if (!b) continue;
    const u = b(ctx, s);
    u.spec = s;
    units.push(u);
  }
  if (!units.length) return null;
  for (let i = 0; i < units.length - 1; i++) units[i].output.connect(units[i + 1].input);
  return {
    input: units[0].input,
    output: units[units.length - 1].output,
    units,
    set(i, p) { if (units[i]) units[i].set(p); },
    stop(t) { units.forEach((u) => u.stop && u.stop(t)); }
  };
}

export const FX_DEFAULTS = {
  drive: { type: 'drive', shape: 'soft', amount: 0.4, tone: 7000, mix: 1, level: 1 },
  crush: { type: 'crush', bits: 8, reduction: 2, jitter: 0, mix: 0.6 },
  filter: { type: 'filter', filterType: 'lowpass', freq: 2200, q: 2, lfoRate: 0.5, lfoDepth: 0 },
  chorus: { type: 'chorus', rate: 0.6, depth: 0.004, delay: 0.012, feedback: 0.15, mix: 0.4 },
  phaser: { type: 'phaser', rate: 0.3, depth: 900, feedback: 0.4, mix: 0.5 },
  delay: { type: 'delay', timeL: 0.28, timeR: 0.42, feedback: 0.35, damp: 5200, mix: 0.28 },
  reverb: { type: 'reverb', kind: 'hall', size: 1, mix: 0.22, preDelay: 0.012, damp: 8000 },
  comp: { type: 'comp', threshold: -18, ratio: 4, attack: 0.006, release: 0.16, makeup: 2 },
  eq: { type: 'eq', low: 0, mid: 0, high: 0, midFreq: 1100 },
  gate: { type: 'gate', depth: 1, shape: 0.3, pattern: [1, 0, 1, 1, 0, 1, 0, 1] },
  autopan: { type: 'autopan', mode: 'pan', rate: 2, depth: 0.7, shape: 'sine' },
  ring: { type: 'ring', freq: 220, mix: 0.4, shape: 'sine' },
  width: { type: 'width', width: 1.3 },
  noisefloor: { type: 'noisefloor', color: 'vinyl', level: 0.04 }
};
