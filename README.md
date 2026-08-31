# GitHub Profile README Builder

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Author](https://img.shields.io/badge/Author-benniiee-181717?logo=github&logoColor=white&style=flat-square)](https://github.com/benniiee)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white&style=flat-square)](https://vercel.com/)

A modern, visual, Notion-inspired **GitHub Profile README Builder** built as a pure client-side Single Page Application (SPA). Designed for software engineers, developers, and open-source creators to compose, customize, and export professional, high-impact GitHub profile READMEs with real-time preview and nested drag-and-drop ordering.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features](#-key-features)
- [Supported Block Types](#-supported-block-types)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Development](#installation--local-development)
  - [Production Build](#production-build)
- [Developer Guide: Extending the Builder](#-developer-guide-extending-the-builder)
  - [How to Add a New Block Type](#how-to-add-a-new-block-type)
  - [State Management Architecture](#state-management-architecture)
  - [Compilation Pipeline](#compilation-pipeline)
- [Code Conventions & Performance Guidelines](#-code-conventions--performance-guidelines)
- [Deployment](#-deployment)
- [Author & Credits](#-author--credits)
- [License](#-license)

---

## 🔭 Overview & Architecture

This application operates entirely in the browser (**100% client-side**) with zero external backend dependencies. It combines a Notion-like modular block editor with an instant GitHub-Flavored Markdown (GFM) compiler.

```
┌────────────────────────────────────────────────────────┐
│               GitHub Profile Builder SPA               │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌──────────────────────┐        ┌──────────────────────┐
 │   Left Pane:         │        │   Right Pane:        │
 │   Block Builder      │        │   Live Dual Preview  │
 │   - Macro Drag (DND) │        │   - Rendered GFM     │
 │   - Micro Drag (DND) │        │   - Raw Markdown     │
 │   - Block Editors    │        │   - 1-Click Copy     │
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
1. **Monochrome-Leaning Dev Tool Aesthetic**: Follows the design philosophy of Linear, Vercel, and Raycast (subtle grayscale palette, hairline borders, consistent radii, zero decorative clutter).
2. **Decoupled Input Performance**: High-frequency continuous controls (color pickers, sliders) maintain local state and only commit to global state on change settle, avoiding unnecessary re-renders.
3. **Trustworthy Preview**: Renders markdown using `react-markdown`, `remark-gfm`, and `rehype-raw` with identical styling and container widths to GitHub's native profile renderer.

---

## ✨ Key Features

- **🧱 Notion-Style Modular Blocks**: Add, duplicate, delete, reorder, and collapse individual profile sections with full state encapsulation.
- **🔀 Two-Tier Nested Drag-and-Drop (`@dnd-kit`)**:
  - **Macro Drag**: Reorder top-level sections (Banner, Hero, Rapid Fire, Skills, Projects, Experience, Stats).
  - **Micro Drag**: Reorder items *inside* a section (e.g., individual skill badges, bullet prompts, experience cards, social links).
- **⚡ Real-Time Markdown & HTML Compiler**: Custom pure JavaScript compiler translating block trees into valid, sanitizable GitHub-Flavored Markdown and HTML fallbacks (`<div align>`, `<table>`, flex wrappers).
- **🎨 Interactive Custom Modals**: Clean, accessible modal dialogs for block insertion, badge browsing, bulk pasting, and destructive action confirmations.
- **💾 Automatic Local Persistence**: Debounced `localStorage` synchronization preserving profile drafts across browser reloads.
- **📥 One-Click Export**:
  - **Copy Markdown**: Copies ready-to-paste markdown directly to clipboard with instant visual feedback.
  - **Download `README.md`**: Directly downloads a formatted file.
- **🌓 Dark / Light Theme Support**: Full dark mode with high contrast and ambient mesh gradient backdrop.

---

## 🧩 Supported Block Types

| Block Type | Description | Key Customization Options |
| :--- | :--- | :--- |
| **Banner & Header** | Header image or dynamic waving curve | Capsule Render wave generator (flowing wave, soft organic, convex arch, concave arc, rounded pill, transparent, rect + animations: twinkling, pulsing glow, fade-in, scale-in, static), 11 gradient themes, custom wallpaper URL, Profile views counter (`komarev.com`), TOC summary wrapper. |
| **Hero Introduction** | Profile intro with avatar & dynamic subtitle | Avatar URL, shapes (`circle`, `rounded`, `square`), size slider, Animated Typing SVG generator (`readme-typing-svg`), social badge links. |
| **Rapid Fire / About Me** | Highlighted tagline and Q&A bullet points | Bio statement, draggable prompt items (*Working on*, *Learning*, *Ask me about*, *Fun fact*), custom icons/bullets. |
| **Skills & Tools Grid** | Categorized developer technologies | 90+ curated searchable badges across 8 categories (Languages, Frontend, Backend, Databases, Cloud & DevOps, Testing, Design & IDEs, AI & Data Science), center flex-wrap HTML badges layout, badge height scaling, Bulk Shields.io parser (markdown/HTML/names). |
| **GitHub Stats & Widgets** | Live GitHub repository & activity cards | Extended stats card, Top languages card, Commit streak counter, 10+ color themes, layout width selector. |
| **Project Showcase** | Card grid for featured repositories | Responsive 2-col or 3-col `<table>` layout, preview thumbnails, live demo links, repository URLs, tech stack tags. |
| **Work Experience** | Chronological career timeline | Role, company, dates, location, overview description, reorderable accomplishment bullet points. |
| **Custom Markdown** | Raw markdown / HTML code node | Freeform GFM editor with one-click stats card snippet insertions. |

---

## 📁 Project Directory Structure

```
github-profile-maker/
├── .github/                     # GitHub workflows and config
├── docs/                        # UI/UX design references & documentation
├── public/                      # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── blocks/              # Dedicated Block Editor Components
│   │   │   ├── BannerBlockEditor.jsx       # Header & Capsule Waving generator
│   │   │   ├── CustomMarkdownEditor.jsx    # Raw GFM snippet editor
│   │   │   ├── ExperienceBlockEditor.jsx   # Work experience timeline
│   │   │   ├── GitHubStatsBlockEditor.jsx  # GitHub stats & streak cards
│   │   │   ├── HeroBlockEditor.jsx         # Avatar, Typing SVG, social badges
│   │   │   ├── ProjectsBlockEditor.jsx     # Project showcase table grid
│   │   │   ├── RapidFireBlockEditor.jsx    # Draggable Q&A bullet points
│   │   │   └── SkillsBlockEditor.jsx       # Categorized badges (90+) & bulk importer
│   │   ├── builder/             # Builder Canvas & Drag-and-Drop Container
│   │   │   ├── AddBlockModal.jsx           # Section block selection dialog
│   │   │   ├── BlockCard.jsx               # Individual draggable block shell
│   │   │   ├── BlockSettings.jsx           # Per-block alignment & header settings
│   │   │   └── DndBuilder.jsx              # DnD Context handling macro & micro drags
│   │   ├── layout/              # App Shell & Navigation
│   │   │   ├── Header.jsx                  # Top navigation, templates, export actions
│   │   │   ├── Footer.jsx                  # Bottom footer with author credit
│   │   │   └── SplitView.jsx               # Responsive dual-pane layout container
│   │   ├── preview/             # Output Preview Components
│   │   │   ├── LivePreview.jsx             # Rendered GitHub markdown view
│   │   │   └── RawMarkdownView.jsx         # Line-numbered raw markdown code view
│   │   └── ui/                  # Reusable UI Primitives
│   │       ├── DebouncedInputs.jsx         # Decoupled Color & Range controls
│   │       ├── Modal.jsx                   # Linear-style Modal & ConfirmDialog
│   │       └── Primitives.jsx              # Button, Input, Textarea, Badge
│   ├── lib/                     # Utilities, Compiler, and Presets
│   │   ├── compileMarkdown.js   # Pure JS Markdown/HTML compiler engine
│   │   ├── defaultState.js      # Starter templates (Modern, Alex, DevOps, Minimal)
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
   git clone <repository-url>
   cd github-profile-maker
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

## 🛠️ Developer Guide: Extending the Builder

### How to Add a New Block Type

Adding a new section block requires 4 simple steps:

1. **Define the Data Schema**:
   Add default block properties in `addBlock()` inside [`src/store/profileStore.jsx`](file:///c:/Users/Ash/Desktop/Website/github-profile-maker/src/store/profileStore.jsx):
   ```javascript
   else if (type === 'custom-widget') {
     newBlock = {
       id: generateId('block_widget'),
       type: 'custom-widget',
       title: 'My Custom Widget',
       hideHeader: false,
       alignment: 'left',
       isCollapsed: false,
       // Custom properties...
     };
   }
   ```

2. **Create the Block Editor Component**:
   Create `src/components/blocks/CustomWidgetEditor.jsx` using primitives from `src/components/ui/Primitives.jsx`.

3. **Add Compiler Logic**:
   In [`src/lib/compileMarkdown.js`](file:///c:/Users/Ash/Desktop/Website/github-profile-maker/src/lib/compileMarkdown.js), add a case in the switch statement and write a pure compiler function returning the markdown string:
   ```javascript
   case 'custom-widget':
     sectionMd = compileCustomWidget(block);
     break;
   ```

4. **Register in UI**:
   - Register the component and icon in [`src/components/builder/BlockCard.jsx`](file:///c:/Users/Ash/Desktop/Website/github-profile-maker/src/components/builder/BlockCard.jsx).
   - Add the block entry in [`src/components/builder/AddBlockModal.jsx`](file:///c:/Users/Ash/Desktop/Website/github-profile-maker/src/components/builder/AddBlockModal.jsx).

---

### State Management Architecture

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

---

## ⚡ Code Conventions & Performance Guidelines

When contributing to this repository, adhere to the guidelines established in `javascript_code_practices.txt` and `docs/ui-ux-design-reference.md`:

1. **Pure JavaScript / JSX**: Keep all code in pure `.js` and `.jsx` syntax without TypeScript overhead.
2. **Decouple Continuous Inputs**: Never pipe high-frequency drag events directly to `updateBlock()`. Use `ColorInput` or `DebouncedSlider` from `DebouncedInputs.jsx`.
3. **Memoize Sortable Items**: Wrap sortable child items and cards in `React.memo` to keep DnD interactions at 60fps.
4. **Stable Unique Keys**: Always use `generateId()` for keys—never use array indices in reorderable lists.
5. **No Dynamic Tailwind Interpolation**: Never build class names dynamically with template literals like `` `bg-${color}-500` ``. Use inline `style` for arbitrary user-defined colors.

---

## ☁️ Deployment

### Vercel (Recommended)
This repository is pre-configured for instant deployment on [Vercel](https://vercel.com/):
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### GitHub Pages / Static Hosting
Because the project is 100% static client-side, the generated `dist/` folder can be served by any static web server (GitHub Pages, Cloudflare Pages, Netlify, AWS S3).

---

## 👨‍💻 Author & Credits

Created and maintained by **[benniiee](https://github.com/benniiee)**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
