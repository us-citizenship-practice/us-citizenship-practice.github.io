// script.js
// -----------------------------------------------------------------------
// This file is the "brain" of the page. HTML gave us structure, CSS gave
// us looks, and this gives us BEHAVIOR: what happens when you click things.
//
// Read top to bottom — it's organized in the order things happen:
//   1. Grab references to HTML elements we'll need to change
//   2. Keep track of "state" (what's currently on screen)
//   3. Functions that build the category dropdown
//   4. Flashcard mode functions
//   5. Quiz mode functions (including the "Explain" feature)
//   6. Event listeners that wire buttons to those functions
// -----------------------------------------------------------------------

// ---------- 1. ELEMENT REFERENCES ----------
// document.getElementById() finds one HTML tag by its id="..." attribute.
// We do this once, up front, and reuse the variable everywhere instead of
// re-searching the page every time.
const categoryFilterEl = document.getElementById("categoryFilter");
const starredOnlyEl = document.getElementById("starredOnly");

const modeButtons = document.querySelectorAll(".mode-btn");
const flashcardModeEl = document.getElementById("flashcardMode");
const quizModeEl = document.getElementById("quizMode");

// Flashcard elements
const flipCardEl = document.getElementById("flipCard");
const questionTextEl = document.getElementById("questionText");
const answerListEl = document.getElementById("answerList");
const cardPositionEl = document.getElementById("cardPosition");
const cardStarredFlagEl = document.getElementById("cardStarredFlag");
const prevCardBtn = document.getElementById("prevCard");
const nextCardBtn = document.getElementById("nextCard");
const shuffleCardsBtn = document.getElementById("shuffleCards");

// Quiz elements
const quizPositionEl = document.getElementById("quizPosition");
const quizScoreEl = document.getElementById("quizScore");
const quizQuestionTextEl = document.getElementById("quizQuestionText");
const quizOptionsEl = document.getElementById("quizOptions");
const quizFeedbackEl = document.getElementById("quizFeedback");
const explainBtn = document.getElementById("explainBtn");
const nextQuizBtn = document.getElementById("nextQuizBtn");
const explanationBoxEl = document.getElementById("explanationBox");

// ---------- 2. APPLICATION STATE ----------
// "State" just means: the small set of values that describe what the
// screen currently looks like. When state changes, we call a "render"
// function to update the HTML to match it. This pattern (state -> render)
// is the core idea behind almost every interactive web app you'll build.
const state = {
  mode: "flashcards",       // "flashcards" or "quiz"
  filteredQuestions: [],    // the list currently in play, after filters
  cardIndex: 0,             // which flashcard we're looking at
  isFlipped: false,

  quizIndex: 0,
  quizOptions: [],          // [{ text, sourceQuestionId }, ...] for current question
  correctOptionText: null,
  hasAnswered: false,
  score: { correct: 0, total: 0 },
};

// ---------- Utility helpers ----------

// Fisher-Yates shuffle: the standard, unbiased way to shuffle an array.
function shuffle(array) {
  const copy = [...array]; // don't mutate the original array
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Applies the category + "starred only" filters to the full question list.
function getFilteredQuestions() {
  const category = categoryFilterEl.value;
  const starredOnly = starredOnlyEl.checked;

  return CIVICS_QUESTIONS.filter((q) => {
    if (category !== "all" && q.category !== category) return false;
    if (starredOnly && !q.starred) return false;
    return true;
  });
}

// ---------- 3. CATEGORY DROPDOWN ----------
function buildCategoryOptions() {
  // Get each category exactly once, in the order it first appears.
  const seen = new Set();
  const categories = [];
  CIVICS_QUESTIONS.forEach((q) => {
    if (!seen.has(q.category)) {
      seen.add(q.category);
      categories.push(q.category);
    }
  });

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilterEl.appendChild(option);
  });
}

// Called whenever a filter changes, or on first load.
function applyFilters() {
  state.filteredQuestions = getFilteredQuestions();
  state.cardIndex = 0;
  state.isFlipped = false;
  state.quizIndex = 0;
  state.score = { correct: 0, total: 0 };

  renderFlashcard();
  renderQuizQuestion();
}

// =========================================================================
// 4. FLASHCARD MODE
// =========================================================================
function renderFlashcard() {
  const list = state.filteredQuestions;

  if (list.length === 0) {
    questionTextEl.textContent = "No questions match this filter.";
    answerListEl.innerHTML = "";
    cardPositionEl.textContent = "0 of 0";
    return;
  }

  const q = list[state.cardIndex];

  questionTextEl.textContent = q.question;
  answerListEl.innerHTML = q.answers
    .map((answer) => `<li>${answer}</li>`)
    .join("");

  cardPositionEl.textContent = `Card ${state.cardIndex + 1} of ${list.length}`;
  cardStarredFlagEl.hidden = !q.starred;

  // Always show the question side when we move to a new card.
  flipCardEl.classList.toggle("is-flipped", state.isFlipped);
}

function flipCard() {
  if (state.filteredQuestions.length === 0) return;
  state.isFlipped = !state.isFlipped;
  flipCardEl.classList.toggle("is-flipped", state.isFlipped);
}

function goToNextCard() {
  const list = state.filteredQuestions;
  if (list.length === 0) return;
  state.cardIndex = (state.cardIndex + 1) % list.length; // wrap to start
  state.isFlipped = false;
  renderFlashcard();
}

function goToPrevCard() {
  const list = state.filteredQuestions;
  if (list.length === 0) return;
  state.cardIndex = (state.cardIndex - 1 + list.length) % list.length; // wrap to end
  state.isFlipped = false;
  renderFlashcard();
}

function shuffleDeck() {
  state.filteredQuestions = shuffle(state.filteredQuestions);
  state.cardIndex = 0;
  state.isFlipped = false;
  renderFlashcard();
}

// =========================================================================
// 5. QUIZ MODE
// =========================================================================

// Builds a pool of {text, sourceQuestionId} from every OTHER question's
// primary (first) answer — this is what wrong-answer options are drawn
// from. We exclude "varies" questions (like "who is your senator") since
// they don't have one fixed correct answer.
function buildDistractorPool(excludeQuestion) {
  const excludeTexts = new Set(
    excludeQuestion.answers.map((a) => a.toLowerCase().trim())
  );

  const pool = [];
  const seenText = new Set();

  CIVICS_QUESTIONS.forEach((q) => {
    if (q.id === excludeQuestion.id || q.varies) return;
    const text = q.answers[0];
    const key = text.toLowerCase().trim();
    // Skip if this text is actually also a correct answer to our question,
    // or if we've already added this exact text from another question.
    if (excludeTexts.has(key) || seenText.has(key)) return;
    seenText.add(key);
    pool.push({ text, sourceQuestionId: q.id });
  });

  return pool;
}

function buildQuizOptions(question) {
  const correct = { text: question.answers[0], sourceQuestionId: question.id };
  const distractors = shuffle(buildDistractorPool(question)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

function renderQuizQuestion() {
  // The quiz only uses questions that have one fixed correct answer.
  const pool = state.filteredQuestions.filter((q) => !q.varies);

  // Reset per-question UI state
  state.hasAnswered = false;
  quizFeedbackEl.hidden = true;
  quizFeedbackEl.className = "quiz-feedback";
  explanationBoxEl.hidden = true;
  explainBtn.disabled = true;
  nextQuizBtn.disabled = true;

  if (pool.length === 0) {
    quizQuestionTextEl.textContent = "No quizzable questions match this filter.";
    quizOptionsEl.innerHTML = "";
    quizPositionEl.textContent = "0 of 0";
    return;
  }

  if (state.quizIndex >= pool.length) state.quizIndex = 0;

  const q = pool[state.quizIndex];
  state.quizOptions = buildQuizOptions(q);
  state.correctOptionText = q.answers[0];
  state.currentQuizQuestion = q;

  quizQuestionTextEl.textContent = q.question;
  quizPositionEl.textContent = `Question ${state.quizIndex + 1} of ${pool.length}`;
  quizScoreEl.textContent = `Score: ${state.score.correct} / ${state.score.total}`;

  quizOptionsEl.innerHTML = "";
  state.quizOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.type = "button";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => handleAnswerSelected(opt, btn));
    quizOptionsEl.appendChild(btn);
  });
}

function handleAnswerSelected(chosenOption, chosenButtonEl) {
  if (state.hasAnswered) return; // ignore repeat clicks on the same question
  state.hasAnswered = true;

  const isCorrect = chosenOption.text === state.correctOptionText;
  state.score.total += 1;
  if (isCorrect) state.score.correct += 1;
  quizScoreEl.textContent = `Score: ${state.score.correct} / ${state.score.total}`;

  // Disable every option and color-code correct vs. incorrect
  const allButtons = quizOptionsEl.querySelectorAll(".quiz-option");
  allButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === state.correctOptionText) {
      btn.classList.add("correct");
    } else if (btn === chosenButtonEl) {
      btn.classList.add("incorrect");
    }
  });

  quizFeedbackEl.hidden = false;
  quizFeedbackEl.textContent = isCorrect
    ? "Correct!"
    : "Not quite — the correct answer is highlighted above.";
  quizFeedbackEl.classList.add(isCorrect ? "correct" : "incorrect");

  state.lastChosenOption = chosenOption;
  explainBtn.disabled = false;
  nextQuizBtn.disabled = false;
}

// This is the "explain wrong answers" feature you asked for. It tells the
// learner WHY the correct answer is right, and — if they picked wrong —
// where their chosen answer actually came from, so it feels informative
// rather than just "nope, try again."
function showExplanation() {
  const q = state.currentQuizQuestion;
  const chosen = state.lastChosenOption;
  const wasCorrect = chosen.text === state.correctOptionText;

  let html = `<p><strong>Official answer:</strong> ${state.correctOptionText} <br>
    <em>(Category: ${q.category})</em></p>`;

  if (!wasCorrect) {
    const sourceQuestion = CIVICS_QUESTIONS.find(
      (item) => item.id === chosen.sourceQuestionId
    );
    html += `<p><strong>About the answer you picked:</strong> \u201c${chosen.text}\u201d
      is actually the correct answer to a different civics question:
      \u201c${sourceQuestion.question}\u201d &mdash; not this one. On the real test,
      answers are tied to a specific question, so it's worth reviewing both
      questions separately.</p>`;
  }

  if (q.answers.length > 1) {
    html += `<p><strong>Other accepted answers:</strong> ${q.answers.join("; ")}</p>`;
  }

  explanationBoxEl.innerHTML = html;
  explanationBoxEl.hidden = false;
}

function goToNextQuizQuestion() {
  const pool = state.filteredQuestions.filter((q) => !q.varies);
  if (pool.length === 0) return;
  state.quizIndex = (state.quizIndex + 1) % pool.length;
  renderQuizQuestion();
}

// =========================================================================
// 6. EVENT LISTENERS — wiring the buttons to the functions above
// =========================================================================

// Mode switching (Flashcards <-> Quiz)
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode; // reads the data-mode="..." attribute

    modeButtons.forEach((b) => b.classList.toggle("active", b === btn));
    flashcardModeEl.hidden = state.mode !== "flashcards";
    quizModeEl.hidden = state.mode !== "quiz";
  });
});

// Filters
categoryFilterEl.addEventListener("change", applyFilters);
starredOnlyEl.addEventListener("change", applyFilters);

// Flashcards
flipCardEl.addEventListener("click", flipCard);
nextCardBtn.addEventListener("click", goToNextCard);
prevCardBtn.addEventListener("click", goToPrevCard);
shuffleCardsBtn.addEventListener("click", shuffleDeck);

// Keyboard support: left/right arrows move cards, space/enter flips
document.addEventListener("keydown", (e) => {
  if (state.mode !== "flashcards") return;
  if (e.key === "ArrowRight") goToNextCard();
  if (e.key === "ArrowLeft") goToPrevCard();
});

// Quiz
explainBtn.addEventListener("click", showExplanation);
nextQuizBtn.addEventListener("click", goToNextQuizQuestion);

// =========================================================================
// STARTUP
// =========================================================================
buildCategoryOptions();
applyFilters();
