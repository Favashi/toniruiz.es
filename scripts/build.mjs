#!/usr/bin/env node
// Build de toniruiz.es
//
// Copia site/ a _site/, consulta la API pública de GitHub y deja los datos
// tanto en _site/data/github.json como incrustados en el HTML (para que los
// buscadores y las previsualizaciones vean contenido real sin ejecutar JS).
//
// Genera las dos versiones (es en /, en en /en/).
//
// Uso: node scripts/build.mjs            (GITHUB_TOKEN opcional, evita el límite de 60 req/h)
//      node scripts/build.mjs --offline  (sin red: solo copia y fecha el sitemap)

import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'site');
const OUT = join(ROOT, '_site');
const USER = 'Favashi';
const OFFLINE = process.argv.includes('--offline');

// Solo estos repos aparecen en la web. Cualquier otro se ignora a propósito.
const PROJECTS = ['escribadelamarca', 'osr-manager', 'toniruiz.es'];
const ACTIVITY_LIMIT = 6;

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'toniruiz.es-build',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API ${res.status} en ${path}`);
  return res.json();
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const firstLine = (msg) => {
  const line = msg.split('\n')[0].trim();
  return line.length > 72 ? line.slice(0, 71) + '…' : line;
};
// Páginas generadas y su idioma
const PAGES = [{ file: 'index.html', lang: 'es' }, { file: 'en/index.html', lang: 'en' }];
const LOCALES = { es: { locale: 'es-ES', in: 'en' }, en: { locale: 'en-GB', in: 'in' } };
const monthYear = (iso, lang) => new Date(iso).toLocaleDateString(LOCALES[lang].locale, { month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' });

async function collect() {
  const projects = {};
  const commits = [];

  for (const name of PROJECTS) {
    const repo = await api(`/repos/${USER}/${name}`);
    if (!repo || repo.private) continue;
    const release = await api(`/repos/${USER}/${name}/releases/latest`);
    const recent = (await api(`/repos/${USER}/${name}/commits?per_page=${ACTIVITY_LIMIT}`)) || [];

    projects[name] = {
      url: repo.html_url,
      homepage: repo.homepage || null,
      stars: repo.stargazers_count,
      pushed_at: repo.pushed_at,
      version: release ? release.tag_name.replace(/^(?!v)/, 'v') : null,
      released_at: release ? release.published_at : null,
    };

    for (const c of recent) {
      commits.push({
        repo: name,
        sha: c.sha.slice(0, 7),
        message: firstLine(c.commit.message),
        date: c.commit.author?.date || c.commit.committer?.date,
        url: c.html_url,
      });
    }
  }

  commits.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { generated_at: new Date().toISOString(), projects, activity: commits.slice(0, ACTIVITY_LIMIT) };
}

function render(html, data, lang) {
  const { locale } = LOCALES[lang];
  // <span data-gh="repo.campo">fallback</span>
  html = html.replace(/(<([a-z]+)[^>]*\sdata-gh="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, open, _tag, key, text, close) => {
    const [repo, field] = key.split('.');
    const value = data.projects[repo]?.[field];
    return value ? open + esc(value) + close : m;
  });

  // <time data-gh-time="repo.campo" data-prefix="..." datetime="...">texto</time>
  html = html.replace(/<time([^>]*)\sdata-gh-time="([^"]+)"([^>]*)>[^<]*<\/time>/g, (m, a, key, b) => {
    const iso = key === 'generated_at' ? data.generated_at : data.projects[key.split('.')[0]]?.[key.split('.')[1]];
    if (!iso) return m;
    const attrs = (a + b).replace(/\sdatetime="[^"]*"/, '');
    const prefix = (attrs.match(/data-prefix="([^"]*)"/) || [])[1];
    return `<time${attrs} data-gh-time="${key}" datetime="${iso}">${prefix ? `${prefix} ${LOCALES[lang].in} ` : ''}${monthYear(iso, lang)}</time>`;
  });

  // Bloque de actividad reciente
  if (data.activity.length) {
    const rows = data.activity.map((c) =>
      `              <div class="log-row"><a href="${esc(c.url)}" rel="noopener">${esc(c.sha)}</a>` +
      `<span class="repo dv">${esc(c.repo)}</span><span class="msg">${esc(c.message)}</span>` +
      `<time class="when dim" data-date="${esc(c.date)}" datetime="${esc(c.date)}">${new Date(c.date).toLocaleDateString(locale, { timeZone: 'Europe/Madrid' })}</time></div>`
    ).join('\n');
    html = html.replace(/<!-- gh:activity -->[\s\S]*?<!-- \/gh:activity -->/, `<!-- gh:activity -->\n${rows}\n              <!-- /gh:activity -->`);
  }

  // JSON para la terminal interactiva (escapando "<" para no cerrar el <script>)
  html = html.replace(
    /<script type="application\/json" id="gh-data">[\s\S]*?<\/script>/,
    `<script type="application/json" id="gh-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
  );
  return html;
}

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const sitemapPath = join(OUT, 'sitemap.xml');
writeFileSync(sitemapPath, readFileSync(sitemapPath, 'utf8').replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`));

// Versionado de CSS/JS (?v=hash) para que un despliegue nuevo nunca mezcle
// HTML nuevo con recursos antiguos de la caché del navegador.
const assetHash = (rel) => createHash('sha256').update(readFileSync(join(OUT, rel))).digest('hex').slice(0, 10);
for (const { file } of [{ file: 'index.html' }, { file: 'en/index.html' }]) {
  const path = join(OUT, file);
  const html = readFileSync(path, 'utf8').replace(
    /((?:href|src)="(?:\.\.\/)?)(assets\/(?:css|js)\/[\w.-]+\.(?:css|js))"/g,
    (m, pre, rel) => `${pre}${rel}?v=${assetHash(rel)}"`
  );
  writeFileSync(path, html);
}

if (OFFLINE) {
  console.log('Build offline: _site/ sin datos de GitHub.');
} else {
  try {
    const data = await collect();
    mkdirSync(join(OUT, 'data'), { recursive: true });
    writeFileSync(join(OUT, 'data', 'github.json'), JSON.stringify(data, null, 2));
    for (const { file, lang } of PAGES) {
      const path = join(OUT, file);
      writeFileSync(path, render(readFileSync(path, 'utf8'), data, lang));
    }
    console.log(`Build OK: ${Object.keys(data.projects).length} proyectos, ${data.activity.length} commits recientes.`);
  } catch (err) {
    // Si GitHub falla, se publica igualmente con el contenido estático de respaldo.
    console.warn(`Aviso: sin datos de GitHub (${err.message}). Se publica el contenido estático.`);
  }
}
