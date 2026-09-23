'use strict';

const { app, BrowserWindow, ipcMain, dialog, shell, Menu, protocol, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const fssync = require('node:fs');

const IS_DEV = process.argv.includes('--dev');
const IS_SELFTEST = process.argv.includes('--selftest');
const SHOT_ARG = process.argv.find((a) => a.startsWith('--shots='));
const PROBE_ARG = process.argv.find((a) => a.startsWith('--probe='));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

/* ------------------------------------------------------------------ *
 * Single instance
 * ------------------------------------------------------------------ */
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

/* Chromium flags that matter for a low-latency audio app. */
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

/* The renderer is served over a custom scheme so ES modules and AudioWorklet
 * both work without a bundler and without relaxing file:// security. */
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true }
  }
]);

/* ------------------------------------------------------------------ *
 * Paths / vault
 * ------------------------------------------------------------------ */
function userDir(...p) { return path.join(app.getPath('userData'), ...p); }
const VAULT = () => userDir('vault');
const RENDERS = () => userDir('renders');

async function ensureDirs() {
  await fs.mkdir(VAULT(), { recursive: true });
  await fs.mkdir(RENDERS(), { recursive: true });
}

function safeSlug(name) {
  const s = String(name == null ? '' : name)
    .normalize('NFC')
    .split('')
    .filter((ch) => ch.charCodeAt(0) > 31 && !'\\/:*?"<>|'.includes(ch))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return s || 'untitled';
}

/* Guard: a project id must never escape the vault directory. */
function vaultFile(id) {
  const base = safeSlug(id).replace(/\.riot$/i, '') || 'untitled';
  const file = path.join(VAULT(), base + '.riot');
  const rel = path.relative(VAULT(), file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('invalid project id');
  return file;
}

/* ------------------------------------------------------------------ *
 * Window
 * ------------------------------------------------------------------ */
let mainWindow = null;

function resolveIcon() {
  const candidates = [
    path.join(ROOT, 'build', 'icon.ico'),
    path.join(ROOT, 'build', 'icons', '512x512.png'),
    path.join(ROOT, 'build', 'icon.png')
  ];
  for (const c of candidates) if (fssync.existsSync(c)) return c;
  return undefined;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1580,
    height: 960,
    minWidth: 1100,
    minHeight: 680,
    backgroundColor: '#0b0b0d',
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    icon: resolveIcon(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
      backgroundThrottling: false,
      webSecurity: true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (IS_DEV) mainWindow.webContents.openDevTools({ mode: 'detach' });
    if (IS_SELFTEST) runSelfTest();
    else if (SHOT_ARG) captureShots(SHOT_ARG.slice('--shots='.length));
    else if (PROBE_ARG) runProbe(decodeURIComponent(PROBE_ARG.slice('--probe='.length)));
  });

  if (IS_SELFTEST) {
    mainWindow.webContents.on('console-message', (_e, level, message) => {
      if (level >= 2) console.log('[renderer]', message);
    });
    mainWindow.webContents.on('render-process-gone', (_e, d) => {
      console.log('[selftest] renderer gone:', JSON.stringify(d));
      app.exit(1);
    });
  }

  const send = (ch, v) => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send(ch, v); };
  mainWindow.on('maximize', () => send('window:state', { maximized: true }));
  mainWindow.on('unmaximize', () => send('window:state', { maximized: false }));
  mainWindow.on('closed', () => { mainWindow = null; });

  /* External links open in the user's browser, never in-app. */
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('app://')) {
      e.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.loadURL('app://riot/index.html');
}

/* ------------------------------------------------------------------ *
 * app:// protocol -> src/
 * ------------------------------------------------------------------ */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.wav': 'audio/wav'
};

function registerAppProtocol() {
  protocol.handle('app', async (request) => {
    const url = new URL(request.url);
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/' || rel === '') rel = '/index.html';
    const file = path.join(SRC, rel);
    const relCheck = path.relative(SRC, file);
    if (relCheck.startsWith('..') || path.isAbsolute(relCheck)) {
      return new Response('forbidden', { status: 403 });
    }
    try {
      const data = await fs.readFile(file);
      const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
      return new Response(data, {
        status: 200,
        headers: { 'content-type': type, 'cache-control': IS_DEV ? 'no-store' : 'max-age=3600' }
      });
    } catch {
      return new Response('not found: ' + rel, {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });
    }
  });
}

/* ------------------------------------------------------------------ *
 * IPC — window chrome & app info
 * ------------------------------------------------------------------ */
ipcMain.handle('window:minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.handle('window:toggleMaximize', () => {
  if (!mainWindow) return false;
  if (mainWindow.isMaximized()) mainWindow.unmaximize(); else mainWindow.maximize();
  return mainWindow.isMaximized();
});
ipcMain.handle('window:close', () => { if (mainWindow) mainWindow.close(); });
ipcMain.handle('window:isMaximized', () => !!(mainWindow && mainWindow.isMaximized()));

ipcMain.handle('app:info', () => ({
  version: app.getVersion(),
  name: app.getName(),
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  node: process.versions.node,
  platform: process.platform,
  arch: process.arch,
  vault: VAULT(),
  renders: RENDERS(),
  dev: IS_DEV
}));

ipcMain.handle('app:openPath', async (_e, which) => {
  await ensureDirs();
  return shell.openPath(which === 'renders' ? RENDERS() : VAULT());
});

/* ------------------------------------------------------------------ *
 * IPC — project vault
 * ------------------------------------------------------------------ */
function countNotes(project) {
  let n = 0;
  for (const p of project.patterns || []) {
    for (const k of Object.keys(p.notes || {})) n += (p.notes[k] || []).length;
  }
  return n;
}

ipcMain.handle('vault:list', async () => {
  await ensureDirs();
  const names = await fs.readdir(VAULT());
  const out = [];
  for (const n of names) {
    if (!n.toLowerCase().endsWith('.riot')) continue;
    const full = path.join(VAULT(), n);
    try {
      const stat = await fs.stat(full);
      const raw = await fs.readFile(full, 'utf8');
      let meta;
      try {
        const j = JSON.parse(raw);
        meta = {
          name: j.name || n.replace(/\.riot$/i, ''),
          bpm: j.bpm,
          tracks: Array.isArray(j.tracks) ? j.tracks.length : 0,
          patterns: Array.isArray(j.patterns) ? j.patterns.length : 0,
          notes: countNotes(j)
        };
      } catch {
        meta = { name: n.replace(/\.riot$/i, ''), corrupt: true };
      }
      out.push({
        id: n.replace(/\.riot$/i, ''),
        file: full,
        size: stat.size,
        modified: stat.mtimeMs,
        created: stat.birthtimeMs,
        ...meta
      });
    } catch { /* skip unreadable entries */ }
  }
  out.sort((a, b) => b.modified - a.modified);
  return out;
});

ipcMain.handle('vault:save', async (_e, { id, project }) => {
  await ensureDirs();
  const targetId = safeSlug(id || (project && project.name) || 'untitled');
  const file = vaultFile(targetId);
  const tmp = file + '.tmp';
  const body = JSON.stringify(project, null, 1);
  await fs.writeFile(tmp, body, 'utf8');
  await fs.rename(tmp, file); // never leave a half-written project behind
  return { id: targetId, file, bytes: Buffer.byteLength(body) };
});

ipcMain.handle('vault:load', async (_e, id) => {
  const raw = await fs.readFile(vaultFile(id), 'utf8');
  return JSON.parse(raw);
});

ipcMain.handle('vault:delete', async (_e, id) => {
  await fs.rm(vaultFile(id), { force: true });
  return true;
});

ipcMain.handle('vault:rename', async (_e, { id, next }) => {
  const from = vaultFile(id);
  const to = vaultFile(next);
  if (from === to) return { id: safeSlug(next) };
  if (fssync.existsSync(to)) throw new Error('A project with that name already exists.');
  await fs.rename(from, to);
  return { id: safeSlug(next).replace(/\.riot$/i, '') };
});

ipcMain.handle('vault:duplicate', async (_e, id) => {
  const raw = await fs.readFile(vaultFile(id), 'utf8');
  let base = safeSlug(id) + ' copy';
  let n = 2;
  while (fssync.existsSync(vaultFile(base))) { base = safeSlug(id) + ' copy ' + n; n += 1; }
  const j = JSON.parse(raw);
  j.name = base;
  await fs.writeFile(vaultFile(base), JSON.stringify(j, null, 1), 'utf8');
  return { id: base };
});

/* ------------------------------------------------------------------ *
 * IPC — import / export files
 * ------------------------------------------------------------------ */
ipcMain.handle('file:exportProject', async (_e, { name, json }) => {
  const res = await dialog.showSaveDialog(mainWindow, {
    title: 'Export project',
    defaultPath: path.join(app.getPath('documents'), safeSlug(name) + '.riot'),
    filters: [{ name: 'RIOT project', extensions: ['riot'] }, { name: 'JSON', extensions: ['json'] }]
  });
  if (res.canceled || !res.filePath) return { canceled: true };
  await fs.writeFile(res.filePath, json, 'utf8');
  return { canceled: false, path: res.filePath };
});

ipcMain.handle('file:importProject', async () => {
  const res = await dialog.showOpenDialog(mainWindow, {
    title: 'Import project',
    properties: ['openFile'],
    filters: [{ name: 'RIOT project', extensions: ['riot', 'json'] }]
  });
  if (res.canceled || !res.filePaths.length) return { canceled: true };
  const raw = await fs.readFile(res.filePaths[0], 'utf8');
  return { canceled: false, path: res.filePaths[0], project: JSON.parse(raw) };
});

/* Renders land on disk via the main process so we never fight the browser
 * download sandbox. `data` arrives as a transferred ArrayBuffer. */
ipcMain.handle('file:saveAudio', async (_e, { suggested, ext, data, toRenders }) => {
  const buf = Buffer.from(data);
  const extension = ext || 'wav';
  const fname = safeSlug(suggested) + '.' + extension;
  if (toRenders) {
    await ensureDirs();
    const out = path.join(RENDERS(), fname);
    await fs.writeFile(out, buf);
    return { canceled: false, path: out };
  }
  const res = await dialog.showSaveDialog(mainWindow, {
    title: 'Export audio',
    defaultPath: path.join(app.getPath('music'), fname),
    filters: [{ name: extension.toUpperCase() + ' audio', extensions: [extension] }]
  });
  if (res.canceled || !res.filePath) return { canceled: true };
  await fs.writeFile(res.filePath, buf);
  return { canceled: false, path: res.filePath };
});

ipcMain.handle('file:saveText', async (_e, { suggested, ext, text }) => {
  const extension = ext || 'txt';
  const res = await dialog.showSaveDialog(mainWindow, {
    title: 'Export file',
    defaultPath: path.join(app.getPath('documents'), safeSlug(suggested) + '.' + extension),
    filters: [{ name: extension.toUpperCase(), extensions: [extension] }]
  });
  if (res.canceled || !res.filePath) return { canceled: true };
  await fs.writeFile(res.filePath, text, 'utf8');
  return { canceled: false, path: res.filePath };
});

ipcMain.handle('file:reveal', async (_e, p) => { shell.showItemInFolder(p); });

ipcMain.handle('dialog:confirm', async (_e, { title, message, detail, confirmLabel, danger }) => {
  const res = await dialog.showMessageBox(mainWindow, {
    type: danger ? 'warning' : 'question',
    buttons: [confirmLabel || 'OK', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    title: title || 'RIOT MACHINE',
    message: message || '',
    detail: detail || ''
  });
  return res.response === 0;
});

ipcMain.handle('dialog:prompt', async (_e, { title, message, detail }) => {
  /* Electron has no native text prompt; the renderer owns that UI.
   * Kept as a hook so main-process-driven flows can fall back to a message box. */
  await dialog.showMessageBox(mainWindow, {
    type: 'info',
    buttons: ['OK'],
    title: title || 'RIOT MACHINE',
    message: message || '',
    detail: detail || ''
  });
  return null;
});

/* ------------------------------------------------------------------ *
 * Menu (accelerators; the visible chrome is drawn in the renderer)
 * ------------------------------------------------------------------ */
function buildMenu() {
  const fire = (cmd) => () => { if (mainWindow) mainWindow.webContents.send('menu', cmd); };
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New project', accelerator: 'CmdOrCtrl+N', click: fire('new') },
        { label: 'Vault', accelerator: 'CmdOrCtrl+O', click: fire('view:vault') },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: fire('save') },
        { label: 'Save as…', accelerator: 'CmdOrCtrl+Shift+S', click: fire('saveas') },
        { type: 'separator' },
        { label: 'Import .riot…', click: fire('import') },
        { label: 'Export .riot…', click: fire('exportproject') },
        { label: 'Export audio…', accelerator: 'CmdOrCtrl+E', click: fire('export') },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: fire('undo') },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', click: fire('redo') },
        { type: 'separator' },
        { label: 'Duplicate pattern', accelerator: 'CmdOrCtrl+D', click: fire('duppattern') },
        { label: 'Clear track', accelerator: 'CmdOrCtrl+Backspace', click: fire('cleartrack') }
      ]
    },
    {
      label: 'Transport',
      submenu: [
        { label: 'Play / Stop', accelerator: 'Space', click: fire('playstop') },
        { label: 'Stop', accelerator: 'Escape', click: fire('stop') },
        { label: 'Song mode', accelerator: 'CmdOrCtrl+L', click: fire('songmode') },
        { label: 'Tap tempo', accelerator: 'CmdOrCtrl+T', click: fire('tap') },
        { label: 'Metronome', accelerator: 'CmdOrCtrl+M', click: fire('metronome') }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Studio', accelerator: 'F2', click: fire('view:studio') },
        { label: 'Instruments', accelerator: 'F3', click: fire('view:rack') },
        { label: 'Mixer', accelerator: 'F4', click: fire('view:mixer') },
        { label: 'Arrangement', accelerator: 'F6', click: fire('view:song') },
        { label: 'Vault', accelerator: 'F7', click: fire('view:vault') },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'toggledevtools' },
        { role: 'reload' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Keyboard shortcuts', accelerator: 'F1', click: fire('help') },
        { label: 'Open project vault folder', click: () => ensureDirs().then(() => shell.openPath(VAULT())) },
        { label: 'Open renders folder', click: () => ensureDirs().then(() => shell.openPath(RENDERS())) },
        { label: 'About RIOT MACHINE', click: fire('about') }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/* ------------------------------------------------------------------ *
 * Self test (npm run verify) — drives the real renderer under a real
 * Chromium so the audio graph and the offline renderer are exercised.
 * ------------------------------------------------------------------ */
async function runSelfTest() {
  const wc = mainWindow.webContents;
  const script = `(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const out = { checks: [], errors: [] };
    const check = (name, ok, detail) => out.checks.push({ name, ok: !!ok, detail: detail == null ? '' : String(detail) });
    try {
      for (let i = 0; i < 200 && !(window.__riotApp && window.__riotApp.ready); i++) await wait(50);
      const app = window.__riotApp;
      check('app booted', !!(app && app.ready));

      const mod = await import('/js/data/instruments.js');
      check('rack has 590 instruments', mod.INSTRUMENTS.length === 590, mod.INSTRUMENTS.length);

      check('audio context', !!app.engine.ctx, app.engine.ctx && app.engine.ctx.sampleRate);
      check('audio worklet loaded', app.engine.ctx.__riotWorklet === true, app.engine.ctx.__riotWorklet);
      check('graph built', !!app.engine.graph && app.engine.graph.tracks.size === app.project.tracks.length,
            app.engine.graph && app.engine.graph.tracks.size);

      check('demo project', app.project.tracks.length > 0 && app.project.patterns.length > 0,
            app.project.tracks.length + ' tracks / ' + app.project.patterns.length + ' patterns');
      check('track rows rendered', document.querySelectorAll('.trow').length === app.project.tracks.length,
            document.querySelectorAll('.trow').length);
      check('step cells rendered', document.querySelectorAll('.scell').length > 0,
            document.querySelectorAll('.scell').length);

      // Every instrument must build a voice without throwing.
      const { triggerDrum, triggerSynth } = await import('/js/audio/voice.js');
      const probe = new OfflineAudioContext(2, 4800, 48000);
      await (await import('/js/audio/engine.js')).loadWorklet(probe);
      let bad = [];
      for (const inst of mod.INSTRUMENTS) {
        try {
          if (inst.kind === 'drum') triggerDrum(probe, probe.destination, inst, { time: 0.001, vel: 0.9, midi: inst.defaultNote || 48 });
          else triggerSynth(probe, probe.destination, inst, { time: 0.001, vel: 0.9, dur: 0.05, midi: inst.defaultNote || 60 });
        } catch (e) { bad.push(inst.id + ': ' + e.message); }
      }
      check('all 590 instruments trigger', bad.length === 0, bad.slice(0, 5).join(' | '));

      // Render each instrument alone and confirm it actually makes sound.
      const { renderInstrument } = await import('/js/audio/engine.js');
      const silent = [];
      const peaks = [];
      for (const inst of mod.INSTRUMENTS) {
        // Slow-attack instruments (risers, drones, pads) need a window long
        // enough for the envelope to actually open.
        const attack = (inst.ampEnv && inst.ampEnv.a) || 0.01;
        const dur = Math.max(0.5, attack * 1.6);
        const buf = await renderInstrument(inst.id, { sampleRate: 44100, dur, tail: 0.6 });
        let peak = 0;
        const d = buf.getChannelData(0), d2 = buf.getChannelData(1);
        for (let i = 0; i < d.length; i++) { const a = Math.max(Math.abs(d[i]), Math.abs(d2[i])); if (a > peak) peak = a; }
        peaks.push({ id: inst.id, peak: Number(peak.toFixed(4)) });
        if (peak < 0.005) silent.push(inst.id + ' (' + peak.toFixed(5) + ')');
      }
      check('no silent instruments', silent.length === 0, silent.join(', '));
      out.peaks = peaks;

      // Full pattern render + WAV encode.
      const { renderProject } = await import('/js/audio/engine.js');
      const { encodeWav, analyse } = await import('/js/lib/encode.js');
      const song = await renderProject(app.project, { mode: 'song', sampleRate: 44100, tail: 1 });
      const st = analyse(song);
      check('song renders', song.length > 0 && st.peakDb > -40, 'dur=' + song.duration.toFixed(2) + 's peak=' + st.peakDb.toFixed(1) + 'dB rms=' + st.rmsDb.toFixed(1) + 'dB');
      const wav = encodeWav(song, 24);
      const head = new TextDecoder().decode(new Uint8Array(wav, 0, 4));
      check('wav encodes', head === 'RIFF' && wav.byteLength > 44, head + ' ' + wav.byteLength + ' bytes');

      // MP3 path.
      const { encodeMp3 } = await import('/js/lib/encode.js');
      const short = await renderProject(app.project, { mode: 'pattern', patternId: app.project.patterns[0].id, loops: 1, sampleRate: 44100, tail: 0.2 });
      const mp3 = await encodeMp3(short, 128);
      const m = new Uint8Array(mp3);
      check('mp3 encodes', mp3.byteLength > 1000 && (m[0] === 0xff || (m[0] === 0x49 && m[1] === 0x44)), mp3.byteLength + ' bytes');

      // Live transport.
      await app.engine.play({ song: false });
      await wait(700);
      check('transport runs', app.engine.playing && app.engine.step > 0, 'step=' + app.engine.step);
      app.stop();
      check('transport stops', !app.engine.playing);

      // Editing round trip.
      const { migrate } = await import('/js/state/project.js');
      const before = app.project.patterns[0].notes[app.project.tracks[0].id].length;
      app.pushHistory('test');
      app.project.patterns[0].notes[app.project.tracks[0].id].push({ s: 1, n: 36, v: 0.8, l: 1 });
      app.markDirty();
      app.undo();
      check('undo restores notes', app.project.patterns[0].notes[app.project.tracks[0].id].length === before,
            app.project.patterns[0].notes[app.project.tracks[0].id].length + ' vs ' + before);
      const round = migrate(JSON.parse(JSON.stringify(app.project)));
      check('project round-trips', round.tracks.length === app.project.tracks.length && round.patterns.length === app.project.patterns.length);

      // Views render.
      for (const v of ['rack', 'mixer', 'song', 'vault', 'studio']) { app.setView(v); await wait(90); }
      check('rack cards rendered', document.querySelectorAll('.icard').length === 590, document.querySelectorAll('.icard').length);
      check('mixer strips rendered', document.querySelectorAll('.strip').length === app.project.tracks.length + 1, document.querySelectorAll('.strip').length);

      // Piano roll.
      app.sequencer.setMode('roll');
      await wait(120);
      check('piano roll rendered', document.querySelectorAll('#rollkeys .k').length > 60 && document.querySelectorAll('.rnote').length > 0,
            document.querySelectorAll('.rnote').length + ' notes');
      app.sequencer.setMode('grid');
    } catch (e) {
      out.errors.push(String((e && e.stack) || e));
    }
    return out;
  })()`;

  try {
    const result = await wc.executeJavaScript(script, true);
    console.log('__SELFTEST__' + JSON.stringify(result));
    const failed = result.checks.filter((c) => !c.ok).length + result.errors.length;
    app.exit(failed ? 1 : 0);
  } catch (e) {
    console.log('__SELFTEST__' + JSON.stringify({ checks: [], errors: [String(e)] }));
    app.exit(1);
  }
}

/* Screenshot pass used while developing the UI: `electron . --shots=<dir>` */
async function captureShots(dir) {
  const wc = mainWindow.webContents;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await fs.mkdir(dir, { recursive: true });
  try {
    await wc.executeJavaScript('(async()=>{for(let i=0;i<200 && !(window.__riotApp&&window.__riotApp.ready);i++)await new Promise(r=>setTimeout(r,50));return true})()', true);
    await wait(900);
    const views = ['studio', 'rack', 'mixer', 'song', 'vault'];
    for (const v of views) {
      await wc.executeJavaScript(`window.__riotApp.setView('${v}')`, true);
      await wait(600);
      const img = await wc.capturePage();
      await fs.writeFile(path.join(dir, v + '.png'), img.toPNG());
      console.log('shot', v);
    }
    await wc.executeJavaScript("window.__riotApp.setView('studio'); window.__riotApp.sequencer.setMode('roll');", true);
    await wait(600);
    await fs.writeFile(path.join(dir, 'pianoroll.png'), (await wc.capturePage()).toPNG());
    await wc.executeJavaScript("window.__riotApp.sequencer.setMode('grid'); window.__riotApp.showHelp();", true);
    await wait(500);
    await fs.writeFile(path.join(dir, 'help.png'), (await wc.capturePage()).toPNG());
    console.log('shots written to ' + dir);
  } catch (e) {
    console.log('shot failure: ' + e.message);
  }
  app.exit(0);
}

/* Ad-hoc DOM probe used while developing: electron . --probe=<uri-encoded js> */
async function runProbe(code) {
  const wc = mainWindow.webContents;
  try {
    await wc.executeJavaScript('(async()=>{for(let i=0;i<200 && !(window.__riotApp&&window.__riotApp.ready);i++)await new Promise(r=>setTimeout(r,50));return true})()', true);
    const r = await wc.executeJavaScript('(async()=>{ ' + code + ' })()', true);
    console.log('__PROBE__' + JSON.stringify(r));
  } catch (e) {
    console.log('__PROBE__' + JSON.stringify({ error: String(e && e.stack || e) }));
  }
  app.exit(0);
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */
app.whenReady().then(async () => {
  nativeTheme.themeSource = 'dark';
  registerAppProtocol();
  await ensureDirs();
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
