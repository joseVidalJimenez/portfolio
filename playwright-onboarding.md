# Playwright onboarding — Visual tests & screenshots

This short guide explains how to run the repository's Playwright visual tests and where screenshots and baselines are saved.

## Purpose

- Capture full-page screenshots for pages under `docs/` and run visual snapshot comparisons.
- Keep instructions generic — screenshots for any page are saved under a shared folder.

## Prerequisites

- Node.js (LTS recommended, e.g. Node 16+)
- npm (or yarn)
- Python 3 (the project uses `python3 -m http.server` in `playwright.config.js` to serve `docs/`)
- On Linux, Playwright requires system libraries. Try the Playwright helper first:

```bash
npx playwright install-deps
```

If you prefer to install Debian/Ubuntu packages manually, see Playwright docs or install the platform deps.

## Install (project)

From the repository root:

```bash
npm ci
npx playwright install
```

`npx playwright install` downloads browser binaries. `npx playwright install-deps` attempts to install OS deps (may require `sudo`).

## How tests run here

- Tests are in [tests/visual.spec.js](tests/visual.spec.js).
- Playwright config is in [playwright.config.js](playwright.config.js). This config sets a `webServer` to serve the `docs/` folder at `http://localhost:5500`, so running tests will start the local static server automatically.

## Common commands

- Run all tests:

```bash
npx playwright test
```

- Run a single page's visual test (match the `name` from the `PAGES` array in `tests/visual.spec.js`):

```bash
npx playwright test -g proj-<page-slug>
```


Example: to run a page named `proj-example` (replace with your page's name from the PAGES array):

```bash
npx playwright test -g proj-example
```

- Run headed (visible browsers) for debugging:

```bash
npx playwright test --headed -g proj-<page-slug>
```

- Update baseline snapshots when changes are intentional:

```bash
npx playwright test --update-snapshots -g proj-<page-slug>
```

- Open the HTML report after a run:

```bash
npx playwright show-report tests/report
```

## Where screenshots are saved

- Manual/full-page screenshots (the explicit `page.screenshot` calls in the test) are written into the screenshots folder organized by viewport: `tests/screenshots/<viewport>/<page>.png`.
- Playwright snapshot baselines used by `expect(page).toHaveScreenshot(...)` are kept under the repository snapshot directory configured in `playwright.config.js` (by default `tests/screenshots/`).

In short: check `tests/screenshots/` for all captured images and baselines.

## Troubleshooting

- "Missing libraries" warnings on Linux: run `npx playwright install-deps` or follow https://playwright.dev/docs/linux for the distro-specific package list.
- If a snapshot comparison fails and the change is intended, refresh baselines with `--update-snapshots`.
- Fail artifacts (diffs, actual images, error contexts) are saved in `tests/results/` and the HTML report is under `tests/report`.

## Quick single-page screenshot (optional)

If you want a simple script to capture a single page without the full test harness, create a small Node script (example):

```js
// scripts/screenshot.js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5500/projects/hapicFinger.html');
  await page.screenshot({ path: 'tests/screenshots/desktop/proj-hapicFinger.png', fullPage: true });
  await browser.close();
})();
```

Run it after starting the docs server (or rely on the test `webServer`):

```bash
node scripts/screenshot.js
```

## Notes / tips

- Test names come from the `PAGES` array in [tests/visual.spec.js](tests/visual.spec.js); use those `name` values with `-g` to match a specific page.
- The tests take care to wait for images/fonts and scroll lazy-loaded content before screenshotting; prefer using the existing test rather than ad-hoc scripts if you want consistent baselines.

If you'd like, I can also add a short npm script to `package.json` for single-page runs (for example `npm run test:page -- proj-hapicFinger`).
