# Playwright onboarding — Tests & screenshots

This guide explains how to run the repository's Playwright tests and where screenshots are saved.

## Purpose

- Capture full-page screenshots for **every** page on the site (from `build.config.json`) across three viewports.
- Run functional (layout/behavior) assertions on the pages.

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

## How tests are organised here

- [tests/projects-screenshots.spec.js](tests/projects-screenshots.spec.js) — generates a full-page screenshot for every page in `build.config.json` across mobile/tablet/desktop. The page list is **not hardcoded**: it reads `build.config.json` (the same source of truth the build script uses), so adding/removing a page there updates the screenshot set automatically.
- [tests/projects.spec.js](tests/projects.spec.js) — functional tests (correct `<title>`, navbar, headings, no horizontal overflow, images have alt text, no text/image overlap) for each project page.
- [tests/svg-diagram.spec.js](tests/svg-diagram.spec.js) — verifies the System Architecture Diagram SVG renders on the curler page.
- Playwright config is in [playwright.config.js](playwright.config.js). The config sets a `webServer` to serve `docs/` at `http://localhost:5500`, so tests start the local static server automatically.

## Common commands

- Run the screenshot generator (all pages × 3 viewports):

```bash
npx playwright test tests/projects-screenshots.spec.js
```

- Run a single page's screenshot (match the page name, derived from the built file's basename in `build.config.json`, e.g. `about`, `index`, `backpack`):

```bash
npx playwright test tests/projects-screenshots.spec.js --grep "about"
```

- Run all tests:

```bash
npx playwright test
```

- Run headed (visible browsers) for debugging:

```bash
npx playwright test --headed
```

- Open the HTML report after a run:

```bash
npx playwright show-report tests/report
```

## Where screenshots are saved

- Full-page screenshots are written to `tests/screenshots/<viewport>/<name>.png`, where `<name>` is the built page's basename (e.g. `index.png`, `about.png`, `backpack.png`) and `<viewport>` is `mobile`, `tablet`, or `desktop`.

In short: check `tests/screenshots/` for all captured images.

## Troubleshooting

- "Missing libraries" warnings on Linux: run `npx playwright install-deps` or follow https://playwright.dev/docs/linux for the distro-specific package list.
- Fail artifacts (screenshots, error contexts) are saved in `tests/results/` and the HTML report is under `tests/report`.
- If a generated screenshot comes out corrupt (a uniformly 512 KiB, non-PNG file on a tall page), see [troubleshooting.md](troubleshooting.md) — this project captures to a Buffer and writes it manually to avoid Playwright's `page.screenshot({ path, fullPage })` truncation.

## Notes / tips

- Page names in the screenshot spec are derived from `build.config.json` `out` paths, so use those basename values with `-g` to match a specific page.
- The screenshot spec forces eager image loading, scrolls lazy-loaded content, and waits for stability before capturing, so output is consistent.