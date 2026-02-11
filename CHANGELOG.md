# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
