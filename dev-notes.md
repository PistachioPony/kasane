# Kasane — Dev Notes & Bug Log

A running record of interesting bugs, decisions, and things worth understanding.

---

## Bug 1: Locked cards displaced during drag

**File:** `script.js` → `enforceLockedPositions()`  
**Status:** Fixed  
**Date:** June 2026

### What was happening

After a player submits a partially correct answer, correctly placed cards get a copper border and are "locked." After several drags of other cards, a locked card would eventually drift to the wrong position even though nothing was dragging it.

### Root cause

The drag-and-drop uses `insertBefore(node, referenceNode)` — a DOM method that looks like a single action but is actually two steps:
1. **Remove** `node` from its current position (shifting every card between old and new positions)
2. **Insert** `node` before `referenceNode`

Step 1 shifts all cards in between, including locked ones.

We had `enforceLockedPositions()` to detect and restore displaced locked cards — but it had its own bug.

### The subtle mistake

When a locked card needed to move **down** (current index < correct index), the code used:

```javascript
const referenceNode = cards[correctIndex]; // ❌ wrong when moving down
```

But by the time the insertion happens, the removal in step 1 has already shifted `cards[correctIndex]` one slot up. The locked card lands one position too high.

### The fix

```javascript
const referenceNode = currentIndex < correctIndex
  ? (cards[correctIndex + 1] || null)  // moving DOWN — account for the shift
  : (cards[correctIndex] || null);      // moving UP — unaffected
```

### The lesson

`insertBefore` is not atomic from a positional standpoint. The reference node's index changes between removal and insertion. Any time you move a node that sits *before* the reference node, the reference shifts up by one.

---

## Bug 2: Scrolling reorders cards on mobile

**File:** `script.js` → `initDragAndDrop()`, `style.css`  
**Status:** Fixed  
**Date:** June 2026

### What was happening

On Android, when a player tried to scroll down to reach the submit button, their finger landing on a card would trigger the drag-and-drop instead of scrolling the page — accidentally reordering cards.

### Root cause

The cards had `touch-action: none` in CSS. This tells the browser: "don't handle any touch gestures here — I'll handle everything in JavaScript." So even a clear scroll gesture got captured by the drag code instead of scrolling the page.

### The fix

Add a **drag handle** — a small grip icon (`⠿`) on each side of the card. Only the handle has `touch-action: none` and initiates a drag. The rest of the card gets `touch-action: pan-y`, which tells the browser: "vertical scrolling is fine here, handle it normally."

```css
.card { touch-action: pan-y; }
.card-drag-handle { touch-action: none; cursor: grab; }
```

In JS, `pointerdown` is now attached to `.card-drag-handle` elements only, not the whole card.

### The lesson

`touch-action: none` is powerful but greedy — it suppresses ALL browser touch handling including scrolling. On a scrollable page with draggable elements, you need to be precise about which elements own touch events. Drag handles are the standard solution: they give users a clear target and leave the rest of the surface free for normal scrolling.

---

## Bug 3: Cards unreachable at the bottom during drag

**File:** `script.js` → `initDragAndDrop()` → `onPointerMove()`  
**Status:** Fixed  
**Date:** June 2026

### What was happening

When dragging a card toward the bottom of the screen, the player could only move it as far as the last visible card. Cards below the viewport were completely unreachable — the dragged card would stop moving even though there were more cards below.

### Root cause

The drag logic uses `document.elementFromPoint(e.clientX, e.clientY)` to find which card is under the pointer. This method only sees elements visible in the viewport. Cards scrolled below the visible area return nothing — so the swap never happens and the drag appears to freeze.

### The fix

**Edge scrolling** — when the pointer gets within 80px of the bottom of the viewport during a drag, automatically nudge the page downward a few pixels on each `pointermove` event. This brings the off-screen card into view where `elementFromPoint` can find it.

```javascript
const SCROLL_ZONE = 80;
const SCROLL_SPEED = 6;
if (e.clientY > window.innerHeight - SCROLL_ZONE) {
  window.scrollBy(0, SCROLL_SPEED);
} else if (e.clientY < SCROLL_ZONE) {
  window.scrollBy(0, -SCROLL_SPEED);
}
```

`pointermove` fires many times per second during a drag, so even a small nudge per event produces smooth continuous scrolling.

### The lesson

`elementFromPoint` is limited to the visible viewport — it cannot see off-screen content. Any drag-and-drop on a scrollable page needs edge scrolling so users can drag items to positions that aren't currently on screen.

---

## UX Issue: Submit button hidden below the fold

**File:** `script.js`, `style.css`  
**Status:** Fixed  
**Date:** June 2026

### What was happening

On smaller phones, the 6 draggable cards filled the entire screen with no submit button visible. Players had no way to know the button existed, or that there were more cards below what they could see.

### Fix part 1 — Sticky submit button

Moved the submit button into a `position: fixed` bar pinned to the bottom of the viewport. The button is now always visible regardless of scroll position. A gradient fade above it blends into the dark background.

```css
.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, var(--indigo) 40%);
}
```

### Fix part 2 — Preview scroll on load

The sticky button solved visibility but raised a new question: what if a player rearranges only the visible cards and submits without realising there are more below?

On puzzle load, the page automatically scrolls to the bottom (revealing all cards and the submit button), then returns to the top. This takes about 1.5 seconds and acts as a silent orientation moment.

```javascript
setTimeout(() => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 900);
}, 500);
```

### The lesson

On mobile, "below the fold" means invisible — not just inconvenient. Critical UI elements should either be sticky or confirmed visible on all target screen sizes. When neither is certain, a preview scroll is an elegant way to orient users without adding permanent UI chrome.

---

## Bug 5: localStorage saves wrong puzzle index (off by one)

**File:** `script.js` → `checkAnswer()`, "Next Puzzle" button handler
**Status:** Fixed
**Date:** June 2026

### What was happening

After finishing puzzle 2 and closing the browser, reopening the game showed "CONTINUE → PUZZLE 2" — pointing back to the puzzle you just completed instead of puzzle 3.

### Root cause

`saveProgress()` was called immediately after pushing the result to `state.results`, which happens inside `checkAnswer()`. But `state.currentPuzzleIndex++` happens later — only when the player taps "NEXT PUZZLE →". So at the moment of saving, the index still pointed at the just-finished puzzle.

Timeline:
1. Player gets correct answer → `state.results.push(...)` then `saveProgress()` → saves index 1 (puzzle 2)
2. Player taps "Next Puzzle" → `state.currentPuzzleIndex++` (now 2) → loads puzzle 3
3. Player closes browser
4. On reopen: saved index is 1 → "CONTINUE → PUZZLE 2" — wrong!

### The fix

Remove `saveProgress()` from `checkAnswer()` entirely. Instead, call it inside the "Next Puzzle" button handler, *after* incrementing the index:

```javascript
state.currentPuzzleIndex++;
saveProgress(); // now saves the index of the puzzle they're about to play
loadPuzzle(state.currentPuzzleIndex);
```

### The lesson

Save state *after* all mutations are complete — not in the middle of a multi-step flow. Calling `saveProgress()` at the moment a result is recorded felt logical, but the index is a separate piece of state that updates later. The invariant to maintain: the saved `currentPuzzleIndex` should always be the next puzzle to play, not the one just finished.

---
