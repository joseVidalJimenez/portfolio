# Portfolio Project Page — Style Guide
> A reusable design system for José Vidal's project case study pages.

---

## 1. Page Structure

Every project page follows this section order:

1. **Hero** — Project title, category, metadata, and a featured image
2. **Info Cards** — Description · My Role · Outcome (3-column)
3. **In Context** — Real-world usage or deployment, image + text side-by-side
4. **Design Overview** — Key visuals, renders, or diagrams in a 2-column grid
5. **Technical Analysis** — 2×2 card grid breaking down the core technical decisions
6. **Prototyping Process** — Numbered steps + process photos
7. **In Action** — Demo video or final result, image + text side-by-side
8. **Key Innovation** — Closing summary of what makes the project novel
9. **Footer CTA** — Back-to-portfolio button

> **Optional section:** If the project includes a distinct subsystem (electronics, software, structural), add a dedicated section between Prototyping and In Action. Keep it to one image and three short cards maximum so it reads as supporting detail, not a second project.

---

## 2. Color Palette

| Role | Value | Usage |
|---|---|---|
| Background | `#1a1a1a` | Hero and footer backgrounds |
| Surface | `#f5f5f5` | Page and section backgrounds |
| Accent | `#CC0000` | Section borders, CTA button, collage arrows |
| Text Primary | `#ffffff` (on dark) / `#1a1a1a` (on light) | Body and heading text |
| Text Secondary | `#888888` | Captions, metadata, labels |
| Card Background | `#ffffff` | Info cards, analysis cards |
| Card Border | `#e0e0e0` | Subtle card outlines |

**Rule:** Use the red accent sparingly — left-border on section headings, CTA button, category label, and collage arrows only.

---

## 3. Typography

| Element | Font | Size | Notes |
|---|---|---|---|
| **Project Title (H1)** | Bebas Neue | 48–56px | White, on dark hero |
| **Section Headings (H2)** | Bebas Neue | 22–26px | Dark, with 4px red left-border |
| **Card Titles (H3)** | Bebas Neue | 14–16px | Dark, numbered prefix |
| **Body Text** | DM Sans | 14–15px | Line-height 1.6, dark gray |
| **Labels / Metadata** | DM Sans | 10–11px | Uppercase, red or gray, letter-spacing 0.1em |
| **Captions** | DM Sans | 11–12px | Italic, `#888888`, centered below images |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

**CSS baseline:**
```css
h1, h2, h3 { font-family: 'Bebas Neue', sans-serif; }
body        { font-family: 'DM Sans', sans-serif; }
```

---

## 4. Hero Section

```
┌─────────────────────────────────────────────────┐
│  [Dark background #1a1a1a]                       │
│                                                  │
│  CATEGORY · DEPARTMENT · YEAR   ← red label     │
│  Project Title                  ← Bebas Neue H1 │
│  Short subtitle / tagline       ← DM Sans       │
│                              [Featured image →]  │
└─────────────────────────────────────────────────┘
```

- **Featured image:** Floats right with no white box — transparent or dark container only, no card treatment
- **Category label:** Uppercase red, DM Sans, small, above the title

---

## 5. Info Cards (3-Column)

Three equal-width cards immediately below the hero:

- **Labels:** Uppercase red, DM Sans 10px (e.g., `DESCRIPTION`, `MY ROLE`, `OUTCOME`)
- **Content:** DM Sans regular, 13–14px
- **Style:** White card, `1px solid #e0e0e0`, 16–20px padding, equal height
- **Length:** 3 sentences maximum per card — quick-read summaries only. Anything covered in depth lower on the page should not be repeated here.

---

## 6. Section Headings

All H2 section headings:

- Bebas Neue, ~22px
- Left-border: `4px solid #CC0000`
- Padding-left: `12px`
- No background — sits directly on the page surface

---

## 7. Image Treatment

**Rules for all images:**

- **Uniform aspect ratio** within any grid (e.g., all 16:9 or all 4:3)
- **Consistent container:** `border-radius: 8px`, `box-shadow: 0 2px 12px rgba(0,0,0,0.08)`
- **No raw floating images** — always inside a framed container or grid cell
- **Captions:** Always present, DM Sans italic, `#888888`, centered beneath

**Side-by-side image/text layout:**

Always let the text column set the row height — never the image:

```css
.section-row {
  display: flex;
  align-items: stretch;
}
.section-row img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center; /* adjust to top or bottom if crop hides key content */
}
```

If no crop preserves the key content, use a **lightbox on click** — never hover expand, which breaks on mobile.

**Narrative image pairs:**

Two images with a clear relationship (before/after, internal/external, component/assembled) can be combined in a collage with a single `#CC0000` arrow pointing left to right. No label on the arrow. Both images must have white or transparent backgrounds.

**Standard grid patterns:**

| Layout type | Structure |
|---|---|
| Overview / diagrams | 2-column equal-width grid |
| Process photos | 2-column equal-height grid |
| In Context / In Action | Image left 40% + text right 60% |

---

## 8. Technical Analysis Cards (2×2 Grid)

- **Title:** Bebas Neue, 14–16px, with a plain numbered prefix (e.g., `1.`)
- **Body:** DM Sans regular, 13px, muted gray
- **Card style:** `background: #fff`, `border: 1px solid #e0e0e0`, `border-radius: 8px`, `padding: 20px`
- **Grid:** 2 columns, equal width, 16px gap
- **No decorative circles or icons** on the numbering

---

## 9. Prototyping Process Steps

- **Layout:** 2-column grid of step cards
- **Step indicator:** Small dark numbered badge, ~24px
- **Text:** DM Sans, concise, 13px, 2 sentences maximum per step
- **Card:** `background: #f5f5f5`, no heavy border
- **Followed by:** 2-column equal-height photo grid

---

## 10. Key Innovation Section

Every project page closes with a Key Innovation section before the footer:

- **Purpose:** Summarise what makes the project technically novel in plain language
- **Structure:** 2 paragraphs — first for a technical audience (mechanisms, methods, trade-offs), second for a general audience (outcome, applications, broader significance)
- **Tone:** State facts and contrasts, not self-promotion. Contrast against conventional approaches where relevant ("which normally requires...") — this is more persuasive than describing your solution alone.

---

## 11. Footer CTA

```
┌─────────────────────────────────────────────────┐
│  [Dark background #1a1a1a]                       │
│                                                  │
│  Explore more projects                           │
│  See the full range of work in the portfolio.    │
│                          [ Back to Portfolio → ] │
└─────────────────────────────────────────────────┘
```

- Button: `background: #CC0000`, white text, right-aligned, `border-radius: 4px`

---

## 12. Navigation

- **Style:** `background: #1a1a1a`, white text links
- **Name/Logo:** Left-aligned, Bebas Neue
- **Links:** Right-aligned, DM Sans regular, hover with red color shift
- **Sticky:** Yes — fixed at top on scroll

---

## 13. Spacing System

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 8px | Inner card padding minimum |
| `--space-sm` | 16px | Card padding, grid gap |
| `--space-md` | 32px | Between elements within a section |
| `--space-lg` | 64px | Between sections |
| `--space-xl` | 96px | Hero vertical padding |

---

## 14. Content & Copy

### Special Character Encoding

When pasting content from Word, Google Docs, or any rich-text source, special characters can corrupt silently:

| Intended | Corrupted |
|---|---|
| `—` em dash | `â€"` |
| `"` `"` smart quotes | `â€œ` `â€` |
| `'` apostrophe | `â€™` |
| `…` ellipsis | `â€¦` |

- Always use HTML entities: `&mdash;` `&ldquo;` `&rdquo;` `&rsquo;` `&hellip;`
- Set `<meta charset="UTF-8">` in every page `<head>`
- Visually scan the rendered page for garbled characters before publishing

### Technical Writing

- Use correct domain terminology — it signals expertise without alienating a general reader
- Contrast your solution against the conventional approach: *"which normally requires..."* is more persuasive than describing your design alone
- Card text should state facts, not justify them — at small sizes, justifications read as padding

---

## 15. Working with Agents

When asking a coding agent to fix a specific CSS or layout issue, always end the prompt with:

> "Do not change the text, font, or any other section on the page."

Without this, agents routinely modify things outside the scope of the fix.

---

## 16. Pre-Publish Checklist

- [ ] Hero has dark background, red category label, no white box on featured image
- [ ] Info cards are 3 sentences maximum each, no repeated detail from lower sections
- [ ] All section headings use Bebas Neue with red left-border
- [ ] Side-by-side rows use `object-fit: cover` — text drives the height, not the image
- [ ] All grid images share the same aspect ratio
- [ ] All images have `border-radius: 8px`, shadow, and a caption
- [ ] Narrative image pairs use a collage with a single red arrow, white/transparent backgrounds
- [ ] Technical Analysis uses the 2×2 card grid with numbered plain prefixes
- [ ] Key Innovation section is present as a closing summary
- [ ] Page ends with dark footer CTA and back-to-portfolio button
- [ ] Red accent is used sparingly throughout
- [ ] `<meta charset="UTF-8">` is in the page `<head>`
- [ ] Body text scanned for encoding artifacts
- [ ] Domain terminology is used correctly and consistently

---
