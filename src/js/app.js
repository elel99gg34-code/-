/* RIOT MACHINE — application controller.
 * Owns the project, wires the views, and drives the transport UI. */

import { $, clamp, clear, debounce, el, fmtTime, NOTE_NAMES, SCALES } from './lib/util.js';
import { Engine, stepDuration } from './audio/engine.js';
import { getInstrument, INSTRUMENTS } from './data/instruments.js';
import {
  History, demoProject, emptyProject, makePattern, makeTrack, migrate, projectStats
} from './state/project.js';
import { Sequencer } from './ui/sequencer.js';
import { Inspector } from './ui/inspector.js';
import { Mixer, Rack, SongView, VaultView, duplicatePattern } from './ui/views.js';
import { openExportDialog, exportInstrument } from './ui/exporter.js';
import { closeModal, confirmAction, numberDrag, openModal, promptText, toast } from './ui/widgets.js';

const LAST_SESSION = 'riot.lastSession';
const LAST_VAULT_ID = 'riot.lastVaultId';

class App {
  constructor() {
    this.engine = new Engine();
    this.history = new History();
    this.project = demoProject();
    this.vaultId = null;
    this.dirty = false;
    this.selectedTrackId = this.project.tracks[0] ? this.project.tracks[0].id : null;
    this.activePatternId = this.project.patterns[0].id;
    this.songIndex = -1;
    this.view = 'studio';
    this.lastNotes = new Map();
    this.stepQueue = [];
    this._lastCommitted = JSON.stringify(this.project);
    this.tapTimes = [];
    this.ready = false;

    this.sequencer = new Sequencer(this);
    this.inspector = new Inspector(this);
    this.rack = new Rack(this);
    this.mixer = new Mixer(this);
    this.songView = new SongView(this);
    this.vault = new VaultView(this);
  }

  /* ================================================================ *
   * Boot
   * ================================================================ */
  async boot() {
    this.info = await window.riot.app.info();
    this.restoreSession();

    await this.engine.init();
    this.engine.setProject(this.project);
    this.engine.activePatternId = this.activePatternId;
    this.engine.onStep = (localStep, patternId, time, absStep) => {
      this.stepQueue.push({ localStep, patternId, time, absStep });
    };

    this.bindChrome();
    this.bindTransport();
    this.bindStudio();
    this.bindMenus();
    this.bindKeys();

    this.rack.mount({
      cats: $('#catlist'),
      grid: $('#rackgrid'),
      search: $('#racksearch'),
      count: $('#rackcount')
    });
    this.mixer.mount($('#mixerstrips'), $('#mixsub'));
    this.songView.mount($('#songlane'), $('#songsub'));
    this.vault.mount($('#vaultlist'), $('#vaultsub'));
    this.sequencer.mount($('#gridscroll'));
    this.inspector.mount($('#insp-body'), $('#insp-title'));

    this.renderTracks();
    this.renderPatternChips();
    this.renderTitle();
    this.loop();

    const splash = $('#splash');
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);

    window.addEventListener('resize', debounce(() => {
      if (this.view === 'studio') this.sequencer.render();
    }, 140));
    window.addEventListener('beforeunload', () => this.saveSession());
    setInterval(() => this.saveSession(), 20000);

    this.ready = true;
  }

  restoreSession() {
    try {
      const raw = localStorage.getItem(LAST_SESSION);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      this.project = migrate(parsed);
      this.vaultId = localStorage.getItem(LAST_VAULT_ID) || null;
      this.selectedTrackId = this.project.tracks[0] ? this.project.tracks[0].id : null;
      this.activePatternId = this.project.patterns[0].id;
      this._lastCommitted = JSON.stringify(this.project);
    } catch {
      /* A broken cache should never stop the app opening. */
      this.project = demoProject();
    }
  }

  saveSession() {
    try {
      localStorage.setItem(LAST_SESSION, JSON.stringify(this.project));
      if (this.vaultId) localStorage.setItem(LAST_VAULT_ID, this.vaultId);
    } catch { /* quota or private mode — not worth interrupting for */ }
  }

  /* ================================================================ *
   * Selection helpers used by the views
   * ================================================================ */
  pattern() {
    return this.project.patterns.find((p) => p.id === this.activePatternId) || this.project.patterns[0];
  }

  selectedTrack() {
    return this.project.tracks.find((t) => t.id === this.selectedTrackId) || null;
  }

  selectTrack(id) {
    this.selectedTrackId = id;
    this.renderTracks();
    this.inspector.render();
    if (this.sequencer.mode === 'roll') this.sequencer.render();
    else this.highlightRow();
  }

  activatePattern(id) {
    this.activePatternId = id;
    this.engine.activePatternId = id;
    this.renderPatternChips();
    this.sequencer.render();
  }

  lastNoteFor(trackId) { return this.lastNotes.get(trackId); }
  setLastNote(trackId, midi) { this.lastNotes.set(trackId, midi); }

  /* ================================================================ *
   * Mutation bookkeeping
   * ================================================================ */
  pushHistory(label) {
    this.history.pushSnapshot(this._lastCommitted, label);
  }

  /** Commit a continuous gesture (knob / fader drag) as one undo step. */
  pushHistoryDeferred(label) {
    this.history.pushSnapshot(this._lastCommitted, label);
    this._lastCommitted = JSON.stringify(this.project);
    this.dirty = true;
    this.renderTitle();
  }

  /** @param continuous true while a drag is in flight (no undo checkpoint yet) */
  markDirty(continuous) {
    this.dirty = true;
    this.project.modified = Date.now();
    if (!continuous) this._lastCommitted = JSON.stringify(this.project);
    this.renderTitle();
  }

  undo() {
    const r = this.history.undo(this.project);
    if (!r) { toast('Nothing to undo'); return; }
    this.adoptProject(r.project, { keepVault: true });
    toast('Undo — ' + r.label);
  }

  redo() {
    const r = this.history.redo(this.project);
    if (!r) { toast('Nothing to redo'); return; }
    this.adoptProject(r.project, { keepVault: true });
    toast('Redo — ' + r.label);
  }

  adoptProject(project, { keepVault = false } = {}) {
    const wasPlaying = this.engine.playing;
    this.engine.stop();
    this.project = project;
    if (!keepVault) this.vaultId = null;
    if (!this.project.tracks.find((t) => t.id === this.selectedTrackId)) {
      this.selectedTrackId = this.project.tracks[0] ? this.project.tracks[0].id : null;
    }
    if (!this.project.patterns.find((p) => p.id === this.activePatternId)) {
      this.activePatternId = this.project.patterns[0].id;
    }
    this._lastCommitted = JSON.stringify(this.project);
    this.engine.setProject(this.project);
    this.engine.activePatternId = this.activePatternId;
    this.renderAll();
    if (wasPlaying) this.engine.play({ song: this.engine.songMode });
  }

  rebuildAudio() {
    this.engine.rebuild();
  }

  renderAll() {
    this.renderTitle();
    this.renderTracks();
    this.renderPatternChips();
    this.renderTransport();
    this.sequencer.render();
    this.inspector.render();
    this.mixer.render();
    this.songView.render();
  }

  /* ================================================================ *
   * Window chrome
   * ================================================================ */
  bindChrome() {
    $('#win-min').onclick = () => window.riot.win.minimize();
    $('#win-max').onclick = () => window.riot.win.toggleMaximize();
    $('#win-close').onclick = async () => {
      if (this.dirty) {
        const ok = await confirmAction({
          title: 'Unsaved changes',
          message: `"${this.project.name}" has unsaved changes.`,
          detail: 'Close anyway? Your work stays in the session cache and reopens next time.',
          confirmLabel: 'Close'
        });
        if (!ok) return;
      }
      this.saveSession();
      window.riot.win.close();
    };

    $('#docname').onclick = async () => {
      const next = await promptText('Project name', this.project.name, { title: 'Rename project' });
      if (next == null || !next.trim()) return;
      this.pushHistory('rename project');
      this.project.name = next.trim();
      this.markDirty();
    };

    $('#nav').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-view]');
      if (b) this.setView(b.dataset.view);
    });
    $('#nav-help').onclick = () => this.showHelp();
  }

  setView(view) {
    this.view = view;
    for (const node of document.querySelectorAll('.view')) node.classList.toggle('on', node.id === view);
    for (const b of document.querySelectorAll('#nav button[data-view]')) b.classList.toggle('on', b.dataset.view === view);
    if (view === 'mixer') this.mixer.render();
    if (view === 'song') this.songView.render();
    if (view === 'vault') this.vault.refresh();
    if (view === 'studio') this.sequencer.render();
  }

  /* ================================================================ *
   * Transport
   * ================================================================ */
  bindTransport() {
    $('#t-play').onclick = () => this.togglePlay();
    $('#t-stop').onclick = () => this.stop();
    $('#t-song').onclick = () => this.toggleSongMode();
    $('#t-metro').onclick = () => {
      this.engine.metronome = !this.engine.metronome;
      $('#t-metro').classList.toggle('on', this.engine.metronome);
    };
    $('#t-tap').onclick = () => this.tapTempo();
    $('#t-export').onclick = () => openExportDialog(this);
    $('#t-save').onclick = () => this.save();

    numberDrag($('#t-bpm'), {
      value: this.project.bpm, min: 20, max: 300, step: 1, label: 'Tempo (BPM)',
      format: (v) => String(Math.round(v)),
      onChange: (v) => { this.project.bpm = Math.round(v); this.markDirty(true); },
      onEnd: () => this.pushHistoryDeferred('tempo')
    });

    numberDrag($('#t-swing'), {
      value: this.project.swing, min: 0, max: 0.7, step: 0.01, range: 0.7, label: 'Swing',
      format: (v) => `${Math.round(v * 100)}%`,
      onChange: (v) => { this.project.swing = v; this.markDirty(true); },
      onEnd: () => this.pushHistoryDeferred('swing')
    });

    const res = $('#t-res');
    res.value = String(this.project.res);
    res.onchange = () => {
      this.pushHistory('resolution');
      this.project.res = Number(res.value);
      this.markDirty();
      this.sequencer.render();
    };

    const root = $('#t-root');
    NOTE_NAMES.forEach((n, i) => {
      const o = el('option', { value: String(i) });
      o.textContent = n;
      if (i === this.project.key.root) o.selected = true;
      root.append(o);
    });
    root.onchange = () => { this.pushHistory('key'); this.project.key.root = Number(root.value); this.markDirty(); };

    const scale = $('#t-scale');
    Object.keys(SCALES).forEach((s) => {
      const o = el('option', { value: s });
      o.textContent = s.replace(/([A-Z])/g, ' $1').toLowerCase();
      if (s === this.project.key.scale) o.selected = true;
      scale.append(o);
    });
    scale.onchange = () => { this.pushHistory('scale'); this.project.key.scale = scale.value; this.markDirty(); };
  }

  renderTransport() {
    const bpm = $('#t-bpm');
    if (bpm.setValue) bpm.setValue(this.project.bpm);
    const sw = $('#t-swing');
    if (sw.setValue) sw.setValue(this.project.swing);
    $('#t-res').value = String(this.project.res);
    $('#t-root').value = String(this.project.key.root);
    $('#t-scale').value = this.project.key.scale;
  }

  async togglePlay() {
    if (this.engine.playing) this.stop();
    else {
      await this.engine.play({ song: this.engine.songMode });
      $('#t-play').classList.add('on');
    }
  }

  stop() {
    this.engine.stop();
    this.stepQueue.length = 0;
    this.sequencer.setPlayStep(-1);
    $('#t-play').classList.remove('on');
    $('#clock').innerHTML = '001<small>:</small>1<small>:</small>01';
  }

  toggleSongMode() {
    const on = !this.engine.songMode;
    this.engine.songMode = on;
    $('#t-song').classList.toggle('on', on);
    if (on && !this.project.song.length) {
      toast('The arrangement is empty — add pattern blocks in the Song view.', { kind: 'warn' });
    }
    if (this.engine.playing) { this.engine.stop(); this.engine.play({ song: on }); }
  }

  tapTempo() {
    const now = performance.now();
    this.tapTimes = this.tapTimes.filter((t) => now - t < 2400);
    this.tapTimes.push(now);
    if (this.tapTimes.length < 2) { toast('Keep tapping…'); return; }
    const gaps = [];
    for (let i = 1; i < this.tapTimes.length; i++) gaps.push(this.tapTimes[i] - this.tapTimes[i - 1]);
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const bpm = clamp(Math.round(60000 / avg), 20, 300);
    this.pushHistory('tap tempo');
    this.project.bpm = bpm;
    this.markDirty();
    this.renderTransport();
    toast(`${bpm} BPM`, { kind: 'ok' });
  }

  /* ================================================================ *
   * Studio: tracks, patterns, grid tools
   * ================================================================ */
  bindStudio() {
    $('#add-track').onclick = () => this.setView('rack');

    $('#pat-add').onclick = () => {
      this.pushHistory('new pattern');
      const p = makePattern(String.fromCharCode(65 + this.project.patterns.length % 26), this.pattern().steps);
      this.project.patterns.push(p);
      this.activatePattern(p.id);
      this.markDirty();
    };
    $('#pat-dup').onclick = () => { duplicatePattern(this); this.markDirty(); };
    $('#pat-len').onclick = async () => {
      const cur = this.pattern();
      const v = await promptText('Steps in this pattern (1–128)', String(cur.steps), { title: 'Pattern length' });
      if (v == null) return;
      const n = clamp(Math.round(Number(v)), 1, 128);
      if (!isFinite(n)) return;
      this.pushHistory('pattern length');
      cur.steps = n;
      for (const k of Object.keys(cur.notes)) cur.notes[k] = cur.notes[k].filter((x) => x.s < n);
      this.markDirty();
      this.renderPatternChips();
      this.sequencer.render();
    };

    $('#mode-grid').onclick = () => { this.sequencer.setMode('grid'); this.syncModeButtons(); };
    $('#mode-roll').onclick = () => { this.sequencer.setMode('roll'); this.syncModeButtons(); };
    this.syncModeButtons();

    $('#edit-clear').onclick = () => this.clearTrack();
    $('#edit-fill').onclick = () => this.fillTrack();
    $('#edit-rand').onclick = () => this.randomizeTrack();

    $('#insp-audition').onclick = () => {
      const t = this.selectedTrack();
      if (t) this.engine.previewTrack(t.id, null, 0.95, 0.6);
    };

    $('#rack-add').onclick = () => this.rack.addAsTrack(this.rack.selected);
    $('#rack-export').onclick = () => {
      const inst = getInstrument(this.rack.selected);
      exportInstrument(inst.id, inst.name);
    };

    $('#mix-reset').onclick = () => {
      this.pushHistory('reset faders');
      for (const t of this.project.tracks) { t.vol = -6; t.pan = 0; }
      this.engine.syncMix();
      this.markDirty();
      this.mixer.render();
    };

    $('#song-clear').onclick = () => {
      this.pushHistory('clear arrangement');
      this.project.song = [];
      this.markDirty();
      this.songView.render();
    };
    $('#song-auto').onclick = () => {
      this.pushHistory('build arrangement');
      this.project.song = this.project.patterns.map((p) => ({ pattern: p.id, repeats: 2 }));
      this.markDirty();
      this.songView.render();
      toast('Arrangement built from every pattern', { kind: 'ok' });
    };

    $('#vault-new').onclick = () => this.newProject();
    $('#vault-import').onclick = () => this.importProject();
    $('#vault-refresh').onclick = () => this.vault.refresh();
    $('#vault-folder').onclick = () => window.riot.app.openPath('vault');
  }

  syncModeButtons() {
    $('#mode-grid').classList.toggle('primary', this.sequencer.mode === 'grid');
    $('#mode-roll').classList.toggle('primary', this.sequencer.mode === 'roll');
  }

  renderTracks() {
    const host = $('#trackrows');
    clear(host);
    /* Spacer that lines the rows up with the grid ruler. */
    host.append(el('div', { style: { height: '22px', borderBottom: '1px solid var(--line)', background: '#0e0e12' } }));

    this.meterNodes = [];
    for (const track of this.project.tracks) {
      const inst = getInstrument(track.instrument);
      const lvl = el('i');
      this.meterNodes.push({ id: track.id, node: lvl });

      const row = el('div', {
        class: 'trow' + (track.id === this.selectedTrackId ? ' sel' : ''),
        dataset: { track: track.id },
        onclick: (e) => { if (!e.target.closest('button')) this.selectTrack(track.id); },
        oncontextmenu: (e) => { e.preventDefault(); this.trackMenu(track); }
      },
        el('div', { class: 'swatch', style: { background: track.color || inst.color } }),
        el('div', { class: 'tinfo' },
          el('div', { class: 'tname', text: track.name }),
          el('div', { class: 'tinst', text: inst.name })),
        el('div', { class: 'lvl' }, lvl),
        el('div', { class: 'tbtns' },
          el('button', {
            class: 'tmini m' + (track.mute ? ' on' : ''), text: 'M', title: 'Mute',
            onclick: () => { this.pushHistory('mute'); track.mute = !track.mute; this.engine.syncMix(); this.markDirty(); this.renderTracks(); this.mixer.render(); }
          }),
          el('button', {
            class: 'tmini s' + (track.solo ? ' on' : ''), text: 'S', title: 'Solo',
            onclick: () => { this.pushHistory('solo'); track.solo = !track.solo; this.engine.syncMix(); this.markDirty(); this.renderTracks(); this.mixer.render(); }
          }),
          el('button', {
            class: 'tmini', text: '▶', title: 'Audition',
            onclick: () => this.engine.previewTrack(track.id, null, 0.95, 0.5)
          }))
      );
      host.append(row);
    }

    if (!this.project.tracks.length) {
      host.append(el('div', { class: 'empty' },
        el('h3', { text: 'No tracks yet' }),
        el('div', { text: 'Open the Rack and add an instrument.' })));
    }
  }

  highlightRow() {
    for (const r of document.querySelectorAll('.trow')) r.classList.toggle('sel', r.dataset.track === this.selectedTrackId);
    for (const r of document.querySelectorAll('.srow')) r.classList.toggle('sel', r.dataset.track === this.selectedTrackId);
  }

  async trackMenu(track) {
    const del = async () => {
      const ok = await confirmAction({
        title: 'Remove track',
        message: `Remove "${track.name}"?`,
        detail: 'Its notes in every pattern go with it.',
        confirmLabel: 'Remove',
        danger: true
      });
      if (!ok) return;
      this.pushHistory('remove track');
      this.project.tracks = this.project.tracks.filter((t) => t.id !== track.id);
      for (const p of this.project.patterns) delete p.notes[track.id];
      if (this.selectedTrackId === track.id) this.selectedTrackId = this.project.tracks[0] ? this.project.tracks[0].id : null;
      this.markDirty();
      this.rebuildAudio();
      this.renderAll();
    };

    const index = this.project.tracks.indexOf(track);
    const move = (delta) => {
      const j = index + delta;
      if (j < 0 || j >= this.project.tracks.length) return;
      this.pushHistory('reorder tracks');
      const [m] = this.project.tracks.splice(index, 1);
      this.project.tracks.splice(j, 0, m);
      this.markDirty();
      this.renderAll();
      closeModal();
    };

    openModal({
      title: track.name,
      body: [
        el('div', { class: 'row' },
          el('button', { class: 'btn', text: '↑ Move up', onclick: () => move(-1) }),
          el('button', { class: 'btn', text: '↓ Move down', onclick: () => move(1) })),
        el('div', { class: 'row' },
          el('button', {
            class: 'btn', text: 'Duplicate track',
            onclick: () => {
              this.pushHistory('duplicate track');
              const copy = JSON.parse(JSON.stringify(track));
              copy.id = 'trk_' + Math.random().toString(36).slice(2, 9);
              copy.name = track.name + ' 2';
              this.project.tracks.splice(index + 1, 0, copy);
              for (const p of this.project.patterns) {
                if (p.notes[track.id]) p.notes[copy.id] = JSON.parse(JSON.stringify(p.notes[track.id]));
              }
              this.markDirty();
              this.rebuildAudio();
              this.renderAll();
              closeModal();
            }
          }),
          el('button', { class: 'btn danger', text: 'Remove track', onclick: () => { closeModal(); del(); } }))
      ],
      footer: [el('button', { class: 'btn', text: 'Close', onclick: () => closeModal() })]
    });
  }

  renderPatternChips() {
    const host = $('#patchips');
    clear(host);
    this.project.patterns.forEach((p, i) => {
      host.append(el('div', {
        class: 'patchip' + (p.id === this.activePatternId ? ' on' : ''),
        text: p.name,
        title: `${p.steps} steps — double-click to rename, right-click to delete`,
        onclick: () => this.activatePattern(p.id),
        ondblclick: async () => {
          const n = await promptText('Pattern name', p.name, { title: 'Rename pattern' });
          if (n == null || !n.trim()) return;
          this.pushHistory('rename pattern');
          p.name = n.trim();
          this.markDirty();
          this.renderPatternChips();
          this.songView.render();
        },
        oncontextmenu: async (e) => {
          e.preventDefault();
          if (this.project.patterns.length === 1) { toast('A project needs at least one pattern.', { kind: 'warn' }); return; }
          const ok = await confirmAction({ title: 'Delete pattern', message: `Delete "${p.name}"?`, confirmLabel: 'Delete', danger: true });
          if (!ok) return;
          this.pushHistory('delete pattern');
          this.project.patterns.splice(i, 1);
          this.project.song = this.project.song.filter((s) => s.pattern !== p.id);
          if (this.activePatternId === p.id) this.activePatternId = this.project.patterns[0].id;
          this.markDirty();
          this.renderPatternChips();
          this.sequencer.render();
          this.songView.render();
        }
      }));
    });
    $('#pat-len').textContent = `${this.pattern().steps} STEPS`;
  }

  clearTrack() {
    const t = this.selectedTrack();
    const p = this.pattern();
    if (!t || !p) return;
    this.pushHistory('clear track');
    p.notes[t.id] = [];
    this.markDirty();
    this.sequencer.render();
    toast(`Cleared ${t.name} in ${p.name}`);
  }

  fillTrack() {
    const t = this.selectedTrack();
    const p = this.pattern();
    if (!t || !p) return;
    const inst = getInstrument(t.instrument);
    const every = inst.kind === 'drum' ? (inst.cat === 'kick' ? this.project.res : 1) : this.project.res;
    this.pushHistory('fill track');
    const midi = this.lastNoteFor(t.id) || inst.defaultNote || 60;
    const list = [];
    for (let s = 0; s < p.steps; s += every) list.push({ s, n: midi, v: s % (this.project.res * 2) === 0 ? 0.95 : 0.7, l: 1 });
    p.notes[t.id] = list;
    this.markDirty();
    this.sequencer.render();
  }

  randomizeTrack() {
    const t = this.selectedTrack();
    const p = this.pattern();
    if (!t || !p) return;
    const inst = getInstrument(t.instrument);
    this.pushHistory('randomize track');

    const list = [];
    if (inst.kind === 'drum') {
      const density = inst.cat === 'kick' ? 0.32 : inst.cat === 'hat' ? 0.6 : 0.25;
      for (let s = 0; s < p.steps; s++) {
        if (Math.random() < density) list.push({ s, n: inst.defaultNote || 36, v: 0.55 + Math.random() * 0.45, l: 1 });
      }
    } else {
      const scale = SCALES[this.project.key.scale] || SCALES.minor;
      const root = this.project.key.root;
      const base = inst.defaultNote || 60;
      const oct = Math.floor(base / 12) * 12;
      let s = 0;
      while (s < p.steps) {
        const len = 1 + Math.floor(Math.random() * 3);
        if (Math.random() < 0.78) {
          const deg = scale[Math.floor(Math.random() * scale.length)];
          const jump = [0, 0, 0, 12, -12][Math.floor(Math.random() * 5)];
          list.push({ s, n: clamp(oct + root + deg + jump, 12, 108), v: 0.6 + Math.random() * 0.4, l: len });
        }
        s += len;
      }
    }
    p.notes[t.id] = list;
    this.markDirty();
    this.sequencer.render();
    toast(`${t.name} rewritten`, { kind: 'ok' });
  }

  /* ================================================================ *
   * Files
   * ================================================================ */
  async save(forceAsk) {
    let id = this.vaultId;
    if (!id || forceAsk) {
      const name = await promptText('Save as', this.project.name, { title: 'Save to vault', confirmLabel: 'Save' });
      if (name == null || !name.trim()) return;
      this.project.name = name.trim();
      id = name.trim();
    }
    try {
      const res = await window.riot.vault.save(id, this.project);
      this.vaultId = res.id;
      this.dirty = false;
      this._lastCommitted = JSON.stringify(this.project);
      this.renderTitle();
      this.saveSession();
      toast(`Saved to vault (${(res.bytes / 1024).toFixed(1)} KB)`, { kind: 'ok', title: this.project.name });
      if (this.view === 'vault') this.vault.refresh();
    } catch (e) {
      toast('Save failed: ' + e.message, { kind: 'warn' });
    }
  }

  async loadFromVault(id) {
    if (this.dirty) {
      const ok = await confirmAction({
        title: 'Unsaved changes',
        message: `"${this.project.name}" has unsaved changes.`,
        detail: 'Open the other project anyway?',
        confirmLabel: 'Open'
      });
      if (!ok) return;
    }
    try {
      const raw = await window.riot.vault.load(id);
      const project = migrate(raw);
      this.history.clear();
      this.adoptProject(project);
      this.vaultId = id;
      this.dirty = false;
      this.renderTitle();
      this.setView('studio');
      toast(`Opened "${project.name}"`, { kind: 'ok' });
    } catch (e) {
      toast('Could not open that project: ' + e.message, { kind: 'warn' });
    }
  }

  async newProject() {
    if (this.dirty) {
      const ok = await confirmAction({
        title: 'Unsaved changes',
        message: 'Start a new project?',
        detail: `"${this.project.name}" has unsaved changes.`,
        confirmLabel: 'New project'
      });
      if (!ok) return;
    }
    openModal({
      title: 'New project',
      body: [
        el('div', { class: 'tt', text: 'Start from' }),
        el('div', { class: 'row' },
          el('button', {
            class: 'btn primary', text: 'Empty project',
            onclick: () => { closeModal(); this.startProject(emptyProject('Untitled Riot')); }
          }),
          el('button', {
            class: 'btn', text: 'Punk starter kit',
            onclick: () => { closeModal(); this.startProject(demoProject()); }
          }),
          el('button', {
            class: 'btn', text: 'Drum kit only',
            onclick: () => { closeModal(); this.startProject(drumKitProject()); }
          }))
      ],
      footer: [el('button', { class: 'btn', text: 'Cancel', onclick: () => closeModal() })]
    });
  }

  startProject(project) {
    this.history.clear();
    this.adoptProject(project);
    this.vaultId = null;
    this.dirty = false;
    this.renderTitle();
    this.setView('studio');
  }

  async importProject() {
    try {
      const res = await window.riot.files.importProject();
      if (res.canceled) return;
      const project = migrate(res.project);
      this.history.clear();
      this.adoptProject(project);
      this.vaultId = null;
      this.dirty = true;
      this.renderTitle();
      this.setView('studio');
      toast(`Imported "${project.name}"`, { kind: 'ok' });
    } catch (e) {
      toast('Import failed: ' + e.message, { kind: 'warn' });
    }
  }

  async exportProjectFile() {
    const res = await window.riot.files.exportProject(this.project.name, JSON.stringify(this.project, null, 1));
    if (!res.canceled) toast('Project written to ' + res.path, { kind: 'ok' });
  }

  renderTitle() {
    $('#docname').textContent = this.project.name;
    $('#dirty').classList.toggle('hide', !this.dirty);
    document.title = `${this.project.name}${this.dirty ? ' •' : ''} — RIOT MACHINE`;
  }

  /* ================================================================ *
   * Menus & keys
   * ================================================================ */
  bindMenus() {
    window.riot.app.onMenu((cmd) => {
      switch (cmd) {
        case 'new': this.newProject(); break;
        case 'save': this.save(); break;
        case 'saveas': this.save(true); break;
        case 'import': this.importProject(); break;
        case 'exportproject': this.exportProjectFile(); break;
        case 'export': openExportDialog(this); break;
        case 'undo': this.undo(); break;
        case 'redo': this.redo(); break;
        case 'duppattern': duplicatePattern(this); break;
        case 'cleartrack': this.clearTrack(); break;
        case 'playstop': this.togglePlay(); break;
        case 'stop': this.stop(); break;
        case 'songmode': this.toggleSongMode(); break;
        case 'tap': this.tapTempo(); break;
        case 'metronome': $('#t-metro').click(); break;
        case 'help': this.showHelp(); break;
        case 'about': this.showAbout(); break;
        default:
          if (cmd.startsWith('view:')) this.setView(cmd.slice(5));
      }
    });
    window.riot.win.onState(() => { /* reserved for a maximize-aware chrome */ });
  }

  bindKeys() {
    const KEYMAP = {
      z: 0, s: 1, x: 2, d: 3, c: 4, v: 5, g: 6, b: 7, h: 8, n: 9, j: 10, m: 11,
      q: 12, 2: 13, w: 14, 3: 15, e: 16, r: 17, 5: 18, t: 19, 6: 20, y: 21, 7: 22, u: 23
    };
    this.octave = 4;

    document.addEventListener('keydown', (e) => {
      const typing = e.target.matches('input, textarea, select');
      const mod = e.ctrlKey || e.metaKey;

      if (!typing && e.code === 'Space') { e.preventDefault(); this.togglePlay(); return; }
      if (e.key === 'Escape' && !document.getElementById('scrim').classList.contains('on')) { this.stop(); return; }
      if (typing) return;

      if (mod) {
        const k = e.key.toLowerCase();
        if (k === 'z' && !e.shiftKey) { e.preventDefault(); this.undo(); return; }
        if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); this.redo(); return; }
        return;   /* the native menu owns the rest */
      }

      /* Pattern select 1-9 */
      if (/^[1-9]$/.test(e.key) && !e.altKey && this.project.patterns[Number(e.key) - 1]) {
        if (!KEYMAP[e.key] || e.shiftKey) {
          this.activatePattern(this.project.patterns[Number(e.key) - 1].id);
          return;
        }
      }

      if (e.key === '[') { this.octave = clamp(this.octave - 1, 0, 8); toast('Octave ' + this.octave); return; }
      if (e.key === ']') { this.octave = clamp(this.octave + 1, 0, 8); toast('Octave ' + this.octave); return; }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const list = this.project.tracks;
        if (!list.length) return;
        e.preventDefault();
        const i = list.findIndex((t) => t.id === this.selectedTrackId);
        const j = clamp(i + (e.key === 'ArrowDown' ? 1 : -1), 0, list.length - 1);
        this.selectTrack(list[j].id);
        return;
      }

      const k = e.key.toLowerCase();
      if (KEYMAP[k] != null && !e.repeat) {
        const midi = 12 * this.octave + KEYMAP[k];
        const t = this.selectedTrack();
        if (t) {
          this.setLastNote(t.id, midi);
          this.engine.previewTrack(t.id, midi, 0.95, 0.5);
        }
      }
    });
  }

  /* ================================================================ *
   * Help / about
   * ================================================================ */
  showHelp() {
    const G = (t) => el('div', { class: 'g', text: t });
    const R = (keys, what) => [el('div', { class: 'k' }, ...keys.map((k) => el('kbd', { text: k }))), el('div', { text: what })];
    openModal({
      title: 'Keyboard',
      wide: true,
      body: [el('div', { class: 'keytable' },
        G('Transport'),
        ...R(['Space'], 'Play / stop'),
        ...R(['Esc'], 'Stop'),
        ...R(['Ctrl', 'L'], 'Song mode'),
        ...R(['Ctrl', 'T'], 'Tap tempo'),
        ...R(['Ctrl', 'M'], 'Metronome'),
        G('Editing'),
        ...R(['Click'], 'Draw a step / note'),
        ...R(['Right-click'], 'Erase'),
        ...R(['Drag'], 'Paint across steps'),
        ...R(['Alt', 'Wheel'], 'Nudge velocity'),
        ...R(['Shift', 'Drag'], 'Snap notes to the project scale (piano roll)'),
        ...R(['Ctrl', 'Z'], 'Undo'),
        ...R(['Ctrl', 'Shift', 'Z'], 'Redo'),
        ...R(['Ctrl', 'D'], 'Duplicate pattern'),
        G('Playing'),
        ...R(['Z S X D C…'], 'Play the selected track (lower octave)'),
        ...R(['Q 2 W 3 E…'], 'Play the selected track (upper octave)'),
        ...R(['[', ']'], 'Octave down / up'),
        ...R(['↑', '↓'], 'Previous / next track'),
        ...R(['Shift', '1-9'], 'Jump to pattern'),
        G('Files'),
        ...R(['Ctrl', 'S'], 'Save to vault'),
        ...R(['Ctrl', 'Shift', 'S'], 'Save as'),
        ...R(['Ctrl', 'E'], 'Export audio'),
        ...R(['Ctrl', 'N'], 'New project'),
        G('Views'),
        ...R(['F2', 'F3', 'F4'], 'Studio · Rack · Mixer'),
        ...R(['F6', 'F7'], 'Arrangement · Vault')
      )],
      footer: [el('button', { class: 'btn primary', text: 'GOT IT', onclick: () => closeModal() })]
    });
  }

  showAbout() {
    const s = projectStats(this.project);
    openModal({
      title: 'About',
      body: [
        el('div', { style: { textAlign: 'center', padding: '10px 0' } },
          el('div', {
            style: {
              width: '52px', height: '52px', margin: '0 auto 12px', background: 'var(--riot)',
              clipPath: 'polygon(50% 0, 100% 38%, 81% 100%, 19% 100%, 0 38%)'
            }
          }),
          el('div', { class: 'mono', style: { fontSize: '17px', letterSpacing: '.24em', fontWeight: '800' }, text: 'RIOT MACHINE' }),
          el('div', { class: 'tt', style: { marginTop: '6px' }, text: `version ${this.info.version}` })),
        el('div', { class: 'tt', text: 'A punk electronic music studio. 130 synthesised instruments, no samples, no internet.' }),
        el('div', { class: 'keytable', style: { fontSize: '11px' } },
          el('div', { class: 'k tt', text: 'Instruments' }), el('div', { class: 'mono', text: String(INSTRUMENTS.length) }),
          el('div', { class: 'k tt', text: 'This project' }), el('div', { class: 'mono', text: `${s.tracks} tracks · ${s.patterns} patterns · ${s.notes} notes · ${fmtTime(s.seconds)}` }),
          el('div', { class: 'k tt', text: 'Engine' }), el('div', { class: 'mono', text: `Web Audio @ ${(this.engine.ctx.sampleRate / 1000).toFixed(1)} kHz` }),
          el('div', { class: 'k tt', text: 'Runtime' }), el('div', { class: 'mono', text: `Electron ${this.info.electron} · Chromium ${this.info.chrome}` }),
          el('div', { class: 'k tt', text: 'Vault' }), el('div', { class: 'mono', style: { wordBreak: 'break-all' }, text: this.info.vault })),
        el('div', { class: 'tt', text: 'MP3 export uses LAME (LGPL) — lame.sourceforge.net' })
      ],
      footer: [
        el('button', { class: 'btn', text: 'OPEN VAULT FOLDER', onclick: () => window.riot.app.openPath('vault') }),
        el('button', { class: 'btn primary', text: 'CLOSE', onclick: () => closeModal() })
      ]
    });
  }

  /* ================================================================ *
   * Render loop — playhead, clock, meters
   * ================================================================ */
  loop() {
    const tick = () => {
      const ctx = this.engine.ctx;
      if (ctx) {
        const now = ctx.currentTime;
        let current = null;
        while (this.stepQueue.length && this.stepQueue[0].time <= now) current = this.stepQueue.shift();
        if (current) {
          if (current.patternId !== this.activePatternId && this.engine.songMode) {
            this.activatePattern(current.patternId);
          }
          this.sequencer.setPlayStep(current.localStep);
          this.updateClock(current.absStep);
        }
      }

      if (this.meterNodes) {
        for (const m of this.meterNodes) {
          m.node.style.height = `${Math.min(100, this.engine.trackLevel(m.id) * 260)}%`;
        }
      }
      const ml = $('#masterlevel');
      if (ml) ml.style.width = `${Math.min(100, this.engine.masterLevel() * 260)}%`;
      if (this.view === 'mixer') this.mixer.tickMeters(this.engine);

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  updateClock(absStep) {
    const res = this.project.res;
    const bar = Math.floor(absStep / (res * 4)) + 1;
    const beat = Math.floor((absStep % (res * 4)) / res) + 1;
    const step = (absStep % res) + 1;
    $('#clock').innerHTML =
      `${String(bar).padStart(3, '0')}<small>:</small>${beat}<small>:</small>${String(step).padStart(2, '0')}`;
  }
}

/* A second starter template: just the drums. */
function drumKitProject() {
  const p = emptyProject('Drum Kit');
  p.bpm = 160;
  const kit = ['kick_concrete', 'snr_909', 'hat_closed', 'hat_open', 'perc_clap', 'perc_tom_lo', 'cym_crash'];
  for (const id of kit) p.tracks.push(makeTrack(id));
  const pat = p.patterns[0];
  pat.name = 'A · beat';
  pat.notes[p.tracks[0].id] = [0, 4, 8, 12].map((s) => ({ s, n: 36, v: 1, l: 1 }));
  pat.notes[p.tracks[1].id] = [4, 12].map((s) => ({ s, n: 38, v: 0.95, l: 1 }));
  pat.notes[p.tracks[2].id] = Array.from({ length: 16 }, (_, s) => ({ s, n: 42, v: s % 2 ? 0.45 : 0.85, l: 1 }));
  return p;
}

/* ------------------------------------------------------------------ */
const app = new App();
window.__riotApp = app;
app.boot().catch((e) => {
  console.error(e);
  const splash = document.getElementById('splash');
  if (splash) {
    splash.innerHTML = `<div style="text-align:center;max-width:520px;padding:24px">
      <div style="color:#ff2e63;font-weight:800;letter-spacing:.2em;margin-bottom:10px">STARTUP FAILED</div>
      <pre style="white-space:pre-wrap;text-align:left;font-size:11px;color:#a3a2a8">${String(e && e.stack || e)}</pre>
    </div>`;
  }
});
