# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-05-31

Minor release: a full brand identity — the final Venn (V ∩ M) logo with an
animated hero reveal and an adaptive header, a complete favicon / app-icon set
with web manifest, a social share (Open Graph) image, and npm supply-chain
hardening.

### Added

- **Brand logo** (`images/logo.svg`): the final Venn mark — **V** (Veliz) ∩
  **M** (Mallorga) — with dual-gradient rings, a hatched intersection and nodes.
  Plus `images/logo-mark.svg`, a compact, small-size-optimized variant (bolder
  strokes, larger letters) for tight spaces.
- **Animated hero logo**: on load the rings appear stacked at the centre and
  split to their places, then the V/M letters emerge from *behind* the rings
  into their lobes. Self-contained inline SVG animation; respects
  `prefers-reduced-motion`.
- **Adaptive header**: the header eases between a tall state at the top (full
  logo, 60px) and a condensed state on scroll (compact mark, 44px), cross-fading
  the two marks; height is driven by a `--header-h` custom property.
- **Favicons & web app manifest**: full icon set (`favicon.ico`, 16/32 PNGs,
  `apple-touch-icon`, `android-chrome` 192/512) plus `site.webmanifest`, wired
  up with `<link>` tags in `<head>`.
- **Open Graph / social image** (`images/og-image.jpg`, 1200×630) with
  `og:image:width` / `height` / `type` / `alt` meta.
- **`docs/logo-concept.md`**: the brand concept write-up (what each part and
  colour of the mark means).
- **`.npmrc` supply-chain hardening**: `ignore-scripts=true` (dependency
  lifecycle scripts are not run on install) and `minimum-release-age=1d` (refuse
  package versions published less than a day ago).

### Changed

- **Header & footer branding** now use the SVG mark only — the "VM Pro Lab"
  wordmark text was removed (the mark carries the brand); the footer uses the
  compact `logo-mark.svg`.
- **Favicon** (`images/favicon.svg`) refreshed to the balanced brand blue.
- **Critical CSS** now includes the `.main` fixed-header offset, avoiding a
  first-paint content jump.

## [2.1.1] - 2026-05-30

Patch release: cache-busting for the CSS/JS bundles so a new release is no
longer shadowed by the production browser/CDN cache.

### Fixed

- **Stale CSS/JS on the production domain after deploy**: the minified bundles
  ship under stable filenames (`styles.min.css` / `main.min.js`) with an
  `immutable`, 1-year cache (`_headers`), so the production domain kept serving
  the previous release's assets (the `*.pages.dev` preview was unaffected — it's
  a different origin). The build now stamps a `?v=<version>` query onto the
  CSS/JS references via `scripts/version-assets.js`, giving each release a fresh
  asset URL while keeping the long `immutable` cache benefit.

## [2.1.0] - 2026-05-30

Minor release: the projects section becomes a zero-dependency vanilla
scroll-snap carousel, two new projects (FisioYa and VamosBenja) are added, and
the project cards gain linkable titles, explicit site links, and refreshed copy.

### Added

- **Projects carousel**: the static projects grid is now a vanilla CSS
  scroll-snap carousel — no library, zero runtime dependencies — showing ~1 card
  on mobile, ~2 on tablet, and ~3 on desktop.
- **Carousel navigation**: prev/next arrows (desktop), clickable pagination
  dots, keyboard arrow keys, native touch swipe, and mouse drag-to-scroll (with
  a post-drag click guard so a drag never opens a link).
- **FisioYa project** (*En progreso*): multi-clinic kinesiology booking SaaS,
  with a new abstract teal SVG card image.
- **VamosBenja project** (*En producción*): fundraising landing plus social
  media work (Instagram profile, posts, highlighted stories), with a new
  navy/gold SVG card image and `Redes Sociales` / `Instagram` tags.
- **"En progreso" status badge** variant (`.project-status-progress`) and a new
  `--color-progress` token (amber, AA-compliant with white text).
- **Linkable project titles** plus an explicit "Sitio Web" link per project that
  opens the live site in a new tab.

### Changed

- **Project descriptions** rewritten to be sharper and benefit-focused; the
  FisioYa description no longer repeats its tech stack (the tags cover it).
- **Digital Mouth tags** updated (added Sidekiq; `AWS S3` → `AWS`).
- **Project cards** are no longer wrapped in a single full-card anchor — only the
  title and the explicit site link are clickable, which is cleaner and more
  accessible.

### Fixed

- **Horizontal scroll on tablet/mobile**: `overflow-x: clip` on the projects
  section contains the carousel's inner horizontal scroller so it no longer
  extends the page width.

## [2.0.0] - 2026-04-10

Major release: complete site redesign to the Plasma Field aesthetic, full
WCAG 2.1 AA accessibility pass, production build pipeline with static
deployment on Cloudflare Pages, and a migration of the contact form from
Formspree to a self-hosted Cloudflare Worker + Resend.

### Added

- **Plasma Field design system**: complete visual overhaul with a cyan/blue
  palette, Venn diagram hero mark, and dark-dominant theme.
- **Dark/light theme toggle** with `localStorage` persistence and
  system-preference detection on first load.
- **Contact form on Cloudflare Worker + Resend**: self-hosted submission
  endpoint with branded HTML email delivery, replacing Formspree.
- **Honeypot field** on the contact form for silent bot rejection.
- **Toast notifications** for form feedback (success/error) with brand
  gradients, `aria-live` regions, and `prefers-reduced-motion` support.
- **IP-based rate limiting** (3 submissions per hour per IP) via Cloudflare KV.
- **`isSubmitting` guard** against double-submissions while a request is in flight.
- **`reply_to` header** on transactional emails so replies in the notification
  inbox go directly to the form submitter.
- **AI & Automation section** showcasing Claude, Gemini, ChatGPT, GitHub
  Copilot, and Antigravity with official SVG icons.
- **SVG favicon** with the Venn diagram mark.
- **Production build pipeline**: clean, minify (CSS/JS/HTML), inline critical
  CSS, copy assets, and publish to `dist/` for Cloudflare Pages.
- **Critical CSS sync script** (`scripts/sync-critical-css.js`) that extracts
  above-the-fold rules from `css/styles.css` and inlines them in `index.html`.
- **`_headers` file** for Cloudflare Pages cache control (1-year immutable
  cache on versioned assets).
- **SVG project images** replacing the previous raster (JPG/WebP) versions.
- **Lucide SVG icons** replacing emoji throughout team cards, service cards,
  and AI highlights.
- **Accessible cyan text token** (`--color-accent-cyan-text`) with AA-compliant
  contrast on both light (5.36:1) and dark (10.55:1) backgrounds.
- **Mobile testing report** (`docs/mobile-testing-report.md`).
- **Performance audit report** (`docs/performance-audit-2026-03.md`).
- **Accessibility audit report** (`docs/accessibility-audit-2026-03.md`).
- **CLAUDE.md** instructions for future contributors.

### Changed

- **Complete UI redesign** to the Plasma Field aesthetic (cyan/blue palette,
  dark-dominant theme, Venn diagram hero, restrained typography).
- **Color tokens** migrated from an early violet/purple prototype to the final
  cyan/blue palette with tokenized light and dark variants.
- **Contact form markup** is now JS-only (removed `action`/`method` attributes);
  all submissions are handled by `fetch` against the worker.
- **Preconnect hint** updated from `formspree.io` to the worker URL.
- **Hero layout** uses a dedicated 900px breakpoint for single-column stacking,
  distinct from the general 768px mobile breakpoint.
- **Footer layout** simplified from a 3-column grid to a compact horizontal
  flexbox.
- **Navigation controls** grouped in a single flex container for consistent
  horizontal alignment on desktop and mobile.
- **Nav mark** restyled as a horizontal Venn diagram overlap.
- **Project cards** now link to live sites where applicable (e.g., Gabitour →
  `gabitour.com.ar`) with a grayscale hover effect.
- **Project card hover** underline now limited to the title only.
- **Team cards** updated with current LinkedIn profile info for both members.
- **Contact form placeholders** reworded for clarity.
- **README.md** rewritten with production build, local-server, and caching
  guidance.
- **OG image** regenerated with the new brand assets.
- **Team avatars** (`fabian.webp`, `yuliana.webp`) re-optimized.

### Fixed

- **WCAG 2.1 AA compliance** across the site: contrast ratios, focus
  indicators, ARIA roles and labels, keyboard navigation.
- **Eyebrow text contrast** in light mode (removed an opacity-based dimming
  that was failing contrast).
- **Footer text visibility** when toggling between dark and light modes.
- **Hero CLS** (Cumulative Layout Shift) eliminated via inlined critical CSS
  for above-the-fold content.
- **FCP/LCP** improved by removing render-blocking stylesheets and preloading
  self-hosted fonts.
- **SEO meta tags**: title, description, OG, Twitter cards, and canonical URL
  corrected and aligned.
- **Inline styles** removed in favor of CSS custom properties and classes.

### Removed

- **Formspree dependency** and its preconnect hint.
- **E-commerce service offering** replaced by a "Tu próximo proyecto" CTA card.
- **Emoji icons** throughout the site, replaced with Lucide SVGs.
- **Unused dead code**: `.btn-secondary` alias, duplicate `.footer-logo-link`,
  unreferenced SVG icons.
- **Outdated audit reports** (`docs/ACCESSIBILITY-AUDIT.md`,
  `docs/lighthouse-final-audit.md`).
- **Orphaned project images**: raster JPG and WebP versions replaced by
  lighter SVG patterns.

### Security

- **Contact form honeypot** for bot rejection.
- **IP-based rate limiting** (3 per hour per IP) via Cloudflare KV.
- **Origin whitelist** enforced at the Cloudflare Worker edge — disallowed
  origins receive 403.
- **HTML entity escaping** of all user input before interpolation into email
  templates.
- **Generic 500 responses** on Resend failures — no upstream vendor errors
  leaked to clients.
- **Encrypted secret storage** for the Resend API key via Cloudflare Workers
  Secrets.

### Accessibility

- **WCAG 2.1 AA compliance** verified across light and dark themes.
- **Keyboard navigation** for all interactive elements including the mobile
  menu (with focus trap and ESC close) and form fields.
- **Screen reader announcements** for active navigation, form validation
  errors, and toast notifications via `aria-live` regions.
- **Skip navigation link** for keyboard users.
- **Reduced-motion support** for animations, transitions, and toast slide-ins.

### Breaking changes

- Deploying this release required new infra: a Cloudflare Worker (for form
  submission), a KV namespace (for rate limiting), and a Resend account
  with domain verification for `vmprolab.com`. Anyone forking or cloning
  this repository will need to provision their own equivalent setup before
  the contact form will deliver mail.

[2.0.0]: https://github.com/fabianvelizok/vm-pro-lab/releases/tag/v2.0.0

## [1.0.0] - 2025-02-11

### Added

- Responsive landing page with sticky header and mobile hamburger menu
- Hero section with reusable button system
- Team section with interactive profile cards
- Contact form with inline validation and status feedback
- Footer with semantic markup (address, time elements)
- Dark mode toggle with proper contrast ratios
- Skip navigation link for keyboard users
- Focus trapping for mobile menu overlay
- ARIA labels, landmarks, and roles across all sections
- Screen reader indicators for active navigation and form status
- Reduced motion support for all animations and transitions
- Build pipeline with CSS, JS, and HTML minification (`npm run build`)
- Dist output with optimized assets (fonts, images)
- Lighthouse performance and accessibility audit reports

### Accessibility

- WCAG AA color contrast compliance in light and dark modes
- Keyboard navigation for all interactive elements (cards, menu, form)
- Form autocomplete attributes and descriptive field labels
- Inline error messages with `aria-describedby` associations
- `role="img"` and descriptive `aria-label` on picture elements
- Proper heading hierarchy (h1-h6) validated across pages

[2.1.1]: https://github.com/fabianvelizok/vm-pro-lab/releases/tag/v2.1.1
[2.1.0]: https://github.com/fabianvelizok/vm-pro-lab/releases/tag/v2.1.0
[2.0.0]: https://github.com/fabianvelizok/vm-pro-lab/releases/tag/v2.0.0
[1.0.0]: https://github.com/fabianvelizok/vm-pro-lab/releases/tag/v1.0.0
