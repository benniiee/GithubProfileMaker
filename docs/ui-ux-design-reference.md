# UI/UX design reference — GitHub README builder (v2)

Read this before writing any component. It exists so the app looks like it was designed by someone with a point of view, not generated from a template. Every choice below is justified by what this specific tool is: a dual-pane, block-based editor used by developers to build something they'll put their name on.

**What changed in v2:** the original doc was strong on "don't look like AI slop" but had two gaps in practice. First, it never addressed emoji/emotes directly, and undirected emote use is one of the fastest ways to make a dev tool look generated. Second, following the doc's own restraint principles too literally — hover-only affordances, grayscale, minimal decoration — produced screens with real dead space, because restraint was never paired with a plan for what *earns* that space back. Sections 8 and 9 are new. Sections 2, 4, 5, and 8 (checklist) are amended in place. Everything else is unchanged from v1.

---

## 1. The one rule everything else follows

Design decisions come from the subject, not from habit. This is a developer tool for building a developer artifact (a README). The audience already lives in code editors, terminals, and GitHub itself. They will notice — consciously or not — if the UI looks like a generic SaaS landing page kit instead of a tool built by people who understand their world.

Concretely: this app should feel closer to **Linear, Vercel, Raycast, and GitHub's own UI** than to a marketing site or a no-code form builder. Precise, quiet, monochrome-leaning, information-dense where it needs to be, empty where it doesn't.

The important word there is "where it needs to be." Emptiness is not automatically restraint — sometimes it's just an unfinished screen. Section 9 exists because that distinction matters.

---

## 2. Traits that mark a UI as AI-generated — do not default to these

These show up constantly in generated interfaces regardless of what the product actually is. Treat every one as a thing to actively avoid, not a neutral default:

- **Warm cream background (~#F4F1EA) + serif display + terracotta accent (~#D97757).** This is the single most common generated-look tell right now. Do not use this palette for this app.
- **Near-black background with one bright acid-green or vermilion accent.** Also overused.
- **The SaaS-card kit**: everything chopped into identically rounded cards, one border-radius applied everywhere regardless of hierarchy, the same soft gray shadow (`rgba(0,0,0,.1)`) under every card, gradient washes used as pure decoration.
- **Template chrome**: tracked-out ALL-CAPS eyebrow labels above every heading; meta text joined with middle dots (`A · B · C`); labels styled as `WORD — fragment` with a spaced em dash; a monospace font slapped on small data labels for no functional reason; a `→` glued onto every button and link.
- **Numbered markers (01 / 02 / 03)** on content that isn't actually a sequence. This app has real sequences (the Experience timeline, ordered blocks) — number those. Don't number things that aren't ordered, like a settings popover's options.
- **Bolding or italicizing a single word in a heading** for emphasis. **All-caps for every label.** Unnecessary typographic eyebrows above content that's already self-explanatory.
- **Fade-and-slide-up entrance animation on every section, hover-lift on every card.** This is the generic default and reads as templated the instant more than one element does it.
- **Decorative emoji/emotes with no functional job** — 🚀 next to "Deploy," ✨ next to a heading called "Features," 🎉 in a success toast, an emoji in every sidebar label. This is covered in full in section 8, but it belongs on this list because it's exactly as diagnostic as the terracotta-and-serif combo above: the moment an emoji is doing the job of a word instead of the job of a signal, the screen reads as generated.

If you're about to reach for any of these, stop and ask whether it's actually the right choice for *this* screen, or just the path of least resistance.

---

## 3. Reference points — study these, don't copy them

These are real products with distinct, deliberate design languages relevant to a block-based dev tool. Pull principles, not pixels.

**Linear** — the clearest reference for this app's *tone*. Near-monochrome UI (grays doing almost all the work), a single restrained accent color used sparingly and consistently for interactive state, dense information without feeling cluttered, keyboard-first interactions treated as first-class (not an afterthought bolted onto a mouse-driven UI). Study how little color Linear actually uses — most of the interface is grayscale, and color appears only where it's meaningful (status, priority, active state).

**Vercel** — near-monochrome black/white/gray palette, Geist typeface, sharp geometric precision, generous whitespace used deliberately rather than as filler. Relevant here because this app *deploys to* Vercel — visual kinship isn't required, but Vercel is a good example of a dev-tool brand that never reaches for decoration it doesn't need.

**Notion** — the direct UX ancestor of this app's core interaction model. Study specifically: the `+` block-insertion affordance that only appears on hover at the cursor's current line, the six-dot drag handle that appears on hover to the left of a block (not always visible — visible on intent), the block-type picker as a filterable command menu rather than a dropdown, and how settings for a block live in a lightweight popover anchored to that block rather than a separate panel. Your nested drag-and-drop and per-block settings popover should feel like this family of interaction, not like a form builder's static "Edit" button. Notion is also the right reference for emoji, specifically: page-icon emoji and inline `:emoji:` in Notion are always *user-chosen and load-bearing* (they identify a page, or stand in for a word in running text) — Notion's own chrome never sprinkles emoji onto its buttons or labels. That distinction is the crux of section 8.

**Raycast** — reference for popovers, command palettes, and how a "settings" surface can feel fast and native rather than like a modal dialog bolted onto a webpage. Blur/glass treatment used sparingly and only on floating surfaces (popovers, command palette), never on the base UI.

**GitHub itself** — the most important reference, because the *output* of this tool has to live inside GitHub's own rendering of markdown. Study GitHub's own information density: monospace used functionally (code, usernames, technical values) not decoratively, hairline borders instead of heavy shadows, badges and pills that are compact and informational rather than decorative. Also study how GitHub itself uses emoji: shortcodes like `:rocket:` and `:tada:` are a real, popular part of README culture — release notes, PR titles, and README headers use them constantly. The tool should make that easy to do *in the generated markdown*, while keeping its own builder chrome emoji-free. Those are two different surfaces with two different rules — don't collapse them into one policy.

**shadcn/ui** (already your component base) — its whole design philosophy is restraint: no unnecessary shadow, radius, or color by default. Don't fight it by layering generic SaaS polish on top; extend it in the same spirit. Restraint is a starting discipline, not a finished layout — see section 9 for what fills the space restraint deliberately leaves behind.

---

## 4. Design tokens for this app

Fill this in once, early, and keep every component honest to it. Don't let individual screens invent their own colors or radii.

**Color** — lean grayscale with one working accent, not a marketing palette:
- Base surfaces: near-white / near-black neutrals (not pure `#FFF`/`#000` — pick a warm-neutral or cool-neutral gray family and stay in it, e.g. Vercel's or Linear's approach of a slightly tinted gray scale rather than true black).
- One accent color, used only for: primary actions, active/selected state, and drag-in-progress feedback. Nowhere else. Resist adding a second accent for "variety."
- Semantic colors (error, success, warning) stay desaturated until they're actually needed (a real error state), not used decoratively.

**Type** — two roles, not two decorative typefaces:
- UI/body: a clean grotesk (Inter, Geist, or similar) — this is a tool, not an editorial page. Don't reach for a serif display face; it fights the dev-tool register this app lives in.
- Monospace: reserved for actual technical content — generated markdown preview, code-like values (usernames, badge URLs) — not for stylistic flourish on regular labels.
- Keep a tight, deliberate type scale (a handful of sizes, not a dozen). Settings popover text, block titles, and body copy should each have one consistent size — don't let sizes drift screen to screen.

**Layout** — the dual-pane structure is the spine of the whole app:
- Left pane (builder) and right pane (live preview) should feel like two views of the same data, not two unrelated panels — consistent gutter, consistent vertical rhythm, so a block in the left pane and its rendered output in the right pane read at roughly the same vertical position where possible.
- Left-align almost everything. This is a working tool, not a marketing page — center-aligned hero treatment has no place here except perhaps the very first empty-state screen.
- Radius: pick one small radius for interactive controls (buttons, inputs) and one slightly larger radius for containers (blocks, popovers, cards). Two radii total, applied consistently — not "whatever felt right per component."
- **A third region, not two:** most gap complaints trace back to treating this as a two-pane layout when it's really builder / preview / *context*. Reserve a narrow, collapsible third region (left of the builder, or a slim rail) for the block library and contextual help described in section 9. Don't solve empty vertical space inside the builder or preview panes by adding padding — solve it by giving that space an actual job in the third region instead.

**Principles** — the short version to hold yourself to:
1. Grayscale does the work; color is meaningful, not decorative.
2. Every visual affordance (drag handle, `+` button, settings gear) appears on hover/intent, not permanently cluttering the canvas — mirror Notion's restraint here.
3. The output (rendered markdown) is the real product. The builder UI should never visually upstage the preview pane.
4. Restraint removes decoration; it doesn't remove content. If a screen feels empty, the fix is more real information (section 9), never a gradient, an illustration, or an emoji standing in for missing content.

---

## 5. Component-level guidance specific to this app

**Block list (macro drag-and-drop)**
- Drag handle: six-dot icon, hover-only visibility, left-aligned to the block, not a full-width "grab anywhere" surface — grabbing anywhere makes text-selection and clicking inside the block unreliable.
- Dragging state: the block being dragged gets a subtle elevation (thin border + very light shadow, not a heavy drop shadow), and a thin insertion-line indicator shows where it'll land — not a ghost outline of the whole block, which is noisier than necessary.
- Empty canvas state: a single, calm "Add a block" affordance — not a large illustration or marketing-style empty state graphic. This is a tool; the empty state should invite the very next action, plainly. If the canvas is empty for longer than a first visit, that's a job for the block library (section 9), not for decorating the empty state itself.

**Item list within a block (micro drag-and-drop)**
- Slightly smaller/lighter drag handle than the macro one, so the visual hierarchy between "reordering blocks" and "reordering items inside a block" stays legible without needing a label to explain it.

**Block settings popover**
- Anchor it to the block, don't center it in a modal — modals interrupt the builder/preview relationship this app depends on. Popover content: alignment, header toggle, badge style — grouped by what they affect, not just stacked in the order they were built.

**Live preview pane**
- No chrome trying to look like an actual GitHub page (no fake browser window, no fake profile header). Render the markdown plainly, close to how GitHub itself renders it, so what the user sees is trustworthy — a stylized "preview of a preview" undermines the one thing this pane needs to do.

**Export controls (Copy / Download)**
- Button copy is literal and active: "Copy markdown," "Download README.md" — not "Export" or "Submit." Confirm success in the interface's own voice: a brief "Copied" state on the button itself, not a separate toast stack, for an action this lightweight.

**New: Block library / context rail** (fills the third layout region from section 4)
- A collapsible left rail listing block types (Header, About, Skills, Experience, Stats, Badges, Socials, Custom) as a scannable list, not a grid of icon tiles — this is a list of *things you insert*, closer to Notion's slash-menu contents than to an app-launcher grid.
- Below the block list, a thin "Recently used" section — real state, not filler — so a user building several READMEs in a session sees their own actual usage, not a static suggestion.
- This rail is the right home for the one-time onboarding content (the "here's how this works" material a lot of generated UIs mishandle by putting it in a modal or a dismissible banner on the canvas itself). Put it here, let it collapse, and don't re-show it once dismissed.

**New: Preview pane footer strip**
- A single hairline-bordered strip under the preview pane with real, functional information: character count, whether the markdown will render a broken image link, GitHub-flavored-markdown compatibility notes (e.g., "this alignment trick doesn't render on GitHub mobile"). This is the kind of density GitHub's own diff and PR views use constantly, and it's exactly the sort of real content that fills space without being decoration.

**New: Template starting points (first-run / empty-project state)**
- Rather than a single blank canvas on first load, offer 3–4 named starting layouts (e.g., "Minimal," "Project README," "Personal profile," "Open-source contributor") as a plain list, not a card carousel with screenshots. Selecting one populates real blocks the user immediately edits — this replaces "gap" with "a decision," which is more in keeping with a dev tool than an illustrated empty state would be.

---

## 6. Writing inside the product

- Name things the way a developer thinks about them: "Blocks," "Preview," "Copy markdown" — not internal implementation names ("Nodes," "Render tree," "Serialize").
- Active voice, plain verbs. A button that adds a block says "Add block," not "New" or "Create."
- Empty states and errors explain what to do next, in the product's own voice — no apologizing, no vague "Something went wrong."
- No filler copy. If a label doesn't help someone use the tool, cut it.
- No decorative emoji in this copy — see section 8 for exactly where the line is, because "Copy markdown" and "Copy markdown 📋" read as two different products, and only one of them belongs here.

---

## 7. Motion

- One deliberate motion moment is worth more than animation on everything. Candidates worth animating: the drag-and-drop reorder itself (it needs motion to be legible), the block-insertion moment, the popover open/close.
- Skip: entrance animations on page load, hover-lift on every card, animated gradients. None of these serve a tool a developer will use daily — repeated motion on a daily-use tool becomes friction, not delight.
- Respect `prefers-reduced-motion` throughout.

---

## 8. Emoji & emotes — two surfaces, two different rules

This app touches emoji in two genuinely different places, and the single biggest mistake is applying one policy to both. Keep them separate.

### 8.1 The builder's own UI chrome — no decorative emoji, ever

Buttons, labels, empty states, toasts, settings popovers, the block library, onboarding copy: none of this gets emoji as decoration. Not "🚀 Add block," not "✨ Preview," not a 🎉 in the copy-success state. This isn't a stylistic preference — it's the same signal as the terracotta-and-serif palette in section 2. A generated UI reaches for an emoji because it's an easy, cheap way to imply energy or personality without doing the work of an actual interaction detail (real motion, real copy, real information). A tool built by people who understand developers doesn't need the emoji, because it earns personality the way Linear and Raycast do: through precision, through an interaction that feels considered, through copy that's specific rather than generic.

The test before using any emoji in the app's own chrome: **if you deleted it, would anything about the interface communicate less?** If the answer is no, it was decoration, and decoration in this app is the exact failure mode section 2 already lists.

The only narrow exceptions are functional, not decorative:
- A semantic status glyph that stands in for color-blind-safe meaning (though a proper icon from your icon set, not a random emoji, is almost always the better choice here — prefer that first).
- An emoji the *user themselves* picked to represent something of theirs (e.g., if a "Socials" block lets someone label a custom link and they type an emoji into their own label) — that's their content, not the app's chrome, and it follows section 8.2's rules instead.

### 8.2 The generated README content — emoji are a real, earned part of this culture, support them well

This is the opposite situation. GitHub READMEs, PR titles, and commit messages have a genuine, long-standing convention of using emoji shortcodes (`:rocket:`, `:sparkles:`, `:warning:`) as compact functional markers — a changelog entry, a section a maintainer wants to flag, a status. That's not slop; it's a real convention of the medium this tool outputs into. Refusing to support it well would be its own kind of tone-deafness, just in the opposite direction from decorative emoji spam.

Support it properly rather than loosely:
- If a block (e.g., a header or a badges block) supports an icon or leading glyph, offer a real `:shortcode:` picker (searchable, GitHub's actual shortcode set) rather than a native OS emoji picker — the shortcode is what actually renders identically on GitHub, and using the real picker also reinforces the tool's credibility with developers who know the difference.
- Keep it opt-in and scoped to blocks where it's a real convention (headers, section titles, badges) — don't offer an emoji-insert affordance on every block by default, or you've just relocated the decorative-emoji problem from the chrome into the output.
- In the live preview, render shortcodes exactly as GitHub would, so what the user sees is trustworthy (this is the same trust requirement section 5 already sets for the preview pane generally).

### 8.3 The one-line rule to hold yourself to

*Emoji are content the user chose for their README, never a costume the app puts on for itself.* If you're ever unsure which side of that line something falls on, it belongs in 8.1's "no" column until proven otherwise.

---

## 9. Filling space without faking life

Restraint (grayscale, hover-only affordances, no decorative shadows) is correct, but restraint only removes what shouldn't be there — it was never supposed to be the whole design. If a screen still feels empty after you've applied every rule in sections 1–7, that's a sign real content is missing, not a sign you need decoration. This section is about which real content goes where.

**Diagnose before you decorate.** For any region that feels like a "gap," ask what's actually missing before reaching for a visual fix:
- Is there a decision the user hasn't made yet that the UI should be surfacing instead of hiding? (→ template starting points, section 5)
- Is there real state the app already has that isn't being shown? (→ recently used blocks, word/character counts, GFM compatibility notes, section 5)
- Is there a next action that isn't obvious? (→ a plainly-worded prompt, not an illustration)
- Is this region genuinely fine as whitespace, and it only *feels* wrong because a neighboring region is under-filled? (→ fix the neighbor, leave this one alone)

**Concrete density moves for this app specifically**, roughly in order of how much they change the perceived "life" of the layout:
1. **The block library / context rail** (section 5) turns the empty space to the left of the builder into a working part of the tool instead of a margin.
2. **Template starting points** replace a blank canvas with a short, real decision on first load.
3. **The preview footer strip** turns dead space under the preview into information the user actually needs before hitting "Copy markdown."
4. **Inline block previews inside the builder pane** — e.g., a Skills block shows a compact preview of its own badges inline in the builder list, not just in the far-away preview pane — shorten the distance between editing and seeing, which reads as more "alive" than any animation would.
5. **Real counts and states in small type** where they're functionally true — a Badges block showing "6 badges," an Experience block showing "3 entries" — the same instinct as GitHub's own compact metadata, applied to your own blocks.

**What doesn't count as filling space**, even though it's tempting because it's fast to add:
- Illustrations, mascots, or hero graphics on non-empty-state screens.
- A "tips" carousel of generic advice unrelated to the user's actual document.
- Gradient panels, decorative background patterns, or texture used to make a flat area feel "designed."
- Emoji, per section 8.
- Padding. Padding is not content. If a region is empty because it genuinely has nothing to show yet (e.g., a brand-new block with no items), a calm, specific prompt in that exact spot is correct — inflating the surrounding whitespace to "balance" it is not.

The through-line: everywhere else in this doc, "don't add decoration" is the rule. Here, the rule is symmetrical — "don't add decoration" and "don't leave a functional gap unfilled" are the same instruction pointed in two directions. The fix for AI-slop and the fix for empty-feeling layouts are the same fix: replace whatever isn't real information with real information, in either direction.

---

## 10. Before calling anything done

Run this checklist against the actual screen, not the plan:
- [ ] Does any part of this match section 2's "traits to avoid" list? If yes, was that a deliberate choice for this specific screen, or just the default?
- [ ] Is color used only where it's meaningful (state, action, selection) — not decoratively?
- [ ] Are there two radii total, applied consistently, not "whichever felt right per component"?
- [ ] Do affordances (drag handles, add buttons, settings gears) appear on hover/intent rather than cluttering the canvas permanently?
- [ ] Does the live preview pane look like a trustworthy rendering of the actual markdown, not a stylized mockup of one?
- [ ] Would a developer who uses Linear or Raycast daily recognize this as belonging to that same family of tool?
- [ ] **Does any emoji in the app's own chrome survive the "if I deleted it, would anything communicate less?" test from section 8.1?** If not, cut it.
- [ ] **Is the README-content emoji/shortcode picker (section 8.2) actually the real GitHub shortcode set, not a generic OS emoji picker?**
- [ ] **For every region that reads as empty, can you name the specific real content that belongs there (section 9), or are you about to paper over it with decoration?**
- [ ] If you added something to fill space today, is it state, a decision, or information the user needs — or is it visual noise wearing the costume of "life"?