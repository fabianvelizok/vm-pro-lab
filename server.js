const express = require('express');
const path = require('path');

const app = express();
const oneYear = 31536000000;

// Add very long cache headers for static assets that rarely change.
app.use((req, res, next) => {
  // only set on assets (css, js, fonts, images, icons, etc.)
  if (/\.(css|js|woff2?|ico|svg|jpg|jpeg|png|webp|json)$/.test(req.path)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

// Single page fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Production server running on http://localhost:${port}`);
});
