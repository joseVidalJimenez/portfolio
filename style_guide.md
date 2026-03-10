# Portfolio Project Page — Style Guide & AI Template
> Exact design system for José Vidal's project case study pages.
> Use this file as a reference when building new project pages.

---

## PROMPT — How to use this file with an AI

Paste this prompt followed by the full contents of this file:

```
You are building a project case study HTML page for the portfolio of José Vidal.
The page must exactly follow the design system in this document — use only the
class names, colours, fonts, and layout patterns listed here. Do not invent new
class names, do not change any colour values, and do not modify the navbar or
footer markup.

Project details to fill in:
- Title: [PROJECT TITLE]
- Category label: [DISCIPLINE · CLIENT / CONTEXT · YEAR]
- Tagline: [ONE LINE DESCRIBING WHAT THE PROJECT IS]
- Hero image path: ../images/projects/[FOLDER]/[FILENAME].webp
- Hero image alt text: [DESCRIPTION]

Sections to include (use only the patterns from this document):
1. Info Cards — Description, My Role, Outcome
2. [SECTION NAME] — In-context or deployment photo + 3 paragraphs
3. Design Overview — 2 portrait-frame images + captions
4. [ANALYSIS SECTION NAME] — 4-card analysis grid
5. Prototyping Process — section-intro + 4 steps + image pair (photo + video)
6. [OPTIONAL SUBSYSTEM SECTION] — section-intro + wide image + 3 cards + closing line
7. [IN ACTION SECTION] — section-intro + deployed-grid (9:16 video left, text right)
8. Key Innovation — 2–3 paragraphs

For each section, I will provide the copy below. Output a complete, valid HTML
file named [FILENAME].html in the same structure as the template.

[PASTE YOUR SECTION CONTENT HERE]
```

---

## 1. Design Tokens

These are the exact values used in `docs/css/project.css`. Do not substitute.

| Token | Value | Where used |
|---|---|---|
| Accent | `#cb4444` | Section h2 bar, card left-borders, yt-play button, CTA button |
| Hero background | `#111` | `.project-hero`, `.project-cta` |
| Page background | `#f2f2f2` | `.project-body` |
| Card background | `#ffffff` | All cards |
| Image frame background | `#1c1c1c` | `.img-frame` (dark placeholder while loading) |
| Primary text | `#111` | Headings |
| Body text | `#333` / `#444` | Card and section body copy |
| Muted text | `#555` | `.section-intro`, `.elec-closing` |
| Caption / meta text | `#888` | `.media-caption`, CTA sub-text |

---

## 2. Typography

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| H1 — Project title | Bebas Neue | `clamp(3rem, 6.5vw, 5rem)` | 400 | White, `letter-spacing: 0.03em` |
| H2 — Section headings | Bebas Neue | `2.2rem` | 400 | Dark `#111`, `letter-spacing: 0.04em`, red `::before` bar |
| H3 — CTA heading | Bebas Neue | `1.9rem` | 400 | White |
| H4 — Card titles | Inter | `0.7rem`–`0.95rem` | 700 | Uppercase, `#cb4444` or `#111` depending on card type |
| Body / paragraphs | Inter | `0.9rem`–`0.95rem` | 400 | `line-height: 1.72`–`1.78` |
| Hero label | Inter | `0.75rem` | 600 | Uppercase, `#cb4444`, `letter-spacing: 0.14em` |
| Hero tagline | Inter | `1rem` | 400 | `#aaa`, `line-height: 1.65` |
| Media captions | Inter | `0.8rem` | 400 | `#888`, centered |

**Google Fonts import (already in `project.css` — do not add it again to individual pages):**
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');
```

---

## 3. File Head (copy exactly)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>[PROJECT TITLE] &ndash; José Vidal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[ONE SENTENCE PROJECT DESCRIPTION]. Designed by José Vidal.">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/project.css">
  </head>
```

---

## 4. Navbar (copy exactly — do not modify)

```html
<div class="navbar">
  <div class="navbar-layout">
    <div class="navbar-icon">
      <img src="../images/favicon_brand.png" alt="Logo." width="20px" height="20px" loading="eager">
    </div>
    <div class="navbar-name">José Vidal</div>
    <div class="navbar-menu">
      <a href="../index.html">Home</a>
      <a href="../portfolio.html">Portfolio</a>
      <a href="../hobbies.html">Hobbies</a>
      <a href="../journal.html">Journal</a>
      <a href="../about.html">About</a>
      <a href="../contact.html">Contact</a>
    </div>
  </div>
</div>
```

---

## 5. Hero Section

```html
<div class="project-hero">
  <div class="project-hero__inner">
    <div class="project-hero__text">
      <span class="project-hero__label">[DISCIPLINE] &middot; [CLIENT / CONTEXT] &middot; [YEAR]</span>
      <h1 class="project-hero__title">[PROJECT TITLE]</h1>
      <p class="project-hero__tagline">[TAGLINE — one sentence, plain language]</p>
    </div>
    <div class="project-hero__img-wrap">
      <img src="../images/projects/[FOLDER]/[HERO IMAGE].webp"
           alt="[PROJECT] — [brief image description]"
           class="project-hero__img">
    </div>
  </div>
</div>
```

**Rules:**
- Hero image: no card box, no background, no border — `project-hero__img-wrap` has `position: relative` only
- Use `.webp` format for hero images
- Label is uppercase, accent red, separated by `&middot;`

---

## 6. Page Body Wrapper (copy exactly)

```html
<div class="project-body">
  <div class="project-container">
    <!-- all sections go here -->
  </div>
</div>
```

---

## 7. Section Patterns

### 7.1 Info Cards (always first section, no H2)

```html
<div class="project-section">
  <div class="overview-grid">
    <div class="overview-block">
      <h4>Description</h4>
      <p>[2–3 sentences: what the project is and what it does]</p>
    </div>
    <div class="overview-block">
      <h4>My Role</h4>
      <p>[2–3 sentences: what you specifically designed or built]</p>
    </div>
    <div class="overview-block">
      <h4>Outcome</h4>
      <p>[2–3 sentences: what was delivered and why it matters]</p>
    </div>
  </div>
</div>
```

**Rules:** 3 sentences max per card. No detail that is covered in depth lower on the page.

---

### 7.2 In-Context Section (photo left, text right)

Use when showing the project deployed or in its real environment.

```html
<div class="project-section">
  <h2>[SECTION TITLE e.g. "Deployed on Set"]</h2>
  <div class="deployed-grid" style="align-items: stretch;">
    <div style="position: relative; overflow: hidden; border-radius: 10px;
                box-shadow: 0 4px 22px rgba(0,0,0,0.13); background: #1c1c1c; min-height: 240px;">
      <img src="../images/projects/[FOLDER]/[IMAGE].webp"
           alt="[description]"
           style="position: absolute; inset: 0; width: 100%; height: 100%;
                  object-fit: cover; object-position: top; display: block;">
      <button class="img-expand-btn" aria-label="View full image">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      </button>
    </div>
    <div class="deployed-text">
      <p>[paragraph 1]</p>
      <p>[paragraph 2]</p>
      <p>[paragraph 3]</p>
    </div>
  </div>
</div>
```

**Rules:**
- The image wrapper uses inline styles (not a class) so the image stretches to match text height
- Always include the expand button — it triggers the lightbox (see Section 11)
- `object-position: top` — change to `center` or `bottom` if the subject is not at the top
- Text: 3 paragraphs, each ~2–3 sentences

---

### 7.3 Design Overview (2-column portrait images)

Use for annotated diagrams, CAD renders, or key reference images.

```html
<div class="project-section">
  <h2>Design Overview</h2>
  <div class="image-pair">
    <div>
      <div class="img-frame img-frame--portrait">
        <img src="../images/projects/[FOLDER]/[IMAGE1].png"
             alt="[description]" class="pair-img"
             style="object-fit: contain; background: #fff;">
      </div>
      <p class="media-caption">[Caption for image 1]</p>
    </div>
    <div>
      <div class="img-frame img-frame--portrait">
        <img src="../images/projects/[FOLDER]/[IMAGE2].png"
             alt="[description]" class="pair-img"
             style="object-fit: contain; background: #fff;">
      </div>
      <p class="media-caption">[Caption for image 2]</p>
    </div>
  </div>
</div>
```

**Rules:**
- Use `object-fit: contain; background: #fff` for diagrams/renders with white/transparent backgrounds
- Use `object-fit: cover` (no background override) for photographs
- If an image is slightly too zoomed out, add `style="object-fit: contain; background: #fff; transform: scale(1.2); transform-origin: center;"` to the `<img>`
- `.img-frame--portrait` = 3:4 ratio. Use `.img-frame--wide` (16:9) for landscape photos/screenshots

---

### 7.4 Technical Analysis (2×2 card grid)

```html
<div class="project-section">
  <h2>[ANALYSIS SECTION TITLE]</h2>
  <div class="analysis-grid">
    <div class="analysis-card">
      <h4>1. [Card title]</h4>
      <p>[Technical explanation, 3–5 sentences. State facts and mechanisms. Contrast against conventional approaches where relevant.]</p>
    </div>
    <div class="analysis-card">
      <h4>2. [Card title]</h4>
      <p>[...]</p>
    </div>
    <div class="analysis-card">
      <h4>3. [Card title]</h4>
      <p>[...]</p>
    </div>
    <div class="analysis-card">
      <h4>4. [Card title]</h4>
      <p>[...]</p>
    </div>
  </div>
</div>
```

**Rules:** Number prefixes are plain text (e.g. `1.`), no decorative badges. No icons. Left border is `#cb4444` (from the CSS class — do not add inline styles).

---

### 7.5 Prototyping Process

```html
<div class="project-section">
  <h2>Prototyping Process</h2>
  <p class="section-intro">[1–2 sentence intro describing the overall approach]</p>
  <ol class="proto-steps">
    <li>[Step 1 — 1–2 sentences]</li>
    <li>[Step 2 — 1–2 sentences]</li>
    <li>[Step 3 — 1–2 sentences]</li>
    <li>[Step 4 — 1–2 sentences]</li>
  </ol>
  <div class="image-pair">
    <div>
      <div class="img-frame img-frame--wide">
        <img src="../images/projects/[FOLDER]/[PHOTO].jpg"
             alt="[description]" class="pair-img">
      </div>
      <p class="media-caption">[Caption]</p>
    </div>
    <div>
      <div class="img-frame img-frame--wide">
        <div class="yt-facade" data-id="[YOUTUBE_VIDEO_ID]">
          <img src="https://i.ytimg.com/vi/[YOUTUBE_VIDEO_ID]/hqdefault.jpg"
               alt="[Video description]" class="yt-thumb">
          <span class="yt-play">&#9654;</span>
        </div>
      </div>
      <p class="media-caption">[Caption]</p>
    </div>
  </div>
</div>
```

**Rules:** Both images must use `.img-frame--wide` (16:9) so heights match. Replace `[YOUTUBE_VIDEO_ID]` with the 11-character ID from the YouTube URL.

---

### 7.6 Optional Subsystem Section (e.g. Electronics, Software, Structure)

Use only if there is a distinct subsystem worth documenting. Keep it to one image + three cards maximum.

```html
<div class="project-section">
  <h2>[SUBSYSTEM TITLE]</h2>
  <p class="section-intro">[1–2 sentence intro]</p>
  <div class="img-frame img-frame--wide" style="margin-bottom: 28px; aspect-ratio: 16 / 5;">
    <img src="../images/projects/[FOLDER]/[IMAGE].webp"
         alt="[description]" class="pair-img"
         style="object-fit: contain; background: #fff;">
  </div>
  <div class="elec-grid">
    <div class="elec-card">
      <h4>[Card 1 title]</h4>
      <p>[2–3 sentences]</p>
    </div>
    <div class="elec-card">
      <h4>[Card 2 title]</h4>
      <p>[2–3 sentences]</p>
    </div>
    <div class="elec-card">
      <h4>[Card 3 title]</h4>
      <p>[2–3 sentences]</p>
    </div>
  </div>
  <p class="elec-closing">[1 sentence closing — a tightly composed summary of the subsystem's role]</p>
</div>
```

---

### 7.7 In Action Section (9:16 video left, text right)

```html
<div class="project-section">
  <h2>[SECTION TITLE e.g. "Arm in Action"]</h2>
  <p class="section-intro">[1 sentence describing what the video shows]</p>
  <div class="deployed-grid">
    <div class="video-wrapper-9x16">
      <div class="yt-facade" data-id="[YOUTUBE_VIDEO_ID]">
        <img src="https://i.ytimg.com/vi/[YOUTUBE_VIDEO_ID]/hqdefault.jpg"
             alt="[Video description]" class="yt-thumb">
        <span class="yt-play">&#9654;</span>
      </div>
    </div>
    <div class="deployed-text">
      <p>[paragraph 1]</p>
      <p>[paragraph 2]</p>
      <p>[paragraph 3]</p>
    </div>
  </div>
</div>
```

**Note:** For 16:9 videos use `.video-wrapper-16x9` instead and wrap the full pair in `.image-pair`.

---

### 7.8 Key Innovation (always last section before CTA)

```html
<div class="project-section">
  <h2>Key Innovation</h2>
  <div class="innovation-body">
    <p>[Technical paragraph — explain the core mechanism or method, what makes it novel, contrast against the conventional approach. Target: engineers and designers.]</p>
    <p>[Supporting paragraph — cover a secondary aspect (e.g. return mechanism, packaging, trade-offs).]</p>
    <p>[Closing paragraph — plain-language summary of what was replaced or eliminated and with what. One sentence is fine.]</p>
  </div>
</div>
```

---

### 7.9 Footer CTA (copy exactly)

```html
<div class="project-cta">
  <div class="project-cta__text">
    <h3>Explore more projects</h3>
    <p>See the full range of mechanical and product design work in the portfolio.</p>
  </div>
  <a href="../portfolio.html" class="project-cta__btn">Back to Portfolio &rarr;</a>
</div>
```

---

## 8. Footer (copy exactly — do not modify)

```html
<div class="footer">
  <div class="footer-layout">
    <div class="footer-text"><p>&copy;Jose Vidal</p></div>
    <div class="footer-link"><a href="../sitemap.html">Sitemap</a></div>
    <div class="footer-link">
      <a href="https://www.linkedin.com/in/vidaljose/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
    <div class="footer-link">
      <a href="https://github.com/joseVidalJimenez" target="_blank" rel="noopener noreferrer">Github</a>
    </div>
    <div class="footer-link"><a href="../contact.html">Contact</a></div>
    <div class="footer-text"><p>Designed by: Jose Vidal</p></div>
  </div>
</div>
```

---

## 9. Lightbox Overlay (copy exactly — required if any page uses `.img-expand-btn`)

Place this just before `</body>`:

```html
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Full image view">
  <button class="lightbox__close" aria-label="Close">&times;</button>
  <img class="lightbox__img" src="" alt="">
</div>
```

---

## 10. Scripts (copy exactly — place after `</body>`, before `</html>`)

```html
<script>
  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox__img');

  document.querySelectorAll('.img-expand-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const img = btn.parentElement.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox__close')) {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // YouTube lite-embed
  document.querySelectorAll('.yt-facade').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = el.querySelector('.yt-thumb').alt;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:4px;';
      el.replaceWith(iframe);
    });
  });
</script>
```

---

## 11. Image & Asset Rules

| Image type | Frame class | `object-fit` | Background override | Notes |
|---|---|---|---|---|
| Photo (person, object in environment) | default `.img-frame` (4:3) or `.img-frame--wide` (16:9) | `cover` | none | Crops to fill frame |
| Diagram / annotated drawing | `.img-frame--portrait` (3:4) | `contain` | `background: #fff` | Shows full image |
| CAD render (white/transparent bg) | `.img-frame--portrait` (3:4) | `contain` | `background: #fff` | Shows full render |
| Electronics / component spread | `.img-frame--wide` + `aspect-ratio: 16/5` inline | `contain` | `background: #fff` | Banner-style image |
| In-context deployment photo | inline wrapper (see 7.2) | `cover` | dark `#1c1c1c` built in | Fills text column height |
| Video thumbnail (16:9) | `.img-frame--wide` + `.yt-facade` inside | — | — | Click-to-embed |
| Video thumbnail (9:16) | `.video-wrapper-9x16` + `.yt-facade` inside | — | — | Click-to-embed |

**Always:**
- Add a `.media-caption` paragraph after every `.img-frame` wrapper
- Use `alt` text on every image
- Use `.webp` for photos, `.png` for diagrams/renders, `.jpg` only if source is JPEG

---

## 12. Content & Copy Rules

- **Info cards:** max 3 sentences each. Do not repeat detail that appears in a section below.
- **Analysis cards:** state mechanisms and trade-offs. Lead with the technical claim, then explain. Use correct domain terminology.
- **Contrastive writing:** *"which normally requires..."* is more persuasive than describing your solution alone.
- **Encoding:** always use HTML entities for special characters: `&mdash;` `&ndash;` `&ldquo;` `&rdquo;` `&rsquo;` `&hellip;` `&middot;` `&amp;`
- **Do not** include the word "innovative" or "unique" — show the novelty through mechanism description instead.

---

## 13. Pre-Publish Checklist

- [ ] `<meta charset="UTF-8">` in `<head>`
- [ ] Both CSS files linked: `styles.css` and `project.css`
- [ ] Hero image: `.webp`, no card box on `.project-hero__img-wrap`
- [ ] Category label is uppercase red, separated by `&middot;`
- [ ] Info cards: 3 sentences max each
- [ ] All section `<h2>` use Bebas Neue (comes from `.project-section h2` rule — no inline style needed)
- [ ] In-context section: image wrapper uses inline styles (Section 7.2 pattern), expand button present
- [ ] Lightbox overlay `<div>` present before `</body>`
- [ ] Both script blocks present (lightbox + yt-facade)
- [ ] YouTube embeds: `data-id` set, thumbnail URL correct, `rel=0` in embed src
- [ ] All grid images within the same grid share the same aspect ratio
- [ ] Every image frame has a `.media-caption` below it
- [ ] Key Innovation section present before the CTA
- [ ] CTA text and button are unchanged from the template
- [ ] Footer markup is unchanged from the template
- [ ] Page scanned visually for encoding artifacts (`â€"`, `â€™`, etc.)
- [ ] New page added to `docs/sitemap.html`

---
