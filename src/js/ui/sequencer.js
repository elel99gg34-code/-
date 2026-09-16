/* The editing surface: a step grid for the whole pattern and a piano roll
 * for the selected track. Both write straight into project.patterns[].notes. */

import { $, clamp, clear, el, noteName, snapToScale } from '../lib/util.js';
import { getInstrument } from '../data/instruments.js';
import { notesAt } from '../state/project.js';

const CELL_W = 34;      // minimum; widened to fill the viewport for short patterns
const CELL_MAX = 72;
const ROW_H = 38;
const KEY_H = 15;
const ROLL_LOW = 24;    // C1
const ROLL_HIGH = 96;   // C7

export class Sequencer {
  constructor(app) {
    this.app = app;
    this.mode = 'grid';
    this.host = null;
    this.playStep = -1;
    this.selection = new Set();
    this.lastNoteLen = 1;
    this.painting = null;
    this.cellW = CELL_W;
  }

  mount(host) {
    this.host = host;
    this.render();
  }

  get project() { return this.app.project; }
  get pattern() { return this.app.pattern(); }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.render();
  }

  /** Short patterns stretch to fill the viewport; long ones scroll. */
  measure() {
    const p = this.pattern;
    if (!p) { this.cellW = CELL_W; return; }
    const keys = this.mode === 'roll' ? 62 : 0;
    const avail = Math.max(320, (this.host ? this.host.clientWidth : 900) - keys - 12);
    this.cellW = Math.max(CELL_W, Math.min(CELL_MAX, Math.floor(avail / p.steps)));
  }

  render() {
    if (!this.host) return;
    const scrollLeft = this.host.scrollLeft;
    const scrollTop = this.host.scrollTop;
    clear(this.host);
    this.host.classList.toggle('rollmode', this.mode === 'roll');
    this.measure();
    if (this.mode === 'grid') this.renderGrid();
    else this.renderRoll();
    this.host.scrollLeft = scrollLeft;
    this.host.scrollTop = scrollTop;
    this.paintPlayhead();
  }

  /* ================================================================ *
   * Step grid
   * ================================================================ */
  renderGrid() {
    const p = this.pattern;
    const proj = this.project;
    if (!p) return;

    const res = proj.res || 4;
    const CW = this.cellW;
    const wrap = el('div', { class: 'stepgrid', style: { width: `${p.steps * CW}px`, position: 'relative' } });

    /* ruler */
    const ruler = el('div', { class: 'ruler' });
    for (let s = 0; s < p.steps; s++) {
      const beat = s % res === 0;
      const bar = s % (res * 4) === 0;
      ruler.append(el('div', {
        class: 'rcell' + (bar ? ' bar' : beat ? ' beat' : ''),
        style: { width: `${CW}px` },
        text: bar ? String(s / (res * 4) + 1) : beat ? '·' : ''
      }));
    }
    wrap.append(ruler);

    /* rows */
    for (const track of proj.tracks) {
      const row = el('div', {
        class: 'srow' + (track.id === this.app.selectedTrackId ? ' sel' : ''),
        dataset: { track: track.id }
      });
      const list = p.notes[track.id] || [];
      const byStep = new Map();
      for (const n of list) {
        if (!byStep.has(n.s)) byStep.set(n.s, []);
        byStep.get(n.s).push(n);
      }

      for (let s = 0; s < p.steps; s++) {
        const beat = s % res === 0;
        const bar = s % (res * 4) === 0;
        const cell = el('div', {
          class: 'scell' + (bar ? ' bar' : beat ? ' beat' : ''),
          style: { width: `${CW}px` },
          dataset: { step: String(s), track: track.id }
        });
        const notes = byStep.get(s);
        if (notes && notes.length) {
          const top = notes[0];
          const hit = el('div', { class: 'hit' });
          hit.style.background = track.color || 'var(--riot)';
          hit.style.opacity = String(0.34 + clamp(top.v, 0, 1) * 0.66);
          if (notes.length > 1) hit.textContent = String(notes.length);
          else if (getInstrument(track.instrument).kind !== 'drum') hit.textContent = noteName(top.n).replace(/\d+$/, '');
          if (top.l > 1) hit.style.width = `calc(${top.l * 100}% + ${(top.l - 1) * 1}px)`;
          cell.append(hit);
        }
        row.append(cell);
      }
      wrap.append(row);
    }

    /* playhead */
    this.playheadNode = el('div', { class: 'playhead', style: { display: 'none' } });
    wrap.append(this.playheadNode);

    this.host.append(wrap);
    this.bindGrid(wrap);
  }

  bindGrid(wrap) {
    const cellOf = (e) => {
      const node = e.target.closest('.scell');
      return node ? { node, step: Number(node.dataset.step), track: node.dataset.track } : null;
    };

    const apply = (c, mode, e) => {
      const p = this.pattern;
      const track = this.project.tracks.find((t) => t.id === c.track);
      if (!track || !p) return;
      const list = notesAt(p, track.id);
      const idx = list.findIndex((n) => n.s === c.step);

      if (mode === 'erase') {
        if (idx < 0) return;
        list.splice(idx, 1);
      } else {
        if (idx >= 0) return;
        const inst = getInstrument(track.instrument);
        const midi = this.app.lastNoteFor(track.id) || inst.defaultNote || 60;
        const vel = e && e.shiftKey ? 0.5 : 0.9;
        list.push({ s: c.step, n: midi, v: vel, l: 1 });
        list.sort((a, b) => a.s - b.s);
        this.app.engine.previewTrack(track.id, midi, vel, 0.25);
      }
      this.app.markDirty();
      this.render();
    };

    wrap.addEventListener('pointerdown', (e) => {
      const c = cellOf(e);
      if (!c) return;
      e.preventDefault();
      this.app.selectTrack(c.track);
      const erase = e.button === 2 || e.altKey;
      this.app.pushHistory(erase ? 'erase steps' : 'draw steps');
      this.painting = { mode: erase ? 'erase' : 'draw', seen: new Set() };
      this.painting.seen.add(c.track + ':' + c.step);
      apply(c, this.painting.mode, e);
    });

    wrap.addEventListener('pointerover', (e) => {
      if (!this.painting) return;
      const c = cellOf(e);
      if (!c) return;
      const key = c.track + ':' + c.step;
      if (this.painting.seen.has(key)) return;
      this.painting.seen.add(key);
      apply(c, this.painting.mode, e);
    });

    wrap.addEventListener('contextmenu', (e) => e.preventDefault());

    const stop = () => { this.painting = null; };
    document.addEventListener('pointerup', stop, { once: true });

    /* Alt+wheel over a hit nudges its velocity. */
    wrap.addEventListener('wheel', (e) => {
      const c = cellOf(e);
      if (!c || !e.altKey) return;
      const p = this.pattern;
      const list = p.notes[c.track] || [];
      const n = list.find((x) => x.s === c.step);
      if (!n) return;
      e.preventDefault();
      n.v = clamp(n.v - Math.sign(e.deltaY) * 0.06, 0.05, 1);
      this.app.markDirty();
      this.render();
    }, { passive: false });
  }

  /* ================================================================ *
   * Piano roll
   * ================================================================ */
  renderRoll() {
    const p = this.pattern;
    const proj = this.project;
    const trackId = this.app.selectedTrackId;
    const track = proj.tracks.find((t) => t.id === trackId);
    if (!p || !track) {
      this.host.append(el('div', { class: 'empty' },
        el('h3', { text: 'No track selected' }),
        el('div', { text: 'Pick a track on the left to open its piano roll.' })));
      return;
    }

    const rows = ROLL_HIGH - ROLL_LOW + 1;
    const res = proj.res || 4;
    const root = (proj.key && proj.key.root) || 0;

    const CW = this.cellW;
    const layout = el('div', { id: 'roll' });

    /* keyboard — a single inner block we translate in step with the grid */
    const keys = el('div', { id: 'rollkeys' });
    const keysInner = el('div', { class: 'inner' });
    keysInner.append(el('div', { style: { height: '22px', background: '#0e0e12', borderBottom: '1px solid var(--line)' } }));
    for (let m = ROLL_HIGH; m >= ROLL_LOW; m--) {
      const pc = ((m % 12) + 12) % 12;
      const black = [1, 3, 6, 8, 10].includes(pc);
      const k = el('div', {
        class: 'k ' + (black ? 'black' : 'white') + (pc === root ? ' root' : ''),
        dataset: { midi: String(m) },
        text: pc === 0 || pc === root ? noteName(m) : ''
      });
      keysInner.append(k);
    }
    keys.append(keysInner);
    keys.addEventListener('pointerdown', (e) => {
      const k = e.target.closest('.k');
      if (!k) return;
      this.app.engine.previewTrack(track.id, Number(k.dataset.midi), 0.9, 0.5);
    });

    /* note area */
    const gridArea = el('div', { id: 'rollgrid' });
    const canvas = el('div', {
      class: 'rollcanvas',
      style: {
        width: `${p.steps * CW}px`,
        height: `${rows * KEY_H + 22}px`,
        backgroundImage: [
          keyRowStripes(),
          `repeating-linear-gradient(to right, #2f2f3a 0 1px, transparent 1px ${CW * res * 4}px)`,
          `repeating-linear-gradient(to right, #23232b 0 1px, transparent 1px ${CW * res}px)`,
          `repeating-linear-gradient(to right, #17171d 0 1px, transparent 1px ${CW}px)`
        ].join(','),
        backgroundPosition: '0 22px, 0 0, 0 0, 0 0',
        backgroundRepeat: 'repeat, repeat, repeat, repeat'
      }
    });

    /* ruler on top of the canvas */
    const ruler = el('div', { class: 'ruler', style: { width: `${p.steps * CW}px` } });
    for (let s = 0; s < p.steps; s++) {
      const beat = s % res === 0;
      const bar = s % (res * 4) === 0;
      ruler.append(el('div', {
        class: 'rcell' + (bar ? ' bar' : beat ? ' beat' : ''),
        style: { width: `${CW}px` },
        text: bar ? String(s / (res * 4) + 1) : ''
      }));
    }
    canvas.append(ruler);

    const yFor = (midi) => 22 + (ROLL_HIGH - midi) * KEY_H;

    for (const n of p.notes[track.id] || []) {
      if (n.n < ROLL_LOW || n.n > ROLL_HIGH) continue;
      const node = el('div', {
        class: 'rnote' + (this.selection.has(n) ? ' sel' : ''),
        dataset: { step: String(n.s), midi: String(n.n) },
        style: {
          left: `${n.s * CW + 1}px`,
          top: `${yFor(n.n) + 1}px`,
          width: `${Math.max(1, n.l) * CW - 2}px`,
          background: track.color || 'var(--riot)',
          opacity: String(0.42 + n.v * 0.58)
        },
        title: `${noteName(n.n)} · vel ${(n.v * 100) | 0}% · len ${n.l}`
      }, el('div', { class: 'res' }));
      node.__note = n;
      canvas.append(node);
    }

    this.playheadNode = el('div', { class: 'playhead', style: { display: 'none' } });
    canvas.append(this.playheadNode);

    gridArea.append(canvas);
    layout.append(keys, gridArea);
    this.host.append(layout);

    /* Keep the key column locked to the note area while scrolling. */
    gridArea.addEventListener('scroll', () => { keysInner.style.transform = `translateY(${-gridArea.scrollTop}px)`; });

    this.bindRoll(canvas, track, p);

    /* Scroll to where the notes actually are. */
    const list = p.notes[track.id] || [];
    const focus = list.length
      ? list.reduce((a, n) => a + n.n, 0) / list.length
      : (getInstrument(track.instrument).defaultNote || 60);
    requestAnimationFrame(() => {
      const h = gridArea.clientHeight || 400;
      gridArea.scrollTop = clamp(yFor(focus) - h / 2, 0, rows * KEY_H + 22 - h);
      keysInner.style.transform = `translateY(${-gridArea.scrollTop}px)`;
    });
  }

  bindRoll(canvas, track, pattern) {
    const proj = this.project;
    const CW = this.cellW;
    const stepFrom = (x) => clamp(Math.floor(x / CW), 0, pattern.steps - 1);
    const midiFrom = (y) => clamp(ROLL_HIGH - Math.floor((y - 22) / KEY_H), ROLL_LOW, ROLL_HIGH);

    let drag = null;

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (y < 22) return;
      e.preventDefault();

      const hit = e.target.closest('.rnote');

      /* Right-click / alt-click deletes. */
      if (hit && (e.button === 2 || e.altKey)) {
        this.app.pushHistory('delete note');
        const list = notesAt(pattern, track.id);
        const i = list.indexOf(hit.__note);
        if (i >= 0) list.splice(i, 1);
        this.app.markDirty();
        this.render();
        return;
      }

      if (hit) {
        const resizing = e.target.classList.contains('res');
        this.app.pushHistory(resizing ? 'resize note' : 'move note');
        drag = {
          kind: resizing ? 'resize' : 'move',
          note: hit.__note,
          node: hit,
          ox: x, oy: y,
          startStep: hit.__note.s,
          startMidi: hit.__note.n,
          startLen: hit.__note.l
        };
        canvas.setPointerCapture(e.pointerId);
        return;
      }

      /* Empty space: create. */
      const step = stepFrom(x);
      let midi = midiFrom(y);
      if (e.shiftKey) midi = snapToScale(midi, (proj.key && proj.key.root) || 0, (proj.key && proj.key.scale) || 'minor');
      this.app.pushHistory('add note');
      const note = { s: step, n: midi, v: 0.9, l: this.lastNoteLen };
      notesAt(pattern, track.id).push(note);
      this.app.setLastNote(track.id, midi);
      this.app.engine.previewTrack(track.id, midi, 0.9, 0.3);
      this.app.markDirty();
      this.render();
      return;
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (drag.kind === 'resize') {
        const len = clamp(Math.round((x - drag.note.s * CW) / CW), 1, pattern.steps - drag.note.s);
        if (len !== drag.note.l) {
          drag.note.l = len;
          this.lastNoteLen = len;
          drag.node.style.width = `${len * CW - 2}px`;
        }
      } else {
        const dStep = Math.round((x - drag.ox) / CW);
        const dMidi = -Math.round((y - drag.oy) / KEY_H);
        const s = clamp(drag.startStep + dStep, 0, pattern.steps - 1);
        let m = clamp(drag.startMidi + dMidi, ROLL_LOW, ROLL_HIGH);
        if (e.shiftKey) m = snapToScale(m, (proj.key && proj.key.root) || 0, (proj.key && proj.key.scale) || 'minor');
        if (s !== drag.note.s || m !== drag.note.n) {
          if (m !== drag.note.n) this.app.engine.previewTrack(track.id, m, 0.7, 0.2);
          drag.note.s = s;
          drag.note.n = m;
          drag.node.style.left = `${s * CW + 1}px`;
          drag.node.style.top = `${22 + (ROLL_HIGH - m) * KEY_H + 1}px`;
        }
      }
    });

    const endDrag = () => {
      if (!drag) return;
      this.app.setLastNote(track.id, drag.note.n);
      drag = null;
      this.app.markDirty();
      this.render();
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    /* Alt+wheel on a note changes velocity. */
    canvas.addEventListener('wheel', (e) => {
      const hit = e.target.closest('.rnote');
      if (!hit || !e.altKey) return;
      e.preventDefault();
      hit.__note.v = clamp(hit.__note.v - Math.sign(e.deltaY) * 0.06, 0.05, 1);
      hit.style.opacity = String(0.42 + hit.__note.v * 0.58);
      this.app.markDirty();
    }, { passive: false });
  }

  /* ================================================================ *
   * Playhead
   * ================================================================ */
  setPlayStep(step) {
    if (step === this.playStep) return;
    this.playStep = step;
    this.paintPlayhead();
  }

  paintPlayhead() {
    if (!this.playheadNode) return;
    if (this.playStep < 0) { this.playheadNode.style.display = 'none'; return; }
    this.playheadNode.style.display = '';
    this.playheadNode.style.left = `${this.playStep * this.cellW}px`;
  }
}


/** A 12-row repeating gradient whose dark bands line up with the black keys,
 * so the roll reads like a keyboard laid on its side. */
function keyRowStripes() {
  const stops = [];
  for (let i = 0; i < 12; i++) {
    const pc = ((ROLL_HIGH - i) % 12 + 12) % 12;
    const black = pc === 1 || pc === 3 || pc === 6 || pc === 8 || pc === 10;
    stops.push(`${black ? 'rgba(0,0,0,.34)' : 'rgba(255,255,255,.03)'} ${i * KEY_H}px ${(i + 1) * KEY_H}px`);
  }
  return `repeating-linear-gradient(to bottom, ${stops.join(',')})`;
}

export const GRID_METRICS = { CELL_W, ROW_H, KEY_H, ROLL_LOW, ROLL_HIGH };
