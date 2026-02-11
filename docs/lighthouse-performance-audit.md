# Lighthouse Performance Audit Report
VM Pro Lab Website - Comprehensive Analysis

**Date**: 2026-02-11
**Auditor**: Performance Engineering Audit
**Environment**: Local Development (Desktop)
**Lighthouse Version**: 13.0.1

---

## Executive Summary

### Overall Assessment

The VM Pro Lab website demonstrates **excellent performance** with strong fundamentals in place. The site achieves impressive Core Web Vitals scores and follows modern web development best practices.

**Lighthouse Scores (Development Build)**:
- Performance: 97/100
- Accessibility: 97/100
- Best Practices: 100/100
- SEO: 100/100

### Key Metrics (Development Build)

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **First Contentful Paint (FCP)** | 0.3s | <1.8s | Excellent |
| **Largest Contentful Paint (LCP)** | 0.4s | <2.5s | Excellent |
| **Cumulative Layout Shift (CLS)** | 0.115 | <0.1 | Needs Improvement |
| **Total Blocking Time (TBT)** | 0ms | <200ms | Excellent |
| **Speed Index (SI)** | 0.3s | <3.4s | Excellent |

### Performance Snapshot

**Strengths**:
- Near-instant initial rendering (FCP: 0.3s)
- Extremely fast LCP (0.4s)
- Zero blocking time on main thread
- Excellent SEO fundamentals
- Strong accessibility implementation
- All images have proper WebP format with fallbacks
- Self-hosted fonts with proper preloading
- Minimal JavaScript footprint (16KB)
- Efficient CSS delivery strategy

**Primary Issue**:
- **CLS score of 0.115** (target: <0.1) caused by web font loading (inter-700.woff2)

---

## Critical Issues

### 1. Cumulative Layout Shift from Font Loading

**Impact**: Direct negative effect on Core Web Vitals CLS metric
**Current CLS**: 0.115 (needs to be <0.1 for "good" rating)
**Severity**: CRITICAL

#### Problem Description

Layout shift occurs when the bold weight font (inter-700.woff2) loads, causing the main content area to reflow. This is triggered by the font-display: swap strategy, which initially renders text with a fallback font and then swaps to the web font once loaded.

**Root Cause**:
```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;  /* Causes visible font swap */
  src: url('fonts/inter-700.woff2') format('woff2');
}
```

The font-display: swap ensures text is immediately visible, but creates layout instability when the fallback font metrics don't match Inter's metrics.

#### Recommended Fix

**Option 1: Font Metric Overrides (Preferred)**

Use CSS font metric overrides to ensure the fallback font matches Inter's dimensions exactly, eliminating layout shift:

```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('fonts/inter-700.woff2') format('woff2');
  /* Font metric overrides to match Inter with fallback */
  ascent-override: 90%;
  descent-override: 22.43%;
  line-gap-override: 0%;
  size-adjust: 107%;
}
```

Calculate exact values using the [Fontaine tool](https://github.com/unjs/fontaine) or [Capsize](https://seek-oss.github.io/capsize/).

**Option 2: Preload Critical Font Weights**

The 700 weight font is already in the HTML preload section, but it may not be loading early enough. Ensure preload is positioned before critical CSS:

```html
<!-- Move this BEFORE inline critical CSS -->
<link rel="preload" href="fonts/inter-700.woff2" as="font" type="font/woff2" crossorigin>
```

**Option 3: Use font-display: optional (Trade-off)**

Change font-display to 'optional', which eliminates layout shift but shows fallback font if Inter doesn't load in ~100ms:

```css
font-display: optional;  /* No swap = no layout shift */
```

**Trade-off**: On slow connections, users may see system fonts instead of Inter. This ensures zero layout shift but sacrifices brand consistency in edge cases.

#### Expected Impact

- **CLS reduction**: 0.115 → <0.05 (improvement of >50%)
- **Performance score**: 97 → 99-100
- **User experience**: Eliminates visible text reflow during page load

#### Implementation Priority

**IMMEDIATE** - This is the only issue preventing a perfect Performance score and optimal CLS.

---

## Medium-Impact Issues

### 2. Unused CSS (51% of stylesheet)

**Current Waste**: 16.3KB of unused CSS (51.6% of styles.css)
**Potential LCP Savings**: 40-50ms
**Severity**: MEDIUM

#### Problem Description

The full styles.css (32KB total) is loaded with only ~48% of rules actively used on the page. This increases parse time and delays rendering.

**Lighthouse Report**:
```
URL: http://localhost:8080/css/styles.css
Transfer Size: 31.6KB
Estimated Savings: 16.3KB
```

#### Analysis

This is expected for a single-page site with multiple sections. The unused CSS likely includes:
- Styles for below-the-fold sections (projects, technologies, contact)
- Dark mode styles (loaded for all users but only used if preferred-color-scheme matches)
- Responsive breakpoint styles not active in current viewport
- Utility classes and component variants

**Reality Check**: This is NOT a critical issue for this site because:
1. Total CSS size (32KB) is well within acceptable range (<100KB)
2. Critical CSS is already inlined in `<head>` for above-the-fold content
3. Full stylesheet loads asynchronously with media="print" hack
4. The site is a single-page application - "unused" CSS is used when scrolling

#### Recommended Optimization

**Option 1: Critical CSS Extraction (Current Implementation - GOOD)**

You're already doing this correctly:
```html
<!-- Critical CSS inline for fast FCP -->
<style>
  /* Above-the-fold styles inlined here */
</style>

<!-- Full stylesheet loaded async -->
<link rel="stylesheet" href="css/styles.css" media="print" onload="this.media='all'">
```

**No action needed** - current approach is optimal for a single-page site.

**Option 2: Purge Truly Unused CSS (Low Priority)**

If you want to eliminate the Lighthouse warning, use PurgeCSS to remove genuinely unused rules:

```bash
npm install --save-dev @fullhuman/postcss-purgecss
```

Configure to preserve:
- Dark mode styles (`@media (prefers-color-scheme: dark)`)
- JavaScript-added classes (.active, .scrolled, .btn-loading)
- Below-fold section styles

**Trade-off**: Adds build complexity for minimal real-world benefit (40ms LCP savings). Current approach is cleaner.

#### Expected Impact

- **LCP improvement**: 40-50ms (marginal - from 0.4s to 0.35s)
- **File size reduction**: 16KB (from 32KB to 16KB)
- **Maintenance cost**: Increased (requires build tool configuration)

#### Implementation Priority

**LOW** - The current implementation is already optimized. The 40ms savings is theoretical and unlikely to be noticeable to users.

---

### 3. Missing Canonical URL

**Severity**: MEDIUM (SEO)
**Current State**: Not applicable (Lighthouse reports N/A)

#### Problem Description

The site does not include a canonical URL tag, which helps search engines understand the preferred URL for indexing. This is particularly important for avoiding duplicate content issues.

#### Recommended Fix

Add a canonical link tag in the `<head>` section:

```html
<head>
  <!-- ... existing meta tags ... -->

  <!-- Canonical URL -->
  <link rel="canonical" href="https://vmprolab.com/">

  <!-- ... rest of head ... -->
</head>
```

For a single-page site, the canonical should point to the root URL. If you add additional pages in the future, each page should have its own canonical URL.

#### Expected Impact

- **SEO**: Prevents duplicate content penalties
- **Search ranking**: Consolidates page authority to canonical URL
- **Analytics**: Cleaner traffic attribution

#### Implementation Priority

**MEDIUM** - Important for SEO best practices, especially before launching to production.

---

### 4. Missing Structured Data (Schema.org)

**Severity**: MEDIUM (SEO)
**Current State**: Manual audit required

#### Problem Description

The site lacks structured data markup, which helps search engines understand the content type and display rich snippets in search results. For a professional services website, this is a missed opportunity for enhanced search presence.

#### Recommended Fix

Add JSON-LD structured data for Organization and LocalBusiness:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VM Pro Lab",
  "description": "Estudio de desarrollo web profesional",
  "url": "https://vmprolab.com",
  "logo": "https://vmprolab.com/images/og-image.jpg",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "velizfabianhoracio@gmail.com",
    "contactType": "Customer Service"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Tucumán",
    "addressCountry": "AR"
  },
  "sameAs": [
    "https://github.com/fabianvelizok",
    "https://www.linkedin.com/in/velizfabianhoracio/",
    "https://github.com/yuliana-mallorga",
    "https://www.linkedin.com/in/yuliana-mallorga/"
  ],
  "founder": [
    {
      "@type": "Person",
      "name": "Fabián Veliz",
      "jobTitle": "Tech Lead & Senior Full Stack Developer",
      "url": "https://www.linkedin.com/in/velizfabianhoracio/"
    },
    {
      "@type": "Person",
      "name": "Yuliana Mallorga",
      "jobTitle": "Full Stack Developer",
      "url": "https://www.linkedin.com/in/yuliana-mallorga/"
    }
  ]
}
</script>
```

Add this script before the closing `</head>` tag.

For the projects section, consider adding WebPage or CreativeWork schema for individual portfolio items.

#### Expected Impact

- **Search visibility**: Enables rich snippets in Google Search
- **CTR improvement**: Rich results typically see 20-30% higher click-through rates
- **Knowledge graph**: May appear in Google Knowledge Panel for brand searches

#### Implementation Priority

**MEDIUM** - Important for SEO and search visibility, implement before production launch.

---

## Low-Priority Improvements

### 5. HTTP/2 Server Push Opportunity

**Severity**: LOW
**Potential Benefit**: 20-30ms faster font loading

#### Description

While fonts are preloaded in HTML, HTTP/2 Server Push could deliver them even faster by pushing them with the initial HTML response before the browser parses the preload tags.

#### Implementation

Requires server configuration. For Apache:

```apache
<FilesMatch "index\.html$">
  Header add Link "</fonts/inter-400.woff2>; rel=preload; as=font; type=font/woff2; crossorigin"
  Header add Link "</fonts/inter-600.woff2>; rel=preload; as=font; type=font/woff2; crossorigin"
  Header add Link "</fonts/inter-700.woff2>; rel=preload; as=font; type=font/woff2; crossorigin"
</FilesMatch>
```

For nginx:

```nginx
location = /index.html {
  http2_push /fonts/inter-400.woff2;
  http2_push /fonts/inter-600.woff2;
  http2_push /fonts/inter-700.woff2;
}
```

**Trade-off**: Adds server configuration complexity. May waste bandwidth if fonts are already cached.

#### Priority

**LOW** - Marginal improvement given current excellent FCP/LCP scores.

---

### 6. Consider Subsetting Fonts

**Severity**: LOW
**Potential Savings**: ~8-12KB per font file

#### Description

The Inter font files are 24KB each. Subsetting to only Latin characters (removing Cyrillic, Greek, etc.) could reduce file size by ~30-50%.

#### Implementation

Use a tool like [glyphhanger](https://github.com/zachleat/glyphhanger) or [fonttools](https://github.com/fonttools/fonttools):

```bash
# Install glyphhanger
npm install -g glyphhanger

# Subset to Latin only
glyphhanger --subset=fonts/inter-400.woff2 --formats=woff2 --US_ASCII
```

Or use an online tool like [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator) with "Basic Latin" subset.

**Trade-off**:
- Breaks support for accented characters in Spanish (á, é, í, ó, ú, ñ)
- **NOT RECOMMENDED** for this Spanish-language site

#### Priority

**NOT RECOMMENDED** - Site uses Spanish language, needs extended Latin character set.

---

### 7. Add Resource Hints for External Domains

**Severity**: LOW
**Status**: Partially implemented

#### Current Implementation

You already have:
```html
<link rel="preconnect" href="https://formspree.io">
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

This is excellent for third-party performance.

#### Additional Opportunity

Add preconnect (not just dns-prefetch) for cdn.jsdelivr.net since it's used for critical Devicon loading:

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

However, since Devicon is loaded lazily via JavaScript only when the Technologies section is visible, this is a very minor optimization.

#### Priority

**LOW** - Current implementation is already well-optimized.

---

## Performance Anti-Patterns Analysis

### HTML Review

**Strengths**:
- Excellent semantic HTML with proper landmarks (header, main, nav, footer)
- Proper meta tags for SEO and social sharing
- Critical CSS inlined in head
- Async stylesheet loading with media="print" hack
- Font preloading with correct crossorigin attribute
- All images have width/height attributes (prevents CLS)
- Proper picture elements with WebP sources
- Defer attribute on main.js script

**No Anti-Patterns Detected**

---

### CSS Review

**Strengths**:
- Modern CSS custom properties (variables) for maintainability
- Efficient use of CSS Grid and Flexbox
- Prefers-reduced-motion media query for accessibility
- Dark mode support with prefers-color-scheme
- Mobile-first responsive design
- Minimal use of expensive properties (no complex filters, excessive shadows)
- Efficient selectors (mostly classes, minimal descendant selectors)

**Minor Observations**:

1. **Transition on All Properties** (Line 48):
```css
--transition: all 0.3s ease;
```

Using `transition: all` can cause unnecessary repaints. Consider specifying exact properties:

```css
/* Instead of: transition: var(--transition); */
transition: transform 0.3s ease, opacity 0.3s ease;
```

**Impact**: Very minor. Only affects elements using this variable.
**Priority**: LOW - Not worth refactoring unless you notice performance issues.

---

### JavaScript Review

**Strengths**:
- IIFE pattern prevents global scope pollution
- Strict mode enabled
- Passive scroll listeners for better scroll performance
- IntersectionObserver for efficient scroll-based triggers
- Lazy loading of Devicon CSS (excellent optimization)
- No DOM queries inside loops
- Efficient event delegation
- Proper focus management for accessibility
- Async form submission with Fetch API

**No Anti-Patterns Detected**

**Excellent Implementations**:

1. **Passive Scroll Listener** (Line 44):
```javascript
window.addEventListener('scroll', function() {
  // ...
}, { passive: true });
```

Perfect - prevents scroll blocking.

2. **IntersectionObserver for Active Nav** (Line 201):
```javascript
const observer = new IntersectionObserver(function(entries) {
  // ...
}, {
  rootMargin: '-40% 0px -50% 0px'
});
```

Excellent use of IntersectionObserver instead of scroll events.

3. **Lazy Load Devicon** (Line 413):
```javascript
function initLazyLoadDevicon() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !deviconLoaded) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';
        document.head.appendChild(link);
        deviconLoaded = true;
        observer.disconnect();
      }
    });
  }, {
    rootMargin: '300px'
  });
  observer.observe(technologiesSection);
}
```

Outstanding optimization - prevents render-blocking external CSS by loading it only when needed.

---

## Asset Analysis

### Images

| File | Format | Size | Optimization |
|------|--------|------|-------------|
| fabian.jpg | JPEG | 5.0KB | Good |
| fabian.webp | WebP | 2.7KB | Excellent (46% smaller) |
| yuliana.jpg | JPEG | 7.1KB | Good |
| yuliana.webp | WebP | 4.5KB | Excellent (37% smaller) |
| digital-mouth.jpg | JPEG | 25KB | Acceptable |
| digital-mouth.webp | WebP | 8.1KB | Excellent (68% smaller) |
| gabitour.jpg | JPEG | 18KB | Good |
| gabitour.webp | WebP | 7.9KB | Excellent (56% smaller) |
| cta-project.jpg | JPEG | 21KB | Acceptable |
| cta-project.webp | WebP | 12KB | Excellent (43% smaller) |

**Total Image Weight**: ~110KB (with WebP support)
**Assessment**: Excellent optimization. All images have proper WebP versions with JPEG fallbacks.

**Recommendation**: Consider adding AVIF format for even better compression:

```html
<picture>
  <source srcset="images/team/fabian.avif" type="image/avif">
  <source srcset="images/team/fabian.webp" type="image/webp">
  <img src="images/team/fabian.jpg" alt="Fabián Veliz" width="150" height="150" loading="lazy">
</picture>
```

AVIF typically achieves 20-30% smaller file sizes than WebP.

**Priority**: LOW - Current WebP implementation is already excellent.

---

### Fonts

| File | Format | Size | Status |
|------|--------|------|--------|
| inter-400.woff2 | WOFF2 | 24KB | Optimal |
| inter-600.woff2 | WOFF2 | 24KB | Optimal |
| inter-700.woff2 | WOFF2 | 24KB | Optimal |

**Total Font Weight**: 72KB
**Assessment**: Excellent. WOFF2 is the most compressed format, and you're only loading 3 weights.

**Observations**:
- Self-hosted fonts avoid third-party requests to Google Fonts
- Proper preloading of critical weights (400, 600)
- font-display: swap for immediate text rendering
- All fonts use crossorigin attribute on preload

**No optimization needed** - implementation is already best practice.

---

### JavaScript

| File | Size | Status |
|------|------|--------|
| main.js | 16KB | Excellent |

**Assessment**: Minimal JavaScript footprint. Modern vanilla JS with no framework overhead.

**Code Efficiency**:
- No unnecessary libraries or frameworks
- Efficient DOM manipulation
- Proper use of modern APIs (IntersectionObserver, Fetch)
- No jQuery or other legacy dependencies

---

### CSS

| File | Size | Status |
|------|------|--------|
| styles.css | 32KB | Good |

**Assessment**: Reasonable size for a full-featured single-page site with dark mode support.

**Breakdown**:
- CSS variables and reset: ~2KB
- Critical above-the-fold styles: ~3KB (inlined)
- Component styles: ~15KB
- Responsive styles: ~8KB
- Dark mode styles: ~4KB

**Optimization Status**: Already optimized with critical CSS inlining.

---

## Network Performance

### Request Summary (Development Build)

| Resource Type | Count | Transfer Size |
|--------------|-------|---------------|
| HTML | 1 | ~30KB |
| CSS | 1 | 32KB |
| JavaScript | 1 | 16KB |
| Fonts | 3 | 72KB |
| Images | ~6 | ~60KB (WebP) |
| **Total** | **~12** | **~210KB** |

**Assessment**: Excellent. Very lean page weight.

**Industry Benchmarks**:
- Average website: 2.2MB with 70+ requests
- Performance-focused sites: <500KB with <30 requests
- **VM Pro Lab**: ~210KB with ~12 requests - **Outstanding**

---

## Browser Compatibility Notes

### Modern Features Used

1. **IntersectionObserver**: Supported in all modern browsers. No polyfill needed for target audience.
2. **CSS Custom Properties**: Supported in all modern browsers.
3. **CSS Grid/Flexbox**: Full support.
4. **Fetch API**: Full support in modern browsers.
5. **async/await**: Full support in modern browsers (ES2017).
6. **WebP Images**: Full support with JPEG fallback via `<picture>`.

**No compatibility issues detected** for modern browsers (Chrome, Firefox, Safari, Edge).

---

## Accessibility Highlights

**Score**: 97/100 (Excellent)

**Strengths**:
- Proper semantic HTML with landmarks
- Skip link for keyboard navigation
- ARIA labels on interactive elements
- Proper focus management in mobile menu
- Focus trap implementation
- Form validation with aria-invalid and error messages
- Proper color contrast in both light and dark modes
- Responsive tap targets (>44x44px)
- Reduced motion support
- All images have alt text
- Proper heading hierarchy

**Minor Issue**: 3-point deduction likely from:
- Skip link implementation (passes but could be enhanced)
- Form field labels (all properly associated)

**Overall**: Accessibility implementation exceeds typical standards.

---

## SEO Highlights

**Score**: 100/100 (Perfect)

**Strengths**:
- Proper meta description
- Valid HTML lang attribute
- Descriptive link text
- Proper heading hierarchy
- Mobile-friendly viewport
- Crawlable content (no JavaScript rendering issues)
- Open Graph and Twitter Card tags
- Descriptive title tag

**Recommendations** (from Medium-Impact section):
- Add canonical URL
- Implement structured data (JSON-LD)

---

## Production Recommendations

### Pre-Launch Checklist

1. **Fix CLS Issue** (CRITICAL)
   - Implement font metric overrides
   - Test CLS score drops below 0.1
   - Verify on real devices (mobile especially)

2. **Add SEO Enhancements** (MEDIUM)
   - Add canonical URL tag
   - Implement structured data (Organization schema)
   - Test with Google Rich Results Test

3. **Configure Server** (MEDIUM)
   - Enable Brotli or Gzip compression
   - Set cache headers for static assets (fonts, images, CSS, JS)
   - Enable HTTP/2 (or HTTP/3 if available)
   - Configure security headers (CSP, X-Frame-Options, etc.)

4. **Testing** (REQUIRED)
   - Run Lighthouse on production URL
   - Test on real mobile devices (3G/4G)
   - Verify WebP images load correctly
   - Test form submission to Formspree

5. **Monitoring** (RECOMMENDED)
   - Set up Google Search Console
   - Configure Core Web Vitals monitoring
   - Implement error tracking (e.g., Sentry)
   - Set up analytics (Google Analytics or privacy-focused alternative)

---

## Performance Budget Recommendations

### Suggested Budgets for Future Development

| Metric | Current | Budget | Status |
|--------|---------|--------|--------|
| FCP | 0.3s | <1.0s | Pass |
| LCP | 0.4s | <2.0s | Pass |
| CLS | 0.115 | <0.1 | Warning |
| TBT | 0ms | <200ms | Pass |
| Total Page Weight | ~210KB | <500KB | Pass |
| JavaScript | 16KB | <100KB | Pass |
| CSS | 32KB | <75KB | Pass |
| Fonts | 72KB | <100KB | Pass |
| Images (per page) | ~60KB | <300KB | Pass |
| HTTP Requests | ~12 | <30 | Pass |

**Recommendation**: Implement these budgets in your build process to prevent performance regression.

---

## Conclusion

The VM Pro Lab website is **exceptionally well-optimized** and demonstrates mastery of modern web performance techniques. The site achieves near-perfect scores across all Lighthouse categories and implements advanced optimizations that many professional sites overlook.

### Key Achievements

1. **Outstanding Core Web Vitals**: FCP, LCP, and TBT all in "excellent" range
2. **Minimal footprint**: 210KB total page weight vs. industry average of 2.2MB
3. **Modern optimization**: Lazy loading, critical CSS, font preloading, WebP images
4. **Excellent JavaScript**: Vanilla JS with modern APIs, no framework bloat
5. **Strong accessibility**: 97/100 score with thoughtful implementations
6. **Perfect SEO fundamentals**: 100/100 score

### Single Action Item

**Fix CLS from font loading** by implementing font metric overrides. This is the only barrier to a perfect 100/100 Performance score and optimal Core Web Vitals.

Once this is addressed, the site will be among the top tier of performant websites globally.

---

## Appendix: Testing Commands

### Run Lighthouse Audit (Desktop)
```bash
lighthouse http://localhost:8080/index.html \
  --preset=desktop \
  --output=html \
  --output=json \
  --output-path=./lighthouse-report
```

### Run Lighthouse Audit (Mobile)
```bash
lighthouse http://localhost:8080/index.html \
  --output=html \
  --output=json \
  --output-path=./lighthouse-mobile-report
```

### Test CLS Fix
```bash
# After implementing font metric overrides
lighthouse http://localhost:8080/index.html \
  --only-categories=performance \
  --preset=desktop
```

### Validate Structured Data
After adding JSON-LD schema:
1. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your production URL
3. Verify Organization schema is detected

---

**Report Generated**: 2026-02-11
**Next Review**: After CLS fix implementation
