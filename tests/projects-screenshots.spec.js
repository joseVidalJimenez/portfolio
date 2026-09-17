// @ts-check
/**
 * Update screenshots for every page across three viewports.
 *
 * The page list is generated from build.config.json (the same source of truth the
 * build script uses), so index.html and any newly added/removed pages are picked up
 * automatically without hardcoding.
 *
 * Saves screenshots to:
 *   tests/screenshots/{viewport}/{name}.png
 *
 * Viewports:
 *   - mobile:  375px wide
 *   - tablet:  768px wide
 *   - desktop: 1440px wide
 *
 * Run with:
 *   npx playwright test tests/projects-screenshots.spec.js
 */

const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ─── Page definitions (from build.config.json) ───────────────────────────────
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'build.config.json'), 'utf8')
);

const PAGES = config.pages.map(p => {
  // docs/showcase.html           -> /showcase.html
  // docs/projects/backpack.html  -> /projects/backpack.html
  const rel = p.out.replace(/^docs[\\/]/, '');
  const url = '/' + rel.split(path.sep).join('/');
  const name = rel.split('/').pop().replace(/\.html$/, '');
  return { name, url };
});

// ─── Viewport definitions ────────────────────────────────────────────────────
const VIEWPORTS = [
  { label: 'mobile',  width: 375,  height: 812  },
  { label: 'tablet',  width: 768,  height: 1024 },
  { label: 'desktop', width: 1440, height: 900  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Ensure screenshot directory exists */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Navigate to the page, force eager image loading (disable lazy loading),
 * and wait until the page is fully loaded and stable before screenshotting.
 */
async function waitForPageReady(page, url) {
  await page.goto(url);
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});

  // Force all images to load eagerly (disable lazy loading) and await each one.
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => {
      img.loading = 'eager';
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }));
  });

  // Scroll through the full page so lazy-loaded iframes/images initialise.
  await page.evaluate(async () => {
    await new Promise(resolve => {
      const distance = 200;
      const delay = 150;
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

  // Hide scrollbars for cleaner screenshots.
  await page.addStyleTag({
    content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }',
  });

  // Let layouts/animations settle before capturing.
  await page.waitForTimeout(800);
}

/**
 * Quick check that a PNG buffer is valid by verifying its magic bytes.
 * Guards against truncated/partial captures that produce invalid images.
 */
function isValidPng(buffer) {
  return buffer.length > 0 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
}

// ─── Test suite ──────────────────────────────────────────────────────────────
for (const pg of PAGES) {
  for (const viewport of VIEWPORTS) {
    test(`${pg.name} @ ${viewport.label} (${viewport.width}px)`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to the page and wait until it is fully loaded/stable
      await waitForPageReady(page, pg.url);

      // Ensure screenshot directory exists
      const dir = path.join('tests', 'screenshots', viewport.label);
      ensureDir(dir);
      const finalPath = path.join(dir, `${pg.name}.png`);

      // Capture the full page to a Buffer and write it out manually.
      //
      // NOTE: we intentionally do NOT pass a `path` here. Playwright's
      // `page.screenshot({ path })` truncates large full-page PNGs at exactly
      // 512KB (524288 bytes) in this environment, producing corrupt files for
      // tall pages (e.g. backpack/curler/hapicFinger above ~6-9k px). Capturing
      // into a Buffer avoids that write path and returns the complete, valid PNG.
      let written = false;
      for (let attempt = 0; attempt < 3 && !written; attempt++) {
        const buffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
        });
        if (isValidPng(buffer)) {
          fs.writeFileSync(finalPath, buffer);
          written = true;
        } else {
          await page.waitForTimeout(500);
        }
      }
      if (!written) {
        throw new Error(`Failed to produce a valid PNG for ${pg.name} @ ${viewport.label}`);
      }
    });
  }
}
