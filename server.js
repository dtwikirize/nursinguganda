const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Correct MIME type for web app manifest
express.static.mime.define({ "application/manifest+json": ["webmanifest"] });

// Serve all static assets from the project root
app.use(
  express.static(__dirname, {
    maxAge: "1d",
    etag: true,
    lastModified: true,
  })
);

// SPA fallback — hash-based routing handles all navigation client-side
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Nursing Uganda running on port ${PORT}`);
});
