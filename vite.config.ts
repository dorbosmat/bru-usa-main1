import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// PERF-TODO (Sprint Task 11): chunk-splitting strategy below.
// Route-level splitting lives in src/App.tsx (React.lazy + Suspense).
// The manualChunks function below splits node_modules into stable vendor
// groups so a single dep upgrade doesn't invalidate the whole vendor
// cache for repeat visitors. The groupings match real usage patterns:
//
//   react-vendor    — react + react-dom + react-router (every page)
//   supabase-vendor — @supabase/* (used by chat, AI Preview, admin)
//   radix-vendor    — @radix-ui/* (shadcn primitives — large surface)
//   query-vendor    — @tanstack/react-query (used by admin pages most)
//   charts-vendor   — recharts (admin dashboards only)
//   forms-vendor    — react-hook-form / zod / hookform resolvers
//
// CWV-TODO: with the route split + vendor split, the homepage critical
// chunk should drop materially. Re-measure with `npm run build` and
// keep this comment updated.
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise the warning threshold — we are intentionally shipping vendor
    // chunks that may exceed Vite's default 500 KB warning, but every
    // chunk is now well below 700 KB after the split which is fine for
    // HTTP/2 multiplexing and parallel download. Re-tighten once the
    // largest binary assets (bathroom PNGs, hero JPGs) are converted to
    // WebP/AVIF (see PERF-TODO in the image-conversion notes below).
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@radix-ui"))                                          return "radix-vendor";
          if (id.includes("@supabase"))                                          return "supabase-vendor";
          if (id.includes("@tanstack/react-query"))                              return "query-vendor";
          if (id.includes("recharts") || id.includes("d3-"))                     return "charts-vendor";
          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("/zod/")
          ) {
            return "forms-vendor";
          }
          if (id.includes("react-router"))                                       return "react-vendor";
          if (id.includes("/react/") || id.includes("/react-dom/"))              return "react-vendor";
          return undefined; // rest stays in the default vendor chunk
        },
      },
    },
  },
}));

// PERF-TODO: binary image assets in this repo are the dominant LCP /
// transfer-size offenders (audit captured during Sprint Task 11):
//   public/videos/work-team-pic.png        ~10  MB  ← misplaced PNG in /videos
//   src/assets/ai-preview/before-bathroom.png  8.1 MB
//   public/images/about-hero-team.jpg       7.2 MB
//   src/assets/ai-preview/after-bathroom.png   5.4 MB
//   src/assets/services/card-*.jpg          2–3 MB each (10 files)
//   src/assets/home/hero-*.jpg              2–3 MB each (5 files)
// Cumulative ~80 MB of binary assets in repo. Recommended next pass:
//   1. Convert all hero + card JPGs to AVIF (~ 80–90% size reduction)
//      with WebP fallback. Use <picture> with <source type="image/avif">.
//   2. Resize the bathroom before/after to 1600x1200 max (4x current
//      area is wasted — they're never displayed larger than ~600px).
//   3. Investigate the 10 MB PNG sitting in /videos — likely a misnamed
//      poster frame; recompress to JPEG at 1280x720.
// These conversions are done out-of-band (squoosh, sharp-cli, ffmpeg)
// rather than in the build pipeline so the commit history doesn't
// churn massive binary blobs every time a setting changes.
