# GitHub Profile README Builder

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Author](https://img.shields.io/badge/Author-benniiee-181717?logo=github&logoColor=white&style=flat-square)](https://github.com/benniiee)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white&style=flat-square)](https://vercel.com/)

A modern, visual, Notion-inspired **GitHub Profile README Builder** built as a pure client-side Single Page Application (SPA). Designed for developers and open-source creators to compose, customize, and export professional, high-impact GitHub profile READMEs with real-time preview and nested drag-and-drop ordering.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features](#-key-features)
- [Supported Block Types & Customization](#-supported-block-types--customization)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Development](#installation--local-development)
  - [Production Build](#production-build)
- [State Management & Compiler Architecture](#-state-management--compiler-architecture)
  - [State Management](#state-management)
  - [Compilation Pipeline](#compilation-pipeline)
  - [Decoupled Input Performance](#decoupled-input-performance)
- [Deployment](#-deployment)
- [Author](#-author)
- [Credits & Acknowledgements](#-credits--acknowledgements)
- [License](#-license)

---

## 🔭 Overview & Architecture

This application operates entirely in the browser (**100% client-side**) with zero backend dependencies. It combines a Notion-like modular block editor with an instant GitHub-Flavored Markdown (GFM) compiler.

```
┌────────────────────────────────────────────────────────┐
│               GitHub Profile Builder SPA               │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌──────────────────────┐        ┌──────────────────────┐
 │   Left Pane:         │        │   Right Pane:        │
 │   Full-Width Builder │        │   Live Dual Preview  │
 │   - Macro Drag (DND) │        │   - Rendered GFM     │
 │   - Micro Drag (DND) │        │   - Raw Markdown     │
 │   - Categorized Tabs │        │   - Live GFM Status  │
 │   - Section Settings │        │   - 1-Click Copy     │
 └──────────┬───────────┘        └──────────▲───────────┘
            │                               │
            ▼                               │
 ┌──────────────────────────────────────────┴───────────┐
 │               Profile Context Provider               │
 │ - Central State (blocks array)                       │
 │ - Debounced Markdown Compiler (compileMarkdown.js)   │
 │ - Debounced LocalStorage Persistence (400ms)         │
 └──────────────────────────────────────────────────────┘
```

### Core Design Principles
1. **Full-Width Fluid Workspace**: Accommodates widescreen monitors with expansive 50/50 dual pane layout, removing artificial max-width constraints for spacious editing.
2. **Developer-First SaaS Aesthetic**: Inspired by the design standards of Linear, Vercel, and modern developer tooling—featuring a near-charcoal dark theme (`#0d0e11`), hairline borders, and a high-visibility chartreuse/lime CTA button.
3. **Categorized Tabbed Navigation**: Multi-option section editors (banners, hero bio, skills, and block catalogs) are partitioned into clean, intuitive tabs to eliminate button clutter and visual overwhelm.
4. **Decoupled Input Performance**: Continuous controls (color pickers, font sliders, dimension ranges) maintain local state and only commit to global state on change settle, ensuring silky 60fps drag-and-drop and instant live feedback.
5. **Trustworthy GFM Preview**: Markdown is parsed and styled with GitHub's exact typography, block margins, and table styles using `react-markdown`, `remark-gfm`, and `rehype-raw`.

---

## ✨ Key Features

- **🧱 Notion-Style Modular Blocks**: Add, duplicate, delete, reorder, and smoothly collapse individual profile sections with full state encapsulation.
- **🔀 Two-Tier Nested Drag-and-Drop (`@dnd-kit`)**:
  - **Macro Drag**: Reorder top-level sections (Banner, Hero, Rapid Fire, Skills, Projects, Experience, Stats).
  - **Micro Drag**: Reorder items *inside* a section (e.g., individual skill badges, bullet prompts, experience cards, social links).
- **⚡ Real-Time Markdown & HTML Compiler**: Custom pure JavaScript compiler translating block trees into valid, sanitizable GitHub-Flavored Markdown and HTML fallbacks (`<div align>`, `<table>`, flex wrappers).
- **🌊 Curated Wave & Header Shapes**: Includes 11 wave and organic container styles powered by Capsule Render (`wave`, `waving`, `venom`, `blur`, `pulse`, `transparent`, `soft`, `egg`, `cylinder`, `rounded`, `rect`).
- **🗂️ Categorized Badge Library**: 90+ searchable tech badges across 8 categories with an interactive modal catalog and bulk importer.
- **🎨 Interactive Custom Modals**: Accessible modal dialogs for categorized block insertion, badge browsing, bulk pasting, and destructive action confirmations.
- **💾 Automatic Local Persistence**: Debounced `localStorage` synchronization preserving profile drafts across browser reloads.
- **📥 One-Click Export**:
  - **Copy Markdown**: Copies ready-to-paste markdown directly to clipboard with instant visual feedback.
  - **Download `README.md`**: Directly downloads a clean, formatted file.
- **🌓 Dark / Light Theme Support**: Full dark mode with high contrast and ambient background mesh gradient.

---

## 🧩 Supported Block Types & Customization

| Block Type | Description | Key Customization Options |
| :--- | :--- | :--- |
| **Banner & Header** | Dynamic waving curve or custom header image | Capsule Render wave generator (`wave`, `waving`, `venom`, `blur`, `pulse`, `transparent`, `soft`, `egg`, `cylinder`, `rounded`, `rect` + animations: `twinkling`, `blink`, `fadeIn`, `scaleIn`, `none`), 11 gradient themes, custom color stops, font color, vertical alignment, custom wallpaper URL, Profile views counter (`komarev.com`), TOC summary wrapper. Organized in 4 tabs: *Wave & Content*, *Colors & Theme*, *Fine Tuning*, *Views & Greeting*. |
| **Hero Introduction** | Profile intro with avatar & dynamic subtitle | Avatar URL, shapes (`circle`, `rounded`, `square`), size slider, Animated Typing SVG generator (`readme-typing-svg`), social badge links. Organized in 3 tabs: *Profile Info*, *Subtitle & Typing*, *Social Links*. |
| **Rapid Fire / About Me** | Highlighted tagline and Q&A bullet points | Bio statement, draggable prompt items (*Working on*, *Learning*, *Ask me about*, *Fun fact*, *Reach me*, *Collaborate*), custom bullet symbols, and answer values. |
| **Skills & Tools Grid** | Categorized developer technologies | 90+ curated searchable badges across 8 categories (Languages, Frontend, Backend, Databases, Cloud & DevOps, Testing, Design & IDEs, AI & Data Science), center flex-wrap HTML layout, badge height scaling, Bulk Shields.io parser (markdown/HTML/names). Organized in 2 tabs: *Badges & Categories*, *Display & Sizing*. |
| **GitHub Stats & Widgets** | Live GitHub repository & activity cards | Extended stats card, Top languages card, Commit streak counter, 10+ color themes (`default`, `radical`, `tokyonight`, `dracula`, `github_dark`, `nord`, `ocean_dark`, `gruvbox`, `synthwave`, `highcontrast`), layout width selector (`48%`, `80%`, `100%`). |
| **Project Showcase** | Card grid for featured repositories | Responsive 2-col or 3-col `<table>` layout, preview thumbnails, live demo links, repository URLs, tech stack tags. |
| **Work Experience** | Chronological career timeline | Role, company, dates, location, overview description, reorderable accomplishment bullet points. |
| **Custom Markdown** | Raw markdown / HTML code node | Freeform GFM editor with one-click stats card snippet insertions. |

---

## 📁 Project Directory Structure

```
github-profile-maker/
├── .github/                     # GitHub workflows and repository config
├── docs/                        # Reference documentation
│   ├── SECURITY.md              # Security policy
│   └── template-reference.html  # UI design reference
├── public/                      # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── blocks/              # Dedicated Block Editor Components
│   │   │   ├── BannerBlockEditor.jsx       # Header & Capsule Waving generator (tabbed)
│   │   │   ├── CustomMarkdownEditor.jsx    # Raw GFM snippet editor
│   │   │   ├── ExperienceBlockEditor.jsx   # Work experience timeline
│   │   │   ├── GitHubStatsBlockEditor.jsx  # GitHub stats & streak cards
│   │   │   ├── HeroBlockEditor.jsx         # Avatar, Typing SVG, social badges (tabbed)
│   │   │   ├── ProjectsBlockEditor.jsx     # Project showcase table grid
│   │   │   ├── RapidFireBlockEditor.jsx    # Draggable Q&A bullet points
│   │   │   └── SkillsBlockEditor.jsx       # Categorized badges (90+) & bulk importer (tabbed)
│   │   ├── builder/             # Builder Canvas & Drag-and-Drop Container
│   │   │   ├── AddBlockModal.jsx           # Section block selection dialog (categorized)
│   │   │   ├── BlockCard.jsx               # Individual draggable block shell
│   │   │   ├── BlockSettings.jsx           # Per-block alignment & header settings
│   │   │   └── DndBuilder.jsx              # DnD Context handling macro & micro drags
│   │   ├── layout/              # App Shell & Navigation
│   │   │   ├── Header.jsx                  # Top navigation, templates, export actions
│   │   │   ├── Footer.jsx                  # Bottom footer with author credit
│   │   │   └── SplitView.jsx               # Responsive full-width dual-pane container
│   │   ├── preview/             # Output Preview Components
│   │   │   ├── LivePreview.jsx             # Rendered GitHub markdown view
│   │   │   └── RawMarkdownView.jsx         # Line-numbered raw markdown code view
│   │   └── ui/                  # Reusable UI Primitives
│   │       ├── DebouncedInputs.jsx         # Decoupled Color & Range controls
│   │       ├── Modal.jsx                   # Modal dialogs & ConfirmDialog
│   │       └── Primitives.jsx              # Button, Input, Textarea, Badge
│   ├── lib/                     # Utilities, Compiler, and Presets
│   │   ├── compileMarkdown.js   # Pure JS Markdown/HTML compiler engine
│   │   ├── defaultState.js      # Starter templates (Modern, Developer, Minimal)
│   │   ├── storage.js           # LocalStorage serialization & schema handling
│   │   └── utils.js             # Shields.io badge builder, ID generator, parsers
│   ├── store/                   # State Management
│   │   └── profileStore.jsx     # React Context store with debounced persistence
│   ├── App.jsx                  # Main Application Component
│   ├── index.css                # Tailwind CSS layers & GitHub typography rules
│   └── main.jsx                 # Vite Entrypoint
├── index.html                   # HTML document template
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration (Tailwind + Autoprefixer)
├── tailwind.config.js           # Tailwind design tokens and dark mode config
└── vite.config.js               # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/benniiee/GithubProfileMaker.git
   cd GithubProfileMaker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

To create an optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🛠️ State Management & Compiler Architecture

### State Management

All profile state is centralized in `src/store/profileStore.jsx` and accessed via the `useProfile()` custom hook:

```javascript
const {
  state,              // Current profile state: { blocks: [...] }
  compiledMarkdown,   // Memoized compiled markdown string
  addBlock,           // (type, index?) => void
  removeBlock,        // (blockId) => void
  duplicateBlock,     // (blockId) => void
  updateBlock,        // (blockId, updater) => void
  reorderBlocks,      // (activeId, overId) => void (Macro Drag)
  reorderItems,       // (blockId, activeId, overId) => void (Micro Drag)
  resetToDefault,     // () => void
  setBlocks,          // (blocksArray) => void
} = useProfile();
```

### Compilation Pipeline

The compiler (`src/lib/compileMarkdown.js`) is a pure functional pipeline:
- Takes the current `blocks` array as input.
- Iterates over each block and applies dedicated formatters (`compileBanner`, `compileHero`, `compileSkills`, `compileProjects`, etc.).
- Formats alignment with standard GitHub `<div align="...">` wrappers.
- Emits clean, copy-ready GitHub-Flavored Markdown (GFM).

### Decoupled Input Performance

To prevent UI stutter during intensive operations:
- High-frequency inputs (sliders and color pickers) use `DebouncedInputs.jsx` to update local state immediately while deferring global store writes until interaction settles.
- Sortable list items and cards are memoized with `React.memo` to sustain 60fps drag-and-drop frame rates.

---

## ☁️ Deployment

### Vercel (Recommended)
This repository is pre-configured for instant deployment on [Vercel](https://vercel.com/):
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### GitHub Pages / Static Hosting
Because the project is 100% client-side, the generated `dist/` directory can be served by any static host (GitHub Pages, Cloudflare Pages, Netlify, AWS S3).

---

## 👨‍💻 Author

Created and maintained by **[benniiee](https://github.com/benniiee)**.

---

## 💖 Credits & Acknowledgements

This project is made possible thanks to these open-source libraries, APIs, and community tools:

- **[Shields.io](https://shields.io)** — Metadata badges for open-source projects.
- **[Capsule Render](https://github.com/kyechan99/capsule-render)** by [@kyechan99](https://github.com/kyechan99) — Dynamic waving curve and organic shape SVG header generator.
- **[GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats)** by [@anuraghazra](https://github.com/anuraghazra) — Dynamically generated GitHub stats and top languages cards.
- **[GitHub Readme Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats)** by [@DenverCoder1](https://github.com/DenverCoder1) — Contribution streak counters.
- **[Readme Typing SVG](https://github.com/DenverCoder1/readme-typing-svg)** by [@DenverCoder1](https://github.com/DenverCoder1) — Animated typing effect SVGs.
- **[GitHub Profile Views Counter](https://github.com/antonkomarev/github-profile-views-counter)** by [@antonkomarev](https://github.com/antonkomarev) — Profile view counter badges.
- **[Simple Icons](https://simpleicons.org)** — SVG brand icons for popular tech stacks and developer tools.
- **[@dnd-kit](https://dndkit.com)** — Performant, lightweight drag-and-drop toolkit for React.
- **[Lucide Icons](https://lucide.dev)** — Clean, consistent open-source icons.
- **[Tailwind CSS](https://tailwindcss.com)** & **[Vite](https://vitejs.dev)** — Modern, ultra-fast frontend styling and build tooling.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
