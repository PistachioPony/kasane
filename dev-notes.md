# Kasane — Dev Notes & Bug Log

A running record of interesting bugs, decisions, and things worth understanding.

---

## Bug: Locked cards displaced during drag

**File:** `script.js` → `enforceLockedPositions()` and `initDragAndDrop()`  
**Status:** Fixed  
**Date:** June 2026

### What was happening

After a player submits a partially correct answer, correctly placed cards get a copper border and are "locked" — they shouldn't be movable. But after several drags of *other* cards, a locked card would eventually end up in the wrong slot even though nothing was dragging it.

### Root cause

The drag-and-drop uses the DOM method `insertBefore(node, referenceNode)`.

What that line actually does, under the hood:
1. **Remove** `node` from wherever it currently sits in the DOM
2. **Insert** `node` immediately before `referenceNode`

Step 1 shifts every card between the old and new positions. If a locked card sits in that range, it gets displaced — even though nobody dragged it.

We had a function `enforceLockedPositions()` that was supposed to detect and fix this after every drag move. It read the current DOM order, found any locked card out of place, and called `insertBefore` again to put it back.

The bug was inside `enforceLockedPositions` itself.

### The subtle mistake

When a locked card needs to move **down** (its current index is less than its correct index), we used this as the insertion reference:

```javascript
const referenceNode = cards[correctIndex]; // ❌ wrong when moving down
```

But `insertBefore` removes the node *before* inserting it. The removal shifts everything between the old and new positions up by one. So by the time the insertion happens, the card we wanted to insert before has slid one slot earlier — and the locked card lands one position too high.

### The fix

```javascript
// Moving DOWN (currentIndex < correctIndex):
//   removal shifts cards up, so use correctIndex + 1 as reference
// Moving UP (currentIndex > correctIndex):
//   reference is before the removed node, unaffected — correctIndex is fine

const referenceNode = currentIndex < correctIndex
  ? (cards[correctIndex + 1] || null)
  : (cards[correctIndex] || null);
```

When moving down, we reference the card *after* our target slot. After removal shifts everything up by one, that card ends up exactly at `correctIndex` — so inserting before it places the locked card in the right position.

### Why this is tricky

`insertBefore` looks like a single action ("put A before B") but it's actually two steps with a side effect between them. The reference node's position changes between step 1 and step 2. This is one of those DOM behaviors that isn't obvious from reading the method name.

The lesson: any time you use `insertBefore` to move a node that is *before* the reference node in the current DOM order, the reference node will have shifted by the time insertion happens.

---

*Add new bugs below as they come up.*
