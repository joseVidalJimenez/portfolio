# portFolioWebsite — José Vidal's Design Engineering Portfolio

A personal portfolio website showcasing professional engineering work in **mechanical design**, **mechatronics**, and **embedded systems**. Built as a static site hosted on GitHub Pages.

## Overview

This site is built with plain HTML, CSS, and JavaScript — no frameworks or static site generators — using a custom Node.js build pipeline that assembles pages from templates. Visual regression tests and functional tests are handled via Playwright.

## Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Open docs/index.html in your browser, or serve locally
npx serve docs
```

## Testing

```bash
# Run Playwright visual and functional tests
npm test
```

### Updating screenshots

The site is served locally from `docs/` during tests. To start the server manually:

```bash
# Serve docs/ locally
python3 -m http.server 5500 --directory docs
```

To regenerate screenshots for a single project (e.g. `curler`) rather than all pages:

```bash
npx playwright test tests/projects-screenshots.spec.js --grep "curler"
```

Screenshots are saved to `tests/screenshots/{viewport}/proj-{project}.png`.
A Playwright `webServer` is configured, so tests start the server automatically.

## Files

| File / Directory | Purpose |
|------------------|---------|
| `package.json` | Node.js project with build and test scripts |
| `build.config.json` | Build pipeline configuration — page metadata, CSS, navigation |
| `project.yaml` | Project metadata |
| `scripts/build.js` | Custom build script that assembles pages from `src/` into `docs/` |
| `src/` | Source templates and assets |
| `docs/` | Built output — served via GitHub Pages |
| `tests/` | Playwright visual screenshot tests and functional tests |

## Deployment

The site is deployed via **GitHub Pages** from the `docs/` directory. The contact form uses **Web3Forms** as the backend.