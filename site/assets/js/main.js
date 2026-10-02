(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LANG = root.lang === 'en' ? 'en' : 'es';
  const LOCALE = LANG === 'en' ? 'en-GB' : 'es-ES';

  /* ---------- Textos por idioma ---------- */
  const I18N = {
    es: {
      now: 'ahora mismo',
      copied: 'Copiado',
      copy: 'Copiar',
      inputLabel: 'Escribe un comando',
      sections: { perfil: '#perfil', profile: '#perfil', stack: '#stack', proyectos: '#proyectos', projects: '#proyectos', contacto: '#contacto', contact: '#contacto' },
      neofetch: [
        ['Rol', 'Developer &amp; DevOps'],
        ['Uptime', '+20 años programando'],
        ['Lenguajes', 'PHP · Python · Go · .NET · Node.js'],
        ['Cloud', 'AWS · GCP · Azure'],
        ['Contenedores', 'Docker · Podman · Kubernetes'],
        ['IaC', 'Terraform · Ansible'],
        ['CI/CD', 'GitHub Actions · GitLab CI · Bitbucket · Jenkins'],
        ['Shell', 'Bash · zsh'],
        ['Observabilidad', 'Prometheus · Grafana · ELK'],
        ['Idiomas', 'Español · Català · English']
      ],
      help: [
        'Comandos disponibles',
        ['whoami', 'quién soy'],
        ['neofetch', 'resumen del sistema'],
        ['skills', 'stack técnico (dev + ops)'],
        ['projects', 'proyectos en producción'],
        ['kubectl get pods', 'estado de los proyectos'],
        ['git log', 'actividad reciente en GitHub'],
        ['status', 'estado real de los servicios'],
        ['contact', 'cómo hablar conmigo'],
        ['cd <sección>', 'ir a perfil, stack, proyectos o contacto'],
        ['lang', 'switch to English'],
        ['theme', 'cambiar tema claro/oscuro'],
        ['clear', 'limpiar la terminal']
      ],
      whoami: 'Escribo el código. Y lo llevo a producción.',
      skills: {
        dev: [['backend', 'PHP, Python, Go, .NET, Node.js'], ['arquitectura', 'REST, GraphQL, microservicios, hexagonal, DDD'], ['datos', 'PostgreSQL, MySQL, SQL Server, NoSQL, dbt'], ['frontend', 'JavaScript, React, AngularJS, PWA'], ['calidad', 'PHPUnit, pgTAP, Playwright'], ['automatización', 'n8n, Make, Bash'], ['ia', 'agentes, RAG, LLM']],
        ops: [['cloud', 'AWS, GCP, Azure'], ['contenedores', 'Docker, Podman, Kubernetes, Compose, Nginx'], ['ci/cd', 'GitHub Actions, GitLab CI, Bitbucket Pipelines, Jenkins'], ['iac', 'Terraform, Ansible'], ['observab.', 'Prometheus, Grafana, ELK']]
      },
      projects: { escriba: 'PWA para coleccionistas de la Marca del Este', osr: 'ayuda de mesa para directores de juego OSR', open: 'abrir app', code: 'código' },
      noData: 'Sin datos ahora mismo. Mira ',
      theme: (t) => 'Tema cambiado a <span class="b">' + (t === 'dark' ? 'oscuro' : 'claro') + '</span>.',
      ls: ['perfil/', 'stack/', 'proyectos/', 'contacto/'],
      readme: 'Escribe <span class="ok">help</span> para ver los comandos. O baja con el scroll, también vale.',
      uptime: 'up +20 años, load average: 0.42, 0.37, 0.31',
      exit: 'logout… es broma. Sigue bajando ↓',
      gitStatus: 'En la rama <span class="b">main</span>\nTu rama está actualizada con <span class="dv">origin/main</span>.\n\nnada para hacer commit, el árbol de trabajo está limpio',
      makeHelp: [['up', 'levanta el entorno'], ['test', 'ejecuta los tests'], ['deploy', 'hoy no, que es viernes']],
      sudo: 'toni no está en el archivo sudoers. Se informará de este incidente.',
      rm: 'Buen intento. Hay backups.',
      noDir: 'cd: no existe el directorio: ',
      notFound: '— prueba con',
      langSwitch: 'Switching to English…',
      intro: '<span class="dim">Escribe</span> <span class="ok">help</span> <span class="dim">para ver los comandos disponibles.</span>',
      status: { head: ['SERVICIO', 'ESTADO', 'HTTP', 'LATENCIA', 'COMPROBADO'], up: 'operativo', down: 'caído', none: 'Sin comprobaciones recientes.' },
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
      // El aviso se muestra en el idioma de destino
      hint: { text: 'This site is also available in', link: 'English →', close: 'Dismiss' }
    },
    en: {
      now: 'just now',
      copied: 'Copied',
      copy: 'Copy',
      inputLabel: 'Type a command',
      sections: { profile: '#profile', perfil: '#profile', stack: '#stack', projects: '#projects', proyectos: '#projects', contact: '#contact', contacto: '#contact' },
      neofetch: [
        ['Role', 'Developer &amp; DevOps'],
        ['Uptime', '20+ years coding'],
        ['Languages', 'PHP · Python · Go · .NET · Node.js'],
        ['Cloud', 'AWS · GCP · Azure'],
        ['Containers', 'Docker · Podman · Kubernetes'],
        ['IaC', 'Terraform · Ansible'],
        ['CI/CD', 'GitHub Actions · GitLab CI · Bitbucket · Jenkins'],
        ['Shell', 'Bash · zsh'],
        ['Observability', 'Prometheus · Grafana · ELK'],
        ['Speaks', 'Spanish · Catalan · English']
      ],
      help: [
        'Available commands',
        ['whoami', 'who I am'],
        ['neofetch', 'system summary'],
        ['skills', 'tech stack (dev + ops)'],
        ['projects', 'projects in production'],
        ['kubectl get pods', 'project status'],
        ['git log', 'recent GitHub activity'],
        ['status', 'live service status'],
        ['contact', 'how to reach me'],
        ['cd <section>', 'go to profile, stack, projects or contact'],
        ['lang', 'cambiar a español'],
        ['theme', 'toggle light/dark theme'],
        ['clear', 'clear the terminal']
      ],
      whoami: 'I write the code. And I ship it to production.',
      skills: {
        dev: [['backend', 'PHP, Python, Go, .NET, Node.js'], ['architecture', 'REST, GraphQL, microservices, hexagonal, DDD'], ['data', 'PostgreSQL, MySQL, SQL Server, NoSQL, dbt'], ['frontend', 'JavaScript, React, AngularJS, PWA'], ['quality', 'PHPUnit, pgTAP, Playwright'], ['automation', 'n8n, Make, Bash'], ['ai', 'agents, RAG, LLM']],
        ops: [['cloud', 'AWS, GCP, Azure'], ['containers', 'Docker, Podman, Kubernetes, Compose, Nginx'], ['ci/cd', 'GitHub Actions, GitLab CI, Bitbucket Pipelines, Jenkins'], ['iac', 'Terraform, Ansible'], ['observab.', 'Prometheus, Grafana, ELK']]
      },
      projects: { escriba: 'PWA for Aventuras en la Marca del Este collectors', osr: 'table assistant for OSR game masters', open: 'open app', code: 'code' },
      noData: 'No data right now. See ',
      theme: (t) => 'Theme switched to <span class="b">' + t + '</span>.',
      ls: ['profile/', 'stack/', 'projects/', 'contact/'],
      readme: 'Type <span class="ok">help</span> to see the commands. Or just scroll down, that works too.',
      uptime: 'up 20+ years, load average: 0.42, 0.37, 0.31',
      exit: 'logout… just kidding. Keep scrolling ↓',
      gitStatus: 'On branch <span class="b">main</span>\nYour branch is up to date with <span class="dv">origin/main</span>.\n\nnothing to commit, working tree clean',
      makeHelp: [['up', 'start the environment'], ['test', 'run the tests'], ['deploy', 'not today, it\'s Friday']],
      sudo: 'toni is not in the sudoers file. This incident will be reported.',
      rm: 'Nice try. There are backups.',
      noDir: 'cd: no such file or directory: ',
      notFound: '— try',
      langSwitch: 'Cambiando a español…',
      intro: '<span class="dim">Type</span> <span class="ok">help</span> <span class="dim">to see the available commands.</span>',
      status: { head: ['SERVICE', 'STATUS', 'HTTP', 'LATENCY', 'CHECKED'], up: 'up', down: 'down', none: 'No recent checks.' },
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      hint: { text: 'Esta web también está en', link: 'español →', close: 'Cerrar' }
    }
  };
  const T = I18N[LANG];

  /* ---------- Tema ---------- */
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.dataset.theme || (mq.matches ? 'dark' : 'light');
  const toggleTheme = () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    return next;
  };
  document.getElementById('theme').addEventListener('click', toggleTheme);
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Datos de GitHub (generados en el build) ---------- */
  let gh = null;
  try { gh = JSON.parse(document.getElementById('gh-data').textContent); } catch (e) {}
  const rtf = new Intl.RelativeTimeFormat(LANG, { numeric: 'auto' });
  const ago = (iso) => {
    const diff = (new Date(iso) - Date.now()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [u, sec] of units) if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), u);
    return T.now;
  };
  const shortAge = (iso) => {
    const d = Math.max(0, (Date.now() - new Date(iso)) / 86400000);
    return d >= 1 ? Math.floor(d) + 'd' : Math.max(1, Math.floor(d * 24)) + 'h';
  };
  document.querySelectorAll('time[data-gh-time]').forEach((t) => {
    const iso = t.getAttribute('datetime');
    if (!iso || isNaN(new Date(iso))) return;
    t.title = new Date(iso).toLocaleString(LOCALE);
    t.textContent = (t.dataset.prefix ? t.dataset.prefix + ' ' : '') + ago(iso);
  });
  document.querySelectorAll('.log-row .when[data-date]').forEach((el) => { el.textContent = ago(el.dataset.date); });

  /* ---------- Copiar email ---------- */
  const copyBtn = document.getElementById('copy');
  copyBtn.addEventListener('click', async () => {
    const lbl = copyBtn.querySelector('.lbl');
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      lbl.textContent = T.copied;
    } catch (e) {
      window.location.href = 'mailto:' + copyBtn.dataset.email;
    }
    setTimeout(() => { lbl.textContent = T.copy; }, 1800);
  });

  /* ---------- Analítica (GoatCounter, sin cookies) ---------- */
  const track = (path, title) => {
    if (window.goatcounter && typeof window.goatcounter.count === 'function') {
      window.goatcounter.count({ path, title: title || path, event: true });
    }
  };

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  /* ---------- Sugerencia de idioma (sin redirigir) ---------- */
  const altLink = document.querySelector('link[rel="alternate"][hreflang="' + (LANG === 'en' ? 'es' : 'en') + '"]');
  const switchLink = document.querySelector('.lang-switch');
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; };
  if (switchLink) switchLink.addEventListener('click', () => store('lang-choice', switchLink.getAttribute('hreflang')));
  const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map((l) => l.toLowerCase());
  const prefersSpanish = langs.some((l) => l.startsWith('es') || l.startsWith('ca'));
  const shouldHint = LANG === 'es' ? !prefersSpanish : (langs[0] || '').match(/^(es|ca)/);
  if (altLink && switchLink && shouldHint && !store('lang-choice') && !store('lang-hint-dismissed')) {
    const hint = document.createElement('div');
    hint.className = 'lang-hint';
    hint.setAttribute('role', 'region');
    hint.setAttribute('lang', LANG === 'en' ? 'es' : 'en');
    hint.setAttribute('aria-label', T.hint.text);
    hint.innerHTML = '<span>' + T.hint.text + '</span>' +
      '<a href="' + switchLink.getAttribute('href') + '" hreflang="' + switchLink.getAttribute('hreflang') + '">' + T.hint.link + '</a>' +
      '<button type="button" aria-label="' + T.hint.close + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    hint.querySelector('a').addEventListener('click', () => { store('lang-choice', switchLink.getAttribute('hreflang')); track('lang-hint/accept'); });
    hint.querySelector('button').addEventListener('click', () => { store('lang-hint-dismissed', '1'); hint.remove(); track('lang-hint/dismiss'); });
    setTimeout(() => document.body.appendChild(hint), 1500);
  }

  /* ---------- Aparición al hacer scroll ---------- */
  const pipeline = document.getElementById('pipeline');
  const runPipeline = () => {
    if (pipeline.classList.contains('run')) return;
    pipeline.querySelectorAll('svg').forEach((m, i) => { m.style.transitionDelay = (reduced ? 0 : 300 + i * 220) + 'ms'; });
    pipeline.classList.add('run');
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target.contains(pipeline)) runPipeline();
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    runPipeline();
  }

  /* ---------- Terminal interactiva ---------- */
  const out = document.getElementById('out');
  out.setAttribute('aria-live', 'off'); // se activa al terminar la intro tecleada
  const PROMPT = '<span class="ok">toni@barcelona</span>:<span class="dv">~</span>$ ';
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const inputLine = document.createElement('div');
  inputLine.className = 'cmd-line';
  inputLine.innerHTML = '<span class="prompt">' + PROMPT + '</span>';
  const field = document.createElement('input');
  field.className = 'cmd-input';
  field.type = 'text';
  field.autocomplete = 'off';
  field.autocapitalize = 'off';
  field.spellcheck = false;
  field.setAttribute('aria-label', T.inputLabel);
  field.setAttribute('enterkeyhint', 'send');
  inputLine.appendChild(field);
  out.appendChild(inputLine);

  const print = (html, tag) => {
    const el = document.createElement(tag || 'pre');
    el.innerHTML = html;
    out.insertBefore(el, inputLine);
  };
  const scrollEnd = () => { out.scrollTop = out.scrollHeight; };

  const LOGO = [
    '<span class="ok">████████╗██████╗ </span>',
    '<span class="ok">╚══██╔══╝██╔══██╗</span>',
    '<span class="ok">   ██║   ██████╔╝</span>',
    '<span class="dv">   ██║   ██╔══██╗</span>',
    '<span class="dv">   ██║   ██║  ██║</span>',
    '<span class="dv">   ╚═╝   ╚═╝  ╚═╝</span>'
  ].join('\n');
  const kv = (k, v) => '<span class="ok b">' + k + '</span>: ' + v;
  const NEOFETCH =
    '<pre class="neo-logo">' + LOGO + '</pre><div><pre>' + [
      '<span class="b">toni</span>@<span class="b">barcelona</span>',
      '<span class="dim">──────────────────</span>'
    ].concat(T.neofetch.map(([k, v]) => kv(k, v))).join('\n') +
    '</pre><div class="neo-colors" aria-hidden="true">' +
    ['#1c1c1f', '#ff6b6b', '#3ee6a8', '#ffd166', '#5e9bff', '#9d9bff', '#5ee6e6', '#d4d4d8']
      .map((c) => '<i style="background:' + c + '"></i>').join('') +
    '</div></div>';

  const link = (href, text) => '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>';
  const table = (rows, width) => rows.map(([k, v]) => '  ' + k.padEnd(width) + v).join('\n');
  const otherLang = document.querySelector('link[rel="alternate"][hreflang="' + (LANG === 'en' ? 'es' : 'en') + '"]');

  const commands = {
    help: () => '<span class="b">' + T.help[0] + '</span>\n' + T.help.slice(1).map(([c, d]) => {
      const m = c.match(/^(\S+)( <.+>)?$/);
      const name = m && m[2] ? '<span class="ok">' + m[1] + '</span> <span class="dim">' + esc(m[2].trim()) + '</span>' : '<span class="ok">' + c + '</span>';
      return '  ' + name + ' '.repeat(Math.max(1, 18 - c.length)) + d;
    }).join('\n') + '\n\n<span class="dim">' + (LANG === 'en' ? 'psst… there are secret commands. Try' : 'psst… hay comandos secretos. Prueba') + '</span> <span class="ok">secrets</span>',
    whoami: () => 'Toni Ruiz — <span class="dv">Developer</span> &amp; <span class="ok">DevOps</span> · Barcelona\n' + T.whoami,
    neofetch: () => ({ html: NEOFETCH, tag: 'div', cls: 'neo' }),
    skills: () => '<span class="dv b"># dev</span>\n' + table(T.skills.dev, 16) + '\n<span class="ok b"># ops</span>\n' + table(T.skills.ops, 16),
    projects: () => [
      '<span class="b">escribadelamarca</span>  ' + T.projects.escriba,
      '                  ' + link('https://favashi.github.io/escribadelamarca/?ref=toniruiz-es', T.projects.open) + ' · ' + link('https://github.com/Favashi/escribadelamarca', T.projects.code),
      '<span class="b">osr-manager</span>       ' + T.projects.osr,
      '                  ' + link('https://favashi.github.io/osr-manager/app/?ref=toniruiz-es', T.projects.open) + ' · ' + link('https://github.com/Favashi/osr-manager', T.projects.code)
    ].join('\n'),
    'kubectl get pods': () => {
      const p = (gh && gh.projects) || {};
      const row = (name, key, fallbackVer) => {
        const d = p[key] || {};
        const pod = (name + '-' + (d.version || fallbackVer)).replace(/\./g, '-');
        const age = d.released_at || d.pushed_at ? shortAge(d.released_at || d.pushed_at) : 'stable';
        const down = d.health && !d.health.ok;
        const status = down ? '<span class="err">CrashLoopBackOff</span>' : '<span class="ok">Running</span>         ';
        return pod.padEnd(26) + (down ? '0/1' : '1/1') + '     ' + status + '   0          ' + age;
      };
      return [
        '<span class="dim">' + 'NAME'.padEnd(26) + 'READY   STATUS             RESTARTS   AGE</span>',
        row('escribadelamarca', 'escribadelamarca', 'v1.14'),
        row('osr-manager', 'osr-manager', 'v0.4'),
        row('toniruiz-es', 'toniruiz.es', 'latest')
      ].join('\n');
    },
    status: () => {
      const p = (gh && gh.projects) || {};
      const rows = Object.entries(p).filter(([, d]) => d.health);
      if (!rows.length) return T.status.none;
      const h = T.status.head;
      return ['<span class="dim">' + h[0].padEnd(19) + h[1].padEnd(13) + h[2].padEnd(6) + h[3].padEnd(10) + h[4] + '</span>']
        .concat(rows.map(([name, d]) => {
          const st = d.health.ok ? '<span class="ok">● ' + T.status.up.padEnd(10) + '</span>' : '<span class="err">● ' + T.status.down.padEnd(10) + '</span>';
          const ms = d.health.ms != null ? (d.health.ms + ' ms').padEnd(10) : '—'.padEnd(10);
          return name.padEnd(19) + st + ' ' + String(d.health.status || '—').padEnd(6) + ms + ago(d.health.checked_at);
        })).join('\n');
    },
    'git log': () => {
      const list = (gh && gh.activity) || [];
      if (!list.length) return T.noData + link('https://github.com/Favashi', 'github.com/Favashi');
      return list.map((c) => '<span class="warn">' + esc(c.sha) + '</span> <span class="dv">(' + esc(c.repo) + ')</span> ' + esc(c.message) + ' <span class="dim">— ' + ago(c.date) + '</span>').join('\n');
    },
    contact: () => [
      'email     ' + link('mailto:info@toniruiz.es', 'info@toniruiz.es'),
      'linkedin  ' + link('https://www.linkedin.com/in/toniruizfernandez', 'toniruizfernandez'),
      'github    ' + link('https://github.com/Favashi', 'Favashi')
    ].join('\n'),
    lang: () => {
      store('lang-choice', LANG === 'en' ? 'es' : 'en');
      if (otherLang) setTimeout(() => { window.location.href = otherLang.getAttribute('href'); }, 400);
      return T.langSwitch;
    },
    theme: () => T.theme(toggleTheme()),
    ls: () => T.ls.map((d) => '<span class="dv b">' + d + '</span>').join('  ') + '  README.md',
    'cat readme.md': () => T.readme,
    pwd: () => '/home/toni',
    date: () => new Date().toLocaleString(LOCALE),
    uptime: () => T.uptime,
    exit: () => T.exit,
    'git status': () => T.gitStatus,
    'terraform plan': () => '<span class="ok">No changes.</span> Your infrastructure matches the configuration.',
    'make help': () => T.makeHelp.map(([k, v]) => '  <span class="ok">' + k.padEnd(8) + '</span> ' + v).join('\n')
  };
  const aliases = {
    '?': 'help', proyectos: 'projects', contacto: 'contact', stack: 'skills', idioma: 'lang', language: 'lang',
    'cat readme': 'cat readme.md', 'k get pods': 'kubectl get pods'
  };

  /* ---------- Comandos secretos (no salen en help ni en el autocompletado) ---------- */
  const L = (es, en) => (LANG === 'en' ? en : es);
  const printText = (text, cls) => {
    const el = document.createElement('pre');
    if (cls) el.className = cls;
    el.textContent = text;
    out.insertBefore(el, inputLine);
    return el;
  };
  let vimMode = false;

  const TRAIN = [
    '      ====        ________                ___________ ',
    '  _D _|  |_______/        \\__I_I_____===__|_________| ',
    '   |(_)---  |   H\\________/ |   |        =|___ ___|   ',
    '   /     |  |   H  |  |     |   |         ||_| |_||   ',
    '  |      |  |   H  |__--------------------| [___] |   ',
    '  | ________|___H__/__|_____/[][]~\\_______|       |   ',
    '  |/ |   |-----------I_____I [][] []  D   |=======|__ ',
    '__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ',
    ' |/-=|___|=    ||    ||    ||    |_____/~\\___/        ',
    '  \\_/      \\O=====O=====O=====O_/      \\_/            '
  ];
  const sl = () => {
    const el = printText('', 'ok');
    const cols = Math.max(40, Math.floor(out.clientWidth / 8.6));
    const width = TRAIN[0].length;
    const frame = (off) => TRAIN.map((l) => (' '.repeat(Math.max(0, off)) + l.slice(Math.max(0, -off))).slice(0, cols)).join('\n');
    if (reduced) { el.textContent = frame(2); return; }
    let off = cols;
    const timer = setInterval(() => {
      el.textContent = frame(off);
      scrollEnd();
      if (--off < -width) { clearInterval(timer); el.remove(); print('<span class="dim">' + L('🚂 chu-chu. Querías escribir «ls».', '🚂 choo-choo. You meant «ls».') + '</span>'); scrollEnd(); }
    }, 35);
  };

  const cowsay = (msg) => {
    const words = (msg || L('Muuu… despliega en viernes bajo tu responsabilidad.', 'Mooo… deploy on Friday at your own risk.')).split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > 36) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    }
    if (cur) lines.push(cur);
    const w = Math.max(...lines.map((l) => l.length));
    const body = lines.length === 1 ? ['< ' + lines[0] + ' >'] : lines.map((l, i) => {
      const [a, b] = i === 0 ? ['/', '\\'] : i === lines.length - 1 ? ['\\', '/'] : ['|', '|'];
      return a + ' ' + l.padEnd(w) + ' ' + b;
    });
    printText([' ' + '_'.repeat(w + 2)].concat(body, [' ' + '-'.repeat(w + 2),
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||']).join('\n'));
  };

  const FORTUNES = L([
    '«Funciona en mi máquina.» — Todos, alguna vez',
    'Si duele, hazlo más a menudo. — Principio de la entrega continua',
    'Hay dos problemas difíciles en informática: invalidar cachés, poner nombres y los errores por uno.',
    'Todo falla, todo el tiempo. — Werner Vogels',
    'El código que no existe no tiene bugs.',
    'Un buen dashboard vale más que mil logs.',
    'Primero haz que funcione, luego que sea correcto y luego que sea rápido. — Kent Beck',
    'Los dados no mienten. Los directores de juego, a veces.'
  ], [
    '"It works on my machine." — Everyone, at some point',
    'If it hurts, do it more often. — Continuous delivery principle',
    'There are two hard things in computer science: cache invalidation, naming things and off-by-one errors.',
    'Everything fails, all the time. — Werner Vogels',
    'Code that does not exist has no bugs.',
    'A good dashboard is worth a thousand logs.',
    'Make it work, make it right, make it fast. — Kent Beck',
    'Dice never lie. Game masters sometimes do.'
  ]);

  const roll = (expr) => {
    const m = (expr || 'd20').replace(/\s+/g, '').match(/^(\d*)d(\d+|%)([+-]\d+)?$/i);
    if (!m) return L('Uso: roll 2d6+1 · roll d20 · roll d%', 'Usage: roll 2d6+1 · roll d20 · roll d%');
    const n = Math.min(Number(m[1] || 1), 50);
    const sides = m[2] === '%' ? 100 : Math.min(Number(m[2]), 1000);
    const mod = Number(m[3] || 0);
    if (!n || !sides) return L('Esos dados no existen ni en el Plano Astral.', 'Those dice do not exist, not even on the Astral Plane.');
    const rolls = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * sides));
    const total = rolls.reduce((a, b) => a + b, 0) + mod;
    let note = '';
    if (n === 1 && sides === 20 && rolls[0] === 20) note = ' <span class="ok">' + L('¡CRÍTICO! 🐉', 'CRITICAL HIT! 🐉') + '</span>';
    if (n === 1 && sides === 20 && rolls[0] === 1) note = ' <span class="err">' + L('Pifia. El kobold se ríe.', 'Fumble. The kobold laughs.') + '</span>';
    return '🎲 ' + esc(expr || 'd20') + ' → [' + rolls.join(', ') + ']' + (mod ? (mod > 0 ? ' + ' : ' − ') + Math.abs(mod) : '') + ' = <span class="b">' + total + '</span>' + note;
  };

  const matrix = () => {
    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ01010110';
    const cols = Math.max(30, Math.floor(out.clientWidth / 8.6));
    const line = () => Array.from({ length: cols }, () => (Math.random() < 0.55 ? chars[Math.floor(Math.random() * chars.length)] : ' ')).join('');
    if (reduced) { printText(Array.from({ length: 6 }, line).join('\n'), 'ok'); return; }
    let i = 0;
    const timer = setInterval(() => {
      printText(line(), 'ok');
      scrollEnd();
      if (++i > 18) { clearInterval(timer); print('<span class="dim">' + L('Despierta, Neo… el clúster te tiene.', 'Wake up, Neo… the cluster has you.') + '</span>'); scrollEnd(); }
    }, 70);
  };

  // Devuelve true si la entrada era un comando secreto
  const easterEgg = (key, input) => {
    const egg = (name, fn) => { track('terminal/egg-' + name, 'Easter egg: ' + name); const r = fn(); if (typeof r === 'string') print(r); return true; };
    if (vimMode) {
      if ([':q', ':q!', ':wq', ':x', 'zz'].includes(key)) { vimMode = false; return egg('vim-exit', () => '<span class="ok">' + L('Has salido de vim. Muy pocos lo consiguen. 🏆', 'You exited vim. Very few make it. 🏆') + '</span>'); }
      print('<span class="err">E37: No write since last change (add ! to override)</span>');
      return true;
    }
    if (key === 'sudo make me a sandwich') return egg('sandwich', () => 'Okay. 🥪 <span class="dim">(xkcd 149)</span>');
    if (key === 'make me a sandwich') return egg('sandwich-no', () => 'What? Make it yourself.');
    if (key === 'sl') return egg('sl', sl);
    if (key === 'cowsay' || key.startsWith('cowsay ')) return egg('cowsay', () => cowsay(input.slice(6).trim()));
    if (key === 'fortune') return egg('fortune', () => FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
    if (key === 'roll' || key.startsWith('roll ') || /^\d*d(\d+|%)([+-]\d+)?$/.test(key)) return egg('roll', () => roll(key.startsWith('roll') ? key.slice(4).trim() : key));
    if (key === 'matrix') return egg('matrix', matrix);
    if (key === 'xyzzy') return egg('xyzzy', () => L('No pasa nada.', 'Nothing happens.'));
    if (key === '42' || key === 'answer') return egg('42', () => L('42. Ahora solo falta saber cuál era la pregunta.', '42. Now you just need to know the question.'));
    if (key === 'hello there') return egg('kenobi', () => 'General Kenobi! ⚔️');
    if (key === 'coffee' || key === 'brew coffee' || key === 'make coffee') return egg('teapot', () => '<span class="warn">HTTP 418 I\'m a teapot</span> ☕ <span class="dim">(RFC 2324)</span>');
    if (key === 'git blame') return egg('blame', () => L('Toni. Siempre es Toni.', 'Toni. It is always Toni.'));
    if (key.startsWith('kubectl delete')) return egg('kubectl-delete', () => L('pod "escribadelamarca" deleted… y vuelve a arrancar. Es un Deployment. 😌', 'pod "escribadelamarca" deleted… and it comes right back. It is a Deployment. 😌'));
    if (key === 'ping' || key.startsWith('ping ')) return egg('ping', () => 'PING ' + esc(input.slice(5).trim() || 'toniruiz.es') + ': 64 bytes, icmp_seq=1 ttl=64 time=0.042 ms\npong 🏓');
    if (key === 'vim' || key === 'vi') { vimMode = true; return egg('vim', () => '<span class="dim">' + L('Has entrado en vim. Buena suerte saliendo.', 'You are now in vim. Good luck getting out.') + '</span>\n~\n~\n~\n<span class="dim">-- INSERT --</span>'); }
    if (key === 'emacs') return egg('emacs', () => L('Gran sistema operativo. Le falta un buen editor.', 'Great operating system. It just lacks a decent editor.'));
    if (key === 'nano') return egg('nano', () => L('nano. Respeto. 🫡', 'nano. Respect. 🫡'));
    if (key === 'lumos' || key === 'nox') return egg(key, () => { root.dataset.theme = key === 'lumos' ? 'light' : 'dark'; try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {} return key === 'lumos' ? '✨ Lumos!' : '🌑 Nox.'; });
    if (key === 'hack' || key === 'hackerman') return egg('hack', () => L('Accediendo al mainframe… ██████████ 100%\n<span class="ok">ACCESS GRANTED</span>\nEs broma. Aquí todo es open source.', 'Accessing the mainframe… ██████████ 100%\n<span class="ok">ACCESS GRANTED</span>\nJust kidding. Everything here is open source.'));
    if (key === 'secrets' || key === 'easter eggs' || key === 'eastereggs') return egg('secrets', () => L(
      'Los comandos secretos no se listan. Pistas:\n  · un tren que aparece cuando escribes mal «ls»\n  · una vaca que habla\n  · xkcd 149 · Colossal Cave · Douglas Adams\n  · un editor del que nadie sabe salir\n  · tira un dado de 20 caras\n  · ↑ ↑ ↓ ↓ ← → ← → B A',
      'Secret commands are not listed. Hints:\n  · a train that shows up when you mistype "ls"\n  · a talking cow\n  · xkcd 149 · Colossal Cave · Douglas Adams\n  · an editor nobody knows how to exit\n  · roll a twenty-sided die\n  · ↑ ↑ ↓ ↓ ← → ← → B A'));
    return false;
  };

  // Código Konami en cualquier parte de la página
  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let konamiPos = 0;
  document.addEventListener('keydown', (e) => {
    const k = (e.key || '').toLowerCase();
    konamiPos = k === KONAMI[konamiPos] ? konamiPos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (konamiPos === KONAMI.length) {
      konamiPos = 0;
      track('terminal/egg-konami', 'Easter egg: konami');
      document.getElementById('shell').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      print('<span class="ok b">' + L('🎮 ¡Código Konami! +30 vidas. Modo dios activado.', '🎮 Konami code! +30 lives. God mode enabled.') + '</span>');
      matrix();
    }
  });

  const run = (raw) => {
    const input = raw.trim();
    print(PROMPT + esc(raw));
    if (!input) return;
    const key = input.toLowerCase().replace(/\s+/g, ' ');
    if (key === 'clear') {
      Array.from(out.children).forEach((n) => { if (n !== inputLine) n.remove(); });
      return;
    }
    if (easterEgg(key, input)) return;
    if (key.startsWith('sudo')) { print('<span class="err">' + T.sudo + '</span>'); return; }
    if (key.startsWith('rm -rf')) { print('<span class="warn">' + T.rm + '</span>'); return; }
    const cd = key.match(/^cd\s+(\S+?)\/?$/);
    if (cd) {
      const target = T.sections[cd[1]];
      if (target) track('terminal/cd', 'Terminal: cd');
      if (target) { print('<span class="dim">→ ' + esc(cd[1]) + '</span>'); document.querySelector(target).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
      else if (cd[1] !== '~' && cd[1] !== '..') print(T.noDir + esc(cd[1]));
      return;
    }
    const fn = commands[key] || commands[aliases[key]];
    if (!fn) { print('zsh: command not found: ' + esc(input.split(' ')[0]) + '  <span class="dim">' + T.notFound + '</span> <span class="ok">help</span>'); return; }
    if (!introRunning) track('terminal/' + (commands[key] ? key : aliases[key]).replace(/\s+/g, '-'), 'Terminal: ' + key);
    const res = fn();
    if (res && res.html) {
      const el = document.createElement(res.tag);
      el.className = res.cls;
      el.innerHTML = res.html;
      out.insertBefore(el, inputLine);
    } else print(res);
  };

  const history = [];
  let hIdx = 0;
  field.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = field.value;
      if (v.trim()) history.push(v);
      hIdx = history.length;
      field.value = '';
      run(v);
      scrollEnd();
    } else if (e.key === 'ArrowUp') {
      if (hIdx > 0) { hIdx--; field.value = history[hIdx]; }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (hIdx < history.length - 1) { hIdx++; field.value = history[hIdx]; }
      else { hIdx = history.length; field.value = ''; }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      const v = field.value.toLowerCase();
      const match = v && Object.keys(commands).find((c) => c.startsWith(v));
      if (match) { field.value = match; e.preventDefault(); }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault(); field.value = ''; run('clear');
    }
  });
  out.addEventListener('click', (e) => {
    if (e.target.closest('a') || String(window.getSelection())) return;
    field.focus({ preventScroll: true });
  });

  // Introducción tecleada: whoami + neofetch
  const typeCmd = (cmd) => new Promise((resolve) => {
    const line = document.createElement('pre');
    line.innerHTML = PROMPT + '<span class="typed"></span>';
    out.insertBefore(line, inputLine);
    const span = line.querySelector('.typed');
    let i = 0;
    const tick = () => {
      span.textContent = cmd.slice(0, ++i);
      if (i < cmd.length) setTimeout(tick, 55 + Math.random() * 60);
      else setTimeout(() => { line.remove(); resolve(); }, 260);
    };
    setTimeout(tick, 400);
  });
  let introRunning = true;
  document.querySelectorAll('.cmd-chip').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (introRunning) return;
      introRunning = true;
      if (!reduced) await typeCmd(btn.dataset.cmd);
      introRunning = false;
      run(btn.dataset.cmd);
      scrollEnd();
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
    e.preventDefault();
    document.getElementById('shell').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    field.focus({ preventScroll: true });
  });
  (async () => {
    for (const c of ['whoami', 'neofetch']) {
      if (!reduced) await typeCmd(c);
      run(c);
    }
    print('\n' + T.intro);
    scrollEnd();
    out.setAttribute('aria-live', 'polite');
    introRunning = false;
  })();
})();
