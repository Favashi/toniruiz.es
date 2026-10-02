#!/usr/bin/env node
// Lee los resultados de Lighthouse CI (.lighthouseci/) y publica las puntuaciones:
// - _site/data/lighthouse.json         (detalle por URL)
// - _site/data/lighthouse-badge.json   (endpoint de shields.io para el README)
// - el pie de ambas páginas            (<!-- lh:scores -->)
// Se toma la peor puntuación de entre las URLs auditadas, por honestidad.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '_site');
const manifestPath = join(ROOT, '.lighthouseci', 'manifest.json');
if (!existsSync(manifestPath)) {
  console.warn('Sin resultados de Lighthouse; se omite.');
  process.exit(0);
}

const runs = JSON.parse(readFileSync(manifestPath, 'utf8')).filter((r) => r.isRepresentativeRun);
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const scores = Object.fromEntries(CATS.map((c) => [c, Math.round(Math.min(...runs.map((r) => r.summary[c])) * 100)]));
const message = CATS.map((c) => scores[c]).join(' · ');

mkdirSync(join(OUT, 'data'), { recursive: true });
writeFileSync(join(OUT, 'data', 'lighthouse.json'), JSON.stringify({
  generated_at: new Date().toISOString(),
  scores,
  runs: runs.map((r) => ({ url: new URL(r.url).pathname, summary: r.summary })),
}, null, 2));
writeFileSync(join(OUT, 'data', 'lighthouse-badge.json'), JSON.stringify({
  schemaVersion: 1,
  label: 'lighthouse',
  message,
  color: Math.min(...Object.values(scores)) >= 90 ? '3ee6a8' : 'ffd166',
}));

const LABELS = {
  es: 'Rendimiento, accesibilidad, buenas prácticas y SEO según Lighthouse',
  en: 'Performance, accessibility, best practices and SEO according to Lighthouse',
};
for (const [file, lang] of [['index.html', 'es'], ['en/index.html', 'en']]) {
  const path = join(OUT, file);
  const html = readFileSync(path, 'utf8').replace(
    /<!-- lh:scores -->[\s\S]*?<!-- \/lh:scores -->/,
    `<!-- lh:scores --> · <abbr title="${LABELS[lang]}">Lighthouse</abbr> ${message}<!-- /lh:scores -->`
  );
  writeFileSync(path, html);
}
console.log(`Lighthouse: ${message}`);
