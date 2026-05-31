#!/usr/bin/env node

/**
 * sync-critical-css.js
 *
 * Extracts above-the-fold CSS rules from css/styles.css and injects them
 * as minified inline <style> into index.html between marker comments.
 *
 * Usage:  node scripts/sync-critical-css.js
 *
 * This keeps css/styles.css as the single source of truth — the inline
 * critical CSS in index.html is always auto-generated from it.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSS_PATH = path.join(ROOT, 'css', 'styles.css');
const HTML_PATH = path.join(ROOT, 'index.html');

const START_MARKER = '<!-- CRITICAL-CSS-START -->';
const END_MARKER = '<!-- CRITICAL-CSS-END -->';

// ---------------------------------------------------------------------------
// Critical selectors — above-the-fold classes/elements to extract.
// A rule is included if its selector *starts with* any of these tokens.
// Order doesn't matter; they're matched as prefixes.
// ---------------------------------------------------------------------------
const CRITICAL_SELECTORS = [
  // CSS custom properties & theme overrides
  ':root',
  '[data-theme="dark"]',
  '[data-theme="light"]',

  // Reset & base
  '*',
  'html',
  'body',

  // Utilities visible on first paint
  '.gradient-text',
  '.visually-hidden',
  '.skip-link',

  // Layout offset for the fixed header
  '.main',

  // Header / Navigation
  '.header',
  '.nav',
  '.logo',
  '.logo-mark',
  '.nav-actions',
  '.nav-menu',
  '.nav-item',
  '.nav-link',
  '.theme-toggle',
  '.hamburger',
  '.hamburger-line',

  // Hero section
  '.hero',
  '.hero-inner',
  '.hero-diagram',
  '.hero-content',
  '.eyebrow',
  '.hero-wordmark',
  '.hero-tagline',
  '.hero-actions',
  '.hero-stats',
  '.stat-item',
  '.stat-value',
  '.stat-label',

  // Buttons (hero CTA)
  '.btn',

  // Brand Venn logo (above-the-fold hero art)
  '.hero-logo',
];

// ---------------------------------------------------------------------------
// CSS Parsing — walk through the stylesheet extracting matching rules
// ---------------------------------------------------------------------------

/**
 * Tokenize the CSS into top-level blocks (rules and @-rules).
 * Returns an array of { selector, body, raw } objects.
 * For @media blocks, selector is the @media line and body contains nested rules.
 */
function parseTopLevelBlocks(css) {
  const blocks = [];
  let i = 0;
  const len = css.length;

  while (i < len) {
    // Skip whitespace
    while (i < len && /\s/.test(css[i])) i++;
    if (i >= len) break;

    // Skip comments
    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? len : end + 2;
      continue;
    }

    // Read selector/at-rule up to opening brace
    const start = i;
    let depth = 0;
    let selectorEnd = -1;
    let blockEnd = -1;

    while (i < len) {
      if (css[i] === '{') {
        if (depth === 0) selectorEnd = i;
        depth++;
      } else if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          blockEnd = i;
          i++;
          break;
        }
      }
      i++;
    }

    if (selectorEnd === -1 || blockEnd === -1) break;

    const selector = css.slice(start, selectorEnd).trim();
    const body = css.slice(selectorEnd + 1, blockEnd).trim();
    const raw = css.slice(start, blockEnd + 1);

    blocks.push({ selector, body, raw });
  }

  return blocks;
}

// Selectors to EXCLUDE from critical CSS — not needed for first paint
const EXCLUDE_PATTERNS = [
  '.scrolled',       // Post-scroll state
  '.active',         // JS-toggled states (hamburger, menu)
  ':hover',          // Hover states
  ':disabled',       // Disabled states
  '::after',         // Pseudo-elements for hover effects (btn glow)
  '[aria-current',   // Active nav indicator
  ':focus-within',   // Focus-within card states
  '.btn-loading',    // JS loading state
  '.btn-spinner',    // Loading spinner
  '.team-',          // Team section (below fold)
  '.footer-',        // Footer section (below fold)
  '.service-',       // Services section (below fold)
  '.tech-',          // Technologies section (below fold)
  '.project-',       // Projects section (below fold)
  '.contact-',       // Contact section (below fold)
  '.card',           // Card base (below fold)
  '.about',          // About section (below fold)
  '.form-',          // Form elements (below fold)
];

// For [data-theme] selectors, only allow these specific suffixes
// (variable declarations + above-the-fold element overrides)
const DATA_THEME_ALLOWED = [
  '[data-theme="dark"]',                          // Variable declarations
  '[data-theme="dark"] .header',                  // Header bg override
  '[data-theme="dark"] .theme-toggle-icon-dark',
  '[data-theme="dark"] .theme-toggle-icon-light',
  '[data-theme="light"]',                         // Variable declarations
  '[data-theme="light"] .header',                 // Header bg override
];

/**
 * Check if a selector matches any of the critical selectors.
 * Handles comma-separated selectors (e.g. ".btn-outline,\n.btn-secondary").
 */
function isCriticalSelector(selector) {
  // Normalize selector: collapse whitespace
  const normalized = selector.replace(/\s+/g, ' ').trim();

  // Exclude non-critical interaction states
  if (EXCLUDE_PATTERNS.some(pat => normalized.includes(pat))) {
    return false;
  }

  // For [data-theme] selectors, use an explicit allowlist
  if (normalized.startsWith('[data-theme')) {
    return DATA_THEME_ALLOWED.some(allowed => normalized === allowed);
  }

  // Split comma-separated selectors and check each part
  const parts = normalized.split(',').map(s => s.trim());

  return parts.some(part => {
    return CRITICAL_SELECTORS.some(critical => {
      // Exact match or prefix match (e.g. ".btn" matches ".btn-primary", ".btn:focus-visible")
      if (part === critical) return true;
      if (part.startsWith(critical)) {
        const next = part[critical.length];
        // Must be followed by a combinator, pseudo, or class modifier
        return !next || /[\s.:,>#~+\-[\{(]/.test(next);
      }
      return false;
    });
  });
}

/**
 * Extract critical rules from parsed blocks.
 * For @media blocks, recursively filters inner rules.
 */
function extractCritical(blocks) {
  const result = [];

  for (const block of blocks) {
    if (block.selector.startsWith('@media')) {
      // Skip reduced-motion — not critical for first paint
      if (block.selector.includes('prefers-reduced-motion')) continue;

      // Parse inner rules
      const innerBlocks = parseTopLevelBlocks(block.body);
      const criticalInner = innerBlocks.filter(inner => isCriticalSelector(inner.selector));

      if (criticalInner.length > 0) {
        const innerCSS = criticalInner.map(b => b.raw).join('\n');
        result.push(`${block.selector} {\n${innerCSS}\n}`);
      }
    } else if (block.selector.startsWith('@keyframes')) {
      // Skip keyframes — not critical for first paint
      continue;
    } else if (isCriticalSelector(block.selector)) {
      result.push(block.raw);
    }
  }

  return result.join('\n\n');
}

// ---------------------------------------------------------------------------
// Minification — simple but effective for CSS custom properties & layout rules
// ---------------------------------------------------------------------------

function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove newlines and collapse whitespace
    .replace(/\s+/g, ' ')
    // Remove space around braces, colons, semicolons
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    // Remove trailing semicolons before closing brace
    .replace(/;}/g, '}')
    // Remove space after @media( and before )
    .replace(/@media\s*\(\s*/g, '@media(')
    .replace(/\s*\)\s*\{/g, '){')
    // Clean up remaining edge cases
    .trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Read source files
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Verify markers exist
  if (!html.includes(START_MARKER) || !html.includes(END_MARKER)) {
    console.error(
      `Error: Could not find critical CSS markers in index.html.\n` +
      `Expected:\n  ${START_MARKER}\n  ...\n  ${END_MARKER}`
    );
    process.exit(1);
  }

  // Parse and extract critical CSS
  const blocks = parseTopLevelBlocks(css);
  const criticalCSS = extractCritical(blocks);
  const minified = minifyCSS(criticalCSS);

  // Build the replacement block
  const inlineBlock = `${START_MARKER}\n  <style>${minified}</style>\n  ${END_MARKER}`;

  // Replace between markers
  const markerRegex = new RegExp(
    `${escapeRegExp(START_MARKER)}[\\s\\S]*?${escapeRegExp(END_MARKER)}`
  );
  const newHTML = html.replace(markerRegex, inlineBlock);

  // Write back
  fs.writeFileSync(HTML_PATH, newHTML, 'utf8');

  // Stats
  const cssBytes = Buffer.byteLength(minified, 'utf8');
  const ruleCount = (minified.match(/\{/g) || []).length;
  console.log(`Synced critical CSS: ${ruleCount} rules, ${(cssBytes / 1024).toFixed(1)} KB`);
  console.log(`Written to: ${HTML_PATH}`);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
