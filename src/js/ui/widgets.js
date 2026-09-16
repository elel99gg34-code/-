/* Reusable UI parts: knobs, faders, drag-numbers, modals, toasts. */

import { clamp, el } from '../lib/util.js';

/* ------------------------------------------------------------------ *
 * Pointer drag helper — vertical drag, shift = fine, double-click = reset
 * ------------------------------------------------------------------ */
export function dragValue(node, { get, set, range = 1, fine = 0.2, onEnd, onStart } = {}) {
  let startY = 0;
  let startV = 0;
  let dragging = false;

  const move = (e) => {
    if (!dragging) return;
    const dy = startY - e.clientY;
    const scale = e.shiftKey ? fine : 1;
    set(startV + (dy / 160) * range * scale, e);
  };
  const up = () => {
    if (!dragging) return;
    dragging = false;
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    document.body.style.cursor = '';
    if (onEnd) onEnd();
  };

  node.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragging = true;
    startY = e.clientY;
    startV = get();
    if (onStart) onStart();
    document.body.style.cursor = 'ns-resize';
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });

  node.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scale = e.shiftKey ? fine : 1;
    set(get() - Math.sign(e.deltaY) * range * 0.02 * scale, e);
    if (onEnd) onEnd();
  }, { passive: false });

  return node;
}

/* ------------------------------------------------------------------ *
 * Knob
 * ------------------------------------------------------------------ */
const ARC_START = -135;
const ARC_END = 135;

/**
 * @param o { label, min, max, value, step, unit, curve, bipolar, format, onChange, onEnd }
 */
export function knob(o) {
  const min = o.min == null ? 0 : o.min;
  const max = o.max == null ? 1 : o.max;
  const curve = o.curve || 1;                     // >1 = more resolution near min
  let value = clamp(o.value == null ? min : o.value, min, max);

  const norm = () => {
    const t = (value - min) / (max - min || 1);
    return curve === 1 ? t : Math.pow(t, 1 / curve);
  };
  const fromNorm = (t) => {
    const c = clamp(t, 0, 1);
    return min + (max - min) * (curve === 1 ? c : Math.pow(c, curve));
  };

  const dial = el('div', { class: 'dial' });
  dial.innerHTML = `
    <svg viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#25252d" stroke-width="3.4" stroke-linecap="round"
              stroke-dasharray="73 100" transform="rotate(135 20 20)"/>
      <circle class="arc" cx="20" cy="20" r="15.5" fill="none" stroke="${o.color || 'var(--riot)'}" stroke-width="3.4"
              stroke-linecap="round" stroke-dasharray="0 100" transform="rotate(135 20 20)"/>
      <circle cx="20" cy="20" r="11" fill="#1b1b22" stroke="#31313b"/>
      <line class="ptr" x1="20" y1="20" x2="20" y2="10.5" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;
  const arc = dial.querySelector('.arc');
  const ptr = dial.querySelector('.ptr');

  const valNode = el('div', { class: 'val' });
  const wrap = el('div', { class: 'knob', title: o.tip || o.label || '' },
    dial, el('div', { class: 'lab', text: o.label || '' }), valNode);

  const fmt = o.format || ((v) => {
    const digits = o.digits == null ? (Math.abs(max - min) > 40 ? 0 : Math.abs(max - min) > 4 ? 1 : 2) : o.digits;
    return v.toFixed(digits) + (o.unit || '');
  });

  function paint() {
    const t = norm();
    if (o.bipolar) {
      const half = 73 / 2;
      const from = 36.5;
      const len = (t - 0.5) * 73;
      arc.setAttribute('stroke-dasharray', `${Math.abs(len)} 100`);
      arc.setAttribute('stroke-dashoffset', String(len < 0 ? -(from + len - half + half) : -(from - half + half)));
      /* Simpler and robust: draw from centre outward. */
      arc.setAttribute('stroke-dasharray', `${Math.abs(len)} 200`);
      arc.setAttribute('stroke-dashoffset', String(len >= 0 ? -36.5 : -(36.5 + len)));
    } else {
      arc.setAttribute('stroke-dasharray', `${t * 73} 200`);
      arc.setAttribute('stroke-dashoffset', '0');
    }
    const ang = ARC_START + t * (ARC_END - ARC_START);
    ptr.setAttribute('transform', `rotate(${ang} 20 20)`);
    valNode.textContent = fmt(value);
  }

  dragValue(dial, {
    get: () => norm(),
    set: (t) => {
      let v = fromNorm(t);
      if (o.step) v = Math.round(v / o.step) * o.step;
      value = clamp(v, min, max);
      paint();
      if (o.onChange) o.onChange(value);
    },
    range: 1,
    onEnd: () => { if (o.onEnd) o.onEnd(value); }
  });

  dial.addEventListener('dblclick', () => {
    value = clamp(o.default == null ? (o.bipolar ? 0 : min) : o.default, min, max);
    paint();
    if (o.onChange) o.onChange(value);
    if (o.onEnd) o.onEnd(value);
  });

  paint();
  wrap.setValue = (v) => { value = clamp(v, min, max); paint(); };
  wrap.getValue = () => value;
  return wrap;
}

/* ------------------------------------------------------------------ *
 * Vertical fader (dB)
 * ------------------------------------------------------------------ */
export function fader(o) {
  const min = o.min == null ? -60 : o.min;
  const max = o.max == null ? 6 : o.max;
  let value = clamp(o.value == null ? 0 : o.value, min, max);

  const fill = el('div', { class: 'fill' });
  const cap = el('div', { class: 'cap' });
  const node = el('div', { class: 'fader', title: o.tip || 'Level' },
    el('div', { class: 'track' }), fill, cap);

  function paint() {
    const t = (value - min) / (max - min);
    const pct = t * 100;
    fill.style.height = `calc(${pct}% - ${pct * 0.12}px)`;
    cap.style.bottom = `calc(${pct}% - ${pct * 0.12}px + 6px)`;
    if (o.onPaint) o.onPaint(value);
  }

  dragValue(node, {
    get: () => (value - min) / (max - min),
    set: (t) => { value = clamp(min + (max - min) * clamp(t, 0, 1), min, max); paint(); if (o.onChange) o.onChange(value); },
    range: 1,
    onEnd: () => { if (o.onEnd) o.onEnd(value); }
  });
  node.addEventListener('dblclick', () => {
    value = o.default == null ? 0 : o.default;
    paint(); if (o.onChange) o.onChange(value); if (o.onEnd) o.onEnd(value);
  });

  paint();
  node.setValue = (v) => { value = clamp(v, min, max); paint(); };
  node.getValue = () => value;
  return node;
}

/* ------------------------------------------------------------------ *
 * Drag-to-edit number box
 * ------------------------------------------------------------------ */
export function numberDrag(node, o) {
  let value = o.value;
  const paint = () => { node.textContent = o.format ? o.format(value) : String(value); };
  dragValue(node, {
    get: () => value,
    set: (v) => {
      value = clamp(o.step ? Math.round(v / o.step) * o.step : v, o.min, o.max);
      paint();
      if (o.onChange) o.onChange(value);
    },
    range: o.range == null ? (o.max - o.min) : o.range,
    onEnd: () => { if (o.onEnd) o.onEnd(value); }
  });
  node.addEventListener('dblclick', async () => {
    const entered = await promptText(o.label || 'Value', String(value));
    if (entered == null) return;
    const n = parseFloat(entered);
    if (!isFinite(n)) return;
    value = clamp(n, o.min, o.max);
    paint();
    if (o.onChange) o.onChange(value);
    if (o.onEnd) o.onEnd(value);
  });
  paint();
  node.setValue = (v) => { value = clamp(v, o.min, o.max); paint(); };
  node.getValue = () => value;
  return node;
}

/* ------------------------------------------------------------------ *
 * Modal
 * ------------------------------------------------------------------ */
const scrim = () => document.getElementById('scrim');
const modalHost = () => document.getElementById('modal');

let closeCurrent = null;

export function openModal({ title, body, footer, wide, onClose }) {
  const host = modalHost();
  host.className = 'modal' + (wide ? ' wide' : '');
  host.innerHTML = '';

  const close = () => {
    scrim().classList.remove('on');
    host.innerHTML = '';
    document.removeEventListener('keydown', esc, true);
    closeCurrent = null;
    if (onClose) onClose();
  };
  const esc = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(); }
  };

  host.append(
    el('header', {},
      el('h3', { text: title || '' }),
      el('div', { style: { flex: '1' } }),
      el('button', { class: 'btn sm ghost', onclick: close, text: '✕' })
    ),
    el('div', { class: 'body' }, body),
    footer ? el('footer', {}, footer) : null
  );

  scrim().classList.add('on');
  document.addEventListener('keydown', esc, true);
  closeCurrent = close;
  return close;
}

export function closeModal() { if (closeCurrent) closeCurrent(); }

/** Small text prompt; resolves to the string or null. */
export function promptText(label, initial = '', { title = 'RIOT MACHINE', confirmLabel = 'OK' } = {}) {
  return new Promise((resolve) => {
    const input = el('input', { class: 'input', value: initial, style: { width: '100%', height: '32px' } });
    let done = false;
    const finish = (v) => { if (done) return; done = true; close(); resolve(v); };
    const ok = el('button', { class: 'btn primary', text: confirmLabel, onclick: () => finish(input.value) });
    const close = openModal({
      title,
      body: [el('div', { class: 'tt', text: label }), input],
      footer: [el('button', { class: 'btn', text: 'Cancel', onclick: () => finish(null) }), ok],
      onClose: () => { if (!done) { done = true; resolve(null); } }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); finish(input.value); }
    });
    setTimeout(() => { input.focus(); input.select(); }, 30);
  });
}

/** Yes/no confirmation, routed through Electron so it reads as native. */
export async function confirmAction(opts) {
  if (window.riot && window.riot.ui) return window.riot.ui.confirm(opts);
  return window.confirm(opts.message || 'Are you sure?');
}

/* ------------------------------------------------------------------ *
 * Toast
 * ------------------------------------------------------------------ */
export function toast(message, { kind = '', title = '', ms = 2600 } = {}) {
  const host = document.getElementById('toasts');
  const node = el('div', { class: 'toast ' + kind },
    title ? el('b', { text: title }) : null,
    el('div', { text: message }));
  host.append(node);
  setTimeout(() => {
    node.style.transition = 'opacity .25s, transform .25s';
    node.style.opacity = '0';
    node.style.transform = 'translateX(14px)';
    setTimeout(() => node.remove(), 260);
  }, ms);
  return node;
}

/* ------------------------------------------------------------------ *
 * Select / segmented helpers
 * ------------------------------------------------------------------ */
export function select(options, value, onChange, attrs = {}) {
  const s = el('select', { class: 'input', ...attrs });
  for (const o of options) {
    const opt = el('option', { value: o.value });
    opt.textContent = o.label;
    if (String(o.value) === String(value)) opt.selected = true;
    s.append(opt);
  }
  s.addEventListener('change', () => onChange(s.value));
  return s;
}

export function labeledRow(label, control) {
  return el('div', { class: 'row' }, el('label', { text: label }), control);
}

export function section(title, bodyNodes, { open = true, actions } = {}) {
  const body = el('div', { class: 'body' }, bodyNodes);
  if (!open) body.style.display = 'none';
  const head = el('header', {},
    el('span', { text: title }),
    el('div', { class: 'grow' }),
    actions || null);
  head.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    body.style.display = body.style.display === 'none' ? '' : 'none';
  });
  return el('div', { class: 'isect' }, head, body);
}
