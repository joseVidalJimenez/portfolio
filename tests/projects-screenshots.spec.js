// @ts-check
/**
 * Update screenshots for all project pages across three viewports.
 *
 * Saves screenshots to:
 *   tests/screenshots/{viewport}/proj-{project}.png
 *
 * Projects included:
 *   - RCcar, backpack, curler, hapicFinger, planter, plug
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

// ─── Project definitions ─────────────────────────────────────────────────────
const PROJECTS = [
  { name: 'backpack',     url: '/projects/backpack.html' },
  { name: 'curler',       url: '/projects/curler.html' },
  { name: 'hapicFinger',  url: '/projects/hapicFinger.html' },
  { name: 'planter',      url: '/projects/planter.html' },
  { name: 'plug',         url: '/projects/plug.html' },
  { name: 'rccar',        url: '/projects/RCcar.html' },
];

// ─── Viewport definitions ────────────────────────────────────────────────────
const VIEWPORTS = [
  { label: 'mobile',  width: 375,  height: 812  },
  { label: 'tablet',  width: 768,  height: 1024 },
  { label: 'desktop', width: 1440, height: 900  },
];

// ─── Helper: ensure screenshot directory exists ──────────────────────────────
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ─── Test suite ──────────────────────────────────────────────────────────────
for (const project of PROJECTS) {
  for (const viewport of VIEWPORTS) {
    test(`${project.name} @ ${viewport.label} (${viewport.width}px)`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to project page
      await page.goto(project.url);
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});

      // Hide scrollbars for cleaner screenshots
      await page.addStyleTag({
        content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }',
      });

      // Scroll through full page to trigger lazy-loaded image loading
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

      // Allow animations to settle
      await page.waitForTimeout(800);

      // Ensure screenshot directory exists
      const dir = path.join('tests', 'screenshots', viewport.label);
      ensureDir(dir);

      // Take full-page screenshot
      await page.screenshot({
        path: path.join(dir, `proj-${project.name}.png`),
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
