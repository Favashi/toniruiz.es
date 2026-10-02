#!/usr/bin/env node
// Servidor estático mínimo para _site/ (tests y desarrollo local).
// Uso: node scripts/serve.mjs [puerto]

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '_site');
const PORT = Number(process.argv[2] || process.env.PORT || 8000);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

const resolve = (urlPath) => {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, clean);
  try { if (statSync(file).isDirectory()) file = join(file, 'index.html'); statSync(file); return file; } catch { return null; }
};

createServer((req, res) => {
  const file = resolve(req.url);
  const target = file || join(ROOT, '404.html');
  res.writeHead(file ? 200 : 404, { 'Content-Type': TYPES[extname(target)] || 'application/octet-stream' });
  createReadStream(target).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`http://127.0.0.1:${PORT}/`));
