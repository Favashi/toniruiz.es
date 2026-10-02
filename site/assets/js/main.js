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
        ['Contenedores', 'Docker · Kubernetes'],
        ['IaC', 'Terraform · Ansible'],
        ['CI/CD', 'GitHub Actions · Jenkins'],
        ['Observabilidad', 'Prometheus · Grafana · ELK'],
        ['Idiomas', 'español · català · English']
      ],
      help: [
        'Comandos disponibles',
        ['whoami', 'quién soy'],
        ['neofetch', 'resumen del sistema'],
        ['skills', 'stack técnico (dev + ops)'],
        ['projects', 'proyectos en producción'],
        ['kubectl get pods', 'estado de los proyectos'],
        ['git log', 'actividad reciente en GitHub'],
        ['contact', 'cómo hablar conmigo'],
        ['cd <sección>', 'ir a perfil, stack, proyectos o contacto'],
        ['lang', 'switch to English'],
        ['theme', 'cambiar tema claro/oscuro'],
        ['clear', 'limpiar la terminal']
      ],
      whoami: 'Escribo el código. Y lo llevo a producción.',
      skills: {
        dev: [['backend', 'PHP, Python, Go, .NET, Node.js'], ['arquitectura', 'REST, GraphQL, microservicios, hexagonal, DDD'], ['datos', 'PostgreSQL, MySQL, SQL Server, NoSQL'], ['frontend', 'JavaScript, React, AngularJS, PWA'], ['calidad', 'PHPUnit, pgTAP, Playwright'], ['ia', 'agentes, RAG, LLM, n8n, Make']],
        ops: [['cloud', 'AWS, GCP, Azure'], ['contenedores', 'Docker, Kubernetes, Compose, Nginx'], ['ci/cd', 'GitHub Actions, Jenkins'], ['iac', 'Terraform, Ansible'], ['observab.', 'Prometheus, Grafana, ELK']]
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
        ['Containers', 'Docker · Kubernetes'],
        ['IaC', 'Terraform · Ansible'],
        ['CI/CD', 'GitHub Actions · Jenkins'],
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
        ['contact', 'how to reach me'],
        ['cd <section>', 'go to profile, stack, projects or contact'],
        ['lang', 'cambiar a español'],
        ['theme', 'toggle light/dark theme'],
        ['clear', 'clear the terminal']
      ],
      whoami: 'I write the code. And I ship it to production.',
      skills: {
        dev: [['backend', 'PHP, Python, Go, .NET, Node.js'], ['architecture', 'REST, GraphQL, microservices, hexagonal, DDD'], ['data', 'PostgreSQL, MySQL, SQL Server, NoSQL'], ['frontend', 'JavaScript, React, AngularJS, PWA'], ['quality', 'PHPUnit, pgTAP, Playwright'], ['ai', 'agents, RAG, LLM, n8n, Make']],
        ops: [['cloud', 'AWS, GCP, Azure'], ['containers', 'Docker, Kubernetes, Compose, Nginx'], ['ci/cd', 'GitHub Actions, Jenkins'], ['iac', 'Terraform, Ansible'], ['observab.', 'Prometheus, Grafana, ELK']]
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
    }).join('\n'),
    whoami: () => 'Toni Ruiz — <span class="dv">Developer</span> &amp; <span class="ok">DevOps</span> · Barcelona\n' + T.whoami,
    neofetch: () => ({ html: NEOFETCH, tag: 'div', cls: 'neo' }),
    skills: () => '<span class="dv b"># dev</span>\n' + table(T.skills.dev, 14) + '\n<span class="ok b"># ops</span>\n' + table(T.skills.ops, 14),
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
        return pod.padEnd(26) + '1/1     <span class="ok">Running</span>   0          ' + age;
      };
      return [
        '<span class="dim">' + 'NAME'.padEnd(26) + 'READY   STATUS    RESTARTS   AGE</span>',
        row('escribadelamarca', 'escribadelamarca', 'v1.14'),
        row('osr-manager', 'osr-manager', 'v0.4'),
        row('toniruiz-es', 'toniruiz.es', 'latest')
      ].join('\n');
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

  const run = (raw) => {
    const input = raw.trim();
    print(PROMPT + esc(raw));
    if (!input) return;
    const key = input.toLowerCase().replace(/\s+/g, ' ');
    if (key === 'clear') {
      Array.from(out.children).forEach((n) => { if (n !== inputLine) n.remove(); });
      return;
    }
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
