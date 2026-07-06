// ================================
// KASANE — script.js
// ================================

// PUZZLES data lives in puzzles.js — loaded before this file in index.html

// --------------------------------
// 1. GAME STATE
// One object that holds everything we need to know about
// where the player is right now. Like a Ruby instance variable
// or a Python class attribute — a single source of truth.
// --------------------------------
const state = {
  currentPuzzleIndex: 0,   // which puzzle we're on (0–4)
  attemptsLeft: 5,          // attempts remaining for current puzzle
  currentOrder: [],         // the player's current card arrangement (array of ids)
  results: [],              // stores result of each completed puzzle for share card
  lockedItemIds: [],        // ids of cards locked in correct position
  hasShownPreviewScroll: false, // whether the onboarding scroll-to-bottom has already played this session
};

// --------------------------------
// 3. DOM REFERENCES
// We grab references to HTML elements once and store them,
// rather than searching the DOM every time we need them.
// document.getElementById() is like Rails' find() — looks up by id.
// --------------------------------
const screens = {
  title:    document.getElementById('screen-title'),
  puzzle:   document.getElementById('screen-puzzle'),
  results:  document.getElementById('screen-results'),
  congrats: document.getElementById('screen-congrats'),
};

const btnStart = document.getElementById('btn-start');

// --------------------------------
// 4. SCREEN NAVIGATION
// showScreen() hides all screens then shows just the one we want.
// This is the "router" for our single-page app.
// --------------------------------
function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[name].classList.add('active');
}

// --------------------------------
// 5. EVENT LISTENERS
// This is the JS equivalent of Rails routes — instead of
// "GET /start → controller#action", we say
// "click on btnStart → run this function".
// --------------------------------
btnStart.addEventListener('click', () => {
  const saved = localStorage.getItem('kasane_progress');
  if (saved) {
    const { currentPuzzleIndex, results } = JSON.parse(saved);
    state.currentPuzzleIndex = currentPuzzleIndex;
    state.results = results;
  }
  showScreen('puzzle');
  loadPuzzle(state.currentPuzzleIndex);
});

document.getElementById('btn-play-again').addEventListener('click', () => {
  clearProgress();
  btnStart.textContent = 'START';
  document.querySelector('.btn-start-over')?.remove();
  showScreen('title');
});

// --------------------------------
// 6. LOAD PUZZLE
// Builds the puzzle screen from puzzle data.
// innerHTML lets us write HTML as a string and inject it into the page —
// like an ERB partial, but generated in the browser at runtime.
// --------------------------------
function loadPuzzle(index) {
  const puzzle = PUZZLES[index];

  // Shuffle the items so they don't start in the correct order.
  // slice() makes a copy first — we never mutate the original data.
  state.currentOrder = shuffle(puzzle.items.map(item => item.id));
  state.attemptsLeft = 5;
  state.lockedItemIds = [];

  // Template literals use backticks ` and ${} to embed variables —
  // like Ruby's "#{}" but more powerful since you can write multi-line HTML.
  screens.puzzle.innerHTML = `
    <div class="puzzle-header">
      <p class="puzzle-count">Puzzle ${index + 1} of ${PUZZLES.length}</p>
      <h2 class="puzzle-title">${puzzle.title}</h2>
      <p class="puzzle-instruction">${puzzle.instruction}</p>
      <p class="attempts-left">Attempts left: <span id="attempts-count">${state.attemptsLeft}</span></p>
    </div>

    <div id="card-list" class="card-list">
      ${state.currentOrder.map(id => {
        const item = puzzle.items.find(i => i.id === id);
        return `
          <div class="card" data-id="${item.id}">
            <span class="card-drag-handle">⠿</span>
            <div class="card-content">
              <span class="card-label">${item.label}</span>
              <span class="card-sub">${item.sub}</span>
            </div>
            <span class="card-drag-handle">⠿</span>
          </div>
        `;
      }).join('')}
    </div>

    <div class="submit-bar">
      <button id="btn-submit" class="btn-primary">SUBMIT ORDER</button>
    </div>
  `;

  // Wire up the submit button after injecting the HTML.
  // We can't do this before because the button didn't exist yet.
  document.getElementById('btn-submit').addEventListener('click', checkAnswer);

  // Activate drag and drop on the cards
  initDragAndDrop();

  // Preview scroll — briefly scroll down to show all cards and the submit
  // button exist, then return to top. Lets the player know what they're working with.
  // Only needed once per session — by the second puzzle they already know the pattern.
  if (!state.hasShownPreviewScroll) {
    state.hasShownPreviewScroll = true;
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 900);
    }, 500);
  }
}

// --------------------------------
// 7. SHUFFLE
// Fisher-Yates shuffle — the standard way to randomise an array in JS.
// Takes an array, returns a new randomly ordered array.
// --------------------------------
function shuffle(array) {
  const arr = [...array]; // spread operator copies the array, like array.dup in Ruby
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap two elements — JS destructuring
  }
  return arr;
}

// --------------------------------
// 8. CHECK ANSWER
// Compares the player's current card order against the correct order.
// --------------------------------
function checkAnswer() {
  const puzzle = PUZZLES[state.currentPuzzleIndex];
  const cardEls = document.querySelectorAll('.card');
  const submitBtn = document.getElementById('btn-submit');

  // Disable submit immediately to prevent double-tapping
  submitBtn.disabled = true;

  const playerOrder = Array.from(cardEls).map(card => card.dataset.id);
  const isCorrect = playerOrder.every((id, i) => id === puzzle.correctOrder[i]);

  if (isCorrect) {
    state.results.push({ puzzleId: puzzle.id, title: puzzle.title, attempts: 6 - state.attemptsLeft });
    saveProgress(state.currentPuzzleIndex + 1);

    // Flash all cards copper and show a victory message
    cardEls.forEach(card => {
      card.classList.remove('incorrect');
      card.classList.add('correct');
    });

    // Inject a "CORRECT!" banner above the cards
    const banner = document.createElement('div');
    banner.className = 'correct-banner';
    banner.textContent = '正解 · CORRECT!';
    document.getElementById('card-list').before(banner);

    // Last puzzle solved correctly → skip info card, go straight to congrats
    const isLastPuzzle = state.currentPuzzleIndex === PUZZLES.length - 1;
    setTimeout(() => isLastPuzzle ? showCongrats() : showInfoCard(puzzle, true), 1500);
    return;
  }

  state.attemptsLeft--;
  document.getElementById('attempts-count').textContent = state.attemptsLeft;

  // Highlight correct vs incorrect card positions, lock correct ones in place
  cardEls.forEach((card, i) => {
    card.classList.remove('correct', 'incorrect');
    if (playerOrder[i] === puzzle.correctOrder[i]) {
      card.classList.add('correct');
      card.dataset.locked = 'true';
      if (!state.lockedItemIds.includes(playerOrder[i])) {
        state.lockedItemIds.push(playerOrder[i]);
      }
    } else {
      card.classList.add('incorrect');
    }
  });

  // Show the legend hint after the first wrong attempt
  if (!document.getElementById('border-hint')) {
    const hint = document.createElement('p');
    hint.id = 'border-hint';
    hint.className = 'border-hint';
    hint.textContent = 'Copper border = correct position · Grey = incorrect';
    document.getElementById('card-list').after(hint);
  }

  if (state.attemptsLeft === 0) {
    // Show a "no attempts left" message and wait 1.5s so the player
    // can see their final wrong attempt before the reveal.
    document.getElementById('attempts-count').textContent = '0 — see the answer below';
    state.results.push({ puzzleId: puzzle.id, title: puzzle.title, attempts: 5 });
    saveProgress(state.currentPuzzleIndex + 1);
    setTimeout(() => showInfoCard(puzzle, false), 1500);
  } else {
    // Re-enable the button for the next attempt
    submitBtn.disabled = false;
  }
}

// --------------------------------
// 9. SHOW INFO CARD
// Displayed after each puzzle — correct order revealed,
// fun facts shown, and a next puzzle button.
// --------------------------------
function showInfoCard(puzzle, won) {
  const correctOrder = puzzle.correctOrder;

  screens.results.innerHTML = `
    <div class="results-header">
      <p class="puzzle-count">Puzzle ${state.currentPuzzleIndex + 1} of ${PUZZLES.length}</p>
      <h2 class="puzzle-title">${puzzle.title}</h2>
      <p class="results-outcome ${won ? 'won' : 'lost'}">
        ${won ? '✓ Correct!' : 'The correct order was:'}
      </p>
    </div>

    <div class="facts-list">
      ${correctOrder.map((id, i) => {
        const item = puzzle.items.find(item => item.id === id);
        const fact = puzzle.facts.find(f => f.id === id);
        return `
          <div class="fact-card">
            <div class="fact-card-header">
              <span class="fact-position">${i + 1}</span>
              <div>
                <span class="fact-label">${item.label}</span>
                <span class="fact-sub">${item.sub}</span>
              </div>
            </div>
            <p class="fact-text">${fact.fact}</p>
          </div>
        `;
      }).join('')}
    </div>

    <p class="sources-line">Facts sourced from Heddels, Denimhunters, Long John, Levi Strauss &amp; Co., BASF and Iron Heart.</p>

    <div class="submit-bar">
      <button id="btn-next" class="btn-primary">
        ${state.currentPuzzleIndex < PUZZLES.length - 1 ? 'NEXT PUZZLE →' : 'FINISH'}
      </button>
    </div>
  `;

  showScreen('results');

  document.getElementById('btn-next').addEventListener('click', () => {
    // Last puzzle (won or not) → go to congrats instead of loading a
    // puzzle index that doesn't exist.
    if (state.currentPuzzleIndex === PUZZLES.length - 1) {
      showCongrats();
      return;
    }
    state.currentPuzzleIndex++;
    saveProgress();
    showScreen('puzzle');
    loadPuzzle(state.currentPuzzleIndex);
  });
}

function showCongrats() {
  const finalResults = [...state.results];
  clearProgress();
  showScreen('congrats');

  document.fonts.ready.then(() => {
    const container = document.getElementById('final-card-container');
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.className = 'share-card-canvas';
    drawFinalCard(canvas, finalResults);
    const btn = document.createElement('button');
    btn.className = 'btn-share';
    btn.textContent = 'SHARE YOUR TITLE';
    btn.addEventListener('click', () => shareCard(canvas, 'kasane-title.png'));
    container.appendChild(canvas);
    container.appendChild(btn);
  });
}

// --------------------------------
// 10. LOCAL STORAGE
// Saves progress between sessions so players can close the browser
// and return to where they left off. Only saves between-puzzle state —
// mid-puzzle progress (attempts, locked cards) is not restored.
// --------------------------------

function saveProgress(resumeIndex) {
  localStorage.setItem('kasane_progress', JSON.stringify({
    currentPuzzleIndex: resumeIndex !== undefined ? resumeIndex : state.currentPuzzleIndex,
    results: state.results,
  }));
}

function clearProgress() {
  localStorage.removeItem('kasane_progress');
  state.currentPuzzleIndex = 0;
  state.results = [];
}

function initProgress() {
  const saved = localStorage.getItem('kasane_progress');
  if (!saved) return;
  const { currentPuzzleIndex, results } = JSON.parse(saved);
  if (!currentPuzzleIndex && !results.length) return;

  // Update the start button to show where they left off
  btnStart.textContent = `CONTINUE → PUZZLE ${currentPuzzleIndex + 1}`;

  // Add a small "start over" option below
  const startOver = document.createElement('button');
  startOver.className = 'btn-start-over';
  startOver.textContent = 'Start over';
  startOver.addEventListener('click', () => {
    clearProgress();
    btnStart.textContent = 'START';
    startOver.remove();
  });
  btnStart.after(startOver);
}

// Run on page load
initProgress();

// --------------------------------
// 11. SHARE CARDS
// Two canvas-based share cards: one per puzzle, one final title card.
// Canvas lets us generate a real image (1080×1080px) that players
// can save and post to Instagram — like Wordle cards but more visual.
// --------------------------------

function calculateTitle(results) {
  const total = results.reduce((sum, r) => sum + r.attempts, 0);
  if (total === results.length)      return 'IRON HEART';
  if (total <= results.length + 3)   return 'SAMURAI';
  if (total <= results.length + 7)   return 'DENIM HEAD';
  return 'RAW RECRUIT';
}

const TITLE_META = {
  'IRON HEART':  { cardColor: '#c0392b', emoji: '🏆' },
  'SAMURAI':     { cardColor: '#1a3a5c', emoji: '⚔️' },
  'DENIM HEAD':  { cardColor: '#d4812a', emoji: '🧵' },
  'RAW RECRUIT': { cardColor: '#a0522d', emoji: '🪡' },
};

function drawCardBase(ctx, W, H) {
  // Ecru background — feels like a physical denim hang tag
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#b87333';
  ctx.lineWidth = 10;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // Selvedge ID red for the inner border — a nod to the red selvedge stripe
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 58, W - 116, H - 116);

  // KASANE in dark indigo on cream
  ctx.fillStyle = '#1a1f3c';
  ctx.font = 'normal 108px "Alfa Slab One"';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#b87333';
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 0;
  ctx.fillText('KASANE', W / 2, 182);
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = '#b87333';
  ctx.font = '300 38px "Noto Sans JP"';
  ctx.fillText('重ねる · かさねる', W / 2, 248);

  ctx.strokeStyle = '#b87333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, 288);
  ctx.lineTo(920, 288);
  ctx.stroke();

  ctx.strokeStyle = '#b87333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, 928);
  ctx.lineTo(920, 928);
  ctx.stroke();

  // URL — larger and darker so it reads clearly on the cream background
  ctx.fillStyle = '#1a1f3c';
  ctx.font = '300 38px "Noto Sans JP"';
  ctx.fillText('pistachiopony.github.io/kasane', W / 2, 984);
}

function drawFinalCard(canvas, results) {
  const W = 1080, H = 1080;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  drawCardBase(ctx, W, H);

  const title = calculateTitle(results);
  const total = results.reduce((sum, r) => sum + r.attempts, 0);
  const firstTries = results.filter(r => r.attempts === 1).length;

  ctx.fillStyle = '#555e7a';
  ctx.font = '300 32px "Noto Sans JP"';
  ctx.textAlign = 'center';
  ctx.fillText('YOUR DENIM TITLE', W / 2, 400);

  const titleSize = title.length > 10 ? 96 : 116;
  const cardColor = TITLE_META[title].cardColor;
  ctx.fillStyle = cardColor;
  ctx.shadowColor = cardColor + '80';
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 6;
  ctx.shadowBlur = 0;
  ctx.font = `normal ${titleSize}px "Alfa Slab One"`;
  ctx.fillText(title, W / 2, 540);
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = '#555e7a';
  ctx.font = '300 36px "Noto Sans JP"';
  const scoreText = firstTries === 5
    ? 'All 5 puzzles solved on the first try'
    : `${total} total attempts · ${firstTries} first-try solve${firstTries !== 1 ? 's' : ''}`;
  ctx.fillText(scoreText, W / 2, 660);

  ctx.font = '120px sans-serif';
  ctx.fillText(TITLE_META[title].emoji, W / 2, 820);
}

async function shareCard(canvas, filename) {
  return new Promise(resolve => {
    canvas.toBlob(async blob => {
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Kasane' });
          resolve();
          return;
        } catch (e) {
          if (e.name === 'AbortError') { resolve(); return; }
          // share failed for another reason — fall through to download
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, 'image/png');
  });
}

// --------------------------------
// 11. ENFORCE LOCKED POSITIONS
// After any drag move, checks that locked cards are still in their
// correct DOM positions and restores them if they've been displaced.
// This is needed because insertBefore can shift cards below the
// insertion point, including locked ones.
// --------------------------------
function enforceLockedPositions(cardList) {
  if (state.lockedItemIds.length === 0) return;
  const puzzle = PUZZLES[state.currentPuzzleIndex];
  const cards = Array.from(cardList.querySelectorAll('.card'));

  state.lockedItemIds.forEach(lockedId => {
    const correctIndex = puzzle.correctOrder.indexOf(lockedId);
    const currentIndex = cards.findIndex(c => c.dataset.id === lockedId);
    if (currentIndex === correctIndex) return;

    const lockedCard = cards[currentIndex];

    // insertBefore removes the node first, then inserts — so if the card
    // is moving DOWN (currentIndex < correctIndex), removal shifts everything
    // up by 1, meaning we need to reference cards[correctIndex + 1] to land
    // at the right slot. Moving UP (currentIndex > correctIndex) is unaffected.
    const referenceNode = currentIndex < correctIndex
      ? (cards[correctIndex + 1] || null)
      : (cards[correctIndex] || null);

    cardList.insertBefore(lockedCard, referenceNode);

    cards.splice(currentIndex, 1);
    cards.splice(correctIndex, 0, lockedCard);
  });
}

// --------------------------------
// 11. DRAG AND DROP
// Uses Pointer Events — one API that works for both mouse and touch.
// pointerdown / pointermove / pointerup replace both
// mousedown/mousemove/mouseup AND touchstart/touchmove/touchend.
// --------------------------------
function initDragAndDrop() {
  const cardList = document.getElementById('card-list');

  let draggedCard = null;   // the real card element, floating and following the pointer
  let pendingCard  = null;  // card where pointerdown fired, not yet confirmed as a drag
  let placeholder  = null;  // dashed stand-in left in draggedCard's spot in the list
  let startX = 0;
  let startY = 0;
  let grabOffsetX = 0; // where inside the card the pointer grabbed it, so it doesn't jump
  let grabOffsetY = 0;

  // DRAG THRESHOLD: how many pixels the pointer must move before
  // we consider it a drag (vs a tap/click). 8px is a standard value.
  const THRESHOLD = 8;

  function onPointerDown(e) {
    const card = e.currentTarget.closest('.card');
    if (card.dataset.locked) return;
    pendingCard = card;
    startX = e.clientX;
    startY = e.clientY;
  }

  // Lifts the card out of the document flow so it can float and follow the
  // pointer. A placeholder takes its place in the list — everything that
  // reads card order (enforceLockedPositions, checkAnswer) still sees a
  // '.card' with the right data-id sitting in that slot.
  function beginDrag() {
    draggedCard = pendingCard;
    pendingCard = null;

    const rect = draggedCard.getBoundingClientRect();
    grabOffsetX = startX - rect.left;
    grabOffsetY = startY - rect.top;

    placeholder = document.createElement('div');
    placeholder.className = 'card card-placeholder';
    placeholder.dataset.id = draggedCard.dataset.id;
    placeholder.style.height = rect.height + 'px';
    draggedCard.replaceWith(placeholder);
    document.body.appendChild(draggedCard);

    draggedCard.style.position = 'fixed';
    draggedCard.style.width = rect.width + 'px';
    draggedCard.style.left = rect.left + 'px';
    draggedCard.style.top = rect.top + 'px';
    draggedCard.style.zIndex = 1000;
    draggedCard.style.pointerEvents = 'none';
    draggedCard.classList.add('dragging');
  }

  function onPointerMove(e) {
    if (!pendingCard && !draggedCard) return;

    // If we have a pending card but haven't started dragging yet,
    // check if the pointer has moved far enough to count as a drag.
    if (pendingCard && !draggedCard) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < THRESHOLD) return; // not a drag yet — do nothing

      beginDrag(); // threshold crossed — officially start the drag
    }

    // Card tracks the pointer directly, keeping the initial grab offset
    // so it doesn't snap to be centered under the pointer.
    draggedCard.style.left = (e.clientX - grabOffsetX) + 'px';
    draggedCard.style.top = (e.clientY - grabOffsetY) + 'px';

    // Edge scrolling — when dragging near the top or bottom of the viewport,
    // nudge the page so cards below (or above) the visible area become reachable.
    const SCROLL_ZONE = 80;
    const SCROLL_SPEED = 6;
    if (e.clientY > window.innerHeight - SCROLL_ZONE) {
      window.scrollBy(0, SCROLL_SPEED);
    } else if (e.clientY < SCROLL_ZONE) {
      window.scrollBy(0, -SCROLL_SPEED);
    }

    // Find the card under the pointer and swap the placeholder if needed.
    // draggedCard itself has pointer-events:none, so elementFromPoint sees
    // straight through to whatever's underneath (the placeholder or another card).
    const below = document.elementFromPoint(e.clientX, e.clientY);
    const target = below?.closest('.card');

    if (target && target !== placeholder && !target.dataset.locked) {
      const rect = target.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (e.clientY < midY) {
        cardList.insertBefore(placeholder, target);
      } else {
        cardList.insertBefore(placeholder, target.nextSibling);
      }

      // After every DOM move, restore any locked cards that got displaced
      enforceLockedPositions(cardList);
    }
  }

  function onPointerUp() {
    pendingCard = null; // cancelled before threshold — treat as tap, do nothing
    if (!draggedCard) return;

    draggedCard.classList.remove('dragging');
    draggedCard.style.position = '';
    draggedCard.style.width = '';
    draggedCard.style.left = '';
    draggedCard.style.top = '';
    draggedCard.style.zIndex = '';
    draggedCard.style.pointerEvents = '';

    placeholder.replaceWith(draggedCard);
    placeholder = null;
    draggedCard = null;
  }

  cardList.querySelectorAll('.card-drag-handle').forEach(handle => {
    handle.addEventListener('pointerdown', onPointerDown);
  });

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp); // handles interruptions e.g. phone call
}
