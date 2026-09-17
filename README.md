# portFolioWebsite — José Vidal's Design Engineering Portfolio

A personal portfolio website showcasing professional engineering work in **mechanical design**, **embedded systems**, and **AI**.

> **Why this exists:** a fast, dependency-light, hand-built static portfolio that stays easy to maintain and costs nothing to host — without sacrificing a clean, professional look or testable quality.

**Built with:**

[![HTML](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222?logo=github&logoColor=white)](https://pages.github.com/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Web3Forms](https://img.shields.io/badge/Web3Forms-2563EB?logo=formspree&logoColor=white)](https://web3forms.com/)

## Overview

This site is built with plain HTML, CSS, and JavaScript — no frameworks or static site generators — using a custom Node.js build pipeline that assembles pages from templates. Visual regression tests and functional tests are handled via Playwright.

## Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Open docs/showcase.html in your browser, or serve locally
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

## Working on this repo

Typical edit → build → test loop:

```bash
# 1. Edit source pages/templates (src/ is the source of truth)
#    e.g. src/pages/contact.html, _templates/layout.html

# 2. Rebuild docs/ from src/
npm run build

# 3. Preview locally
npx serve docs

# 4. Run the Playwright visual + functional tests
npm test
```

> **`docs/` is generated output — always edit `src/`, then rebuild.** Don't hand-edit files under `docs/`; they'll be overwritten by `npm run build`.

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

## Links

- **Live site:** _add URL here once deployed_ — e.g. `https://josevidaljimenez.github.io/portfolioWebsite/`
- The **contact form** is delivered by [Web3Forms](https://web3forms.com/) — no server or email credentials are exposed in the frontend.
- [Playwright](https://playwright.dev/) — visual regression & functional tests.