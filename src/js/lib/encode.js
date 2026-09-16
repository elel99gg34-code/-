/* Audio file encoders.
 *
 * WAV is written here (16 / 24 bit PCM and 32-bit float).
 * MP3 goes through LAME, loaded on demand from lib/vendor as a separate,
 * unmodified library (LGPL — see vendor/LAME-LICENSE.txt). */

import { clamp } from './util.js';

/* ------------------------------------------------------------------ *
 * WAV
 * ------------------------------------------------------------------ */

/**
 * @param buffer AudioBuffer
 * @param bits   16 | 24 | 32 (32 = IEEE float)
 * @returns ArrayBuffer containing a complete RIFF/WAVE file
 */
export function encodeWav(buffer, bits = 24) {
  const channels = buffer.numberOfChannels;
  const frames = buffer.length;
  const sampleRate = buffer.sampleRate;
  const float = bits === 32;
  const bytesPerSample = float ? 4 : bits / 8;
  const blockAlign = channels * bytesPerSample;
  const dataBytes = frames * blockAlign;

  /* A 16-byte fmt chunk is enough for PCM; float needs the extended
   * WAVE_FORMAT_IEEE_FLOAT tag but the same chunk layout. */
  const headerBytes = 44;
  const out = new ArrayBuffer(headerBytes + dataBytes);
  const view = new DataView(out);

  let p = 0;
  const str = (s) => { for (let i = 0; i < s.length; i++) view.setUint8(p++, s.charCodeAt(i)); };
  const u32 = (v) => { view.setUint32(p, v, true); p += 4; };
  const u16 = (v) => { view.setUint16(p, v, true); p += 2; };

  str('RIFF');
  u32(36 + dataBytes);
  str('WAVE');
  str('fmt ');
  u32(16);
  u16(float ? 3 : 1);              // 1 = PCM, 3 = IEEE float
  u16(channels);
  u32(sampleRate);
  u32(sampleRate * blockAlign);
  u16(blockAlign);
  u16(float ? 32 : bits);
  str('data');
  u32(dataBytes);

  const chans = [];
  for (let c = 0; c < channels; c++) chans.push(buffer.getChannelData(c));

  if (float) {
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < channels; c++) { view.setFloat32(p, chans[c][i], true); p += 4; }
    }
  } else if (bits === 16) {
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < channels; c++) {
        const s = clamp(chans[c][i], -1, 1);
        view.setInt16(p, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        p += 2;
      }
    }
  } else {
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < channels; c++) {
        const s = clamp(chans[c][i], -1, 1);
        const v = Math.round(s < 0 ? s * 0x800000 : s * 0x7fffff);
        view.setUint8(p, v & 0xff);
        view.setUint8(p + 1, (v >> 8) & 0xff);
        view.setUint8(p + 2, (v >> 16) & 0xff);
        p += 3;
      }
    }
  }

  return out;
}

/* ------------------------------------------------------------------ *
 * MP3 (LAME)
 * ------------------------------------------------------------------ */

let lamePromise = null;

function loadLame() {
  if (lamePromise) return lamePromise;
  lamePromise = new Promise((resolve, reject) => {
    if (window.lamejs && window.lamejs.Mp3Encoder) { resolve(window.lamejs); return; }
    const s = document.createElement('script');
    s.src = '/js/lib/vendor/lamejs.iife.js';
    s.onload = () => {
      if (window.lamejs && window.lamejs.Mp3Encoder) resolve(window.lamejs);
      else reject(new Error('LAME loaded but Mp3Encoder is missing'));
    };
    s.onerror = () => reject(new Error('Could not load the MP3 encoder'));
    document.head.appendChild(s);
  });
  return lamePromise;
}

/** LAME only accepts a fixed set of sample rates. */
const MP3_RATES = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];

/**
 * @param buffer   AudioBuffer
 * @param kbps     128 | 192 | 256 | 320
 * @param onProgress (0..1) => void
 * @returns ArrayBuffer of MP3 data
 */
export async function encodeMp3(buffer, kbps = 320, onProgress) {
  const lame = await loadLame();
  const channels = Math.min(2, buffer.numberOfChannels);
  const rate = MP3_RATES.includes(buffer.sampleRate) ? buffer.sampleRate : 44100;

  const src = rate === buffer.sampleRate ? buffer : await resample(buffer, rate);
  const frames = src.length;

  const encoder = new lame.Mp3Encoder(channels, rate, kbps);
  const left = toInt16(src.getChannelData(0));
  const right = channels > 1 ? toInt16(src.getChannelData(1)) : null;

  const blocks = [];
  const CHUNK = 1152 * 8;
  for (let i = 0; i < frames; i += CHUNK) {
    const l = left.subarray(i, Math.min(frames, i + CHUNK));
    const r = right ? right.subarray(i, Math.min(frames, i + CHUNK)) : null;
    const buf = right ? encoder.encodeBuffer(l, r) : encoder.encodeBuffer(l);
    if (buf.length) blocks.push(new Uint8Array(buf));
    if (onProgress && (i / CHUNK) % 16 === 0) onProgress(i / frames);
    /* Let the UI breathe on long renders. */
    if ((i / CHUNK) % 64 === 0) await new Promise((r2) => setTimeout(r2, 0));
  }
  const last = encoder.flush();
  if (last.length) blocks.push(new Uint8Array(last));
  if (onProgress) onProgress(1);

  let total = 0;
  for (const b of blocks) total += b.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const b of blocks) { out.set(b, off); off += b.length; }
  return out.buffer;
}

function toInt16(f32) {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    const s = clamp(f32[i], -1, 1);
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

async function resample(buffer, rate) {
  const frames = Math.ceil(buffer.duration * rate);
  const ctx = new OfflineAudioContext(Math.min(2, buffer.numberOfChannels), frames, rate);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start(0);
  return ctx.startRendering();
}

/* ------------------------------------------------------------------ *
 * Peak / loudness inspection for the export dialog
 * ------------------------------------------------------------------ */
export function analyse(buffer) {
  let peak = 0;
  let sum = 0;
  let count = 0;
  let clipped = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const d = buffer.getChannelData(c);
    for (let i = 0; i < d.length; i++) {
      const a = Math.abs(d[i]);
      if (a > peak) peak = a;
      if (a >= 0.9995) clipped++;
      sum += d[i] * d[i];
      count++;
    }
  }
  const rms = Math.sqrt(sum / Math.max(1, count));
  return {
    peakDb: 20 * Math.log10(Math.max(1e-6, peak)),
    rmsDb: 20 * Math.log10(Math.max(1e-6, rms)),
    clipped,
    duration: buffer.duration
  };
}
