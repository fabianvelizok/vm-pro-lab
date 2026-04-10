# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-10

### Changed

- **BREAKING:** Contact form now submits to a self-hosted Cloudflare Worker (`vmprolab-contact.velizfabianhoracio.workers.dev`) instead of Formspree. Requires the worker to be deployed and the Resend domain for vmprolab.com to be verified before the form will deliver mail in production.
- Preconnect resource hint updated from `formspree.io` to the new worker URL.
- Contact form markup is now JS-only (removed `action`/`method` attributes); submissions are always handled by `fetch` against the worker.

### Added

- Branded HTML email template (cyan/navy) delivered via Resend on behalf of `contacto@vmprolab.com`.
- Honeypot field (`hp-website`) on the contact form for silent bot rejection.
- Toast notifications for success/error feedback, with `aria-live` regions and `prefers-reduced-motion` support.
- IP-based rate limiting (3 submissions per hour per IP) via Cloudflare KV.
- `isSubmitting` guard against double-submissions while the first request is in flight.
- `reply_to` header on transactional emails so replies in Gmail go directly to the form submitter.

### Removed

- Formspree dependency and its preconnect hint.

### Security

- Origin whitelist enforced at the worker edge (403 for unknown origins).
- HTML entity escaping of all user input before interpolating into email HTML.
- Resend failures return a generic 500 — no upstream vendor errors leaked to the client.

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

[1.0.0]: https://github.com/fabianvelizok/vm-pro-lab/releases/tag/v1.0.0
