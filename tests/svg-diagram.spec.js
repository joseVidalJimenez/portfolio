// @ts-check
/**
 * Verifies the System Architecture Diagram SVG is visible on the curler project page.
 */

const { test, expect } = require('@playwright/test');

test('System Architecture Diagram SVG is displayed on curler page', async ({ page }) => {
  // Capture any failed network requests
  const failedRequests = [];
  page.on('requestfailed', req => failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`));

  await page.goto('/projects/curler.html');
  await page.waitForLoadState('load');

  // Find the section label
  const sectionLabel = page.locator('p.section-label', { hasText: 'System Architecture Diagram' });
  await expect(sectionLabel).toBeVisible();

  // Find the SVG img
  const svgImg = page.locator('img[src*="curler-test-rig.svg"]');
  await expect(svgImg).toBeVisible();
  await svgImg.scrollIntoViewIfNeeded();

  // Log naturalWidth/Height and any network failures for diagnostics
  const metrics = await page.evaluate(() => {
    const img = document.querySelector('img[src*="curler-test-rig.svg"]');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return {
      complete:      img.complete,
      naturalWidth:  img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: r.width,
      renderedHeight: r.height,
      currentSrc:    img.currentSrc,
    };
  });
  console.log('SVG image metrics:', metrics);
  console.log('Failed requests:', failedRequests);

  // Navigate directly to the SVG to confirm it loads standalone
  const svgPage = await page.context().newPage();
  const resp = await svgPage.goto(`http://localhost:5500/diagrams/curler-test-rig.svg`);
  console.log('Direct SVG status:', resp?.status(), resp?.headers()['content-type']);
  await svgPage.close();

  // The rendered height must be substantial (SVG aspect ratio 225:112 ≈ 2:1)
  expect(metrics, 'Image metrics should not be null').not.toBeNull();
  expect(metrics.complete, 'Image should be complete').toBe(true);
  expect(metrics.renderedWidth, 'Rendered width should be > 100').toBeGreaterThan(100);
  expect(metrics.renderedHeight, 'Rendered height should be > 100').toBeGreaterThan(100);

  // Screenshot the diagram area
  await page.screenshot({
    path: 'tests/screenshots/svg-architecture-diagram.png',
    clip: {
      x: Math.max(0, metrics.renderedWidth > 100 ? 100 : 0),
      y: 0,
      width: 1280,
      height: 800,
    },
    fullPage: false,
  });
});
