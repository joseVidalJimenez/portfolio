// @ts-check
/**
 * Quick screenshot refresh for the planter project page.
 *
 * Saves to the same folders and uses the same naming convention as visual.spec.js:
 *   tests/screenshots/{viewport}/proj-planter.png
 *
 * Run with:
 *   npx playwright test tests/planter-screenshot.spec.js
 */

const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const VIEWPORTS = [
  { label: 'mobile',  width: 375,  height: 812  },
  { label: 'tablet',  width: 768,  height: 1024 },
  { label: 'desktop', width: 1440, height: 900  },
];

for (const viewport of VIEWPORTS) {
  test(`proj-planter @ ${viewport.label} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/projects/planter.html');
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
    await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }' });

    // Scroll through the full page so lazy-loaded images initialise
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
    await page.waitForTimeout(800);

    const dir = path.join('tests', 'screenshots', viewport.label);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await page.screenshot({
      path: path.join(dir, 'proj-planter.png'),
      fullPage: true,
      animations: 'disabled',
    });
  });
}

