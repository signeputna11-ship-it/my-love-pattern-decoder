// @lovable.dev/vite-tanstack-config already includes the following. Do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Outside Lovable the Cloudflare Worker build is opt-in: DEPLOY_TARGET=cloudflare npm run build
export default defineConfig(process.env.DEPLOY_TARGET === "cloudflare" ? { nitro: true } : {});
