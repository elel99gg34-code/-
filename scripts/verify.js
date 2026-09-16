#!/usr/bin/env node
/* Boots the real app in a real Chromium and asserts it works end to end.
 *
 *   npm run verify
 *
 * On a headless machine this wraps the run in xvfb-run automatically. */

'use strict';

const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.join(__dirname, '..');
const electron = require(path.join(ROOT, 'node_modules', 'electron'));

function hasXvfb() {
  return spawnSync('which', ['xvfb-run'], { encoding: 'utf8' }).status === 0;
}

function run() {
  const args = [ROOT, '--selftest', '--no-sandbox', '--disable-gpu'];
  const headless = !process.env.DISPLAY && hasXvfb();
  const cmd = headless ? 'xvfb-run' : electron;
  const argv = headless ? ['-a', '-s', '-screen 0 1600x1000x24', electron, ...args] : args;

  const child = spawn(cmd, argv, {
    cwd: ROOT,
    env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let out = '';
  let err = '';
  child.stdout.on('data', (d) => { out += d; process.stdout.write(d); });
  child.stderr.on('data', (d) => { err += d; });

  const timer = setTimeout(() => {
    console.error('\nself test timed out after 300s');
    child.kill('SIGKILL');
  }, 300000);

  child.on('exit', (code) => {
    clearTimeout(timer);
    const marker = out.indexOf('__SELFTEST__');
    if (marker < 0) {
      console.error('\nno self-test result was produced. stderr tail:\n' + err.split('\n').slice(-25).join('\n'));
      process.exit(1);
    }
    const line = out.slice(marker + '__SELFTEST__'.length).split('\n')[0];
    let result;
    try { result = JSON.parse(line); } catch (e) { console.error('unparseable result: ' + line.slice(0, 400)); process.exit(1); }

    console.log('\nRIOT MACHINE — self test\n' + '='.repeat(52));
    let failed = 0;
    for (const c of result.checks) {
      if (!c.ok) failed++;
      console.log(`${c.ok ? ' ok ' : 'FAIL'}  ${c.name}${c.detail ? '  — ' + c.detail : ''}`);
    }
    for (const e of result.errors || []) { failed++; console.log('FAIL  exception\n' + e); }

    if (result.peaks) {
      const sorted = [...result.peaks].sort((a, b) => a.peak - b.peak);
      console.log('\nquietest instruments: ' + sorted.slice(0, 6).map((p) => `${p.id}=${p.peak}`).join('  '));
      console.log('loudest instruments:  ' + sorted.slice(-6).reverse().map((p) => `${p.id}=${p.peak}`).join('  '));
      fs.writeFileSync(path.join(ROOT, 'build', 'peaks.json'), JSON.stringify(result.peaks, null, 1));
    }

    console.log('='.repeat(52));
    console.log(failed ? `${failed} check(s) failed` : `all ${result.checks.length} checks passed`);
    process.exit(failed ? 1 : (code || 0));
  });
}

run();
