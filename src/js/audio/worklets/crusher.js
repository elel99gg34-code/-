/* AudioWorklet processors that cannot be expressed with stock nodes.
 * Loaded once per AudioContext (live and each offline render context). */

/** Bit-depth reduction + sample-rate decimation + a little analogue drift. */
class Crusher extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bits', defaultValue: 16, minValue: 1, maxValue: 16, automationRate: 'k-rate' },
      { name: 'reduction', defaultValue: 1, minValue: 1, maxValue: 100, automationRate: 'k-rate' },
      { name: 'jitter', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'mix', defaultValue: 1, minValue: 0, maxValue: 1, automationRate: 'k-rate' }
    ];
  }

  constructor() {
    super();
    this.hold = [0, 0];
    this.phase = [0, 0];
  }

  process(inputs, outputs, params) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || input.length === 0) return true;

    const bits = params.bits[0];
    const red = params.reduction[0];
    const jitter = params.jitter[0];
    const mix = params.mix[0];
    const levels = Math.pow(2, Math.max(1, bits)) - 1;

    for (let ch = 0; ch < output.length; ch++) {
      const inCh = input[Math.min(ch, input.length - 1)];
      const outCh = output[ch];
      if (!inCh) { outCh.fill(0); continue; }

      let hold = this.hold[ch] || 0;
      let phase = this.phase[ch] || 0;

      for (let i = 0; i < outCh.length; i++) {
        const dry = inCh[i];
        phase += 1;
        const step = jitter > 0 ? red * (1 + (Math.random() * 2 - 1) * jitter * 0.7) : red;
        if (phase >= step) {
          phase -= step;
          /* Quantize to `bits` after the sample-and-hold, the order a real
           * converter would do it in. */
          hold = Math.round(dry * 0.5 * levels) / (0.5 * levels);
        }
        outCh[i] = dry * (1 - mix) + hold * mix;
      }

      this.hold[ch] = hold;
      this.phase[ch] = phase;
    }
    return true;
  }
}

/** Soft clip + asymmetric bias, at audio rate so drive can be automated
 * without rebuilding a WaveShaper curve. */
class Grit extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'drive', defaultValue: 1, minValue: 0.1, maxValue: 64, automationRate: 'a-rate' },
      { name: 'bias', defaultValue: 0, minValue: -0.9, maxValue: 0.9, automationRate: 'k-rate' },
      { name: 'mix', defaultValue: 1, minValue: 0, maxValue: 1, automationRate: 'k-rate' }
    ];
  }

  process(inputs, outputs, params) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || input.length === 0) return true;

    const dA = params.drive;
    const bias = params.bias[0];
    const mix = params.mix[0];
    const kDrive = dA.length === 1 ? dA[0] : null;

    for (let ch = 0; ch < output.length; ch++) {
      const inCh = input[Math.min(ch, input.length - 1)];
      const outCh = output[ch];
      if (!inCh) { outCh.fill(0); continue; }
      for (let i = 0; i < outCh.length; i++) {
        const d = kDrive === null ? dA[i] : kDrive;
        const x = inCh[i] * d + bias;
        /* tanh-ish soft clip, cheap rational approximation */
        const y = x < -3 ? -1 : x > 3 ? 1 : (x * (27 + x * x)) / (27 + 9 * x * x);
        const wet = (y - bias / (1 + Math.abs(bias))) / Math.max(1, Math.sqrt(d));
        outCh[i] = inCh[i] * (1 - mix) + wet * mix;
      }
    }
    return true;
  }
}

registerProcessor('riot-crush', Crusher);
registerProcessor('riot-grit', Grit);
