# Plasma Field: Geometric System — Implementation Guide

> **Purpose:** This document is the single source of truth for the `frontend-designer` agent to implement the full VM Pro Lab single-page site using the **Plasma Field: Geometric System** aesthetic direction. Read it top-to-bottom before writing any code.
>
> **Prototype reference:** `.claude/prototypes/direction-3-plasma-field.html`
>
> **Production files to modify:**
> - `index.html` — Full page structure and content
> - `css/styles.css` — Complete stylesheet
> - `js/main.js` — Minimal interactions (preserve existing functionality)
>
> **Language rules:** All code (comments, classes, variables) in **English**. Only user-facing text displayed in the browser in **Spanish**.

---

## Part 1 — Design System Technical Specification

### 1.1 Color Palette

The Plasma Field aesthetic is **dark-dominant** with a violet-to-cobalt accent gradient. The entire palette must be defined as CSS custom properties in `:root`.

#### Light Mode (Default)

> **Important:** Although the design is dark-dominant by nature, the site must support `prefers-color-scheme: light` for users who have not set dark mode. In light mode, invert the relationship: light backgrounds with the same accent colors.

```
/* === CORE BACKGROUNDS === */
--color-bg:                 #F8FAFC        /* Main background — very light gray */
--color-bg-alt:             #F1F5F9        /* Alternate/card background */
--color-bg-surface:         #FFFFFF        /* Card surface, form background */

/* === TEXT === */
--color-text:               #0F172A        /* Primary text — near-black */
--color-text-light:         #475569        /* Secondary text — slate */
--color-text-inverse:       #FFFFFF        /* Text on colored/dark backgrounds */

/* === ACCENTS (same in both modes) === */
--color-accent-cyan:        #00D4FF        /* Primary accent */
--color-accent-blue:        #4285F4        /* Secondary accent */
--color-accent-blue-light:  #8AB4F8        /* Light blue for labels, eyebrows */
--color-accent-hover:       #1D4ED8        /* Blue hover state */

/* === BORDERS === */
--color-border:             #CBD5E1        /* Default border */
--color-border-subtle:      rgba(15, 23, 42, 0.06)   /* Very subtle dividers */
--color-border-medium:      rgba(15, 23, 42, 0.12)    /* Medium dividers */

/* === STATES === */
--color-success:            #047857        /* Success green */
--color-error:              #EF4444        /* Error red */
```

#### Dark Mode (`@media (prefers-color-scheme: dark)`)

```
/* === CORE BACKGROUNDS === */
--color-bg:                 #060814        /* Near-black indigo — THE signature color */
--color-bg-alt:             #0B0D1F        /* Slightly lighter surface */
--color-bg-surface:         #0E1029        /* Card/form surface */

/* === TEXT === */
--color-text:               #E4E8F7        /* Primary text — cool off-white */
--color-text-light:         #A8B2E0        /* Secondary text — muted blue-gray, updated for WCAG 4.5:1 ratio */
--color-text-inverse:       #060814        /* Text on light backgrounds */

/* === ACCENTS (unchanged) === */
--color-accent-cyan:        #00D4FF
--color-accent-blue:        #4285F4
--color-accent-blue-light:  #8AB4F8
--color-accent-hover:       #4285F4        /* Solid blue for dark mode hover */

/* === BORDERS === */
--color-border:             rgba(228, 232, 247, 0.1)
--color-border-subtle:      rgba(228, 232, 247, 0.06)
--color-border-medium:      rgba(228, 232, 247, 0.12)

/* === GLOW LAYERS (dark mode only) === */
--glow-cyan:                rgba(0, 212, 255, 0.35)
--glow-blue:                rgba(66, 133, 244, 0.35)
--glow-cyan-soft:           rgba(0, 212, 255, 0.08)
--glow-blue-soft:           rgba(66, 133, 244, 0.06)

/* === STATES === */
--color-success:            #34D399
--color-error:              #F87171
```

#### Contrast Verification Checklist

The following contrast ratios MUST be verified before shipping:

| Pair | Light Mode | Dark Mode | Minimum |
|---|---|---|---|
| `--color-text` on `--color-bg` | #0F172A on #F8FAFC | #E4E8F7 on #060814 | 4.5:1 (normal text) |
| `--color-text-light` on `--color-bg` | #475569 on #F8FAFC | #A8B2E0 on #060814 | 4.5:1 (normal text) |
| `--color-accent-blue` on `--color-bg` | #4285F4 on #F8FAFC | #4285F4 on #060814 | 3:1 (large text/UI) |
| `--color-accent-cyan` on `--color-bg` | #00D4FF on #F8FAFC | #00D4FF on #060814 | 3:1 (large text/UI) |
| `--color-text-inverse` on `--color-accent-blue` | #FFFFFF on #4285F4 | #FFFFFF on #4285F4 | 4.5:1 (button text) |

**CRITICAL:** The dark mode `--color-text-light` was updated to `#A8B2E0` to safely pass WCAG AA 4.5:1 contrast against `--color-bg` (`#060814`). Test with https://webaim.org/resources/contrastchecker/.

---

### 1.2 Typography

Font family: **Inter** (self-hosted WOFF2). Weights: 400, 600, 700.

```
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-weight-regular:  400;
--font-weight-semibold: 600;
--font-weight-bold:     700;
```

#### Type Scale

| Element | Size | Weight | Line-Height | Letter-Spacing | Notes |
|---|---|---|---|---|---|
| **Hero wordmark "VM"** | `clamp(3.5rem, 7vw, 6.5rem)` | 700 | 0.95 | `-0.04em` | Tightly tracked, massive |
| **Hero wordmark "Pro Lab"** | `clamp(2rem, 4vw, 3.5rem)` | 700 | 1.0 | `-0.03em` | Gradient text (cyan → blue) |
| **Section titles (h2)** | `clamp(1.75rem, 4vw, 2.5rem)` | 700 | 1.2 | `-0.02em` | Standard section headings |
| **Card titles (h3)** | `clamp(1.25rem, 3vw, 1.5rem)` | 700 | 1.2 | `-0.01em` | |
| **Body text / paragraphs** | `clamp(0.95rem, 1.5vw, 1.125rem)` | 400 | 1.7 | default | Max-width ~60ch for readability |
| **Eyebrow labels** | `0.65rem` | 600 | 1.0 | `0.2em` | Uppercase, with accent line prefix |
| **Stat values** | `1.5rem` | 700 | 1.0 | `-0.03em` | Bold data points |
| **Stat labels / micro text** | `0.65rem` | 400 | 1.0 | `0.1em` | Uppercase, secondary color |
| **Nav links** | `0.8rem` | 400 | 1.0 | `0.05em` | Secondary color, subtle |
| **Coordinate labels** | `0.55rem` | 400 | 1.0 | `0.15em` | Uppercase, diagram annotations |
| **Button text** | `0.875rem` | 600 | 1.0 | `-0.01em` | |
| **Form labels** | `0.875rem` | 600 | 1.0 | default | |
| **Form inputs** | `1rem` | 400 | 1.6 | default | |
| **Footer text** | `0.875rem` | 400 | 1.6 | default | |

**Design principle:** Use **negative** letter-spacing on display/heading type (tight, modern feel) and **positive** letter-spacing on small labels (readability + utilitarian aesthetic).

---

### 1.3 Spacing Scale

Retain the existing spacing scale — it works well with the Plasma Field aesthetic:

```
--spacing-xs:   0.5rem;    /*  8px */
--spacing-sm:   1rem;      /* 16px */
--spacing-md:   1.5rem;    /* 24px */
--spacing-lg:   2rem;      /* 32px */
--spacing-xl:   3rem;      /* 48px */
--spacing-2xl:  4rem;      /* 64px */
--spacing-3xl:  6rem;      /* 96px — NEW: for generous section padding */
```

```
--max-width:       1200px;
--border-radius:   8px;      /* Default for cards and buttons */
--border-radius-sm: 6px;     /* Smaller elements */
```

**Section padding pattern:** Each `<section>` container gets `padding: var(--spacing-3xl) var(--spacing-md)` on desktop, reducing to `padding: var(--spacing-2xl) var(--spacing-sm)` on mobile.

---

### 1.4 Animations & Transitions

#### Transitions (applied to interactive elements)

```
--transition:       all 0.3s ease;           /* Default */
--transition-fast:  all 0.2s ease;           /* Hover color changes */
--transition-slow:  all 0.4s ease;           /* Layout shifts */
```

#### Keyframe Animations

**1. `breathe-a` — Circle A glow pulse (Hero Venn diagram)**
```css
@keyframes breathe-a {
  0%, 100% { box-shadow: 0 0 30px var(--glow-cobalt), inset 0 0 20px rgba(59, 91, 219, 0.03); }
  50%      { box-shadow: 0 0 60px rgba(59, 91, 219, 0.45), inset 0 0 40px rgba(59, 91, 219, 0.06); }
}
/* Duration: 6s, ease-in-out, infinite */
```

**2. `breathe-b` — Circle B glow pulse (Hero Venn diagram)**
```css
@keyframes breathe-b {
  0%, 100% { box-shadow: 0 0 30px var(--glow-violet), inset 0 0 20px rgba(108, 99, 255, 0.03); }
  50%      { box-shadow: 0 0 60px rgba(108, 99, 255, 0.5), inset 0 0 40px rgba(108, 99, 255, 0.06); }
}
/* Duration: 6s, ease-in-out, infinite, animation-delay: -3s (offset from circle A) */
```

**3. `fadeIn` — Tech icons reveal (Technologies section, triggered by Devicon load)**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 0.7; transform: scale(1); }
}
/* Duration: 0.3s, ease-in */
```

**4. `spin` — Form submit button spinner**
```css
@keyframes spin {
  0%   { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
/* Duration: 0.8s, linear, infinite */
```

#### Hover Effects Catalog

| Element | Effect | Properties | Duration |
|---|---|---|---|
| **Cards** | Lift + glow shadow | `transform: translateY(-4px)`, box-shadow opacity 0→1 | 0.3s ease |
| **Primary button** | Lift + violet glow | `transform: translateY(-2px)`, `box-shadow: 0 0 24px rgba(108, 99, 255, 0.5)` | 0.25s ease |
| **Outline button** | Border color shift | `border-color` → `rgba(108, 99, 255, 0.5)`, `color` → primary text | 0.2s ease |
| **Nav links** | Color shift | `color` → `--color-text` (from secondary) | 0.2s ease |
| **Team links** | Background tint + lift | `background-color` tint, `translateY(-2px)` | 0.3s ease |
| **Tech badges** | Icon desaturate → color | `filter: grayscale(100%) → grayscale(0%)`, `opacity: 0.7 → 1` | 0.3s ease |
| **Project card images** | Subtle zoom | `transform: scale(1.05)` | 0.3s ease |

#### Reduced Motion (`@media (prefers-reduced-motion: reduce)`)

**ALL** animations and transforms MUST be disabled:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .card:hover, .card:focus-within { transform: none !important; }
  .btn:hover, .btn-primary:hover { transform: none !important; }
  .team-link:hover { transform: none !important; }
  .project-card:hover .project-image img,
  .project-card:focus-within .project-image img { transform: none !important; }
  .circle-a, .circle-b { animation: none; }
}
```

---

### 1.5 Background Treatments

#### Global Background (dark mode)

A subtle dual-radial gradient on `body::before` creates the "gravitational center" effect:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 35% 55%,
      var(--glow-violet-soft) 0%, transparent 65%),
    radial-gradient(ellipse 60% 50% at 65% 45%,
      var(--glow-cobalt-soft) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}
```

In **light mode**, this gradient should be even more subtle or replaced with a very soft version:
```css
/* Light mode: barely visible tint */
body::before {
  background:
    radial-gradient(ellipse 80% 60% at 35% 55%,
      rgba(108, 99, 255, 0.03) 0%, transparent 65%),
    radial-gradient(ellipse 60% 50% at 65% 45%,
      rgba(59, 91, 219, 0.02) 0%, transparent 60%);
}
```

#### Section Alternation

- **Default sections** (Hero, Services, Projects, Contact): `background-color: var(--color-bg)`
- **Alternate sections** (About, Technologies): `background-color: var(--color-bg-alt)`
- This creates visual rhythm between sections without heavy borders

#### Section Separators

Instead of hard borders between sections, use a subtle horizontal rule element or a `border-top` with `var(--color-border-subtle)`. The Plasma Field aesthetic favors **hairlines** (1px) over thick borders.

---

### 1.6 Gradient Text Treatment

The "Pro Lab" gradient text is a signature element. Use it sparingly — only on the hero wordmark and optionally on one other prominent element (e.g., a CTA headline).

```css
.gradient-text {
  background: linear-gradient(135deg, var(--color-accent-violet) 0%, var(--color-accent-cobalt-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Accessibility note:** This is purely decorative. Screen readers read the text normally. The gradient does not affect text selection in modern browsers, but it cannot be highlighted visually in some older browsers.

---

## Part 2 — Section-by-Section Implementation Guide

### 2.0 Global Structure

```
<body>
  <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
  <header class="header">...</header>
  <main class="main" id="main-content" tabindex="-1">
    <section class="hero" id="hero">...</section>
    <section class="about" id="about">...</section>
    <section class="services" id="services">...</section>
    <section class="technologies" id="technologies">...</section>
    <section class="projects" id="projects">...</section>
    <section class="contact" id="contact">...</section>
  </main>
  <footer class="footer">...</footer>
  <script src="js/main.js" defer></script>
</body>
```

**Navigation links** must match the sections: Nosotros (#about), Servicios (#services), Proyectos (#projects), Contacto (#contact).

---

### 2.1 Header / Navigation

**Layout:** Fixed top bar. Flexbox: logo left, nav links right. Height: 70px.

**Plasma Field styling:**
- Background: `var(--color-bg)` with `backdrop-filter: blur(12px)` and slight transparency (`rgba(6, 8, 20, 0.85)` in dark mode) for a glass effect
- The `.scrolled` state adds a subtle `box-shadow` and a bottom `border-bottom: 1px solid var(--color-border-subtle)`
- Logo: "VM Pro Lab" text in `--color-text`, weight 600, size 0.875rem. Include the small **nav-mark** element (two tiny overlapping circles in violet/cobalt) as a mini brand identity element before the text
- Nav links: 0.8rem, weight 400, letter-spacing 0.05em, color `--color-text-light`. Hover: color `--color-text`
- Mobile: hamburger menu with existing focus trap logic from `js/main.js`

**Key classes:** `.header`, `.nav`, `.logo`, `.nav-mark`, `.nav-menu`, `.nav-link`, `.hamburger`

---

### 2.2 Hero Section

**This is the prototype. Implement it exactly as defined in `.claude/prototypes/agent-design/direction-3-plasma-field.html`.**

**Layout:** Two-column grid (`1fr 1fr`). Left: Venn diagram. Right: content stack. Full viewport height (`min-height: 100vh`).

**Left column — CSS Venn Diagram:**
- Container: 340x220px, positioned relatively
- Two circles (220x220px each), overlapping in the center
- Circle A (left, "V"): border `var(--circle-stroke)`, fill `var(--circle-fill)`, glow `var(--glow-cobalt)`, animation `breathe-a`
- Circle B (right, "M"): border `rgba(108, 99, 255, 0.4)`, fill `rgba(108, 99, 255, 0.05)`, glow `var(--glow-violet)`, animation `breathe-b` with `animation-delay: -3s`
- Intersection zone: clipped ellipse with radial gradient
- Letters "V" and "M" inside circles: 4.5rem, weight 700, opacity 0.6, colored in cobalt-light and violet respectively
- Coordinate labels: "Senior / Full Stack" (top-left), "Tucuman . ARG" (bottom-right)
- Horizontal axis line through center: gradient hairline

**Right column — Content:**
- Eyebrow: "Estudio de desarrollo web" — 0.65rem, weight 600, uppercase, cobalt-light, preceded by a 24px horizontal line
- Wordmark: `<h1>` containing `<span class="hero-wordmark">VM</span>` and `<span class="hero-wordmark-sub"><span class="gradient-text">Pro Lab</span></span>`
- Tagline: "Dos desarrolladores. Un sistema de trabajo. Construimos productos digitales que escalan con la ambicion de tus ideas."
- CTAs: "Ver proyectos" (primary, gradient background) + "Hablemos" (outline)
- Stats row: "12+" (Anos de exp.), "100" (Lighthouse score), "2" (Devs. 1 equipo) — separated by hairline borders

**Mobile (<=768px):** Single column. Diagram on top (smaller: 280x180px circles), content below. Stats stack vertically. CTAs stack full-width.

**Light mode adaptation:** The Venn diagram glows should be very subtle. Circles get a light border instead of glow. Background remains light. Text colors invert to dark.

---

### 2.3 About Section

**Current content to preserve:**
- Section title: "El equipo detras de VM Pro Lab"
- Two team cards: Fabian Veliz (Tech Lead & Senior Full Stack Developer) and Yuliana Mallorga (Full Stack Developer)
- Each card: photo, name, role, bio paragraph, highlights list, GitHub/LinkedIn links

**Plasma Field layout:**
- Background: `var(--color-bg-alt)` — the alternate section color
- Two-column grid (`repeat(2, 1fr)`) for the team cards, max-width 1000px, centered
- Each card: `background-color: var(--color-bg-surface)`, `border: 1px solid var(--color-border)`, `border-radius: var(--border-radius)`, with hover lift effect

**Plasma Field card styling:**
- Card background in dark mode: `var(--color-bg-surface)` (#0E1029) with `border: 1px solid var(--color-border)`
- On hover: `border-color` shifts to `rgba(108, 99, 255, 0.3)` and a subtle violet glow appears in the box-shadow
- Photo: 120x120px circle, `border: 3px solid var(--color-accent-violet)` (replacing the previous light-blue border) with a subtle glow `box-shadow: 0 0 20px rgba(108, 99, 255, 0.2)` in dark mode
- Name: `--color-text`, weight 700
- Role: `--color-accent-cobalt-light`, weight 600
- Bio: `--color-text-light`, line-height 1.7
- Highlights list: no bullets, each item with `--color-text` and padding-y `--spacing-xs`
- Links row: bottom border-top hairline, GitHub/LinkedIn in `--color-accent-violet`, hover: background tint + lift

**Mobile (<=768px):** Single column. Card padding reduces.

**Accessibility:** `<article>` for each card. `<picture>` with `<source srcset>` for WebP + JPG. `loading="lazy"` on images. `aria-label` on picture elements.

---

### 2.4 Services Section

**Current content to preserve:**
- Section title: "Que hacemos?"
- 4 service cards: Landing Pages, Aplicaciones Web, E-commerce, Mantenimiento & Soporte
- Each card: icon (emoji), title, description

**Plasma Field layout:**
- Background: `var(--color-bg)` — default
- 2x2 grid (`repeat(2, 1fr)`), max-width 1000px, gap `--spacing-lg`
- Cards: same surface treatment as About cards

**Plasma Field styling:**
- Replace emoji icons with a **geometric icon treatment**: a small circle (40x40px) with a subtle gradient border (`linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cobalt))`) and the emoji centered inside. This ties the service icons to the Venn diagram visual language.
- Card text-align: center
- Title: `--color-text`, weight 700, size 1.5rem
- Description: `--color-text-light`, line-height 1.7
- Hover: card lifts, border gets a violet tint

**Mobile (<=768px):** Single column. Card padding reduces.

---

### 2.5 Technologies / Skills Section

**Current content to preserve:**
- Section title: "Nuestro Stack Tecnologico"
- 4 categories: Frontend, Backend, Herramientas, IA & Automatizacion
- Each category: title + grid of tech badges (Devicon icons + labels)
- Devicon CSS lazy-loaded via IntersectionObserver in `js/main.js`

**Plasma Field layout:**
- Background: `var(--color-bg-alt)` — alternate
- Category title: centered, `--color-text`, weight 700
- Tech grid: `repeat(auto-fit, 150px)`, centered, gap `--spacing-md`

**Plasma Field badge styling:**
- Badge: 150x150px, `background: var(--color-bg-surface)`, `border: 1px solid var(--color-border)`, `border-radius: var(--border-radius)`
- Icon: grayscale at 0.7 opacity by default. On hover: full color, opacity 1
- On hover: `border-color` shifts to `rgba(108, 99, 255, 0.4)`
- Badge text: 0.8rem, weight 600, `--color-text`

**Important:** Preserve the existing font protection pattern that prevents Devicon from overriding Inter:
```css
.technologies, .technologies * { font-family: var(--font-family) !important; }
.technologies i[class*="devicon"] { font-family: 'devicon' !important; }
```

**Important:** Preserve `initLazyLoadDevicon()` in `js/main.js` exactly as-is.

**Mobile (<=768px):** Badges shrink to 100x100px. Icon font-size reduces.

---

### 2.6 Projects Section

**Current content to preserve:**
- Section title: "Algunos de nuestros trabajos"
- 3 project cards: Digital Mouth (production), Gabitour (development), CTA card ("Tu proyecto aqui?")
- Each card: image (picture element with WebP), status badge, title, description, tech tags
- CTA card: no status badge, includes a "Contactanos" button instead of tags

**Plasma Field layout:**
- Background: `var(--color-bg)` — default
- 3-column grid: `repeat(auto-fit, minmax(320px, 1fr))`, gap `--spacing-xl`, max-width 1200px
- On mobile: single column

**Plasma Field card styling:**
- Card: `background: var(--color-bg-surface)`, overflow hidden, flex column
- Image container: 250px height, `overflow: hidden`. On hover: `img` scales to 1.05
- Status badge: `position: absolute`, top-right. "En produccion": `background: var(--color-success)`. "En desarrollo": `background: var(--color-accent-violet)`
- Content area: padding `--spacing-xl`
- Title: `--color-text`, weight 700, 1.5rem
- Description: `--color-text-light`, line-height 1.7
- Tech tags: small pills with `background: var(--color-bg-alt)`, `border: 1px solid var(--color-border)`, `border-radius: 4px`, `font-size: 0.75rem`, `font-weight: 600`
- In dark mode, tags: `background: rgba(108, 99, 255, 0.08)`, `border: 1px solid rgba(108, 99, 255, 0.2)`, `color: var(--color-accent-cobalt-light)` — this gives them a subtle Plasma Field violet tint
- CTA card: center-aligned content, "Contactanos" button uses the primary gradient button style

**Mobile (<=768px):** Single column. Image height: 200px. Content padding reduces.

---

### 2.7 Contact Section

**Current content to preserve:**
- Section title: "Tenes un proyecto en mente?"
- Subtitle: "Contanos tu idea y te respondemos en menos de 24 horas."
- Form fields: Name, Email, Project Type (select), Message (textarea)
- Submit button: "Enviar mensaje"
- Status message area for success/error
- Formspree action: `https://formspree.io/f/xnqyavoa`
- All validation logic in `js/main.js` (`initContactForm()`) — preserve exactly

**Plasma Field layout:**
- Background: `var(--color-bg-alt)` — alternate
- Form container: max-width 800px, centered, `background: var(--color-bg-surface)`, padding `--spacing-2xl`, `border-radius: var(--border-radius)`, `border: 1px solid var(--color-border)`
- In dark mode: subtle `box-shadow: 0 0 40px rgba(108, 99, 255, 0.05)` on the form container

**Plasma Field form styling:**
- Labels: 0.875rem, weight 600, `--color-text`
- Inputs: `background: var(--color-bg)`, `border: 2px solid var(--color-border)`, `border-radius: var(--border-radius)`, `color: var(--color-text)`, padding `--spacing-sm`
- Input focus: `border-color: var(--color-accent-violet)`, `box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15)` — violet instead of the previous blue
- Input error: `border-color: var(--color-error)`, `box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)`
- Submit button: full-width, gradient background (`linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cobalt))`), white text, hover glow
- Loading spinner: same `spin` keyframe, white border-top on translucent border

**Accessibility:** All `aria-required`, `aria-invalid`, `aria-describedby` attributes must be preserved exactly as in the current HTML. The error `<span>` elements with `role="alert"` must remain. The status `<p>` with `role="status" aria-live="polite"` must remain.

---

### 2.8 Footer

**Current content to preserve:**
- Brand: "VM Pro Lab" + tagline "Desarrollo web profesional desde Tucuman"
- Team links: Fabian (GitHub, LinkedIn), Yuliana (GitHub, LinkedIn)
- Contact: email link
- Copyright: 2025

**Plasma Field layout:**
- Background: In dark mode, use a slightly different dark shade — `#050710` (even darker than `--color-bg`) or simply `var(--color-bg)` with a top border. In light mode: `var(--color-bg-surface)` with `border-top: 1px solid var(--color-border)`
- 3-column grid: `2fr 1fr 1fr`, gap `--spacing-2xl`
- Bottom bar: `border-top: 1px solid var(--color-border-subtle)`, copyright centered

**Plasma Field styling:**
- Logo: "VM Pro Lab" in `--color-text`, weight 700, 1.75rem
- Tagline: `--color-text-light`, 1rem
- Section titles ("Equipo", "Contacto"): weight 600, 1.125rem, `--color-text`
- Links: `--color-accent-cobalt-light`, hover: `--color-accent-violet`
- Member names: weight 600, 0.875rem, `--color-text`
- Copyright: `--color-text-light`, 0.875rem, opacity 0.7

**Mobile (<=768px):** Single column. Text-align center.

---

## Part 3 — Reference Material

### 3.1 JavaScript Functionality to Preserve

The `js/main.js` file contains 4 initialization functions. **ALL must be preserved without modification** (unless the HTML structure changes require selector updates):

1. **`initHeader()`** — Sticky header shadow on scroll, mobile menu toggle, focus trap, ESC key handler, prevent background scroll. Uses `[data-menu-toggle]` and `[data-menu]` selectors.
2. **`initActiveNavLinks()`** — IntersectionObserver watches sections, updates `aria-current` on nav links. Uses `.nav-link` selector and `href` attributes.
3. **`initContactForm()`** — Form validation (name, email, message), Formspree async submission, loading spinner, error/success feedback. Uses element IDs: `my-form`, `name`, `email`, `message`, `my-form-button`, `my-form-status`.
4. **`initLazyLoadDevicon()`** — Loads Devicon CSS when `#technologies` section enters viewport. Uses `#technologies` selector, adds `.devicon-loading` / `.devicon-loaded` classes.

**Key selectors that MUST exist in HTML:**
- `[data-menu-toggle]` — hamburger button
- `[data-menu]` — nav menu `<ul>`
- `.nav-link` — all nav links
- `.header` — header element
- `#my-form`, `#name`, `#email`, `#message`, `#my-form-button`, `#my-form-status` — form elements
- `#technologies` — technologies section
- `#about`, `#services`, `#projects`, `#contact` — section IDs for nav scroll targets

### 3.2 Performance Requirements

- **Critical CSS inline** in `<head>`: The second `<style>` block must contain minified versions of all above-the-fold styles (`:root` variables, reset, body, header, nav, hero). This is the existing pattern — update the inline CSS to match the new Plasma Field styles.
- **External stylesheet async**: `<link rel="stylesheet" href="css/styles.css" media="print" onload="this.media='all'">`
- **Font preloading**: Inter 400 and 600 weights preloaded. 700 has `font-display: optional`.
- **Images**: WebP with JPG fallback via `<picture>`. `loading="lazy"` on below-the-fold images. `width` and `height` on all `<img>`.
- **Target**: <100KB total page weight, <10 HTTP requests, Lighthouse 100/100.

### 3.3 Existing Content (Spanish User-Facing Text)

Preserve all existing Spanish text from the current `index.html`. Key content:

**Hero:**
- Eyebrow: "Estudio de desarrollo web"
- Tagline: "Dos desarrolladores. Un sistema de trabajo. Construimos productos digitales que escalan con la ambicion de tus ideas."
- CTAs: "Ver proyectos", "Hablemos"
- Stats: "12+" / "Anos de exp.", "100" / "Lighthouse score", "2" / "Devs. 1 equipo"

**About:**
- Title: "El equipo detras de VM Pro Lab"
- Fabian: Tech Lead & Senior Full Stack Developer. Bio, highlights (Ex-Globant, Ex-HBO, Meta certified, 12+ years, English).
- Yuliana: Full Stack Developer. Bio, highlights (React/Node/PostgreSQL, Scrum Master, ZTM Academy, Claude Code certified).

**Services:**
- Title: "Que hacemos?"
- Landing Pages, Aplicaciones Web, E-commerce, Mantenimiento & Soporte (with descriptions)

**Technologies:**
- Title: "Nuestro Stack Tecnologico"
- Categories: Frontend (8 items), Backend (7 items), Herramientas (5 items), IA & Automatizacion (5 items)

**Projects:**
- Title: "Algunos de nuestros trabajos"
- Digital Mouth - Storm Center (production, Rails/PostgreSQL/Redis/Stimulus/Bootstrap/AWS)
- Gabitour - Turismo Iguazu (development, HTML/CSS/JS)
- CTA card: "Tu proyecto aqui?" + "Contactanos" button

**Contact:**
- Title: "Tenes un proyecto en mente?"
- Subtitle: "Contanos tu idea y te respondemos en menos de 24 horas."
- Fields: Nombre, Email, Tipo de proyecto (Landing Page/Aplicacion Web/E-commerce/Otro), Mensaje
- Button: "Enviar mensaje"

**Footer:**
- Brand: "VM Pro Lab" / "Desarrollo web profesional desde Tucuman"
- Team: Fabian (GitHub, LinkedIn), Yuliana (GitHub, LinkedIn)
- Contact: velizfabianhoracio@gmail.com
- Copyright: 2025

### 3.4 File Structure Reminder

```
index.html              <-- Edit: full page restructure with Plasma Field aesthetic
css/styles.css          <-- Edit: complete restyle using Plasma Field design system
js/main.js              <-- Preserve as-is (update selectors only if HTML structure changes)
fonts/                  <-- No changes (Inter 400, 600, 700 WOFF2)
images/                 <-- No changes (existing team photos + project screenshots)
dist/                   <-- Regenerated by `npm run build` after changes
```

### 3.5 Implementation Order

1. **CSS first:** Rewrite `css/styles.css` with the Plasma Field design system (variables, reset, typography, all component styles, dark mode, responsive, reduced motion)
2. **HTML second:** Update `index.html` — restructure the Hero section per the prototype, restyle all other sections with updated class names, update the inline critical CSS in `<head>`
3. **JS last:** Only touch `js/main.js` if HTML selector changes require it (unlikely)
4. **Verify:** Test dark mode, light mode, mobile, keyboard nav, screen reader, reduced motion, then run `npm run build`
