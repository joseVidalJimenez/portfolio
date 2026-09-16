# Troubleshooting — Playwright project screenshot capture

This document records a real bug we hit and solved: full-page screenshots of the tall
project pages coming out as corrupt, un-openable files (`file` reports them as `data`),
while the `about` page screenshot worked fine.

## Symptom

Running

```bash
npx playwright test tests/projects-screenshots.spec.js
```

produced screenshots where **only `proj-about.png` opened correctly**. The other project
pages (backpack, curler, hapicFinger, plug — and sometimes rccar) produced files that
could not be opened as images.

Investigating the broken files (`file` / `xxd`):

```text
$ file tests/screenshots/mobile/proj-backpack.png
tests/screenshots/mobile/proj-backpack.png: data          # NOT "PNG image data"
$ xxd -l 16 tests/screenshots/mobile/proj-backpack.png
32e4 956e fcbc cfd1 500e 7daf 25c7 16a7 ...                # no PNG magic (should be 8950 4e47)
$ wc -c tests/screenshots/mobile/proj-backpack.png
524288                                                  # exactly 512 KiB
```

Two clues stood out:

1. Every broken file was **exactly 524288 bytes (512 KiB)** — suspiciously uniform.
2. The bytes were completely unrelated to a PNG — not a valid PNG with blank areas, but
   a truncated/garbled write.

## What was NOT the problem

We checked several hypotheses that turned out to be red herrings:

- **"Adding `about` broke it."** Not true. Reverting to the pristine committed spec
  (which has no `about`, git `66c18e2`) and re-running `--grep "backpack"` still produced
  corrupt 524288-byte files. The `about` page only *looked* fine because it is short.
- **"`proj-` prefix is wrong."** Not true. The committed spec always wrote
  `proj-${project.name}.png`. A separate spec, `visual.spec.js`, produced the other page
  files (`about.png`, `home.png`, …). Both specs have since been consolidated: the
  screenshot spec is now generated from `build.config.json` and `visual.spec.js` was
  removed.
- **"Lazy loading leaves blank images."** Lazy loading does affect rendering, but the
  broken files were not valid PNGs with blank regions — they were truncated binary.

## Root cause

Playwright's **`page.screenshot({ path, fullPage: true })` truncates large full-page PNGs
at exactly 512 KiB (524288 bytes)** in this environment. When a full-page screenshot
encodes to more than 512 KiB, the path-based write cuts the file off at 512 KiB, producing
a corrupt, non-PNG file.

Why it looked page-dependent:

| Page        | page height (mobile) | fullPage PNG size | Result |
|-------------|----------------------|-------------------|--------|
| about       | 3800 px              | 347696            | ✅ valid |
| planter     | 6538 px              | 502547            | ✅ valid |
| rccar       | 5318 px              | 494011            | ✅ valid |
| hapicFinger | 7781 px              | 845306 (< 512KiB) | ❌ corrupt |
| backpack    | 9037 px              | 668967            | ❌ corrupt |
| plug        | 9043 px              | 843921            | ❌ corrupt |
| curler      | 10869 px             | 658778            | ❌ corrupt |

Tall pages whose encoded PNG stays under 512 KiB stayed valid; taller ones that would
encode over 512 KiB got truncated. The `about` page is short, so it "worked" — which
misled us into suspecting the `about` change.

Diagnostic proof (buffer vs path on the same page):

```js
// Same page, same moment:
const buf = await page.screenshot({ fullPage: true, animations: 'disabled' }); // no path
console.log(buf.length);            // 668967  → complete, valid PNG in memory

await page.screenshot({ path: 'x.png', fullPage: true, animations: 'disabled' });
console.log(fs.statSync('x.png').size); // 524288  → truncated at 512 KiB
```

## Fix (implemented in `tests/projects-screenshots.spec.js`)

1. **Capture the full page into a Buffer and write it manually** — do **not** pass `path`
   to `page.screenshot`. The buffer is the complete, valid PNG; `fs.writeFileSync` writes
   it with no 512 KiB truncation.

   ```js
   const buffer = await page.screenshot({ fullPage: true, animations: 'disabled' });
   fs.writeFileSync(finalPath, buffer);
   ```

2. **Validate the buffer before writing** (PNG magic bytes) and retry up to 3 times as a
   safety net — so a bad capture never silently persists.

3. **Disable lazy loading before capture** (`waitForPageReady` forces every `img` to
   `loading = 'eager'` and awaits them, then scrolls the page and waits) for stable,
   fully-rendered output.

4. **`about` was restored** to the `PROJECTS` array, so
   `npx playwright test tests/projects-screenshots.spec.js --grep "about"` works.

## Verification

After the fix, every generated screenshot is a valid PNG with a sensible, varying size
(no uniform 512 KiB cap):

```text
$ file tests/screenshots/mobile/proj-*.png
... proj-about.png:        PNG image data, 375 x  3800 ...
... proj-backpack.png:     PNG image data, 375 x  9037 ...
... proj-curler.png:       PNG image data, 375 x 11229 ...
... proj-hapicFinger.png:  PNG image data, 375 x  7781 ...
... proj-planter.png:      PNG image data, 375 x  6538 ...
... proj-plug.png:         PNG image data, 530 x  9204 ...
... proj-rccar.png:        PNG image data, 375 x  5318 ...

$ wc -c tests/screenshots/mobile/proj-backpack.png
964484    # no longer stuck at 524288
```

All 21 screenshots (7 pages × 3 viewports) validate as PNG images, and
`npx playwright test tests/projects-screenshots.spec.js --grep "about"` passes.

> **Naming note (later change):** the `proj-` prefix was subsequently removed —
> screenshots are now saved as `tests/screenshots/{viewport}/{project}.png`
> (`about.png`, `backpack.png`, …) instead of `proj-{project}.png`. The diagnosis above
> is unaffected; only the output filenames changed.

## Takeaway

If a screenshot comes out as a uniformly sized, non-PNG file, suspect the write path, not
the page content. Here Playwright's `page.screenshot({ path, fullPage })` capped large
captures at 512 KiB; capturing to a Buffer and writing it yourself sidesteps the cap.
