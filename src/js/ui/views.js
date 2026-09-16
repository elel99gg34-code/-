/* The Rack, Mixer, Arrangement and Vault views. */

import { clamp, clear, el, fmtBytes, fmtDate, fmtTime } from '../lib/util.js';
import { CATEGORIES, INSTRUMENTS, getInstrument, searchInstruments } from '../data/instruments.js';
import { makePattern, makeTrack, projectStats } from '../state/project.js';
import { confirmAction, fader, promptText, toast } from './widgets.js';

/* ================================================================== *
 * RACK — browse and audition all 130 instruments
 * ================================================================== */
export class Rack {
  constructor(app) {
    this.app = app;
    this.cat = 'all';
    this.query = '';
    this.selected = INSTRUMENTS[0].id;
  }

  mount({ cats, grid, search, count }) {
    this.catsHost = cats;
    this.gridHost = grid;
    this.countHost = count;
    search.addEventListener('input', () => {
      this.query = search.value;
      this.renderGrid();
    });
    this.renderCats();
    this.renderGrid();
  }

  renderCats() {
    clear(this.catsHost);
    const counts = new Map();
    for (const i of INSTRUMENTS) counts.set(i.cat, (counts.get(i.cat) || 0) + 1);

    const mk = (id, name, color, n) => el('div', {
      class: 'catrow' + (this.cat === id ? ' on' : ''),
      onclick: () => { this.cat = id; this.renderCats(); this.renderGrid(); }
    },
      el('div', { class: 'dot', style: { background: color } }),
      el('div', { text: name }),
      el('div', { class: 'n', text: String(n) }));

    this.catsHost.append(mk('all', 'All instruments', 'var(--ink-3)', INSTRUMENTS.length));
    for (const c of CATEGORIES) this.catsHost.append(mk(c.id, c.name, c.color, counts.get(c.id) || 0));
  }

  list() {
    let items = this.query ? searchInstruments(this.query) : INSTRUMENTS;
    if (this.cat !== 'all') items = items.filter((i) => i.cat === this.cat);
    return items;
  }

  renderGrid() {
    const items = this.list();
    clear(this.gridHost);
    this.countHost.textContent = `${items.length} of ${INSTRUMENTS.length} instruments`;

    if (!items.length) {
      this.gridHost.append(el('div', { class: 'empty' },
        el('h3', { text: 'Nothing matches' }),
        el('div', { text: 'Try another word, or clear the search box.' })));
      return;
    }

    for (const inst of items) {
      const card = el('div', {
        class: 'icard' + (this.selected === inst.id ? ' on' : ''),
        style: { '--c': inst.color },
        onclick: () => {
          this.selected = inst.id;
          this.app.engine.preview(inst.id, null, 0.95, 0.7);
          this.renderGrid();
        },
        ondblclick: () => this.addAsTrack(inst.id)
      },
        el('div', { class: 'nm', text: inst.name }),
        el('div', { class: 'meta', text: `${inst.cat} · ${inst.kind}` }),
        el('div', { class: 'tags' }, ...(inst.tags || []).map((t) => el('span', { class: 'tag', text: t }))),
        el('div', { class: 'acts' },
          el('button', {
            class: 'btn sm', text: '▶',
            title: 'Audition',
            onclick: (e) => { e.stopPropagation(); this.app.engine.preview(inst.id, null, 0.95, 0.7); }
          }),
          el('button', {
            class: 'btn sm', text: '+ TRACK',
            onclick: (e) => { e.stopPropagation(); this.addAsTrack(inst.id); }
          }))
      );
      card.style.setProperty('--c', inst.color);
      this.gridHost.append(card);
    }
  }

  addAsTrack(id) {
    const app = this.app;
    if (app.project.tracks.length >= 32) { toast('32 tracks is the ceiling.', { kind: 'warn' }); return; }
    app.pushHistory('add track');
    const t = makeTrack(id);
    app.project.tracks.push(t);
    app.markDirty();
    app.rebuildAudio();
    app.selectTrack(t.id);
    app.renderTracks();
    app.sequencer.render();
    toast(`${t.name} added as a track`, { kind: 'ok' });
  }
}

/* ================================================================== *
 * MIXER
 * ================================================================== */
export class Mixer {
  constructor(app) {
    this.app = app;
    this.host = null;
    this.meters = [];
  }

  mount(host, sub) {
    this.host = host;
    this.sub = sub;
    this.render();
  }

  render() {
    if (!this.host) return;
    const app = this.app;
    clear(this.host);
    this.meters = [];

    for (const track of app.project.tracks) {
      this.host.append(this.strip(track));
    }
    this.host.append(this.masterStrip());
    if (this.sub) this.sub.textContent = `${app.project.tracks.length} tracks`;
  }

  strip(track) {
    const app = this.app;
    const inst = getInstrument(track.instrument);

    const db = el('div', { class: 'db mono', text: fmtDb(track.vol) });
    const meterFill = el('i');
    const meter = el('div', { class: 'meter vert', style: { height: 'auto' } }, meterFill);
    this.meters.push({ id: track.id, node: meterFill });

    const f = fader({
      value: track.vol, min: -60, max: 6, default: -6,
      onChange: (v) => { track.vol = v; db.textContent = fmtDb(v); app.engine.syncMix(); app.markDirty(true); },
      onEnd: () => { app.pushHistoryDeferred('fader'); app.inspector.render(); }
    });

    const mute = el('button', {
      class: 'tmini m' + (track.mute ? ' on' : ''), text: 'M', title: 'Mute',
      onclick: () => { app.pushHistory('mute'); track.mute = !track.mute; app.engine.syncMix(); app.markDirty(); this.render(); app.renderTracks(); }
    });
    const solo = el('button', {
      class: 'tmini s' + (track.solo ? ' on' : ''), text: 'S', title: 'Solo',
      onclick: () => { app.pushHistory('solo'); track.solo = !track.solo; app.engine.syncMix(); app.markDirty(); this.render(); app.renderTracks(); }
    });

    const sendCtl = (key, label, color) => {
      const bar = el('div', { class: 'meter', style: { flex: '1', cursor: 'ew-resize' } },
        el('i', { style: { width: `${clamp(track.sends[key] / 1.2, 0, 1) * 100}%`, background: color } }));
      let dragging = false;
      const setFrom = (e) => {
        const r = bar.getBoundingClientRect();
        const v = clamp((e.clientX - r.left) / r.width, 0, 1) * 1.2;
        track.sends[key] = v;
        bar.firstChild.style.width = `${(v / 1.2) * 100}%`;
        app.engine.syncMix();
        app.markDirty(true);
      };
      bar.addEventListener('pointerdown', (e) => { dragging = true; bar.setPointerCapture(e.pointerId); setFrom(e); });
      bar.addEventListener('pointermove', (e) => { if (dragging) setFrom(e); });
      bar.addEventListener('pointerup', () => { dragging = false; app.pushHistoryDeferred('send'); });
      return el('div', { class: 'sendrow' }, el('label', { text: label }), bar);
    };

    const strip = el('div', {
      class: 'strip' + (track.id === app.selectedTrackId ? ' sel' : ''),
      onclick: (e) => { if (!e.target.closest('button,.fader,.meter')) { app.selectTrack(track.id); this.render(); } }
    },
      el('div', { class: 'sname', text: track.name, title: track.name }),
      el('div', { class: 'sinst', text: inst.name }),
      el('div', { class: 'faderzone' }, f, meter),
      db,
      el('div', { class: 'srow2' }, mute, solo,
        el('button', {
          class: 'tmini', text: '▶', title: 'Audition',
          onclick: (e) => { e.stopPropagation(); app.engine.previewTrack(track.id, null, 0.9, 0.5); }
        })),
      sendCtl('reverb', 'RV', 'var(--volt)'),
      sendCtl('delay', 'DL', 'var(--amber)')
    );
    strip.style.borderTopColor = track.color;
    return strip;
  }

  masterStrip() {
    const app = this.app;
    const m = app.project.master;
    const db = el('div', { class: 'db mono', text: fmtDb(m.volume) });
    const meterFill = el('i');
    this.masterMeter = meterFill;

    const f = fader({
      value: m.volume, min: -40, max: 6, default: -3,
      onChange: (v) => { m.volume = v; db.textContent = fmtDb(v); app.engine.syncMix(); app.markDirty(true); },
      onEnd: () => { app.pushHistoryDeferred('master fader'); app.inspector.render(); }
    });

    return el('div', { class: 'strip master' },
      el('div', { class: 'sname', text: 'MASTER' }),
      el('div', { class: 'sinst', text: 'glue · sat · limit' }),
      el('div', { class: 'faderzone' }, f, el('div', { class: 'meter vert' }, meterFill)),
      db,
      el('div', { class: 'srow2' },
        el('button', {
          class: 'btn sm', text: 'SETTINGS',
          onclick: () => { app.selectTrack(null); app.setView('studio'); }
        }))
    );
  }

  tickMeters(engine) {
    for (const m of this.meters) {
      const v = Math.min(1, engine.trackLevel(m.id) * 2.6);
      m.node.style.height = `${v * 100}%`;
    }
    if (this.masterMeter) this.masterMeter.style.height = `${Math.min(1, engine.masterLevel() * 2.6) * 100}%`;
  }
}

function fmtDb(v) {
  if (v <= -60) return '−∞';
  return (v > 0 ? '+' : '') + v.toFixed(1);
}

/* ================================================================== *
 * ARRANGEMENT
 * ================================================================== */
export class SongView {
  constructor(app) { this.app = app; }

  mount(host, sub) { this.host = host; this.sub = sub; this.render(); }

  render() {
    if (!this.host) return;
    const app = this.app;
    const p = app.project;
    clear(this.host);

    p.song.forEach((slot, index) => {
      const pat = p.patterns.find((x) => x.id === slot.pattern);
      if (!pat) return;
      const blk = el('div', {
        class: 'songblk' + (app.songIndex === index ? ' on' : ''),
        draggable: true,
        onclick: () => { app.activatePattern(pat.id); app.setView('studio'); }
      },
        el('div', { class: 'pn', text: pat.name }),
        el('div', { class: 'rp mono', text: `×${slot.repeats} · ${pat.steps} steps` }),
        el('div', {
          class: 'x', text: '✕',
          onclick: (e) => {
            e.stopPropagation();
            app.pushHistory('remove from song');
            p.song.splice(index, 1);
            app.markDirty();
            this.render();
          }
        })
      );

      blk.addEventListener('wheel', (e) => {
        e.preventDefault();
        app.pushHistory('repeats');
        slot.repeats = clamp(slot.repeats - Math.sign(e.deltaY), 1, 32);
        app.markDirty();
        this.render();
      }, { passive: false });

      blk.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', String(index)); });
      blk.addEventListener('dragover', (e) => e.preventDefault());
      blk.addEventListener('drop', (e) => {
        e.preventDefault();
        const from = Number(e.dataTransfer.getData('text/plain'));
        if (Number.isNaN(from) || from === index) return;
        app.pushHistory('reorder song');
        const [moved] = p.song.splice(from, 1);
        p.song.splice(index, 0, moved);
        app.markDirty();
        this.render();
      });

      this.host.append(blk);
    });

    const add = el('div', { class: 'songblk add', text: '+ ADD PATTERN' });
    add.addEventListener('click', async () => {
      const names = p.patterns.map((x) => x.name).join(', ');
      const which = await promptText(`Which pattern? (${names})`, p.patterns[0].name, { title: 'Add to arrangement' });
      if (which == null) return;
      const pat = p.patterns.find((x) => x.name.toLowerCase() === which.trim().toLowerCase()) || p.patterns[0];
      app.pushHistory('add to song');
      p.song.push({ pattern: pat.id, repeats: 1 });
      app.markDirty();
      this.render();
    });
    this.host.append(add);

    const s = projectStats(p);
    if (this.sub) {
      this.sub.textContent = p.song.length
        ? `${p.song.length} blocks · ${s.bars.toFixed(0)} bars · ${fmtTime(s.seconds)}`
        : 'Empty — the arrangement decides what "Song mode" and a song export play.';
    }
  }
}

/* ================================================================== *
 * VAULT
 * ================================================================== */
export class VaultView {
  constructor(app) { this.app = app; this.items = []; }

  mount(host, sub) { this.host = host; this.sub = sub; this.refresh(); }

  async refresh() {
    if (!this.host) return;
    try {
      this.items = await window.riot.vault.list();
    } catch (e) {
      this.items = [];
      toast('Could not read the vault: ' + e.message, { kind: 'warn' });
    }
    this.render();
  }

  render() {
    const app = this.app;
    clear(this.host);
    if (this.sub) this.sub.textContent = `${this.items.length} project${this.items.length === 1 ? '' : 's'}`;

    if (!this.items.length) {
      this.host.append(el('div', { class: 'empty' },
        el('h3', { text: 'The vault is empty' }),
        el('div', { text: 'Hit SAVE in the transport bar and your project lands here.' })));
      return;
    }

    for (const item of this.items) {
      const row = el('div', {
        class: 'vrow',
        ondblclick: () => app.loadFromVault(item.id)
      },
        el('div', { class: 'grow' },
          el('div', { class: 'vn', text: item.name || item.id }),
          el('div', { class: 'vm', text: item.corrupt
            ? 'unreadable file'
            : `${item.tracks} tracks · ${item.patterns} patterns · ${item.notes} notes · ${item.bpm} BPM · ${fmtBytes(item.size)} · ${fmtDate(item.modified)}` })),
        el('div', { class: 'acts' },
          el('button', { class: 'btn sm', text: 'OPEN', onclick: (e) => { e.stopPropagation(); app.loadFromVault(item.id); } }),
          el('button', {
            class: 'btn sm', text: 'DUPLICATE',
            onclick: async (e) => {
              e.stopPropagation();
              await window.riot.vault.duplicate(item.id);
              toast('Duplicated', { kind: 'ok' });
              this.refresh();
            }
          }),
          el('button', {
            class: 'btn sm', text: 'RENAME',
            onclick: async (e) => {
              e.stopPropagation();
              const next = await promptText('New name', item.name || item.id, { title: 'Rename project' });
              if (!next) return;
              try {
                const res = await window.riot.vault.rename(item.id, next);
                if (app.vaultId === item.id) { app.vaultId = res.id; app.project.name = next; app.renderTitle(); }
                this.refresh();
              } catch (err) { toast(err.message, { kind: 'warn' }); }
            }
          }),
          el('button', {
            class: 'btn sm danger', text: 'DELETE',
            onclick: async (e) => {
              e.stopPropagation();
              const ok = await confirmAction({
                title: 'Delete project',
                message: `Delete "${item.name || item.id}"?`,
                detail: 'This removes the file from your vault folder. It cannot be undone.',
                confirmLabel: 'Delete',
                danger: true
              });
              if (!ok) return;
              await window.riot.vault.remove(item.id);
              if (app.vaultId === item.id) app.vaultId = null;
              toast('Deleted', {});
              this.refresh();
            }
          }))
      );
      this.host.append(row);
    }
  }
}

/* ================================================================== *
 * Pattern helpers used by the toolbar
 * ================================================================== */
export function duplicatePattern(app) {
  const p = app.project;
  const cur = app.pattern();
  if (!cur) return;
  app.pushHistory('duplicate pattern');
  const copy = makePattern(nextName(p, cur.name), cur.steps);
  copy.notes = JSON.parse(JSON.stringify(cur.notes));
  p.patterns.push(copy);
  app.activatePattern(copy.id);
  app.markDirty();
  toast(`Pattern "${copy.name}" created`, { kind: 'ok' });
}

function nextName(project, base) {
  const stem = base.replace(/\s*\d+$/, '');
  let n = 2;
  const used = new Set(project.patterns.map((x) => x.name));
  while (used.has(`${stem} ${n}`)) n++;
  return `${stem} ${n}`;
}
