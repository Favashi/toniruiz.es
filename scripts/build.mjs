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

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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
// La propia web cuenta en las estadísticas, pero no en la actividad reciente.
const ACTIVITY_SKIP = new Set(['toniruiz.es']);

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

// Total de elementos de un listado paginado leyendo la cabecera Link (per_page=1)
async function apiCount(path) {
  const res = await fetch(`https://api.github.com${path}${path.includes('?') ? '&' : '?'}per_page=1`, { headers });
  if (!res.ok) return 0;
  const last = (res.headers.get('link') || '').match(/[?&]page=(\d+)>; rel="last"/);
  return last ? Number(last[1]) : (await res.json()).length;
}

// Clona el repo y mide líneas de código fuente propio (sin dependencias de
// terceros ni minificados) y tests automáticos (plan(N) de pgTAP + test( de Playwright).
const CODE_EXT = /\.(js|mjs|ts|css|html|sql|php|py|sh|ya?ml)$/;
const CODE_SKIP = /(^|\/)(vendor|node_modules|dist|third_party)\/|\.min\.(js|css)$/;
function analyzeRepo(name) {
  const dir = mkdtempSync(join(tmpdir(), 'repo-'));
  try {
    execFileSync('git', ['clone', '-q', '--depth', '1', `https://github.com/${USER}/${name}.git`, dir], { stdio: 'ignore' });
    const files = execFileSync('git', ['-C', dir, 'ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    let loc = 0, tests = 0;
    for (const f of files) {
      if (!CODE_EXT.test(f) || CODE_SKIP.test(f)) continue;
      const text = readFileSync(join(dir, f), 'utf8');
      loc += text.split('\n').length;
      if (/(^|\/)tests?\/.*\.sql$/.test(f)) tests += Number((text.match(/\bplan\s*\(\s*(\d+)\s*\)/) || [])[1] || 0);
      if (/\.(spec|test)\.[mc]?[jt]s$/.test(f)) tests += (text.match(/^\s*test\(/gm) || []).length;
    }
    return { loc, tests };
  } catch {
    return { loc: 0, tests: 0 };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Cifras públicas de Escriba de la Marca: la misma RPC que usa su portada.
// URL y clave publishable se leen de su config.js para no desincronizarse.
// "scribes" y "supporters" se omiten a propósito hasta que lleguen a 50 y 20.
async function escribaShowcase() {
  try {
    const cfg = await (await fetch(`https://raw.githubusercontent.com/${USER}/escribadelamarca/main/js/config.js`)).text();
    const url = (cfg.match(/SUPABASE_URL\s*=\s*'([^']+)'/) || [])[1];
    const key = (cfg.match(/SUPABASE_ANON_KEY\s*=\s*'([^']+)'/) || [])[1];
    if (!url || !key) return null;
    const res = await fetch(`${url}/rest/v1/rpc/landing_showcase`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) return null;
    const d = await res.json();
    const out = { publications: d.publications, authors: d.authors, adventures: d.adventures, books_cataloged: d.books_cataloged };
    if (d.scribes >= 50) out.scribes = d.scribes;
    if (d.supporters >= 20) out.supporters = d.supporters;
    return out;
  } catch {
    return null;
  }
}

// URLs públicas que se comprueban en cada build (estado real en la terminal)
const HEALTH_URLS = {
  escribadelamarca: 'https://favashi.github.io/escribadelamarca/',
  'osr-manager': 'https://favashi.github.io/osr-manager/app/',
};
async function healthCheck(url) {
  if (!url) return null;
  const start = performance.now();
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'toniruiz.es-healthcheck' } });
    return { url, ok: res.ok, status: res.status, ms: Math.round(performance.now() - start), checked_at: new Date().toISOString() };
  } catch {
    return { url, ok: false, status: 0, ms: null, checked_at: new Date().toISOString() };
  }
}

// Foto de perfil de GitHub: se descarga en cada build para que nunca quede desfasada
async function syncAvatar() {
  const user = await api(`/users/${USER}`);
  if (!user?.avatar_url) return false;
  const get = async (size) => {
    const res = await fetch(`${user.avatar_url}${user.avatar_url.includes('?') ? '&' : '?'}s=${size}`);
    if (!res.ok || !(res.headers.get('content-type') || '').startsWith('image/jpeg')) throw new Error('avatar');
    return Buffer.from(await res.arrayBuffer());
  };
  try {
    const big = await get(460);
    const hero = await get(352);
    writeFileSync(join(OUT, 'assets/img/avatar.jpg'), big);
    writeFileSync(join(OUT, 'assets/img/avatar-352.jpg'), hero);
    const v = createHash('sha256').update(hero).digest('hex').slice(0, 10);
    for (const { file } of PAGES) {
      const path = join(OUT, file);
      writeFileSync(path, readFileSync(path, 'utf8').replace(/assets\/img\/avatar-176\.webp/g, `assets/img/avatar-352.jpg?v=${v}`));
    }
    return true;
  } catch {
    return false;
  }
}

// Content-Security-Policy por <meta> (GitHub Pages no permite cabeceras propias).
// El script inline de tema se autoriza por su hash, calculado aquí.
function applyCsp() {
  for (const { file } of PAGES) {
    const path = join(OUT, file);
    let html = readFileSync(path, 'utf8');
    const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
      .map(([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`);
    const csp = [
      "default-src 'self'",
      `script-src 'self' ${hashes.join(' ')} https://gc.zgo.at`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://toniruiz.goatcounter.com",
      "connect-src 'self' https://toniruiz.goatcounter.com",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'none'",
    ].join('; ');
    html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n  <meta http-equiv="Content-Security-Policy" content="${csp}">`);
    html = html.replace('<meta name="author"', '<meta name="referrer" content="strict-origin-when-cross-origin">\n  <meta name="author"');
    writeFileSync(path, html);
  }
}

// /.well-known/security.txt (RFC 9116) con caducidad renovada en cada build
function writeSecurityTxt() {
  const expires = new Date(Date.now() + 180 * 86400000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  mkdirSync(join(OUT, '.well-known'), { recursive: true });
  writeFileSync(join(OUT, '.well-known', 'security.txt'), [
    'Contact: mailto:info@toniruiz.es',
    `Expires: ${expires}`,
    'Preferred-Languages: es, en',
    'Canonical: https://toniruiz.es/.well-known/security.txt',
    '',
  ].join('\n'));
}

// Colores de lenguaje de GitHub (linguist)
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', CSS: '#663399', HTML: '#e34c26', PLpgSQL: '#336790',
  PHP: '#4f5d95', Python: '#3572a5', Go: '#00add8', Shell: '#89e051', Makefile: '#427819', Dockerfile: '#384d54',
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const firstLine = (msg) => {
  const line = msg.split('\n')[0].trim();
  return line.length > 72 ? line.slice(0, 71) + '…' : line;
};
// Páginas generadas y su idioma
const PAGES = [{ file: 'index.html', lang: 'es' }, { file: 'en/index.html', lang: 'en' }];
const LOCALES = { es: { locale: 'es-ES', in: 'en' }, en: { locale: 'en-GB', in: 'in' } };
const STRINGS = {
  es: { languages: 'lenguajes', totals: 'totales', releases: 'últimas releases', workflows: 'workflows de CI', loc: 'líneas de código', other: 'otros' },
  en: { languages: 'languages', totals: 'totals', releases: 'latest releases', workflows: 'CI workflows', loc: 'lines of code', other: 'other' },
};
const monthYear = (iso, lang) => new Date(iso).toLocaleDateString(LOCALES[lang].locale, { month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' });

async function collect() {
  const projects = {};
  const commits = [];
  const releases = [];
  const languages = {};
  const stats = { commits: 0, releases: 0, workflows: 0, loc: 0, tests: 0 };

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

    const allReleases = (await api(`/repos/${USER}/${name}/releases?per_page=100`)) || [];
    const langs = (await api(`/repos/${USER}/${name}/languages`)) || {};
    const workflows = await api(`/repos/${USER}/${name}/actions/workflows`);
    const repoCommits = await apiCount(`/repos/${USER}/${name}/commits`);
    const { loc, tests } = analyzeRepo(name);
    const health = await healthCheck(HEALTH_URLS[name]);

    for (const r of allReleases) {
      if (!r.draft) releases.push({ repo: name, tag: r.tag_name, date: r.published_at, url: r.html_url });
    }
    for (const [lang, bytes] of Object.entries(langs)) languages[lang] = (languages[lang] || 0) + bytes;
    stats.commits += repoCommits;
    stats.releases += allReleases.filter((r) => !r.draft).length;
    stats.workflows += workflows?.total_count || 0;
    stats.loc += loc;
    stats.tests += tests;
    projects[name].commits = repoCommits;
    projects[name].releases = allReleases.filter((r) => !r.draft).length;
    projects[name].loc = loc;
    projects[name].tests = tests;
    if (health) projects[name].health = health;
    if (allReleases.length) {
      const first = allReleases.map((r) => new Date(r.published_at)).sort((a, b) => a - b)[0];
      projects[name].first_release_at = first.toISOString();
      projects[name].release_days = Math.max(1, Math.ceil((Date.now() - first) / 86400000));
    }

    for (const c of ACTIVITY_SKIP.has(name) ? [] : recent) {
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
  releases.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Lenguajes en porcentaje: los 6 principales + "otros"
  const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 6).map(([name, bytes]) => ({ name, pct: (bytes / total) * 100, color: LANG_COLORS[name] || '#8a8a93' }));
  const rest = sorted.slice(6).reduce((a, [, b]) => a + b, 0);
  if (rest / total >= 0.005) top.push({ name: 'other', pct: (rest / total) * 100, color: '#3a3a3f' });

  return {
    generated_at: new Date().toISOString(),
    projects,
    stats,
    escriba: await escribaShowcase(),
    languages: top,
    releases: releases.slice(0, 5),
    activity: commits.slice(0, ACTIVITY_LIMIT),
  };
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

  // <b data-stat="stats.loc" data-fmt="compact">fallback</b>
  const pick = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), data);
  html = html.replace(/(<([a-z]+)([^>]*)\sdata-stat="([^"]+)"([^>]*)>)([^<]*)(<\/\2>)/g, (m, open, _t, a1, key, a2, text, close) => {
    const value = pick(key);
    if (typeof value !== 'number' || !value) return m;
    const compact = /data-fmt="compact"/.test(a1 + a2);
    const fmt = new Intl.NumberFormat(locale, compact ? { notation: 'compact', maximumFractionDigits: 0 } : {});
    return open + esc(fmt.format(value)) + close;
  });

  // Panel de GitHub: lenguajes, contadores y últimas releases
  if (data.languages?.length) {
    const t = STRINGS[lang];
    const nf = new Intl.NumberFormat(locale);
    const pad = '              ';
    const bar = data.languages.map((l) =>
      `<i style="width:${l.pct.toFixed(2)}%;background:${l.color}" title="${esc(l.name === 'other' ? t.other : l.name)} ${l.pct.toFixed(1)}%"></i>`).join('');
    const legend = data.languages.map((l) =>
      `<span><i style="background:${l.color}"></i>${esc(l.name === 'other' ? t.other : l.name)} <span class="dim">${l.pct.toFixed(1)}%</span></span>`).join('');
    const counters = [
      [data.stats.commits, 'commits'], [data.stats.releases, 'releases'],
      [data.stats.workflows, t.workflows], [data.stats.loc, t.loc],
    ].filter(([n]) => n).map(([n, label]) => `<span><b>${nf.format(n)}</b> ${label}</span>`).join('');
    const rels = data.releases.map((r) =>
      `${pad}<div class="log-row rel-row"><a href="${esc(r.url)}" rel="noopener">${esc(r.tag)}</a><span class="repo dv">${esc(r.repo)}</span>` +
      `<time class="when dim" data-date="${esc(r.date)}" datetime="${esc(r.date)}">${new Date(r.date).toLocaleDateString(locale, { timeZone: 'Europe/Madrid' })}</time></div>`).join('\n');
    const panel = [
      `${pad}<p class="gh-h dim"># ${t.languages}</p>`,
      `${pad}<div class="lang-bar" role="img" aria-label="${esc(data.languages.map((l) => `${l.name === 'other' ? t.other : l.name} ${l.pct.toFixed(0)}%`).join(', '))}">${bar}</div>`,
      `${pad}<div class="lang-legend">${legend}</div>`,
      `${pad}<p class="gh-h dim"># ${t.totals}</p>`,
      `${pad}<div class="gh-counters">${counters}</div>`,
      data.releases.length ? `${pad}<p class="gh-h dim"># ${t.releases}</p>\n${rels}` : '',
    ].filter(Boolean).join('\n');
    html = html.replace(/<!-- gh:stats -->[\s\S]*?<!-- \/gh:stats -->/, `<!-- gh:stats -->\n${panel}\n              <!-- /gh:stats -->`);
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
    const avatar = await syncAvatar();
    console.log(`Build OK: ${Object.keys(data.projects).length} proyectos, ${data.activity.length} commits recientes${avatar ? ', avatar actualizado' : ''}.`);
  } catch (err) {
    // Si GitHub falla, se publica igualmente con el contenido estático de respaldo.
    console.warn(`Aviso: sin datos de GitHub (${err.message}). Se publica el contenido estático.`);
  }
}

applyCsp();
writeSecurityTxt();
