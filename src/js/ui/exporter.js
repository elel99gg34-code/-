/* Export: renders offline, encodes, and hands the bytes to the main process
 * so the file lands wherever the user picks. */

import { el, fmtTime } from '../lib/util.js';
import { renderInstrument, renderProject } from '../audio/engine.js';
import { analyse, encodeMp3, encodeWav } from '../lib/encode.js';
import { closeModal, openModal, select, labeledRow, toast } from './widgets.js';
import { projectStats } from '../state/project.js';

const FORMATS = [
  { value: 'wav24', label: 'WAV · 24-bit (studio)' },
  { value: 'wav16', label: 'WAV · 16-bit (CD)' },
  { value: 'wav32', label: 'WAV · 32-bit float (master)' },
  { value: 'mp3320', label: 'MP3 · 320 kbps' },
  { value: 'mp3256', label: 'MP3 · 256 kbps' },
  { value: 'mp3192', label: 'MP3 · 192 kbps' },
  { value: 'mp3128', label: 'MP3 · 128 kbps' }
];

const RATES = [
  { value: '48000', label: '48 000 Hz' },
  { value: '44100', label: '44 100 Hz' },
  { value: '96000', label: '96 000 Hz' }
];

export function openExportDialog(app) {
  const p = app.project;
  const stats = projectStats(p);
  const pattern = app.pattern();

  const state = {
    source: p.song.length ? 'song' : 'pattern',
    loops: 4,
    format: 'wav24',
    rate: '48000',
    normalize: true,
    tail: 3.5,
    stems: false,
    toRenders: false
  };

  const info = el('div', { class: 'tt' });
  const progWrap = el('div', { class: 'prog' }, el('i'));
  const progBar = progWrap.firstChild;
  const status = el('div', { class: 'tt', text: 'Ready' });
  progWrap.style.display = 'none';

  const updateInfo = () => {
    const stepSec = 60 / p.bpm / p.res;
    let seconds;
    if (state.source === 'song') seconds = stats.seconds;
    else seconds = (pattern ? pattern.steps : 16) * stepSec * state.loops;
    const total = seconds + Number(state.tail);
    const rate = Number(state.rate);
    const bytes = state.format.startsWith('wav')
      ? total * rate * 2 * (state.format === 'wav16' ? 2 : state.format === 'wav24' ? 3 : 4)
      : total * (Number(state.format.replace('mp3', '')) * 1000 / 8);
    info.textContent =
      `${fmtTime(total)} · ${rate / 1000} kHz · about ${(bytes / 1048576).toFixed(1)} MB` +
      (state.stems ? ` · ${p.tracks.length} stem files` : '');
  };

  const sourceSel = select([
    { value: 'song', label: `Arrangement (${p.song.length} blocks · ${fmtTime(stats.seconds)})` },
    { value: 'pattern', label: `Current pattern — ${pattern ? pattern.name : '—'}` }
  ], state.source, (v) => { state.source = v; updateInfo(); loopRow.style.display = v === 'pattern' ? '' : 'none'; });

  const loopsSel = select(
    [1, 2, 4, 8, 16, 32].map((n) => ({ value: String(n), label: `${n}×` })),
    String(state.loops), (v) => { state.loops = Number(v); updateInfo(); });
  const loopRow = labeledRow('Repeats', loopsSel);
  loopRow.style.display = state.source === 'pattern' ? '' : 'none';

  const fmtSel = select(FORMATS, state.format, (v) => { state.format = v; updateInfo(); });
  const rateSel = select(RATES, state.rate, (v) => { state.rate = v; updateInfo(); });
  const tailSel = select(
    [0, 1, 2, 3.5, 6, 10].map((n) => ({ value: String(n), label: n === 0 ? 'none' : `${n}s` })),
    String(state.tail), (v) => { state.tail = Number(v); updateInfo(); });

  const normCheck = checkbox('Normalize to −0.3 dBFS', state.normalize, (v) => { state.normalize = v; });
  const stemCheck = checkbox('Export each track as a separate stem', state.stems, (v) => { state.stems = v; updateInfo(); });
  const destCheck = checkbox('Save straight to the renders folder (no dialog)', state.toRenders, (v) => { state.toRenders = v; });

  updateInfo();

  const goBtn = el('button', { class: 'btn primary', text: 'RENDER' });

  goBtn.addEventListener('click', async () => {
    goBtn.disabled = true;
    progWrap.style.display = '';
    const setProg = (t, label) => { progBar.style.width = `${Math.round(t * 100)}%`; if (label) status.textContent = label; };

    try {
      const rate = Number(state.rate);
      const opts = {
        mode: state.source,
        patternId: pattern ? pattern.id : null,
        loops: state.loops,
        sampleRate: rate,
        tail: Number(state.tail)
      };

      const jobs = state.stems
        ? p.tracks.map((t) => ({ label: t.name, soloTrack: t.id }))
        : [{ label: p.name, soloTrack: null }];

      const results = [];
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        setProg((i + 0.1) / jobs.length, `Rendering ${job.label}…`);
        const buffer = await renderProject(p, { ...opts, soloTrack: job.soloTrack });
        if (state.normalize) normalize(buffer, 0.966);

        setProg((i + 0.55) / jobs.length, `Encoding ${job.label}…`);
        const { data, ext } = await encodeBuffer(buffer, state.format, (t) =>
          setProg((i + 0.55 + t * 0.4) / jobs.length));

        const name = state.stems ? `${p.name} — ${job.label}` : p.name;
        const saved = await window.riot.files.saveAudio(name, ext, data, state.toRenders || state.stems);
        if (saved.canceled) { status.textContent = 'Cancelled'; goBtn.disabled = false; return; }
        results.push({ path: saved.path, stats: analyse(buffer) });
      }

      setProg(1, 'Done');
      showResult(app, results, state);
    } catch (e) {
      console.error(e);
      status.textContent = 'Failed';
      toast(e.message || 'Export failed', { kind: 'warn', title: 'Export' });
      goBtn.disabled = false;
    }
  });

  openModal({
    title: 'Export audio',
    wide: true,
    body: [
      labeledRow('Source', sourceSel),
      loopRow,
      labeledRow('Format', fmtSel),
      labeledRow('Sample rate', rateSel),
      labeledRow('Tail', tailSel),
      normCheck, stemCheck, destCheck,
      el('div', { style: { borderTop: '1px solid var(--line)', paddingTop: '10px' } }, info),
      progWrap, status
    ],
    footer: [
      el('button', { class: 'btn', text: 'Cancel', onclick: () => closeModal() }),
      goBtn
    ]
  });
}

function showResult(app, results, state) {
  const rows = results.map((r) => el('div', {
    style: { display: 'flex', gap: '10px', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--line)' }
  },
    el('div', { style: { flex: '1', minWidth: '0' } },
      el('div', { class: 'mono', style: { fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, text: r.path }),
      el('div', { class: 'tt', text: `peak ${r.stats.peakDb.toFixed(1)} dB · rms ${r.stats.rmsDb.toFixed(1)} dB · ${fmtTime(r.stats.duration)}${r.stats.clipped ? ` · ${r.stats.clipped} clipped samples` : ''}` })),
    el('button', { class: 'btn sm', text: 'SHOW', onclick: () => window.riot.files.reveal(r.path) })
  ));

  openModal({
    title: results.length > 1 ? `Exported ${results.length} stems` : 'Export finished',
    wide: true,
    body: rows,
    footer: [el('button', { class: 'btn primary', text: 'DONE', onclick: () => closeModal() })]
  });
  toast(results.length > 1 ? `${results.length} stems written` : 'Audio exported', { kind: 'ok', title: 'Export' });
}

/* ------------------------------------------------------------------ *
 * Single-instrument render, used from the Rack view
 * ------------------------------------------------------------------ */
export async function exportInstrument(instrumentId, name) {
  try {
    const buffer = await renderInstrument(instrumentId, { sampleRate: 48000, dur: 1.4, tail: 2.4 });
    normalize(buffer, 0.966);
    const data = encodeWav(buffer, 24);
    const saved = await window.riot.files.saveAudio(`RIOT ${name}`, 'wav', data, false);
    if (!saved.canceled) toast('Instrument rendered to ' + saved.path, { kind: 'ok', title: 'Export' });
  } catch (e) {
    toast(e.message || 'Could not render that instrument', { kind: 'warn' });
  }
}

/* ------------------------------------------------------------------ */
async function encodeBuffer(buffer, format, onProgress) {
  if (format.startsWith('wav')) {
    const bits = format === 'wav16' ? 16 : format === 'wav32' ? 32 : 24;
    if (onProgress) onProgress(1);
    return { data: encodeWav(buffer, bits), ext: 'wav' };
  }
  const kbps = Number(format.replace('mp3', ''));
  const data = await encodeMp3(buffer, kbps, onProgress);
  return { data, ext: 'mp3' };
}

function normalize(buffer, target) {
  let peak = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const d = buffer.getChannelData(c);
    for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; }
  }
  if (peak < 1e-5) return;
  const g = target / peak;
  /* Only ever bring the level up to the target; never squash a quiet mix
   * that was deliberately quiet by more than the headroom allows. */
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const d = buffer.getChannelData(c);
    for (let i = 0; i < d.length; i++) d[i] *= g;
  }
}

function checkbox(label, value, onChange) {
  const box = el('input', { type: 'checkbox' });
  box.checked = !!value;
  box.addEventListener('change', () => onChange(box.checked));
  const wrap = el('label', {
    style: { display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', cursor: 'pointer', color: 'var(--ink-2)' }
  }, box, el('span', { text: label }));
  return wrap;
}
