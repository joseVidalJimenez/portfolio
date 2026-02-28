// @ts-check
/**
 * Per-project page tests
 *
 * Each project is tested for:
 *   1. Correct <title>
 *   2. Navbar present and contains a link back to portfolio
 *   3. Project container + at least one h2 heading
 *   4. At least one project-section with meaningful text
 *   5. Footer present
 *   6. No horizontal overflow on mobile (375 px)
 *   7. Hero image loads (for pages that have one)
 *   8. All img elements have non-empty alt text
 */

const { test, expect } = require('@playwright/test');

// ─── Project definitions ─────────────────────────────────────────────────────
const PROJECTS = [
  {
    name:    'RCcar',
    url:     '/projects/RCcar.html',
    title:   'WombleBot',            // substring of the expected <title>
    heading: 'WombleBot',            // substring expected in first h2
    hasHero: true,
  },
  {
    name:    'backpack',
    url:     '/projects/backpack.html',
    title:   'BackPack Arm',
    heading: 'BackPackArm',
    hasHero: false,
  },
  {
    name:    'curler',
    url:     '/projects/curler.html',
    title:   'Curler',
    heading: 'Curler',
    hasHero: false,
  },
  {
    name:    'hapicFinger',
    url:     '/projects/hapicFinger.html',
    title:   'Tactile Haptic',
    heading: 'Tactile Haptic',
    hasHero: true,
  },
  {
    name:    'planter',
    url:     '/projects/planter.html',
    title:   'Irrigation',
    heading: 'Irrigation',
    hasHero: true,
  },
  {
    name:    'plug',
    url:     '/projects/plug.html',
    title:   'Cable Adapter',
    heading: 'Cable Adapter',
    hasHero: true,
  },
];

// ─── Shared helper ────────────────────────────────────────────────────────────
async function waitForPageReady(page) {
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
}

// ─── Per-project test suite ───────────────────────────────────────────────────
for (const project of PROJECTS) {
  test.describe(`Project: ${project.name}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(project.url);
      await waitForPageReady(page);
    });

    // 1. Page title
    test('has correct <title>', async ({ page }) => {
      await expect(page).toHaveTitle(new RegExp(project.title, 'i'));
    });

    // 2. Navbar – present and contains a "Portfolio" nav link
    test('navbar is visible with portfolio link', async ({ page }) => {
      const navbar = page.locator('.navbar');
      await expect(navbar).toBeVisible();
      const portfolioLink = navbar.locator('a[href*="portfolio.html"]');
      await expect(portfolioLink).toBeVisible();
    });

    // 3. Project container + heading
    test('has project container with h2 heading', async ({ page }) => {
      const container = page.locator('.project-container');
      await expect(container).toBeVisible();
      const h2 = container.locator('h2').first();
      await expect(h2).toBeVisible();
      const text = await h2.innerText();
      expect(text.trim().length, 'h2 should not be empty').toBeGreaterThan(0);
    });

    // 4. At least one project-section
    test('has at least one project-section', async ({ page }) => {
      const sections = page.locator('.project-section');
      const count = await sections.count();
      expect(count, 'expected at least one .project-section').toBeGreaterThanOrEqual(1);
    });

    // 5. Footer
    test('footer is present', async ({ page }) => {
      await expect(page.locator('.footer')).toBeVisible();
    });

    // 6. No horizontal overflow on mobile
    test('no horizontal overflow on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(project.url);
      await waitForPageReady(page);
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(
        scrollWidth,
        `body.scrollWidth (${scrollWidth}) should not exceed clientWidth (${clientWidth})`
      ).toBeLessThanOrEqual(clientWidth + 2);
    });

    // 7. Hero image (only for pages that declare one)
    if (project.hasHero) {
      test('hero image is visible', async ({ page }) => {
        const hero = page.locator('.project-hero img');
        await expect(hero).toBeVisible();
        // Confirm the image actually loaded (naturalWidth > 0)
        const loaded = await hero.evaluate(
          img => (/** @type {HTMLImageElement} */(img)).naturalWidth > 0
        );
        expect(loaded, 'hero image should have loaded successfully').toBe(true);
      });
    }

    // 8. All images have non-empty alt text
    test('all images have alt text', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(
          alt !== null && alt.trim().length > 0,
          `img[${i}] is missing alt text`
        ).toBe(true);
      }
    });

    // 9. No bare class="text" inside a section that also has a floated image
    //    (bare .text has no width/float, causing text to render behind or over the image)
    test('no bare class=text div alongside a floated image', async ({ page }) => {
      const problems = await page.evaluate(() => {
        const sections = document.querySelectorAll('.project-section');
        const issues = [];
        sections.forEach((sec, i) => {
          const hasFloat = sec.querySelector('.image-left, .image-right');
          const hasBareText = sec.querySelector('.text:not(.text-left):not(.text-right)');
          if (hasFloat && hasBareText) {
            issues.push(`project-section[${i}] has a floated image but uses bare class="text" — should be "text-left" or "text-right"`);
          }
        });
        return issues;
      });
      expect(problems, problems.join('\n')).toHaveLength(0);
    });

    // 10. No text paragraph visually overlaps a floated image (bounding-box check,
    //     scoped within each .project-section to avoid cross-section false positives)
    test('text does not visually overlap images', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(project.url);
      await waitForPageReady(page);

      const overlaps = await page.evaluate(() => {
        /**
         * Returns true when two DOMRects intersect (4 px tolerance for
         * subpixel rounding / borders).
         */
        function intersects(a, b) {
          const tol = 4;
          return !(a.right  - tol < b.left   ||
                   b.right  - tol < a.left   ||
                   a.bottom - tol < b.top    ||
                   b.bottom - tol < a.top);
        }

        const issues = [];

        // Only compare images and paragraphs that live in the SAME section.
        document.querySelectorAll('.project-section').forEach((sec, si) => {
          const imgs = Array.from(sec.querySelectorAll('.image-left, .image-right'));
          const paras = Array.from(sec.querySelectorAll('p'));
          if (!imgs.length || !paras.length) return; // text-only or image-only section

          for (const img of imgs) {
            const ir = img.getBoundingClientRect();
            if (ir.width < 1 || ir.height < 1) continue; // not rendered / not loaded

            for (const p of paras) {
              const pr = p.getBoundingClientRect();
              if (pr.width < 1 || pr.height < 1) continue;

              if (intersects(ir, pr)) {
                issues.push(
                  `section[${si}]: <img alt="${img.getAttribute('alt')}"> ` +
                  `overlaps <p> "${p.textContent.trim().slice(0, 60)}..."`
                );
              }
            }
          }
        });

        return issues;
      });

      expect(overlaps, overlaps.join('\n')).toHaveLength(0);
    });

  });
}
