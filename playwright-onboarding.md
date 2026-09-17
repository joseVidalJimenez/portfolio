# Playwright onboarding — Tests & screenshots

Deep-dive on the repo's Playwright setup. For the quick start (run / build / test loop and where screenshots land), see [README.md](README.md) → **Testing**.

## Setup

From the repository root:

```bash
npm ci
npx playwright install        # browser binaries
npx playwright install-deps   # OS libs (Linux; may need sudo)
```

On Linux, Playwright needs system libraries — run `install-deps` or follow https://playwright.dev/docs/linux.

## Test specs

- [tests/projects-screenshots.spec.js](tests/projects-screenshots.spec.js) — full-page screenshot for **every** page in `build.config.json` across mobile/tablet/desktop. The page list is **not hardcoded**: it reads `build.config.json` (the same source of truth as the build script), so adding/removing a page updates the screenshot set automatically.
- [tests/projects.spec.js](tests/projects.spec.js) — functional checks (`<title>`, navbar, headings, no horizontal overflow, images have alt text, no text/image overlap) per project page.
- [tests/svg-diagram.spec.js](tests/svg-diagram.spec.js) — verifies the System Architecture Diagram SVG renders on the curler page.
- Config: [playwright.config.js](playwright.config.js) — sets a `webServer` serving `docs/` at `http://localhost:5500`, so tests start the static server automatically. Build (or edit) `docs/` before running.

## Screenshot output

- Full-page screenshots → `tests/screenshots/<viewport>/<name>.png`, where `<name>` is the built page's basename from `build.config.json` (e.g. `about.png`, `backpack.png`) and `<viewport>` is `mobile`/`tablet`/`desktop`.
- Fail artifacts → `tests/results/`; HTML report → `tests/report/` (view with `npx playwright show-report tests/report`).

## Troubleshooting

- **Missing libraries / corrupt screenshots on tall pages:** this project captures to a Buffer and writes it manually to avoid Playwright's `page.screenshot({ path, fullPage })` truncation — see [troubleshooting.md](troubleshooting.md).
- **Page matching with `--grep`:** names derive from `build.config.json` `out` basenames, so use those to target one page (e.g. `--grep "backpack"`).

## Tips

- The screenshot spec forces eager image loading and waits for stability before capturing, so output is consistent.
- Run headed (`--headed`) for debugging.
