#!/usr/bin/env node
// Comprueba que las versiones es y en tienen la misma estructura: mismas
// etiquetas, clases y claves de datos en el mismo orden. Ignora textos, ids,
// enlaces y atributos traducibles, que sí cambian entre idiomas.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = process.argv[2] || 'site';
const KEEP = ['class', 'data-gh', 'data-gh-time', 'data-stat', 'data-fmt', 'data-cmd', 'data-goatcounter-click', 'type', 'role'];

function signature(file) {
  const html = readFileSync(join(ROOT, dir, file), 'utf8');
  const body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  const out = [];
  for (const [, tag, attrs] of body.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/g)) {
    const kept = KEEP.map((k) => {
      const m = attrs.match(new RegExp(`\\s${k}="([^"]*)"`));
      return m ? `${k}=${m[1]}` : null;
    }).filter(Boolean);
    out.push(`${tag}${kept.length ? ' ' + kept.join(' ') : ''}`);
  }
  return out;
}

const es = signature('index.html');
const en = signature('en/index.html');
const max = Math.max(es.length, en.length);
for (let i = 0; i < max; i++) {
  if (es[i] !== en[i]) {
    console.error(`✗ es/en desincronizadas en el elemento #${i + 1}:\n  es: <${es[i] ?? '(fin)'}>\n  en: <${en[i] ?? '(fin)'}>`);
    process.exit(1);
  }
}
console.log(`✓ es/en sincronizadas (${es.length} elementos)`);
