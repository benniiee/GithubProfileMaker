# JavaScript/React code practices — GitHub README builder

Read this before writing state logic, block components, or the markdown compiler. It exists because "the app lags the moment I change a color" is almost never a JavaScript speed problem — it's an architecture problem: something cheap (moving a slider) is triggering something expensive (re-rendering everything, recompiling markdown, writing to disk) way more often than it needs to.

---

## 0. Before optimizing anything: rule out dev mode

This is the single most common false alarm. If you're testing with `npm run dev`, you are not measuring real performance:

- React's development build includes extra runtime checks and warnings that don't exist in production.
- `<React.StrictMode>` intentionally double-invokes renders and effects in development to surface bugs — this alone can make things feel roughly 2x slower than they'll actually be.
- The dev bundle is unminified and unbundled per-module.

**Before changing a line of code**, run `vite build && vite preview` and reproduce the color-change lag there. If it's gone or much better, you were chasing a dev-mode ghost — don't restructure real architecture to fix a measurement artifact. If the lag is still there in the production build, the rest of this document applies.

---

## 1. What's actually causing "lag the moment I change a color"

Color pickers — a native `<input type="color">`, a drag-based swatch, or an HSL slider — fire their change event continuously while the user interacts, not once at the end. Dragging a slider can easily fire 30–60 events per second.

If each of those events does this chain:

```
onChange → setState(entire blocks array) → every block component re-renders
  → live preview re-renders → markdown compiler re-runs → localStorage.setItem() runs
```

...then a single color drag is running that *entire* chain dozens of times a second. That's the lag. It isn't that any one step is slow in isolation — it's that a cheap, high-frequency interaction is wired directly into your most expensive operations.

The fix isn't "make the compiler faster." It's: **separate the value that changes 60 times a second (live drag position) from the value that should actually trigger a re-render, a recompile, and a save (the committed color).**

---

## 2. Core practices

### A. Continuous inputs get a local "live" value, committed state gets the final value

Don't pipe every intermediate drag event into global state. Keep the in-progress value local to the control (a `useState` inside the color picker component itself, or even a plain CSS variable update via a ref), and only push to the shared block state — the thing that triggers recompilation and persistence — when the interaction settles.

```jsx
// Bad: every drag tick updates global state, re-renders everything, recompiles, writes to disk
function ColorField({ value, onChange }) {
  return <input type="color" value={value} onChange={e => onChange(e.target.value)} />;
}

// Good: local live value drives the visible swatch instantly; global state
// (and everything downstream of it) only updates when the value is committed
function ColorField({ value, onCommit }) {
  const [live, setLive] = useState(value);

  return (
    <input
      type="color"
      value={live}
      onChange={e => setLive(e.target.value)}     // cheap, local, instant
      onBlur={() => onCommit(live)}                // expensive path, once
    />
  );
}
```

For a custom drag-based picker (not the native input), update a CSS custom property directly on the swatch element via a ref during drag for the visual feedback, and only call `setState` on pointer-up. This is how design tools like Figma keep continuous interactions smooth — the pixel-by-pixel feedback never touches React's render cycle at all.

### B. Memoize block components, and give them stable props

`React.memo` only helps if the props you're passing are actually stable across renders. An inline arrow function or object literal is a *new reference* every render, which defeats memoization silently — this is the most common reason "I already added memo and it's still slow."

```jsx
// Bad: a new function reference every render, so BlockCard re-renders every time
// the parent re-renders, regardless of memo
<BlockCard block={block} onUpdate={(id, patch) => updateBlock(id, patch)} />

// Good: stable reference via useCallback, block content compared by memo
const handleUpdate = useCallback((id, patch) => updateBlock(id, patch), [updateBlock]);
<BlockCard block={block} onUpdate={handleUpdate} />

const BlockCard = React.memo(function BlockCard({ block, onUpdate }) {
  // only re-renders when `block` or `onUpdate` actually change
});
```

Same rule for objects/arrays built inline (`style={{ color: block.color }}`, `items={block.items.filter(...)}`) — if it's built fresh every render, memoize it with `useMemo` or move the computation where it belongs (see D).

### C. Colocate state; don't let one Context re-render the whole tree

If block state lives in a single top-level Context (or a single `useState` covering the entire blocks array) and every component reads from that same context, then updating *any* field of *any* block re-renders *every* consumer — including blocks nobody touched.

- Keep frequently-changing, narrowly-scoped state (which block is currently being edited, current picker being dragged) as local component state, not global state.
- If you do need shared state for the blocks array, consider splitting it: one slice for "structure" (block order, ids) that changes rarely, and per-block state/subscriptions so editing one block's color doesn't re-render the other nine.
- If using Context, split it into multiple contexts by update frequency rather than one context holding everything — a component that only needs the block list order shouldn't re-render because a color value changed elsewhere.

### D. The markdown compiler is a derived value — treat it like one

`compileMarkdown(blocks)` should never be called directly in a component body on every render, and it should never run as a side effect on every keystroke. It's a pure function of state — memoize it against the specific state it actually depends on:

```jsx
// Bad: recompiles on every render, including renders caused by unrelated UI state
const markdown = compileMarkdown(blocks);

// Good: only recomputes when `blocks` actually changes
const markdown = useMemo(() => compileMarkdown(blocks), [blocks]);
```

If compilation is still visibly expensive with real content (many blocks), debounce the *commit* that feeds it (see A) rather than trying to make the compiler itself reactive to every keystroke. A 100–150ms debounce on committing a text edit is imperceptible to the user typing, but cuts recompilation frequency by an order of magnitude.

### E. Never write to `localStorage` synchronously on every state change

`localStorage.setItem` is a synchronous, blocking call — for a reasonably sized blocks tree serialized to JSON, doing this on every keystroke or every drag tick is a real, measurable cost, not a theoretical one.

```js
// Bad: blocks the main thread on every single state update
useEffect(() => {
  localStorage.setItem('readme-blocks', JSON.stringify(blocks));
}, [blocks]);

// Good: debounce writes so rapid changes collapse into one write
useEffect(() => {
  const id = setTimeout(() => {
    localStorage.setItem('readme-blocks', JSON.stringify(blocks));
  }, 300);
  return () => clearTimeout(id);
}, [blocks]);
```

### F. dnd-kit specifics

- Don't put expensive per-item work (markdown preview of a single block, heavy computed styles) inside the component that's actively being dragged — `dnd-kit` already re-renders the dragged item frequently to track pointer position; keep that component as cheap as possible.
- Wrap sortable item components in `React.memo` so items *not* involved in the current drag don't re-render just because a sibling moved.
- Use `useSortable`'s provided `transform`/`transition` via `style`, not by recalculating position yourself in state — recalculating in state re-triggers React's reconciliation on every pointer move; the library's own transform application is CSS-driven and cheaper.

### G. Stable, real keys — never array index — for reorderable lists

With drag-and-drop reordering, an index-based `key` actively causes bugs, not just inefficiency: React will match the wrong DOM node to the wrong item after a reorder, causing visible flicker or state bleeding between items (e.g. a text input's focus or cursor position jumping to a different block after dragging).

```jsx
// Bad: index changes on every reorder, so React thinks every item's identity changed
{blocks.map((block, i) => <BlockCard key={i} block={block} />)}

// Good: stable id survives reordering, React correctly tracks each item's identity
{blocks.map(block => <BlockCard key={block.id} block={block} />)}
```

### H. Tailwind: don't build class names dynamically

Tailwind's compiler statically scans your source for literal class strings at build time — it can't see inside a template literal like `` `bg-${colorName}-500` `` and won't generate CSS for it, so this fails silently in production even though it may appear to work in dev.

```jsx
// Bad: Tailwind can't statically find this class, so it won't be in the production CSS
<div className={`bg-${color}-500`} />

// Good: reference full literal class names so the compiler can see them,
// or use inline style / CSS variables for genuinely dynamic values (like a user-picked hex color)
<div className={color === 'red' ? 'bg-red-500' : 'bg-blue-500'} />
// or, for arbitrary user-chosen colors (not a fixed palette):
<div style={{ backgroundColor: block.color }} />
```

Since block colors here come from a color picker (arbitrary hex values, not a fixed Tailwind palette), use inline `style` or a CSS custom property for the actual swatch color — Tailwind utility classes are the wrong tool for a value that isn't known at build time.

### I. Measure with the React DevTools Profiler before and after

Don't guess which component is re-rendering too often — turn on "Highlight updates when components render" in React DevTools and drag a color slider. If you see the entire block list flash on every tick, that confirms the diagnosis in §1 directly. Fix one layer (commit-on-blur, then memoization, then debounced persistence) and re-check with the profiler before adding the next optimization — most of these problems are solved by fixing the input-to-commit boundary in §A alone.

---

## 3. Checklist before calling a performance fix done

- [ ] Confirmed the lag reproduces in a production build (`vite build && vite preview`), not just dev mode.
- [ ] Continuous inputs (color pickers, sliders) update local state instantly and only commit to global state on blur/release.
- [ ] `compileMarkdown` is wrapped in `useMemo` keyed to the actual state it depends on, not called inline in render.
- [ ] `localStorage` writes are debounced, not fired on every keystroke.
- [ ] Block/item components are wrapped in `React.memo`, and the handlers/objects passed to them are stable (`useCallback`/`useMemo`), not recreated inline every render.
- [ ] List keys are stable ids, not array indices.
- [ ] No Tailwind class names are built via string interpolation from dynamic values.
- [ ] Verified with the React DevTools Profiler that the fix actually reduced re-render count, not just guessed.