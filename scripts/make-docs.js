/* Regenerates docs/INSTRUMENTS.md straight from the rack tables.
 *
 * The rack is the source of truth; keeping the catalogue hand-written was
 * fine at 130 instruments and is not fine at 590. Run `npm run docs` after
 * adding a family or renaming anything. */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const { INSTRUMENTS, CATEGORIES } = await import(
  new URL('../src/js/data/instruments.js', import.meta.url).href
);

const byCat = new Map(CATEGORIES.map((c) => [c.id, []]));
for (const i of INSTRUMENTS) byCat.get(i.cat).push(i);

const out = [];
out.push(`# The Rack — all ${INSTRUMENTS.length} instruments`);
out.push('');
out.push(
  'Every instrument is synthesised from scratch by `src/js/audio/voice.js`. ' +
  'There are no samples anywhere in this app: the whole rack is a few kilobytes ' +
  'of parameters, so it renders identically at any sample rate.'
);
out.push('');
out.push(
  'The tables live one family per module under `src/js/data/rack/`; ' +
  '`src/js/data/instruments.js` stitches them together and documents every field.'
);
out.push('');
out.push('This file is generated — run `npm run docs` after changing the rack.');
out.push('');
out.push('| Family | Count | Colour |');
out.push('|---|---:|---|');
for (const c of CATEGORIES) {
  out.push(`| ${c.name} | ${byCat.get(c.id).length} | \`${c.color}\` |`);
}
out.push(`| **Total** | **${INSTRUMENTS.length}** | |`);
out.push('');

for (const c of CATEGORIES) {
  const list = byCat.get(c.id);
  out.push(`## ${c.name} (${list.length})`);
  out.push('');
  out.push('| # | Instrument | Engine | Character |');
  out.push('|---:|---|---|---|');
  list.forEach((i, n) => {
    out.push(`| ${n + 1} | **${i.name}** | ${i.kind} | ${(i.tags || []).join(', ')} |`);
  });
  out.push('');
}

writeFileSync(resolve(root, 'docs/INSTRUMENTS.md'), out.join('\n'), 'utf8');
console.log(`docs/INSTRUMENTS.md — ${INSTRUMENTS.length} instruments, ${CATEGORIES.length} families`);
