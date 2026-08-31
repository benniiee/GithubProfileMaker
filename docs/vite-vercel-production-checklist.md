# Production build & Vercel deployment — GitHub README builder

This is a different concern from the runtime performance doc. That one covers *what happens while someone is using the app* (re-renders, memoization). This one covers *what ships in the first place* — the build Vercel actually serves. Both matter, but they fail in different ways: bad runtime code feels slow while dragging a slider; a bad build feels slow on first load, or ships things it didn't need to.

---

## 0. Always validate against the real build, not the dev server

`npm run dev` and what Vercel deploys are not the same artifact — dev mode skips minification, ships unbundled modules, and includes React's extra development-only checks. Before trusting any performance impression, or before deploying:

```bash
npm run build     # produces the exact dist/ Vercel will serve
npm run preview   # serves that dist/ locally, close to production conditions
```

Treat `vite preview` as your local Vercel — if something's slow there, it'll be slow in production too. If it's only slow in `npm run dev`, it's not a real problem.

---

## 1. Let Vercel's Vite integration do its job — don't fight it

Vercel auto-detects a Vite project and sets the build command to `vite build` and the output directory to `dist` with zero configuration needed. Verify this matches in the Vercel project settings, but don't add a `vercel.json` unless you have a specific reason to (see §5 for the one common exception).

Vercel automatically handles, for every deploy, with no setup required:
- Brotli/gzip compression on all served assets.
- Long-lived, immutable `Cache-Control` headers on Vite's content-hashed output files (e.g. `assets/index-a1b2c3.js`) — safe because the hash changes whenever the content does, so browsers can cache them forever.
- A preview deployment URL for every branch/PR, separate from production — use these to sanity-check a change before it reaches `main`.

---

## 2. Split the vendor bundle from your app code

By default, Vite bundles your app code and its dependencies together. That means every deploy invalidates the *entire* bundle in visitors' browser caches — including large, rarely-changing libraries like `dnd-kit` and the markdown stack (`react-markdown`, `remark-gfm`, `rehype-raw`), even when the only thing that actually changed was a small tweak to your own component.

Split them so the vendor chunk stays cached across your deploys, and only your (smaller) app chunk needs re-downloading:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // don't ship sourcemaps publicly; see note below
    rollupOptions: {
      output: {
        manualChunks: {
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-raw'],
        },
      },
    },
  },
});
```

If you want sourcemaps for debugging production errors without exposing them to every visitor, use `sourcemap: 'hidden'` instead of `false` — it generates the maps for your own use (e.g. uploading to an error-tracking tool) without referencing them from the shipped JS.

---

## 3. Code-split what isn't needed immediately

This app's core loop (block builder + live preview) is used by nearly everyone the moment they land, so don't over-engineer lazy loading for it — that adds complexity for no real gain. Reserve `React.lazy` for genuinely optional, heavier features if you add them later (a PDF export, a syntax-highlighting theme picker, an onboarding tour):

```jsx
const ExportDialog = React.lazy(() => import('./components/ExportDialog'));

// inside a component:
<Suspense fallback={null}>
  {showExport && <ExportDialog />}
</Suspense>
```

Don't lazy-load the block editors, the compiler, or the preview pane — those are the product, not optional extras, and lazy-loading them just adds a loading flicker to the main experience for no benefit.

---

## 4. Keep an eye on what's actually shipping

Add a bundle visualizer as a dev dependency and check it periodically, not just once:

```bash
npm install -D rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html', gzipSize: true }),
  ],
});
```

Run `npm run build` and open `dist/stats.html` to see what's actually taking up space. Common things worth catching this way:
- Importing an entire utility library when you only use one function (`import _ from 'lodash'` pulls in all of lodash; `import debounce from 'lodash/debounce'` or a native implementation doesn't).
- Accidentally adding extra `remark-*`/`rehype-*` plugins beyond the two the spec actually needs (GFM support and raw HTML passthrough) — each one adds real weight to the markdown vendor chunk.

---

## 5. The one common case that does need `vercel.json`: client-side routing

This app is currently a single screen, so this likely doesn't apply yet — but if you add React Router or any client-side routes later, a hard refresh on a non-root path (e.g. `/settings`) will 404 on a static host unless you tell Vercel to serve `index.html` for all paths and let the client-side router take over:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Don't add this preemptively if there's no client-side routing yet — it's unnecessary complexity for a single-screen app.

---

## 6. Environment variables are public by default

Any variable prefixed `VITE_` gets read at build time and inlined directly into the shipped client bundle — anyone can view it in the browser's dev tools. Since this app is explicitly zero-backend with no API keys per the original spec, there shouldn't be secrets to worry about yet. If that changes later (e.g. adding a real GitHub API token to auto-pull repo data), that value cannot live in a `VITE_` variable or anywhere in this client-only app — it would require an actual backend or serverless function to hold it, which is a bigger architectural change than adding an env var.

---

## 7. Fonts, if you add a custom typeface

- Prefer self-hosting the font files over a runtime Google Fonts request — it avoids an extra DNS lookup/connection on every visit and keeps font loading under your own caching strategy.
- If you do use Google Fonts (or any remote font host), add a `<link rel="preconnect">` for it in `index.html` so the connection warms up before the CSS request needs it.
- Set `font-display: swap` so text renders in a fallback font immediately rather than staying invisible while the custom font loads.

---

## 8. Checklist before a deploy you're trusting

- [ ] Tested against `npm run build && npm run preview`, not just `npm run dev`.
- [ ] Vercel project settings show build command `vite build`, output directory `dist` (should be auto-detected, but verify).
- [ ] Vendor libraries (`dnd-kit`, markdown stack) are split into their own chunk via `manualChunks`.
- [ ] `sourcemap` is `false` or `'hidden'` in the production build config, not left as the default `true`.
- [ ] Checked `dist/stats.html` at least once for anything unexpectedly large in the bundle.
- [ ] No `VITE_`-prefixed variable holds anything that shouldn't be publicly visible.
- [ ] `vercel.json` rewrites only exist if client-side routing actually exists yet.
