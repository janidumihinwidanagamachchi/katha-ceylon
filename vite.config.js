import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_FALLBACK_API_URL ?? "";
  const supabaseUrl = env.VITE_SUPABASE_URL ?? "";

  return {
    plugins: [react()],
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
        // the bundle and shipping full readable source for a site that has no
        // error tracking attached to it. Flip this on locally if you need to
        // debug a stack trace in a built bundle.
        sourcemap: false,
        chunkSizeWarningLimit: 900,
        rollupOptions: {
          output: {
            // Keep the long-lived vendor code in its own chunk so an app-shell
            // edit does not invalidate ~200KB of cached framework JS. React,
            // the router and framer-motion change far less often than content.
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom"],
              motion: ["framer-motion"],
            },
          },
        },
      },
  };
});