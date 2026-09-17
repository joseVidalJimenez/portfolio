# Design Manifesto — José Vidal Portfolio Website

A living document tracking design decisions, conventions, and intent.
Future contributors (human or AI) should read this before making changes.

---

## Purpose

A personal portfolio website for José Vidal, a design engineer pivoting into mechatronics.
The site is hosted on **GitHub Pages** and served from the `/docs` folder.

**Primary goals:**
- Showcase professional engineering work to potential employers/clients
- Demonstrate the breadth of skills: mechanical design, mechatronics, embedded systems
- Present a credible, clean, professional first impression

---

## Site Architecture

```
docs/
├── showcase.html       ← Visual showcase / hero — curated highlights grid only
├── portfolio.html      ← Full professional project index (card listing)
├── hobbies.html        ← Personal / hobby projects (separate from professional work)
├── journal.html        ← Blog / notes (future content)
├── about.html          ← Personal bio and background
├── contact.html        ← Contact form (posts to Web3Forms API)
├── sitemap.html        ← Site map
├── thanktyoupage.html  ← Form submission redirect
├── css/
│   ├── styles.css      ← All global styles (navbar, footer, grid, cards, forms)
│   └── project.css     ← Layout for individual project detail pages
├── scripts/
│   └── contact.js      ← Form submit handler posting to Web3Forms API endpoint
├── images/
│   ├── favicon_brand.png
│   ├── thumbnails/     ← Homepage and listing card thumbnails (webp preferred)
│   └── projects/       ← Per-project image folders
│       ├── backpack/
│       ├── curler/
│       ├── hapicFinger/
│       └── (add one subfolder per project)
└── portfolio/          ← Individual project detail pages
    ├── backpack.html
    ├── curler.html
    ├── hapicFinger.html
    ├── planter.html
    ├── plug.html        ← Universal Cable Adapter (UCA)
    └── RCcar.html
```

Planning notes and content drafts live in `_planning/` at the repo root (not served).

---

## Page Roles — What Belongs Where

| Page | Role | Should NOT contain |
|---|---|---|
| `showcase.html` | Visual first impression, curated grid of ~6 best projects | Full project descriptions, long text |
| `portfolio.html` | Complete listing of professional projects with brief summaries | Hobby projects |
| `hobbies.html` | Personal/hobby projects (RC car, WombleBot, side experiments) | Client/paid work |
| `portfolio/*.html` | Full project detail: context, role, process, outcome, images | Navigation clutter |
| `about.html` | Personal bio — personality, journey, interests | CV/resume format |
| `journal.html` | Learning notes, experiments, thoughts (informal) | Polished project write-ups |

---

## Navigation

**Navbar order:** `Home | Portfolio | Hobbies | Journal | About | Contact`

- Navbar is fixed, height 60px, dark background `#333`
- All pages share the exact same navbar HTML
- Pages inside `portfolio/` use `../` relative paths for all links and assets
- Active page is NOT currently highlighted (potential future improvement)

---

## Visual Design

### Colours
| Token | Value | Used for |
|---|---|---|
| Background | `#a0a0a0` | Page body |
| Navbar / Footer | `#333` | Bars |
| Accent / hover | `#cb4444` | Navbar hover, card links |
| Card background | `#fff` | Project cards |
| Form background | `#f2f2f2` | Contact form container |
| Submit button | `#04AA6D` | Form submit |

### Typography
- Font family: `Arial, sans-serif` (system font, no external dependency)
- H2 headings: centred
- Body text: left-aligned

### Images
- Prefer `.webp` format for thumbnails (fallback `.png`/`.jpg` kept alongside)
- Thumbnails sized to display at `200px` height in cards, `object-fit: cover`
- Homepage grid images use `object-fit: cover` to fill grid cells

---

## Layout Patterns

### Homepage Grid (`showcase.html`)
- CSS Grid, 3 columns
- Item 1 spans 2 rows (tall left feature slot — currently Curler)
- Item 6 spans 2 columns (wide bottom slot — currently RC Car → hobbies)
- Hover reveals overlay label

### Project Card (`.card`)
- Used on `portfolio.html` and `hobbies.html`
- Responsive grid: `repeat(auto-fill, minmax(280px, 1fr))`
- Structure: thumbnail → title → company (italic, muted) → summary → "View project →"
- Hover: lifts with `translateY(-4px)` + deeper shadow

### Project Detail Page
- Uses `project.css` for alternating image/text layout
- CSS float-based (left/right image sections with clearfix)
- Container: `80%` width, centred

### Attributions
When a project page includes work by a collaborator or external party (e.g. industrial design, branding, photography), add a single attribution line directly below the overview cards using this format:

```html
<p style="font-family: 'Inter', Arial, sans-serif; font-size: 0.8rem; line-height: 1.6; color: #888; margin: 16px 0 0;">Attributions: [Role] by [Name/Studio]</p>
```

- Keep it secondary — small, muted grey (`#888`), no heading
- One line per attribution; comma-separate multiple roles from the same party
- Place it inside the overview `project-section` div, after the closing `</div>` of `.overview-grid`

---

## Content Conventions

### Project write-ups follow this structure:
1. **Title** — short, descriptive
2. **Company** — client or employer
3. **Description** — what the project was
4. **My Role** — specific contributions only (not generic team descriptions)
5. **Outcome** — concrete result, what was delivered

### Project classification
| Project | Page | Classification |
|---|---|---|
| Curler – Heating Barrel | `projects/curler.html` | Professional |
| Curler – Control Board | `projects/curler.html` | Professional |
| Tactile Haptic System | `projects/hapicFinger.html` | Professional |
| Targeted Irrigation (Planter) | `projects/planter.html` | Professional |
| BackPack Arm | `projects/backpack.html` | Professional |
| Universal Cable Adapter | `projects/plug.html` | Professional |
| WombleBot RC Car | `projects/RCcar.html` | Hobby |

---

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-02 | Serve from `/docs` not repo root | GitHub Pages convention, keeps source separate |
| 2026-02 | `homePage.html` → `index.html` | GitHub Pages serves `index.html` automatically as root |
| 2026-02 | Rejected Jekyll/SSG for now | Added complexity before site is complete; revisit if content management becomes painful |
| 2026-02 | Split `index.html` (showcase) vs `portfolio.html` (full listing) | Showcase = immediate visual impact; portfolio = complete searchable record |
| 2026-02 | `hobbies.html` as separate page | Keeps professional portfolio clean; hobby projects still visible and show personality |
| 2026-02 | Images split into `thumbnails/` and `projects/` | Thumbnails are display assets; project images are content — different lifecycle |
| 2026-02 | Planning `.txt` files moved to `_planning/` | Not web assets; should not be served or clutter `docs/` |
| 2026-02 | `css/projects/project.css` → `css/project.css` | Unnecessary nesting; single level is simpler |
| 2026-02 | `images/valkery/` → `images/projects/hapicFinger/` | Folder name should match project, not client codename |
| 2026-02 | Background colour kept as `#a0a0a0` | User preference |
| 2026-02 | `portfolio/` folder renamed to `projects/` | Neutral name; classification (professional vs hobby) belongs in listing pages, not the URL. Avoids file moves if a project changes category. |
| 2026-02 | Switched contact form backend to Web3Forms | The previous Google Apps Script URL was publicly visible in JS source, exposing a spam-able endpoint. Web3Forms replaces it with an opaque access key — the owner's email is never in the code. Includes built-in honeypot spam protection. Free with no submission limit. |

---

## Known Issues / To-Do

- [x] `projects/curler.html` — populated (Curler #1 + #2 on same page)
- [x] `projects/hapicFinger.html` — populated with images
- [x] `projects/planter.html` — populated
- [x] `projects/plug.html` — populated
- [x] `projects/RCcar.html` — populated (WombleBot)
- [x] `about.html` — expanded: Skills, Professional Experience, Education & Certifications
- [x] `index.html` — intro updated from 2_Introduction.txt
- [ ] `journal.html` — empty, needs content or a "coming soon" stub
- [ ] `sitemap.html` — empty navbar only, needs actual sitemap links
- [ ] `thanktyoupage.html` — empty, needs a proper thank-you message
- [ ] Navbar collapses poorly on mobile (noted: name disappears on resize)
- [ ] Footer spacing too wide on mobile
- [ ] No active page indicator on navbar
- [x] `projects/backpack.html` — nav/footer paths fixed
- [ ] Two Curler projects currently share one page — consider splitting into separate detail pages

- [ ] Education cert years are TBD — fill in when available
