#!/usr/bin/env node

/**
 * version-assets.js
 *
 * Appends a `?v=<package version>` cache-busting query to the minified CSS/JS
 * references in dist/index.html.
 *
 * The bundles ship under STABLE filenames (styles.min.css / main.min.js) and
 * are served with an `immutable`, 1-year cache (see `_headers`). Without a
 * changing URL, browsers and the Cloudflare edge keep serving the stale copies
 * across releases. Bumping the version query gives each release a fresh URL —
 * busting the cache — while keeping the long `immutable` cache benefit.
 *
 * Usage:  node scripts/version-assets.js   (run after `minify:html`)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'dist', 'index.html');
const VERSION = require(path.join(ROOT, 'package.json')).version;

if (!fs.existsSync(HTML_PATH)) {
  console.error('version-assets: dist/index.html not found — run after minify:html.');
  process.exit(1);
}

const ASSETS = ['css/styles.min.css', 'js/main.min.js'];

let html = fs.readFileSync(HTML_PATH, 'utf8');
let count = 0;

ASSETS.forEach(function (asset) {
  // Match the asset path only when immediately followed by a quote (i.e. the
  // end of an href/src value) and not already carrying a query — so re-runs
  // never double-stamp.
  const re = new RegExp(asset.replace(/\./g, '\\.') + '(?=["\'])', 'g');
  html = html.replace(re, function () {
    count++;
    return asset + '?v=' + VERSION;
  });
});

fs.writeFileSync(HTML_PATH, html);
console.log('version-assets: stamped ' + count + ' reference(s) with ?v=' + VERSION);
