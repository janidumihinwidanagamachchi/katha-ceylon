import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

/**
 * GitHub Pages serves static files and nothing else: it has no rewrite rule, so
 * a hard refresh on /katha-ceylon/explore would return a real 404 instead of the
 * app. Pages does serve a 404.html at the requested URL, though, so shipping a
 * copy of index.html keeps the browser URL intact and React Router reads the
 * path from it. Emitting the file here rather than in the deploy workflow keeps
 * dist/ correct for any static host, not just CI.
 */
const spaFallback = () => {
  let outDir = "dist";
  return {
    name: "katha-spa-fallback",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const index = path.resolve(outDir, "index.html");
      if (!fs.existsSync(index)) return;
      fs.copyFileSync(index, path.resolve(outDir, "404.html"));
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Pages serves a project repo from a subpath, so a production build needs the
  // /katha-ceylon prefix baked into every asset URL. Dev keeps the root.
  // BASE_PATH overrides it if the repo is ever renamed or given a custom domain.
  const base = env.BASE_PATH ?? (mode === "production" ? "/katha-ceylon/" : "/");

  const target = env.VITE_FALLBACK_API_URL ?? "";
  const supabaseUrl = env.VITE_SUPABASE_URL ?? "";

  return {
    base,
    plugins: [react(), spaFallback()],
    resolve: {
      alias: { "@": path.resolve(process.cwd(), "src") },
    },
    define: {
      // `process.env` reads can appear in any dependency; keep them harmless.
      "process.env.NODE_ENV": JSON.stringify(
        mode === "production" ? "production" : "development",
      ),
    },
    server: {
      port: 3000,
      open: true,
      // Proxy `/api` to the legacy backend so both transports work in dev.
      proxy: target
        ? {
            "/api": {
              target,
              changeOrigin: true,
              rewrite: (p) => p.replace(/^\/api/, "/api"),
            },
          }
        : undefined,
    },
    preview: { port: 4173 },
    build: {
      outDir: "dist",
      // No sourcemaps for production. They were adding a 2.2MB .map next to
      // the bundle and shipping full readable source. Flip this on locally if
      // you need to debug a stack trace in a built bundle.
      sourcemap: false,
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          // Keep the long-lived vendor code in its own chunk so an app-shell
          // edit does not invalidate ~200KB of cached framework JS.
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            motion: ["framer-motion"],
          },
        },
      },
    },
  };
});