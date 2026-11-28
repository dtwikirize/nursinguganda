import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const MIME_TYPES = {
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

function serveRootAssetsPlugin() {
  return {
    name: "serve-root-assets",
    configureServer(server) {
      server.middlewares.use("/assets", (req, res, next) => {
        const cleanUrl = (req.url || "").split("?")[0];
        const filePath = path.join(process.cwd(), "assets", cleanUrl);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
          fs.createReadStream(filePath).pipe(res);
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), serveRootAssetsPlugin()],
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets/app",
    sourcemap: false
  },
  // Without these the dep optimizer crawls the 433 MB assets/ tree on a cold
  // start and the dev server dies with EMFILE: too many open files.
  optimizeDeps: {
    entries: ["index.html", "src/main.jsx"]
  },
  server: {
    port: 5173,
    open: false,
    watch: {
      ignored: ["**/assets/**", "**/dist/**", "**/Nursing-ug Web_app/**"]
    }
  }
});
