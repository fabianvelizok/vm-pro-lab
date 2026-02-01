# VM Pro Lab

Professional landing page for VM Pro Lab - Web development studio founded by Fabián Veliz and Yuliana Mallorga.

## Project Philosophy

Minimalist page, straight to the point. We show who we are, what we do, and our projects. No filler.

## Tech Stack

- **HTML5** - Semantic and accessible
- **CSS3** - Vanilla, no frameworks
- **JavaScript** - Minimal, only for necessary interactions
- **Build Tools** - cssnano, terser, html-minifier (dev dependencies only)

## Project Structure

```
vm-pro-lab/
├── index.html          # Main page (references .min files)
├── css/
│   ├── styles.css      # Source CSS
│   └── styles.min.css  # Minified CSS (generated)
├── js/
│   ├── main.js         # Source JavaScript
│   └── main.min.js     # Minified JS (generated)
├── images/             # Optimized images (WebP + JPG fallbacks)
├── fonts/              # Self-hosted Inter font (WOFF2)
├── package.json        # Build scripts and dev dependencies
└── README.md           # This file
```

## Color Palette

Professional, modern, tech aesthetic. Minimalist with color accent.

- **Primary**: #0F172A (Very dark blue - almost black)
- **Accent**: #3B82F6 (Bright blue - tech/trust)
- **Background**: #FFFFFF (Main white)
- **Text**: #0F172A (Main text)
- **Text Light**: #64748B (Secondary text)

## Typography

- **Font**: Inter (self-hosted WOFF2 for better performance)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)
- **font-display**: swap (prevents invisible text)

## How to Use

### For end users (no build needed):
1. Open `index.html` in browser
2. Everything works out of the box

### For development:

```bash
# Install dependencies (first time only)
npm install

# Minify CSS only
npm run minify:css

# Minify JavaScript only
npm run minify:js

# Minify HTML (outputs to dist/)
npm run minify:html

# Minify both CSS and JS
npm run minify

# Full build (same as minify)
npm run build
```

**Output files:**
- `css/styles.min.css` - Minified CSS
- `js/main.min.js` - Minified and mangled JavaScript
- `dist/` - Minified HTML (when running minify:html)

## Development

This project follows vanilla web development best practices:
- Clean and maintainable code
- Optimized performance
- Accessibility (ARIA, semantic HTML)
- Responsive design (mobile-first)
- Cross-browser compatible

## Performance Optimizations

**Lighthouse Score: 100/100** ✅

- **Critical CSS inline** - Above-the-fold styles in `<head>`
- **Async CSS loading** - Non-critical styles loaded asynchronously
- **Self-hosted fonts** - Eliminates external font requests
- **Font preloading** - Critical font weights preloaded
- **WebP images** - With JPG fallback using `<picture>`
- **Lazy loading** - Devicon CSS loaded only when needed (IntersectionObserver)
- **GPU-optimized animations** - Using pseudo-elements for shadows
- **Resource hints** - `preconnect` and `dns-prefetch` for external domains
- **Minified assets** - CSS and JS compressed for production

## Authors

**VM Pro Lab**
- Fabián Veliz
- Yuliana Mallorga

---

Last updated: 2026-01-30
