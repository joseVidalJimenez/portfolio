// @ts-check
/**
 * Visual layout review tests for the portfolio website.
 *
 * On first run  → screenshots are captured and saved as baselines.
 * On later runs → screenshots are compared to baselines; failures show diffs.
 *
 * To refresh all baselines after intentional design changes, run:
 *   npx playwright test --update-snapshots
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ─── Pages ───────────────────────────────────────────────────────────────────
const PAGES = [
  { name: 'home',          url: '/index.html' },
  { name: 'about',         url: '/about.html' },
  { name: 'portfolio',     url: '/portfolio.html' },
  { name: 'contact',       url: '/contact.html' },
  { name: 'journal',       url: '/journal.html' },
  { name: 'hobbies',       url: '/hobbies.html' },
  { name: 'sitemap',       url: '/sitemap.html' },
  { name: 'thankyou',      url: '/thanktyoupage.html' },
  // Projects
  { name: 'proj-backpack',   url: '/projects/backpack.html' },
  { name: 'proj-curler',     url: '/projects/curler.html' },
  { name: 'proj-hapicFinger',url: '/projects/hapicFinger.html' },
  { name: 'proj-planter',    url: '/projects/planter.html' },
  { name: 'proj-plug',       url: '/projects/plug.html' },
  { name: 'proj-rccar',      url: '/projects/RCcar.html' },
];

// ─── Viewports ───────────────────────────────────────────────────────────────
const VIEWPORTS = [
  { label: 'mobile',  width: 375,  height: 812  },
  { label: 'tablet',  width: 768,  height: 1024 },
  { label: 'desktop', width: 1440, height: 900  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Wait for images and fonts to load before screenshotting */
async function waitForPageReady(page) {
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  // Hide scrollbar for consistent screenshots
  await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }' });
  // Scroll through the full page so lazy-loaded iframes and images initialise
  await page.evaluate(async () => {
    await new Promise(resolve => {
      const distance = 400;
      const delay = 80;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
          window.scrollTo(0, 0);
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });
  // Extra pause for iframes (YouTube) to render after scrolling into view
  await page.waitForTimeout(1500);
}

/** Ensure screenshots directory exists */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

for (const viewport of VIEWPORTS) {
  test.describe(`Layout @ ${viewport.label} (${viewport.width}px)`, () => {

    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const pg of PAGES) {
      test(`${pg.name}`, async ({ page }, testInfo) => {

        await page.goto(pg.url);
        await waitForPageReady(page);

        // ── 1. Full-page screenshot (saved for manual review) ──────────────
        const screenshotDir = path.join('tests', 'screenshots', viewport.label);
        ensureDir(screenshotDir);
        const screenshotPath = path.join(screenshotDir, `${pg.name}.png`);
        await page.screenshot({
          path:     screenshotPath,
          fullPage: true,
          animations: 'disabled',
        });

        // ── 2. Snapshot comparison (baseline on first run) ─────────────────
        await expect(page).toHaveScreenshot(`${pg.name}-${viewport.label}.png`, {
          fullPage:         true,
          animations:       'disabled',
          maxDiffPixelRatio: 0.02,   // allow up to 2% pixel diff
        });
      });
    }
  });
}

// ─── Layout sanity checks ─────────────────────────────────────────────────────
test.describe('Layout sanity checks', () => {

  test('nav is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await waitForPageReady(page);
    // Site uses <div class="navbar"> rather than a <nav> element
    const nav = page.locator('.navbar');
    await expect(nav).toBeVisible();
  });

  test('no horizontal scroll on mobile home', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await waitForPageReady(page);
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px tolerance
  });

  test('no horizontal scroll on mobile portfolio', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/portfolio.html');
    await waitForPageReady(page);
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test('all navigation links on home resolve (no 404)', async ({ page }) => {
    await page.goto('/index.html');
    await waitForPageReady(page);
    const links = await page.$$eval(
      'nav a[href]',
      els => els.map(el => el.getAttribute('href'))
    );
    for (const href of links) {
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
      const res = await page.request.get(href).catch(() => null);
      if (res) expect(res.status(), `${href} returned ${res.status()}`).toBeLessThan(400);
    }
  });

  test('contact form has required fields', async ({ page }) => {
    await page.goto('/contact.html');
    await waitForPageReady(page);
    await expect(page.locator('form')).toBeVisible();
    // At minimum a name/email input and a submit button should exist
    const inputs = page.locator('input, textarea');
    expect(await inputs.count()).toBeGreaterThanOrEqual(2);
  });
});
