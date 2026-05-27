# TODO

Items from the May 2026 site audit. Fixed items are struck through.

---

## Bugs

- [x] **B-3** `hapicFinger.html` — `videoLightbox` / `closeVideoLightbox` undeclared → `ReferenceError` on load
- [x] **B-4** `project.css` — two orphaned CSS declaration blocks causing parse errors
- [ ] **B-1** `contact.html` — Web3Forms `access_key` is still `YOUR_ACCESS_KEY_HERE` — get key at https://web3forms.com/#start
- [ ] **B-2** `contact.html` — footer `mailto:` is `example@example.com` — replace with real address
- [ ] **B-5** `sitemap.html` and `thanktyoupage.html` have `<title>About</title>` — change to correct titles
- [ ] **B-6** `contact.html` `<title>contact</title>` — change to `Contact – José Vidal`
- [ ] **B-7** `sitemap.html` and `thanktyoupage.html` have empty bodies — add content
- [ ] **B-8** Bare `<a>Jose Vidal</a>` (no `href`) in `sitemap.html` and `thanktyoupage.html` — replace with `<span>`
- [ ] **B-9** `curler.html` and `planter.html` — `<script>` appears after `</body>` — move inside `<body>`
- [ ] **B-11** `portfolio.html` — two cards link to the same `curler.html` with no fragment anchors — add `#section` IDs
- [ ] **B-12** `contact.html` — submit button hover turns green (legacy rule in `styles.css`) — scope or remove the rule

---

## Performance

- [x] **P-1 / M-5** Google Fonts loaded via CSS `@import` (render-blocking) and duplicated across both CSS files — remove both `@import` rules; add `<link rel="preconnect">` + `<link rel="stylesheet">` in every `<head>`
- [ ] **P-2** No `loading="lazy"` on below-fold images in `index.html`, `portfolio.html`, `hobbies.html`
- [ ] **P-3** No `<link rel="icon">` declared — browser tab shows blank icon — add favicon link to all `<head>`s

---

## Accessibility

- [x] **A-1** No `aria-current="page"` on active nav link across all 14 pages
- [ ] **A-2** `.yt-facade` not keyboard-accessible — add `role="button"`, `tabindex="0"`, and `keydown` handler
- [ ] **A-3** No skip-to-content link on any page
- [ ] **A-4** `contact.html` `<textarea>` missing `required` attribute — can be submitted empty
- [ ] **A-5** `.media-caption { color: #888 }` fails WCAG AA contrast — change to at least `#767676`
- [ ] **A-6** `.img-expand-btn` has no `:focus-visible` style — add `outline` on focus

---

## Maintainability

- [x] **M-1** Navbar copy-pasted across all 14 HTML files — consider a JS fetch partial or static-site generator
- [x] **M-2** Duplicate CSS blocks in `styles.css` (`.about-section`, `.listing-section`) — delete the duplicate definitions
- [x] **M-3** Accent colour `#cb4444` hardcoded 30+ times — define `--accent` CSS variable in `:root`
- [x] **M-4** Page-specific `<style>` blocks in `curler.html`, `hapicFinger.html`, `RCcar.html` — move to `project.css`

---

## SEO

- [ ] **S-1** No `<link rel="canonical">` on any page
- [ ] **S-2** No Open Graph / Twitter Card meta tags — pages unfurl blank when shared
- [ ] **S-5** `sitemap.html` has no actual sitemap content (links to pages or XML sitemap)
- [ ] **S-6** No JSON-LD `Person` schema on `index.html`

---

## Security

- [ ] **SC-1** YouTube embeds use `youtube.com` — switch to `youtube-nocookie.com` in all `.yt-facade` JS handlers
- [ ] **SC-2** No Content-Security-Policy meta tag on any page
