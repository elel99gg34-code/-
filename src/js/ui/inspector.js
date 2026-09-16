/* The right-hand editor: instrument macros, per-track FX chain, sends,
 * and the global master / send settings. */

import { clear, el, gainToDb } from '../lib/util.js';
import { getInstrument, CATEGORIES, INSTRUMENTS } from '../data/instruments.js';
import { FX_DEFAULTS, FX_LABELS } from '../audio/fx.js';
import { knob, labeledRow, section, select, toast } from './widgets.js';

/* Which knobs a given instrument kind exposes. `mod` values are offsets /
 * multipliers layered on top of the instrument definition. */
const DRUM_MACROS = [
  { key: 'gain', label: 'Level', min: 0, max: 2, default: 1, digits: 2 },
  { key: 'tune', label: 'Tune', min: -24, max: 24, default: 0, unit: ' st', digits: 0, bipolar: true },
  { key: 'decay', label: 'Decay', min: -2, max: 2, default: 0, digits: 2, bipolar: true },
  { key: 'drive', label: 'Drive', min: -0.5, max: 0.5, default: 0, digits: 2, bipolar: true },
  { key: 'cutoff', label: 'Tone', min: -3, max: 3, default: 0, digits: 2, bipolar: true },
  { key: 'pan', label: 'Pan', min: -1, max: 1, default: 0, digits: 2, bipolar: true }
];

const SYNTH_MACROS = [
  { key: 'gain', label: 'Level', min: 0, max: 2, default: 1, digits: 2 },
  { key: 'tune', label: 'Tune', min: -24, max: 24, default: 0, unit: ' st', digits: 0, bipolar: true },
  { key: 'cutoff', label: 'Cutoff', min: -4, max: 4, default: 0, digits: 2, bipolar: true },
  { key: 'resonance', label: 'Reso', min: -0.9, max: 4, default: 0, digits: 2, bipolar: true },
  { key: 'filterEnv', label: 'F.Env', min: -1, max: 2, default: 0, digits: 2, bipolar: true },
  { key: 'drive', label: 'Drive', min: -0.5, max: 0.6, default: 0, digits: 2, bipolar: true },
  { key: 'fm', label: 'FM', min: -1, max: 3, default: 0, digits: 2, bipolar: true },
  { key: 'lfo', label: 'LFO', min: -1, max: 3, default: 0, digits: 2, bipolar: true },
  { key: 'glide', label: 'Glide', min: 0, max: 0.4, default: 0, digits: 3, unit: 's' },
  { key: 'pan', label: 'Pan', min: -1, max: 1, default: 0, digits: 2, bipolar: true }
];

const ENV_MACROS = [
  { key: 'a', label: 'Attack', min: 0.1, max: 8, default: 1, digits: 2, curve: 2 },
  { key: 'd', label: 'Decay', min: 0.1, max: 8, default: 1, digits: 2, curve: 2 },
  { key: 's', label: 'Sustain', min: 0, max: 1, default: null, digits: 2 },
  { key: 'r', label: 'Release', min: 0.1, max: 8, default: 1, digits: 2, curve: 2 }
];

/* Parameter schemas so the FX editor can build itself. */
const FX_PARAMS = {
  drive: [
    { key: 'amount', label: 'Drive', min: 0, max: 1, digits: 2 },
    { key: 'tone', label: 'Tone', min: 300, max: 18000, digits: 0, curve: 2.5, unit: 'Hz' },
    { key: 'lowCut', label: 'Low cut', min: 20, max: 1000, digits: 0, curve: 2 },
    { key: 'mix', label: 'Mix', min: 0, max: 1, digits: 2 }
  ],
  crush: [
    { key: 'bits', label: 'Bits', min: 1, max: 16, digits: 0, step: 1 },
    { key: 'reduction', label: 'Rate', min: 1, max: 60, digits: 1, curve: 2 },
    { key: 'jitter', label: 'Jitter', min: 0, max: 1, digits: 2 },
    { key: 'mix', label: 'Mix', min: 0, max: 1, digits: 2 }
  ],
  filter: [
    { key: 'freq', label: 'Freq', min: 30, max: 18000, digits: 0, curve: 2.5, unit: 'Hz' },
    { key: 'q', label: 'Reso', min: 0.1, max: 24, digits: 1 },
    { key: 'lfoRate', label: 'LFO Hz', min: 0.02, max: 20, digits: 2, curve: 2 },
    { key: 'lfoDepth', label: 'LFO amt', min: 0, max: 3600, digits: 0 }
  ],
  chorus: [
    { key: 'rate', label: 'Rate', min: 0.02, max: 8, digits: 2, curve: 2 },
    { key: 'depth', label: 'Depth', min: 0, max: 0.02, digits: 4 },
    { key: 'feedback', label: 'Fdbk', min: 0, max: 0.9, digits: 2 },
    { key: 'mix', label: 'Mix', min: 0, max: 1, digits: 2 }
  ],
  phaser: [
    { key: 'rate', label: 'Rate', min: 0.02, max: 8, digits: 2, curve: 2 },
    { key: 'depth', label: 'Depth', min: 0, max: 3000, digits: 0 },
    { key: 'feedback', label: 'Fdbk', min: 0, max: 0.9, digits: 2 },
    { key: 'mix', label: 'Mix', min: 0, max: 1, digits: 2 }
  ],
  delay: [
    { key: 'timeL', label: 'Time L', min: 0.01, max: 2, digits: 3, unit: 's' },
    { key: 'timeR', label: 'Time R', min: 0.01, max: 2, digits: 3, unit: 's' },
    { key: 'feedback', label: 'Fdbk', min: 0, max: 0.94, digits: 2 },
    { key: 'damp', label: 'Damp', min: 300, max: 16000, digits: 0, curve: 2.5 },
    { key: 'mix', label: 'Mix', min: 0, max: 1, digits: 2 }
  ],
  reverb: [
    { key: 'size', label: 'Size', min: 0.2, max: 3, digits: 2 },
    { key: 'preDelay', label: 'Pre', min: 0, max: 0.4, digits: 3, unit: 's' },
    { key: 'damp', label: 'Damp', min: 500, max: 18000, digits: 0, curve: 2.5 },
    { key: 'lowCut', label: 'Low cut', min: 20, max: 1200, digits: 0, curve: 2 },
    { key: 'mix', label: 'Mix', min: 0, max: 1, digits: 2 }
  ],
  comp: [
    { key: 'threshold', label: 'Thresh', min: -60, max: 0, digits: 0, unit: 'dB' },
    { key: 'ratio', label: 'Ratio', min: 1, max: 20, digits: 1 },
    { key: 'attack', label: 'Attack', min: 0.001, max: 0.3, digits: 3, curve: 2 },
    { key: 'release', label: 'Rel', min: 0.02, max: 1, digits: 2 },
    { key: 'makeup', label: 'Makeup', min: -12, max: 18, digits: 1, unit: 'dB', bipolar: true }
  ],
  eq: [
    { key: 'low', label: 'Low', min: -18, max: 18, digits: 1, unit: 'dB', bipolar: true },
    { key: 'mid', label: 'Mid', min: -18, max: 18, digits: 1, unit: 'dB', bipolar: true },
    { key: 'midFreq', label: 'Mid Hz', min: 200, max: 7000, digits: 0, curve: 2 },
    { key: 'high', label: 'High', min: -18, max: 18, digits: 1, unit: 'dB', bipolar: true }
  ],
  gate: [
    { key: 'depth', label: 'Depth', min: 0, max: 1, digits: 2 },
    { key: 'shape', label: 'Shape', min: 0.02, max: 1, digits: 2 }
  ],
  autopan: [
    { key: 'rate', label: 'Rate', min: 0.05, max: 20, digits: 2, curve: 2 },
    { key: 'depth', label: 'Depth', min: 0, max: 1, digits: 2 }
  ],
  ring: [
    { key: 'freq', label: 'Freq', min: 1, max: 4000, digits: 1, curve: 2.5, unit: 'Hz' },
    { key: 'mix', label: 'Mix', min: 0, max: 1, digits: 2 }
  ],
  width: [{ key: 'width', label: 'Width', min: 0, max: 2, digits: 2 }],
  noisefloor: [{ key: 'level', label: 'Level', min: 0, max: 0.3, digits: 3 }]
};

export class Inspector {
  constructor(app) {
    this.app = app;
    this.host = null;
    this.titleNode = null;
  }

  mount(host, titleNode) {
    this.host = host;
    this.titleNode = titleNode;
    this.render();
  }

  render() {
    if (!this.host) return;
    clear(this.host);
    const app = this.app;
    const track = app.selectedTrack();

    if (!track) {
      if (this.titleNode) this.titleNode.textContent = 'Master';
      this.host.append(this.masterSection());
      return;
    }

    const inst = getInstrument(track.instrument);
    if (this.titleNode) this.titleNode.textContent = track.name;

    const parts = [
      this.identitySection(track, inst),
      this.macroSection(track, inst),
      inst.kind === 'synth' ? this.envSection(track) : null,
      this.mixSection(track),
      this.fxSection(track),
      this.masterSection()
    ].filter(Boolean);
    this.host.append(...parts);
  }

  /* ---------------------------------------------------------------- */
  identitySection(track, inst) {
    const app = this.app;
    const nameInput = el('input', { class: 'input', value: track.name, style: { flex: '1' } });
    nameInput.addEventListener('change', () => {
      app.pushHistory('rename track');
      track.name = nameInput.value.trim() || inst.name;
      app.markDirty();
      app.renderTracks();
      this.render();
    });

    const catSel = select(
      CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
      inst.cat,
      (cat) => {
        const first = INSTRUMENTS.find((i) => i.cat === cat);
        if (first) swap(first.id);
      }
    );

    const instSel = select(
      INSTRUMENTS.filter((i) => i.cat === inst.cat).map((i) => ({ value: i.id, label: i.name })),
      inst.id,
      (id) => swap(id)
    );

    const swap = (id) => {
      const next = getInstrument(id);
      app.pushHistory('change instrument');
      const wasDefaultName = track.name === inst.name;
      track.instrument = next.id;
      track.color = next.color;
      if (wasDefaultName) track.name = next.name;
      track.mod = {};
      app.markDirty();
      app.rebuildAudio();
      app.renderTracks();
      this.render();
      app.engine.previewTrack(track.id, null, 0.9, 0.5);
    };

    return section('Instrument', [
      labeledRow('Name', nameInput),
      labeledRow('Family', catSel),
      labeledRow('Preset', instSel),
      el('div', { class: 'row' },
        el('label', { text: '' }),
        el('button', {
          class: 'btn sm', text: '▶ Audition',
          onclick: () => app.engine.previewTrack(track.id, null, 0.95, 0.6)
        }),
        el('button', {
          class: 'btn sm', text: 'Reset macros',
          onclick: () => {
            app.pushHistory('reset macros');
            track.mod = {};
            app.markDirty();
            this.render();
          }
        })
      ),
      el('div', { class: 'tt', style: { marginTop: '2px' }, text: (inst.tags || []).join(' · ') })
    ]);
  }

  macroSection(track, inst) {
    const app = this.app;
    const defs = inst.kind === 'drum' ? DRUM_MACROS : SYNTH_MACROS;
    const row = el('div', { class: 'knobrow' });
    for (const d of defs) {
      row.append(knob({
        label: d.label,
        min: d.min, max: d.max,
        value: track.mod[d.key] == null ? (d.default == null ? 0 : d.default) : track.mod[d.key],
        default: d.default,
        digits: d.digits, unit: d.unit, bipolar: d.bipolar, curve: d.curve,
        color: inst.color,
        onChange: (v) => {
          track.mod[d.key] = v;
          app.markDirty(true);
        },
        onEnd: () => app.pushHistoryDeferred('tweak ' + d.label)
      }));
    }
    return section('Macros', [row, el('div', { class: 'tt', text: 'Drag · shift = fine · dbl-click = reset' })]);
  }

  envSection(track) {
    const app = this.app;
    const inst = getInstrument(track.instrument);
    if (!track.mod.ampEnv) track.mod.ampEnv = {};
    const mk = (target, label) => {
      const row = el('div', { class: 'knobrow' });
      for (const d of ENV_MACROS) {
        const base = (inst[target] || {})[d.key];
        const isSustain = d.key === 's';
        row.append(knob({
          label: d.label,
          min: isSustain ? 0 : d.min,
          max: isSustain ? 1 : d.max,
          curve: d.curve,
          value: track.mod[target] && track.mod[target][d.key] != null
            ? track.mod[target][d.key]
            : (isSustain ? (base == null ? 0.7 : base) : 1),
          default: isSustain ? (base == null ? 0.7 : base) : 1,
          digits: d.digits,
          format: isSustain ? undefined : (v) => `×${v.toFixed(2)}`,
          onChange: (v) => {
            if (!track.mod[target]) track.mod[target] = {};
            track.mod[target][d.key] = v;
            app.markDirty(true);
          },
          onEnd: () => app.pushHistoryDeferred('tweak envelope')
        }));
      }
      return el('div', {}, el('div', { class: 'tt', text: label }), row);
    };
    return section('Envelopes', [mk('ampEnv', 'Amplitude'), mk('filtEnv', 'Filter')], { open: false });
  }

  mixSection(track) {
    const app = this.app;
    const row = el('div', { class: 'knobrow' });
    row.append(
      knob({
        label: 'Volume', min: -60, max: 6, value: track.vol, default: -6, digits: 1, unit: 'dB',
        onChange: (v) => { track.vol = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('volume')
      }),
      knob({
        label: 'Pan', min: -1, max: 1, value: track.pan, default: 0, digits: 2, bipolar: true,
        onChange: (v) => { track.pan = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('pan')
      }),
      knob({
        label: 'Reverb', min: 0, max: 1.2, value: track.sends.reverb, default: 0, digits: 2, color: 'var(--volt)',
        onChange: (v) => { track.sends.reverb = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('reverb send')
      }),
      knob({
        label: 'Delay', min: 0, max: 1.2, value: track.sends.delay, default: 0, digits: 2, color: 'var(--volt)',
        onChange: (v) => { track.sends.delay = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('delay send')
      })
    );
    return section('Mix', [row]);
  }

  fxSection(track) {
    const app = this.app;
    const list = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '7px' } });

    track.fx.forEach((spec, index) => {
      const params = FX_PARAMS[spec.type] || [];
      const body = el('div', { class: 'knobrow' });
      for (const p of params) {
        body.append(knob({
          label: p.label,
          min: p.min, max: p.max, curve: p.curve, step: p.step,
          value: spec[p.key] == null ? (FX_DEFAULTS[spec.type] || {})[p.key] || p.min : spec[p.key],
          default: (FX_DEFAULTS[spec.type] || {})[p.key],
          digits: p.digits, unit: p.unit, bipolar: p.bipolar,
          color: 'var(--acid)',
          onChange: (v) => {
            spec[p.key] = v;
            app.engine.syncTrackFx(track.id);
            app.markDirty(true);
          },
          onEnd: () => app.pushHistoryDeferred('fx ' + p.label)
        }));
      }

      /* Extra selectors for the effects that have a character switch. */
      const extras = [];
      if (spec.type === 'drive') {
        extras.push(labeledRow('Character', select(
          ['soft', 'tube', 'hard', 'fuzz', 'diode', 'fold', 'rect', 'crush', 'saturate', 'destroy'].map((v) => ({ value: v, label: v })),
          spec.shape || 'soft',
          (v) => { app.pushHistory('fx shape'); spec.shape = v; app.engine.syncTrackFx(track.id); app.markDirty(); }
        )));
      }
      if (spec.type === 'reverb') {
        extras.push(labeledRow('Space', select(
          ['room', 'hall', 'plate', 'spring', 'cave', 'gated', 'ruin'].map((v) => ({ value: v, label: v })),
          spec.kind || 'hall',
          (v) => { app.pushHistory('reverb kind'); spec.kind = v; app.engine.syncTrackFx(track.id); app.markDirty(); }
        )));
      }
      if (spec.type === 'filter') {
        extras.push(labeledRow('Type', select(
          ['lowpass', 'highpass', 'bandpass', 'notch', 'peaking'].map((v) => ({ value: v, label: v })),
          spec.filterType || 'lowpass',
          (v) => { app.pushHistory('filter type'); spec.filterType = v; spec.type2 = v; app.engine.syncTrackFx(track.id); app.markDirty(); }
        )));
      }
      if (spec.type === 'autopan') {
        extras.push(labeledRow('Mode', select(
          [{ value: 'pan', label: 'Auto-pan' }, { value: 'trem', label: 'Tremolo' }],
          spec.mode || 'pan',
          (v) => { app.pushHistory('autopan mode'); spec.mode = v; app.engine.syncTrackFx(track.id); app.markDirty(); }
        )));
      }
      if (spec.type === 'gate') {
        const pat = el('div', { style: { display: 'flex', gap: '2px', flexWrap: 'wrap' } });
        const cur = spec.pattern || FX_DEFAULTS.gate.pattern;
        cur.forEach((on, i) => {
          const b = el('button', {
            class: 'tmini' + (on ? ' s on' : ''),
            text: String(i + 1),
            onclick: () => {
              app.pushHistory('gate pattern');
              cur[i] = cur[i] ? 0 : 1;
              spec.pattern = cur;
              app.engine.syncTrackFx(track.id);
              app.markDirty();
              this.render();
            }
          });
          pat.append(b);
        });
        extras.push(el('div', {}, el('div', { class: 'tt', text: 'Pattern' }), pat));
      }

      list.append(el('div', { class: 'fxcard' },
        el('header', {},
          el('span', { text: FX_LABELS[spec.type] || spec.type }),
          el('div', { class: 'grow', style: { flex: '1' } }),
          index > 0 ? el('span', {
            class: 'x', text: '↑', title: 'Move up',
            onclick: () => { app.pushHistory('reorder fx'); track.fx.splice(index - 1, 0, track.fx.splice(index, 1)[0]); app.markDirty(); app.rebuildAudio(); this.render(); }
          }) : null,
          el('span', {
            class: 'x', text: '✕', title: 'Remove',
            onclick: () => { app.pushHistory('remove fx'); track.fx.splice(index, 1); app.markDirty(); app.rebuildAudio(); this.render(); }
          })
        ),
        el('div', { class: 'body' }, body, ...extras)
      ));
    });

    const adder = select(
      [{ value: '', label: '+ Add effect…' }, ...Object.keys(FX_LABELS).map((k) => ({ value: k, label: FX_LABELS[k] }))],
      '',
      (v) => {
        if (!v) return;
        if (track.fx.length >= 6) { toast('Six inserts per track is the limit.', { kind: 'warn' }); return; }
        app.pushHistory('add fx');
        track.fx.push(JSON.parse(JSON.stringify(FX_DEFAULTS[v])));
        app.markDirty();
        app.rebuildAudio();
        this.render();
      }
    );

    return section(`Effects (${track.fx.length})`, [list, adder]);
  }

  /* ---------------------------------------------------------------- */
  masterSection() {
    const app = this.app;
    const p = app.project;
    const m = p.master;

    const masterKnobs = el('div', { class: 'knobrow' },
      knob({
        label: 'Volume', min: -40, max: 6, value: m.volume, default: -3, digits: 1, unit: 'dB',
        onChange: (v) => { m.volume = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('master volume')
      }),
      knob({
        label: 'Glue', min: -40, max: 0, value: m.compThreshold, default: -14, digits: 0, unit: 'dB',
        onChange: (v) => { m.compThreshold = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('master comp')
      }),
      knob({
        label: 'Saturate', min: 0, max: 0.7, value: m.drive, default: 0.08, digits: 2,
        onChange: (v) => { m.drive = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('master drive')
      }),
      knob({
        label: 'Width', min: 0, max: 2, value: m.width, default: 1, digits: 2,
        onChange: (v) => { m.width = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('master width')
      })
    );

    const eqKnobs = el('div', { class: 'knobrow' },
      ...['low', 'mid', 'high'].map((band) => knob({
        label: band.toUpperCase(), min: -15, max: 15, value: m.eq[band] || 0, default: 0, digits: 1, unit: 'dB', bipolar: true,
        onChange: (v) => { m.eq[band] = v; app.engine.syncMix(); app.markDirty(true); },
        onEnd: () => app.pushHistoryDeferred('master eq')
      }))
    );

    const rv = p.sends.reverb;
    const dl = p.sends.delay;
    const sendKnobs = el('div', {},
      el('div', { class: 'tt', text: 'Reverb bus' }),
      labeledRow('Space', select(
        ['room', 'hall', 'plate', 'spring', 'cave', 'gated', 'ruin'].map((v) => ({ value: v, label: v })),
        rv.kind, (v) => { app.pushHistory('reverb bus'); rv.kind = v; app.engine.syncMix(); app.markDirty(); }
      )),
      el('div', { class: 'knobrow' },
        knob({ label: 'Size', min: 0.2, max: 3, value: rv.size, default: 1.1, digits: 2, color: 'var(--volt)',
          onChange: (v) => { rv.size = v; app.engine.syncMix(); app.markDirty(true); }, onEnd: () => app.pushHistoryDeferred('reverb size') }),
        knob({ label: 'Damp', min: 600, max: 18000, curve: 2.5, value: rv.damp, default: 8200, digits: 0, color: 'var(--volt)',
          onChange: (v) => { rv.damp = v; app.engine.syncMix(); app.markDirty(true); }, onEnd: () => app.pushHistoryDeferred('reverb damp') }),
        knob({ label: 'Return', min: 0, max: 1.6, value: rv.return, default: 0.9, digits: 2, color: 'var(--volt)',
          onChange: (v) => { rv.return = v; app.engine.syncMix(); app.markDirty(true); }, onEnd: () => app.pushHistoryDeferred('reverb return') })
      ),
      el('div', { class: 'tt', style: { marginTop: '8px' }, text: 'Delay bus' }),
      el('div', { class: 'knobrow' },
        knob({ label: 'Time L', min: 0.02, max: 1.5, value: dl.timeL, default: 0.26, digits: 3, unit: 's', color: 'var(--volt)',
          onChange: (v) => { dl.timeL = v; app.engine.syncMix(); app.markDirty(true); }, onEnd: () => app.pushHistoryDeferred('delay time') }),
        knob({ label: 'Time R', min: 0.02, max: 1.5, value: dl.timeR, default: 0.39, digits: 3, unit: 's', color: 'var(--volt)',
          onChange: (v) => { dl.timeR = v; app.engine.syncMix(); app.markDirty(true); }, onEnd: () => app.pushHistoryDeferred('delay time') }),
        knob({ label: 'Fdbk', min: 0, max: 0.92, value: dl.feedback, default: 0.36, digits: 2, color: 'var(--volt)',
          onChange: (v) => { dl.feedback = v; app.engine.syncMix(); app.markDirty(true); }, onEnd: () => app.pushHistoryDeferred('delay feedback') }),
        knob({ label: 'Return', min: 0, max: 1.6, value: dl.return, default: 0.8, digits: 2, color: 'var(--volt)',
          onChange: (v) => { dl.return = v; app.engine.syncMix(); app.markDirty(true); }, onEnd: () => app.pushHistoryDeferred('delay return') })
      ),
      el('div', { class: 'row', style: { marginTop: '6px' } },
        el('label', { text: 'Sync' }),
        el('button', {
          class: 'btn sm', text: 'Delay → tempo',
          title: 'Set the delay bus to dotted-eighth and quarter at the current tempo',
          onclick: () => {
            app.pushHistory('sync delay');
            const beat = 60 / app.project.bpm;
            dl.timeL = beat * 0.75;
            dl.timeR = beat * 0.5;
            app.engine.syncMix();
            app.markDirty();
            this.render();
            toast('Delay synced to ' + Math.round(app.project.bpm) + ' BPM', { kind: 'ok' });
          }
        })
      )
    );

    return el('div', {},
      section('Master', [masterKnobs, el('div', { class: 'tt', text: 'EQ' }), eqKnobs], { open: !app.selectedTrack() }),
      section('Send buses', [sendKnobs], { open: false })
    );
  }
}
