# Plan: Implement Plasma Field Design System — Full Site Redesign

## Context

The VM Pro Lab site is getting a complete visual overhaul from its current clean/minimal blue aesthetic to the **Plasma Field: Geometric System** direction — a dark-dominant, cyan/blue accent, geometric aesthetic with animated CSS Venn diagrams and glow effects. A hero-section prototype already exists at `.claude/prototypes/direction-3-plasma-field.html` and a comprehensive implementation guide lives at `.claude/docs/plasma-field-implementation-guide.md`.

The `frontend-designer` agent will execute this plan. The implementation order is: **CSS first → HTML second → JS last → Verify**.

## Files to Modify

| File | Action | Notes |
|---|---|---|
| `css/styles.css` | **Rewrite** | Complete restyle with Plasma Field design system |
| `index.html` | **Rewrite** | New HTML structure (hero Venn diagram), updated inline critical CSS |
| `js/main.js` | **Preserve** | Only touch if HTML selector changes require it |

## Pre-Implementation Checklist

Before writing any code, the agent MUST:
1. Read `.claude/docs/plasma-field-implementation-guide.md` top-to-bottom (this is the single source of truth)
2. Read `.claude/prototypes/direction-3-plasma-field.html` (the hero prototype to match exactly)
3. Read current `css/styles.css`, `index.html`, and `js/main.js` to understand existing patterns
4. Understand all JS selectors that must be preserved (Section 3.1 of the guide)

---

## Phase 1: CSS — Rewrite `css/styles.css`

**Goal:** Replace the entire stylesheet with the Plasma Field design system while preserving the async-loading pattern.

### Task 1.1 — CSS Custom Properties (`:root`)
- Replace all current `:root` variables with the Plasma Field palette from Section 1.1
- Light mode defaults: new `--color-bg` (#F8FAFC), `--color-bg-alt` (#F1F5F9), `--color-bg-surface` (#FFFFFF), accent cyan/blue tokens, new border tokens with rgba values
- Add new tokens not in current CSS: `--color-accent-cyan`, `--color-accent-blue`, `--color-accent-blue-light`, `--color-border-subtle`, `--color-border-medium`, `--color-text-inverse`, `--color-error`, `--spacing-3xl`, `--border-radius-sm`, `--transition-fast`, `--transition-slow`
- Remove old tokens that no longer exist: `--color-primary`, `--color-primary-light`, `--color-accent` (replaced by cyan/blue split), `--color-accent-light`

### Task 1.2 — Dark Mode Variables
- Rewrite `@media (prefers-color-scheme: dark)` block with all Plasma Field dark tokens from Section 1.1
- New dark backgrounds: `--color-bg: #060814`, `--color-bg-alt: #0B0D1F`, `--color-bg-surface: #0E1029`
- Add glow layer tokens (dark mode only): `--glow-cyan`, `--glow-blue`, `--glow-cyan-soft`, `--glow-blue-soft`
- Update `--color-text-light` to `#A8B2E0` (WCAG 4.5:1 verified)

### Task 1.3 — Reset, Base, Typography
- Keep existing reset (`*, *::before, *::after { box-sizing }`)
- Update `body` styles: add `body::before` pseudo-element for dual-radial gradient background (Section 1.5)
- Implement full type scale from Section 1.2 table
- Add `.gradient-text` class (Section 1.6): `linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-blue-light))`

### Task 1.4 — Header / Navigation Styles
- `.header`: fixed, backdrop-filter blur(12px), transparent dark background, glass effect
- `.header.scrolled`: box-shadow + border-bottom
- `.logo`: weight 600, 0.875rem, includes `.nav-mark` (two overlapping mini circles)
- `.nav-link`: 0.8rem, weight 400, letter-spacing 0.05em, `--color-text-light`
- `.hamburger` + mobile menu: preserve existing toggle/focus-trap pattern
- Key classes: `.header`, `.nav`, `.logo`, `.nav-mark`, `.nav-menu`, `.nav-link`, `.hamburger`

### Task 1.5 — Hero Section Styles
- Match prototype exactly (`.claude/prototypes/direction-3-plasma-field.html`)
- Two-column grid (`1fr 1fr`), `min-height: 100vh`
- Venn diagram: `.venn-container` (340x220px), `.circle-a`, `.circle-b` (220x220px), `.intersection`
- Breathing animations: `@keyframes breathe-a` (blue glow), `@keyframes breathe-b` (cyan glow)
- Coordinate labels: `.coord-label` (0.55rem, uppercase, letter-spacing 0.15em)
- Content stack: `.eyebrow`, `.hero-wordmark`, `.hero-wordmark-sub`, `.hero-tagline`
- Stats row: `.hero-stats` with hairline borders
- Buttons: `.btn-primary` (gradient cyan→blue), `.btn-outline` (transparent + border)
- Mobile (<=768px): single column, diagram on top, smaller circles (280x180px)

### Task 1.6 — About Section Styles
- `.about`: background `--color-bg-alt`
- Team cards: `.card` on `--color-bg-surface`, border `--color-border`, hover lift + cyan glow border
- Photo: 120x120px circle, `border: 3px solid var(--color-accent-cyan)`, dark mode glow
- Role text: `--color-accent-blue-light`
- Links: `--color-accent-cyan`, hover: background tint + lift

### Task 1.7 — Services Section Styles
- Geometric icon treatment: 40x40px circle with gradient border (cyan→blue), emoji centered
- 2x2 grid, max-width 1000px
- Card hover: lift + cyan border tint

### Task 1.8 — Technologies Section Styles
- Badge: 150x150px, grayscale icons at 0.7 opacity, hover: full color
- Hover border: `rgba(0, 212, 255, 0.4)`
- Preserve font protection pattern (Devicon vs Inter)
- Mobile: 100x100px badges

### Task 1.9 — Projects Section Styles
- Status badges: "En produccion" = `--color-success`, "En desarrollo" = `--color-accent-cyan`
- Dark mode tags: `background: rgba(0, 212, 255, 0.08)`, `border: rgba(0, 212, 255, 0.2)`, `color: --color-accent-blue-light`
- Image hover: scale(1.05)

### Task 1.10 — Contact Section Styles
- Form on `--color-bg-surface`, dark mode glow `box-shadow: 0 0 40px rgba(0, 212, 255, 0.05)`
- Input focus: `border-color: var(--color-accent-cyan)`, cyan focus ring
- Submit: gradient background (cyan→blue), white text, hover glow

### Task 1.11 — Footer Styles
- Dark mode: `#050710` background or `--color-bg` with top border
- Links: `--color-accent-blue-light`, hover: `--color-accent-cyan`
- 3-column grid: `2fr 1fr 1fr`

### Task 1.12 — Animations & Reduced Motion
- Define all keyframes: `breathe-a`, `breathe-b`, `fadeIn`, `spin`
- Full hover effects catalog from Section 1.4
- Complete `@media (prefers-reduced-motion: reduce)` block

### Task 1.13 — Light Mode body::before
- Barely visible gradient tint: `rgba(0, 212, 255, 0.03)` and `rgba(66, 133, 244, 0.02)`

---

## Phase 2: HTML — Update `index.html`

**Goal:** Restructure the page with Plasma Field HTML, keeping all Spanish content and JS-required selectors intact.

### Task 2.1 — Update Inline Critical CSS in `<head>`
- Replace the minified critical CSS block with Plasma Field above-the-fold styles
- Must include: `:root` variables, reset, body, `body::before`, header, nav, hero section
- Keep the async stylesheet loading pattern: `media="print" onload="this.media='all'"`

### Task 2.2 — Restructure Header
- Add `.nav-mark` element (two overlapping mini circles) before logo text
- Keep all `data-menu-toggle`, `data-menu`, `.nav-link`, `.header` selectors
- Keep hamburger with same `aria-expanded`, `aria-label` attributes

### Task 2.3 — Rebuild Hero Section
- Replace current simple hero with Venn diagram layout from prototype
- Left column: `.venn-container` > `.circle-a` (with "V") + `.circle-b` (with "M") + `.intersection` + `.axis-line` + `.coord-label` elements
- Right column: `.eyebrow` + `<h1>` with `.hero-wordmark` / `.hero-wordmark-sub` / `.gradient-text` + tagline + CTA buttons + `.hero-stats`
- Preserve all existing Spanish text content

### Task 2.4 — Update About Section
- Keep `<article class="card team-card">` structure
- Keep `<picture>` elements with WebP + JPG
- Keep all team content (bios, highlights, links)
- Update classes to match Plasma Field styling

### Task 2.5 — Update Services Section
- Add geometric icon containers (gradient-border circles around emojis)
- Keep all 4 service cards with existing content

### Task 2.6 — Update Technologies Section
- Keep `id="technologies"` for JS lazy-loading
- Keep Devicon `<i>` elements and `.tech-icon-emoji` spans
- Keep tech category structure

### Task 2.7 — Update Projects Section
- Keep `<picture>` elements with WebP/JPG fallbacks
- Update status badge classes for new color scheme
- Keep CTA card with "Contactanos" button

### Task 2.8 — Update Contact Form
- **Preserve exactly:** `id="my-form"`, `id="name"`, `id="email"`, `id="message"`, `id="my-form-button"`, `id="my-form-status"`
- Preserve all `aria-required`, `aria-invalid`, `aria-describedby` attributes
- Preserve error `<span>` elements with `role="alert"`
- Preserve status `<p>` with `role="status" aria-live="polite"`
- Keep Formspree action URL

### Task 2.9 — Update Footer
- Update to 3-column grid layout
- Keep all links (GitHub, LinkedIn, email)

---

## Phase 3: JS — Verify `js/main.js` Compatibility

### Task 3.1 — Selector Audit
- Verify all required selectors exist in new HTML:
  - `[data-menu-toggle]`, `[data-menu]`, `.nav-link`, `.header`
  - `#my-form`, `#name`, `#email`, `#message`, `#my-form-button`, `#my-form-status`
  - `#technologies`, `#about`, `#services`, `#projects`, `#contact`
- Verify `.btn-loading`, `.btn-text`, `.btn-spinner` classes work with new button markup
- Only modify `js/main.js` if selectors changed

---

## Phase 4: Verification

### Task 4.1 — Visual Testing
- [ ] Dark mode renders correctly (should be the primary/dominant appearance)
- [ ] Light mode renders correctly (inverted, subtle background gradients)
- [ ] Mobile layout (<=768px) works for all sections
- [ ] Hero Venn diagram matches prototype appearance

### Task 4.2 — Accessibility Testing
- [ ] Color contrast passes WCAG AA (4.5:1 text, 3:1 UI/large text)
- [ ] Keyboard navigation works through all interactive elements
- [ ] Focus states visible on all buttons, links, form inputs
- [ ] Skip link works
- [ ] Mobile menu focus trap works
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] Screen reader can navigate all sections

### Task 4.3 — Functional Testing
- [ ] Sticky header + scroll shadow works
- [ ] Mobile hamburger menu opens/closes
- [ ] Active nav link highlighting works (IntersectionObserver)
- [ ] Contact form validation works (name, email, message)
- [ ] Contact form submission works (Formspree)
- [ ] Devicon lazy-loading triggers when Technologies section enters viewport
- [ ] All images load (WebP with JPG fallback)

### Task 4.4 — Performance Testing
- [ ] Run `npm run build` successfully
- [ ] Inline critical CSS is updated and minified
- [ ] Page weight < 100KB (own assets)
- [ ] < 10 HTTP requests
- [ ] No render-blocking resources
- [ ] Lighthouse 100/100 target

---

## Critical Constraints

1. **JS selectors are sacred** — never rename the IDs/classes/data-attributes listed in Section 3.1
2. **All user-facing text in Spanish** — all code (comments, classes, variables) in English
3. **No runtime dependencies** — pure HTML/CSS/JS only
4. **Self-hosted Inter font** — no external font requests
5. **Images: WebP + JPG fallback** via `<picture>` elements
6. **`--color-text-light` in dark mode must be `#A8B2E0`** — verified for WCAG 4.5:1 contrast

## Reference Files

- **Design spec (read first):** `.claude/docs/plasma-field-implementation-guide.md`
- **Hero prototype (match exactly):** `.claude/prototypes/direction-3-plasma-field.html`
- **Current CSS:** `css/styles.css`
- **Current HTML:** `index.html`
- **Current JS (preserve):** `js/main.js`

## Todo File

After plan approval, create `.claude/todos/plasma-field-implementation.todo` with all tasks above as a trackable checklist for the `frontend-designer` agent.
