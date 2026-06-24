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
  showScreen('puzzle');
  loadPuzzle(state.currentPuzzleIndex);
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
            <span class="card-label">${item.label}</span>
            <span class="card-sub">${item.sub}</span>
          </div>
        `;
      }).join('')}
    </div>

    <button id="btn-submit" class="btn-primary">SUBMIT ORDER</button>
  `;

  // Wire up the submit button after injecting the HTML.
  // We can't do this before because the button didn't exist yet.
  document.getElementById('btn-submit').addEventListener('click', checkAnswer);

  // Activate drag and drop on the cards
  initDragAndDrop();
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

  // Build array of ids in the player's current visual order
  const playerOrder = Array.from(cardEls).map(card => card.dataset.id);

  const isCorrect = playerOrder.every((id, i) => id === puzzle.correctOrder[i]);

  if (isCorrect) {
    // Save result and show info card
    state.results.push({ puzzleId: puzzle.id, title: puzzle.title, attempts: 6 - state.attemptsLeft });
    showInfoCard(puzzle, playerOrder, true);
    return;
  }

  state.attemptsLeft--;
  document.getElementById('attempts-count').textContent = state.attemptsLeft;

  // Highlight correct vs incorrect positions
  cardEls.forEach((card, i) => {
    card.classList.remove('correct', 'incorrect');
    card.classList.add(playerOrder[i] === puzzle.correctOrder[i] ? 'correct' : 'incorrect');
  });

  if (state.attemptsLeft === 0) {
    state.results.push({ puzzleId: puzzle.id, title: puzzle.title, attempts: 5 });
    showInfoCard(puzzle, playerOrder, false);
  }
}

// --------------------------------
// 9. SHOW INFO CARD
// Displayed after each puzzle — correct order revealed,
// fun facts shown, share card and next puzzle button.
// --------------------------------
function showInfoCard(puzzle, playerOrder, won) {
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

    <div class="results-actions">
      <button id="btn-next" class="btn-primary">
        ${state.currentPuzzleIndex < PUZZLES.length - 1 ? 'NEXT PUZZLE →' : 'FINISH'}
      </button>
    </div>
  `;

  showScreen('results');

  document.getElementById('btn-next').addEventListener('click', () => {
    if (state.currentPuzzleIndex < PUZZLES.length - 1) {
      state.currentPuzzleIndex++;
      showScreen('puzzle');
      loadPuzzle(state.currentPuzzleIndex);
    } else {
      showScreen('congrats');
    }
  });
}

// --------------------------------
// 10. DRAG AND DROP
// Uses Pointer Events — one API that works for both mouse and touch.
// pointerdown / pointermove / pointerup replace both
// mousedown/mousemove/mouseup AND touchstart/touchmove/touchend.
// --------------------------------
function initDragAndDrop() {
  const cardList = document.getElementById('card-list');

  let draggedCard = null;   // the card actively being dragged
  let pendingCard  = null;  // card where pointerdown fired, not yet confirmed as a drag
  let startX = 0;
  let startY = 0;

  // DRAG THRESHOLD: how many pixels the pointer must move before
  // we consider it a drag (vs a tap/click). 8px is a standard value.
  const THRESHOLD = 8;

  function onPointerDown(e) {
    pendingCard = e.currentTarget;
    startX = e.clientX;
    startY = e.clientY;
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

      // Threshold crossed — officially start the drag
      draggedCard = pendingCard;
      pendingCard = null;
      draggedCard.classList.add('dragging');
      draggedCard.style.pointerEvents = 'none';
    }

    // Find the card under the pointer and swap if needed
    const below = document.elementFromPoint(e.clientX, e.clientY);
    const target = below?.closest('.card');

    if (target && target !== draggedCard) {
      const rect = target.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (e.clientY < midY) {
        cardList.insertBefore(draggedCard, target);
      } else {
        cardList.insertBefore(draggedCard, target.nextSibling);
      }
    }
  }

  function onPointerUp() {
    pendingCard = null; // cancelled before threshold — treat as tap, do nothing
    if (!draggedCard) return;
    draggedCard.classList.remove('dragging');
    draggedCard.style.pointerEvents = '';
    draggedCard = null;
  }

  cardList.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointerdown', onPointerDown);
  });

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp); // handles interruptions e.g. phone call
}
