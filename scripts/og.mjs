#!/usr/bin/env node
// Genera las imágenes Open Graph (1200×630) de cada idioma a partir de
// scripts/og/template.html, con el avatar actual de _site/.
// Requiere haber ejecutado antes scripts/build.mjs y tener Chromium de Playwright.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '_site');

const VARIANTS = [
  { file: 'og-image.png', lang: 'es', line1: 'Escribo el código.', line2: 'Y lo llevo a producción.', tagline: '+20 años · cloud · kubernetes · ci/cd' },
  { file: 'og-image-en.png', lang: 'en', line1: 'I write the code.', line2: 'And I ship it to production.', tagline: '20+ years · cloud · kubernetes · ci/cd' },
];

const template = readFileSync(join(ROOT, 'scripts/og/template.html'), 'utf8');
const avatar = `data:image/jpeg;base64,${readFileSync(join(OUT, 'assets/img/avatar.jpg')).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const v of VARIANTS) {
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, k) => (k === 'avatar' ? avatar : v[k] ?? ''));
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: join(OUT, v.file) });
}
await browser.close();
console.log(`OG: ${VARIANTS.map((v) => v.file).join(', ')}`);
