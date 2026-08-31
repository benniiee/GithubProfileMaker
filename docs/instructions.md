# Context & Goal

Build a premium, Notion-style **GitHub Profile README Builder** as a single-page React application. The app lets users construct highly professional, customized GitHub profile READMEs using a dynamic block-based layout engine, a live rendered preview, and a markdown compiler.

The application is **entirely client-side**: zero backend, zero external APIs, zero database. All state persists in the browser via `localStorage`. There is no server component of any kind — the finished build is a static bundle of HTML/CSS/JS.

Act as a Senior Frontend Engineer and architect this application accordingly.

---

## 1. Tech Stack Requirements

* **Build tool:** Vite (React + TypeScript template)
* **Framework:** React 18+ (no meta-framework, no SSR — this is a pure client-side SPA)
* **Styling:** Tailwind CSS + shadcn/ui components
* **Drag-and-drop:** `dnd-kit` (`@dnd-kit/core` + `@dnd-kit/sortable`), with support for **nested sortable contexts**
* **Markdown rendering (preview):** `react-markdown` with `remark-gfm` (GitHub Flavored Markdown) and `rehype-raw` (to render inline HTML fallbacks in the live preview, matching how GitHub itself renders README HTML)
* **Markdown compilation (export):** hand-written TypeScript compiler module (see §3) — this is NOT the same thing as the preview renderer; it turns block state into an output `.md` string
* **State management:** React state + `useReducer`/Zustand (your choice) — no server state library needed since there's no backend
* **Persistence:** `localStorage` only, via a small typed wrapper (see §4)

**Repo & deployment:**
* Source lives in a public GitHub repository.
* Deployed via **Vercel**, using its zero-config Vite preset (framework auto-detected from `vite.config.ts`; build command `vite build`, output directory `dist`).
* No `vercel.json` should be required for the base deploy. If a rewrite rule is later needed for client-side routing, note it in the README but don't over-engineer routing — this app has effectively one screen (the builder), so a router is optional, not required.

---

## 2. Core Features: Advanced Section Management (The "Block Builder")

Move away from rigid, hardcoded sections. Implement a dynamic layout engine where users can add, configure, and reorder distinct "Blocks".

### A. Nested Drag-and-Drop Architecture
* **Macro reordering:** Drag to reorder entire structural blocks (e.g., move the "Experience" block above the "Skills Grid" block).
* **Micro reordering:** Drag to reorder individual items *within* a block (e.g., rearrange badges in the Skills Grid, or reorder roles in the Experience timeline).
* Implement this as two levels of `SortableContext` from `dnd-kit`: an outer context for the block list, and a per-block inner context for that block's items, sharing a single `DndContext`/`onDragEnd` handler that disambiguates macro vs. micro drags by container id.

### B. Professional Block Types
Users can add, duplicate, and remove any number of the following block types:

1. **Hero Intro** — split-layout block: rounded avatar image (URL input), typing-effect subtitle (renders as an HTML `<img>` tag pointing to a typing-svg-style generator or a static fallback text), and social link badges.
2. **Experience Timeline** — structured block: array of entries, each with Job Title, Company, Dates, and bullet points, compiled into a clean markdown timeline.
3. **Skill & Tool Grids** — configurable badge containers grouped by category (e.g., Frontend, Architecture, DevOps), supporting bulk-adding Shields.io badges (paste multiple, parse into individual badge items).
4. **Project Showcase Grid** — generates a 2- or 3-column layout using HTML `<table>` (since GFM has no native grid), displaying project thumbnails, descriptions, and repo links side-by-side.
5. **Custom Markdown Node** — a raw textarea block for edge cases, passed through to the compiler untouched, supporting standard GFM.

### C. Block Configuration & Styling
Each block has a "Settings" popover controlling:
* Alignment (Left / Center / Right) — compiles to `<p align="...">` wrappers where GFM has no native alignment.
* Header visibility toggle.
* Badge style (`flat`, `plastic`, `for-the-badge`) — applied to all Shields.io URLs generated within that block.

---

## 3. Live Preview & Markdown Compiler

* **Dual-pane interface:** left pane is the Block Builder UI; right pane is a zero-latency rendered preview (`react-markdown` + `remark-gfm` + `rehype-raw`) of the compiled markdown string, re-rendered on every state change.
* **Markdown Compiler module** (`src/lib/compileMarkdown.ts`): a pure function `compile(blocks: Block[]): string` that walks the nested block/item state and emits GitHub-flavored markdown, falling back to raw HTML (`<p align>`, `<table>`, `<div>`) exactly where GFM has no native equivalent — mirroring what GitHub's own renderer accepts.
* **Export controls:** "Copy to Clipboard" (Clipboard API) and "Download as README.md" (Blob + `<a download>`), both operating on the compiler's output string, not the preview's rendered HTML.

---

## 4. State Architecture & Persistence

* Define a single nested, serializable state tree (see JSON Schema deliverable below) covering: ordered list of blocks → each block's type, settings, and ordered list of items.
* Wrap `localStorage` access in a small typed module (`src/lib/storage.ts`) with `load()`/`save()`/`clear()`, debounced writes on state change, and a schema version field so future block-type changes can migrate old saved state instead of breaking it.
* No IndexedDB, no cookies, no external sync — `localStorage` is the sole persistence layer per the zero-backend constraint.

---

## 5. Output Needed From You

1. **State Architecture / JSON Schema** — the deeply nested TypeScript types (or JSON Schema) for the reactive state object handling an arbitrary number of blocks and their internal items, plus the versioned `localStorage` shape.
2. **Nested Drag-and-Drop Implementation** — the core React components/hooks that handle dragging blocks (macro) and dragging items inside a block (micro) using `dnd-kit`, including the shared `onDragEnd` disambiguation logic.
3. **The Markdown Compiler** (`compileMarkdown.ts`) — the pure TypeScript function that walks the nested state and emits correctly formatted GitHub markdown with HTML layout fallbacks.
4. **Directory Structure** — the Vite/React project layout: `src/components/blocks/*` (one file per block type), `src/components/builder/*` (DnD shell, settings popover), `src/lib/*` (compiler, storage), `src/store/*` (state), and where the preview pane and export controls live.