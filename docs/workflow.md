# Development workflow — read this before writing anything

This file is the entry point. It doesn't contain design rules or code rules itself — it routes every incoming request to the doc that does, so nothing gets implemented against memory or guesswork. Two reference docs govern this project:

- **`ui-ux-design-reference-v2.md`** — visual design, layout, component behavior, motion, emoji policy.
- **`javascript-code-practices.md`** — code style, patterns, and conventions. *(Adjust this filename if yours differs — this doc just needs to point at the real one.)*

The rule underneath everything below: **classify the request first, open the relevant doc(s) in full before writing or changing anything, then implement, then re-check against the same doc(s) before calling it done.** Skimming a doc once at project start and working from memory afterward is exactly what this file exists to prevent — designs and conventions drift, and re-reading is cheap compared to redoing work that missed a rule.

---

## 1. Classify the request

Most requests fall cleanly into one of these. If a request spans more than one, follow every row that applies — don't pick the closest one and skip the rest.

| Request looks like... | Examples | Read before touching code |
|---|---|---|
| **New feature** (new capability, new block type, new interaction) | "Add a Skills block," "let users reorder items within a block," "add an export-to-PDF option" | Both docs, in full |
| **Layout change** (structure, spacing, regions, responsiveness) | "The left rail feels cramped," "stack the panes on mobile," "add a footer strip under the preview" | `ui-ux-design-reference-v2.md` §4 (tokens/layout), §5 (component guidance), §9 (space/density) — then `javascript-code-practices.md` for how the change should actually be built |
| **Visual/design change** (color, type, spacing values, motion, iconography, emoji) | "Make the accent color less prominent," "add a hover state to the drag handle," "should this use an emoji?" | `ui-ux-design-reference-v2.md` §2, §4, §7, §8 as relevant — §10 checklist at the end regardless |
| **Bug fix / behavior correction** | "Dragging a block sometimes drops it in the wrong spot" | `javascript-code-practices.md` first; only pull in the design doc if the fix changes visible behavior, not just internals |
| **Pure refactor / internal code change** (no visible or behavioral change) | "Extract this into a hook," "clean up this component's props" | `javascript-code-practices.md` only |
| **Copy / wording change** | "Reword this empty state," "change this button label" | `ui-ux-design-reference-v2.md` §6 (writing inside the product) |

If a request doesn't obviously match a row — say so and ask, rather than guessing which doc applies.

---

## 2. Before writing any code

1. Open the doc(s) §1 pointed to — the whole section, not just the part that seems relevant. Rules earlier in a doc (e.g., the AI-slop traits list, or a code-practices convention stated once near the top) apply everywhere later in it, so a partial read misses constraints silently.
2. Note anything in what you read that the request, as asked, would violate. If the request conflicts with a documented rule (e.g., "add a decorative icon to every button" conflicts with the emoji policy), flag the conflict before implementing — don't silently follow the doc and ignore the request, and don't silently follow the request and ignore the doc.
3. If the change touches the dual-pane layout, the block library rail, or anything in `ui-ux-design-reference-v2.md` §5's component list, re-read that component's specific entry even if you've implemented something similar before — component-level rules are more specific than the general principles and take precedence over them.

## 3. While implementing

- Follow `javascript-code-practices.md` for how the code is structured, named, and styled — that doc is authoritative for code, the same way the design doc is authoritative for visuals. Don't let a design constraint justify skipping a code convention, or vice versa.
- If the work is visual, build against the actual design tokens (§4 of the design doc) rather than eyeballing a color or spacing value that looks close.

## 4. Before calling it done

Run every checklist that applies, in full, against the actual result — not the plan:

- Any visual or layout work → `ui-ux-design-reference.md` §10, all items, including the emoji and gap-filling items added in v2.
- Any code change → the equivalent checklist/rules section in `javascript-code-practices.md`.
- If both apply, both checklists must pass. A change that looks right but would fail either doc's checklist isn't done yet.

---

## 5. When the docs don't agree with each other

These two docs cover different layers (visuals vs. code) and shouldn't often conflict, but if a design instruction implies a code pattern that `javascript_code_practices.md` discourages (or the reverse), don't resolve it silently in either direction — surface the conflict and let it be decided explicitly. Silently picking one doc over the other is how the two references drift out of sync with what's actually being built.