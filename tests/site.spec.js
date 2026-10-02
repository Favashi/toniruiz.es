import { expect, test } from '@playwright/test';

// Errores de consola (incluidas violaciones de la CSP). Se ignora la analítica,
// que depende de un servicio externo.
function watchConsole(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/goatcounter|gc\.zgo\.at/i.test(msg.text() + msg.location().url)) errors.push(`${msg.text()} (${msg.location().url})`);
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

const PAGES = [
  { path: '/', lang: 'es', h1: 'Escribo el código.', help: 'Comandos disponibles' },
  { path: '/en/', lang: 'en', h1: 'I write the code.', help: 'Available commands' },
];

for (const p of PAGES) {
  test.describe(`${p.lang}`, () => {
    test('carga sin errores y con contenido básico', async ({ page }) => {
      const errors = watchConsole(page);
      await page.goto(p.path);
      await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
      await expect(page.locator('h1')).toContainText(p.h1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      // Todas las imágenes cargan
      const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => i.loading !== 'lazy' && !(i.complete && i.naturalWidth)).map((i) => i.src));
      expect(broken).toEqual([]);
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
    });

    test('la terminal responde a comandos', async ({ page }) => {
      await page.goto(p.path);
      const out = page.locator('#out');
      await expect(out).toContainText('neofetch');
      const input = page.locator('.cmd-input');
      await input.fill('help');
      await input.press('Enter');
      await expect(out).toContainText(p.help);
      await input.fill('comando-inexistente');
      await input.press('Enter');
      await expect(out).toContainText('command not found');
    });

    test('los botones de comandos ejecutan el comando', async ({ page }) => {
      await page.goto(p.path);
      await expect(page.locator('#out')).toContainText('neofetch');
      await page.locator('.cmd-chip[data-cmd="kubectl get pods"]').click();
      await expect(page.locator('#out')).toContainText('READY');
    });
  });
}

test('el selector de idioma enlaza ambas versiones', async ({ page }) => {
  await page.goto('/');
  await page.locator('.lang-switch').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await page.locator('.lang-switch').click();
  await expect(page).toHaveURL(/127\.0\.0\.1:4173\/$/);
});

test('el cambio de tema funciona', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(() => document.documentElement.dataset.theme || '');
  await page.locator('#theme').click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(after).not.toBe(before);
});

test('el atajo / enfoca la terminal', async ({ page, isMobile }) => {
  test.skip(isMobile, 'sin teclado físico');
  await page.goto('/');
  await page.locator('h1').click();
  await page.keyboard.press('/');
  await expect(page.locator('.cmd-input')).toBeFocused();
});

test('menú móvil: abre, navega y se cierra', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo en móvil');
  await page.goto('/');
  const btn = page.locator('#menu-btn');
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-menu a[href="#contacto"]').click();
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('el botón de menú no aparece en escritorio', async ({ page, isMobile }) => {
  test.skip(isMobile, 'solo en escritorio');
  await page.goto('/');
  await expect(page.locator('#menu-btn')).toBeHidden();
});

test('404 y security.txt existen', async ({ request }) => {
  expect((await request.get('/404.html')).ok()).toBeTruthy();
  const sec = await request.get('/.well-known/security.txt');
  expect(sec.ok()).toBeTruthy();
  expect(await sec.text()).toContain('Contact: mailto:info@toniruiz.es');
});

test('comandos secretos', async ({ page }) => {
  await page.goto('/');
  const out = page.locator('#out');
  await expect(out).toContainText('neofetch');
  const input = page.locator('.cmd-input');
  const run = async (cmd) => { await input.fill(cmd); await input.press('Enter'); };
  await run('sudo make me a sandwich');
  await expect(out).toContainText('Okay.');
  await run('roll 2d6+1');
  await expect(out).toContainText('🎲 2d6+1 →');
  await run('vim');
  await run('ls');
  await expect(out).toContainText('E37');
  await run(':q');
  await expect(out).toContainText('Has salido de vim');
  await run('cowsay hola');
  await expect(out).toContainText('(oo)');
});

test('neofetch muestra los idiomas con mayúscula', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#out')).toContainText('Español · Català · English');
});
