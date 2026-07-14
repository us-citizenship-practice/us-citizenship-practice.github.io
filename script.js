// script.js
// -----------------------------------------------------------------------
// State -> render, same pattern as before. What's new in this version:
//   - A required 2-step onboarding flow (age + years as permanent
//     resident, then N-400 filing date) runs before anything else.
//     It decides which test version applies (2008 or 2025 — filing
//     date is what matters, per USCIS) and whether the 65/20 rule
//     applies (age 65+ AND 20+ years as a permanent resident).
//   - Two separate question banks are loaded (data-2025.js,
//     data-2008.js) and the right one is selected after onboarding.
//   - Category dropdown grouping is now per-dataset, since the 2008
//     bank has a different section structure (it includes a
//     "Geography" category the 2025 bank dropped).
// -----------------------------------------------------------------------

// ---------- ELEMENT REFERENCES ----------

// Onboarding
const onboardStep1 = document.getElementById("onboardStep1");
const onboardStep2 = document.getElementById("onboardStep2");
const ageInput = document.getElementById("ageInput");
const lprYearsInput = document.getElementById("lprYearsInput");
const filingDateInput = document.getElementById("filingDateInput");
const onboardNext1 = document.getElementById("onboardNext1");
const onboardNext2 = document.getElementById("onboardNext2");
const step1Error = document.getElementById("step1Error");
const step2Error = document.getElementById("step2Error");

const landingView = document.getElementById("landingView");
const appShell = document.getElementById("appShell");
const goFlashcardsBtn = document.getElementById("goFlashcards");
const goQuizBtn = document.getElementById("goQuiz");
const homeBtn = document.getElementById("homeBtn");

const categoryFilterEl = document.getElementById("categoryFilter");
const versionBadgeEl = document.getElementById("versionBadge");
const sixtyFiveTwentyToggleWrap = document.getElementById("sixtyFiveTwentyToggleWrap");
const sixtyFiveTwentyToggle = document.getElementById("sixtyFiveTwentyToggle");

const flashcardModeEl = document.getElementById("flashcardMode");
const quizModeEl = document.getElementById("quizMode");
const completionViewEl = document.getElementById("completionView");

// Flashcard elements
const flashCardEl = document.getElementById("flashCard");
const flashQuestionFaceEl = document.getElementById("flashQuestionFace");
const flashAnswerFaceEl = document.getElementById("flashAnswerFace");
const questionTextEl = document.getElementById("questionText");
const answerListEl = document.getElementById("answerList");
const cardTagEl = document.getElementById("cardTag");
const flashSpeakBtn = document.getElementById("flashSpeakBtn");
const prevCardBtn = document.getElementById("prevCard");
const nextCardBtn = document.getElementById("nextCard");
const shuffleCardsBtn = document.getElementById("shuffleCards");

// Quiz elements
const quizTagEl = document.getElementById("quizTag");
const quizSpeakBtn = document.getElementById("quizSpeakBtn");
const answerSpeakBtn = document.getElementById("answerSpeakBtn");
const quizBookmarkBtn = document.getElementById("quizBookmarkBtn");
const quizQuestionTextEl = document.getElementById("quizQuestionText");
const userAnswerInputEl = document.getElementById("userAnswerInput");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const answerRevealEl = document.getElementById("answerReveal");
const correctAnswerListEl = document.getElementById("correctAnswerList");
const prevQuizBtn = document.getElementById("prevQuizBtn");
const shuffleQuizBtn = document.getElementById("shuffleQuizBtn");
const nextQuizBtn = document.getElementById("nextQuizBtn");

// Completion elements
const reviewStarredBtn = document.getElementById("reviewStarredBtn");
const restartAllBtn = document.getElementById("restartAllBtn");
const completionNoteEl = document.getElementById("completionNote");

// ---------- CATEGORY -> SECTION MAPPINGS (one per dataset) ----------
// The 2025 bank organizes categories one way; the 2008 bank is
// slightly different (it has a "Geography" category, grouped under
// "Integrated Civics" along with Symbols and Holidays).
const CATEGORY_SECTIONS_2025 = {
  "Principles of American Government": "American Government",
  "System of Government": "American Government",
  "Rights and Responsibilities": "American Government",
  "Colonial Period and Independence": "American History",
  "1800s": "American History",
  "Recent American History": "American History",
  "Symbols": "Symbols and Holidays",
  "Holidays": "Symbols and Holidays",
};
const SECTION_ORDER_2025 = ["American Government", "American History", "Symbols and Holidays"];

const CATEGORY_SECTIONS_2008 = {
  "Principles of American Democracy": "American Government",
  "System of Government": "American Government",
  "Rights and Responsibilities": "American Government",
  "Colonial Period and Independence": "American History",
  "1800s": "American History",
  "Recent American History and Other Important Historical Information": "American History",
  "Geography": "Integrated Civics",
  "Symbols": "Integrated Civics",
  "Holidays": "Integrated Civics",
};
const SECTION_ORDER_2008 = ["American Government", "American History", "Integrated Civics"];

// ---------- STATE ----------
const state = {
  pendingMode: null,       // "flashcards" or "quiz" — where to go once onboarding finishes
  testVersion: null,       // "2025" or "2008", set after onboarding
  qualifies6520: false,

  activeDataset: [],
  categorySections: {},
  sectionOrder: [],

  baseList: [],
  bookmarkedIds: new Set(),

  cardIndex: 0,
  isFlipped: false,

  quizList: [],
  quizIndex: 0,
  quizRevealed: false,
};

// Small helper so dynamically-generated text (not static HTML) also
// respects the selected language. TRANSLATIONS is defined in i18n.js,
// loaded before this script runs any of these functions.
function t(key) {
  const lang = localStorage.getItem("civicsAppLanguage") || "en";
  const dict = (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS[lang]) || {};
  return dict[key] || (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS.en[key]) || key;
}

// ---------- Helpers ----------
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Reads text aloud using the browser's built-in speech synthesis — no
// external service, no API key, works offline. Not supported in every
// browser, so we quietly do nothing if it's unavailable rather than error.
function speak(text, btnEl) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // stop anything currently speaking
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  if (btnEl) {
    utterance.onstart = () => btnEl.classList.add("is-speaking");
    utterance.onend = () => btnEl.classList.remove("is-speaking");
  }
  window.speechSynthesis.speak(utterance);
}

function getFilteredQuestions() {
  const category = categoryFilterEl.value;
  const sixtyFiveTwentyOnly = state.qualifies6520 && sixtyFiveTwentyToggle.checked;
  return state.activeDataset.filter((q) => {
    if (category !== "all" && q.category !== category) return false;
    if (sixtyFiveTwentyOnly && !q.starred) return false;
    return true;
  });
}

// Small helper so dynamically-generated text (not present in the HTML,
// so data-i18n can't tag it) still respects the selected language.
// TRANSLATIONS is defined globally in i18n.js, loaded before this runs.
function t(key) {
  const lang = localStorage.getItem("civicsAppLanguage") || "en";
  const dict = (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS[lang]) || {};
  return dict[key] || key;
}

// Rebuilds <option value="all">All categories</option> + grouped
// <optgroup> sections for whichever dataset is currently active.
function buildCategoryOptions() {
  categoryFilterEl.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("app.allCategories");
  categoryFilterEl.appendChild(allOption);

  const seenCategory = new Set();
  const categoriesBySection = {};

  state.activeDataset.forEach((q) => {
    if (seenCategory.has(q.category)) return;
    seenCategory.add(q.category);
    const section = state.categorySections[q.category] || "Other";
    if (!categoriesBySection[section]) categoriesBySection[section] = [];
    categoriesBySection[section].push(q.category);
  });

  state.sectionOrder.forEach((section) => {
    const categories = categoriesBySection[section];
    if (!categories) return;
    const group = document.createElement("optgroup");
    group.label = section;
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      group.appendChild(opt);
    });
    categoryFilterEl.appendChild(group);
  });
}

function applyFilters() {
  state.baseList = getFilteredQuestions();
  state.cardIndex = 0;
  state.isFlipped = false;
  state.quizList = state.baseList;
  state.quizIndex = 0;

  renderFlashcard();
  renderQuizQuestion();
}

// =========================================================================
// ONBOARDING
// =========================================================================
function goToStep2() {
  const age = ageInput.value;
  const lprYears = lprYearsInput.value;
  if (age === "" || lprYears === "") {
    step1Error.hidden = false;
    return;
  }
  step1Error.hidden = true;
  onboardStep1.hidden = true;
  onboardStep2.hidden = false;
}

// Called from the landing page — every time someone chooses Flashcard
// View or Quiz View, they go through onboarding first (per requirement:
// this runs every visit, not just once).
function startOnboarding(mode) {
  state.pendingMode = mode;
  ageInput.value = "";
  lprYearsInput.value = "";
  filingDateInput.value = "";
  step1Error.hidden = true;
  step2Error.hidden = true;
  onboardStep2.hidden = true;
  onboardStep1.hidden = false;
  landingView.hidden = true;
}

function finishOnboarding() {
  if (!filingDateInput.value) {
    step2Error.hidden = false;
    return;
  }
  step2Error.hidden = true;

  const age = Number(ageInput.value);
  const lprYears = Number(lprYearsInput.value);
  const filingDate = new Date(filingDateInput.value);
  const cutoff = new Date("2025-10-20");

  state.testVersion = filingDate < cutoff ? "2008" : "2025";
  state.qualifies6520 = age >= 65 && lprYears >= 20;

  if (state.testVersion === "2008") {
    state.activeDataset = CIVICS_QUESTIONS_2008;
    state.categorySections = CATEGORY_SECTIONS_2008;
    state.sectionOrder = SECTION_ORDER_2008;
  } else {
    state.activeDataset = CIVICS_QUESTIONS_2025;
    state.categorySections = CATEGORY_SECTIONS_2025;
    state.sectionOrder = SECTION_ORDER_2025;
  }

  const totalCount = state.activeDataset.length;
  versionBadgeEl.textContent = `${state.testVersion} Test \u2022 ${totalCount} Questions`;

  sixtyFiveTwentyToggleWrap.hidden = !state.qualifies6520;
  sixtyFiveTwentyToggle.checked = state.qualifies6520; // default ON if eligible

  buildCategoryOptions();
  applyFilters();

  onboardStep2.hidden = true;

  // Route to whichever mode the person originally clicked on the landing page
  if (state.pendingMode === "quiz") {
    goQuiz();
  } else {
    goFlashcards();
  }
}

// ---------- VIEW ROUTING ----------
function hideAllPanels() {
  flashcardModeEl.hidden = true;
  quizModeEl.hidden = true;
  completionViewEl.hidden = true;
}

function showLanding() {
  hideAllPanels();
  onboardStep1.hidden = true;
  onboardStep2.hidden = true;
  appShell.hidden = true;
  landingView.hidden = false;
}

function showApp(mode) {
  onboardStep1.hidden = true;
  onboardStep2.hidden = true;
  landingView.hidden = true;
  appShell.hidden = false;
  hideAllPanels();
  if (mode === "flashcards") flashcardModeEl.hidden = false;
  if (mode === "quiz") quizModeEl.hidden = false;
  if (mode === "completion") completionViewEl.hidden = false;
}

function goFlashcards() {
  state.cardIndex = 0;
  state.isFlipped = false;
  renderFlashcard();
  showApp("flashcards");
}

function goQuiz() {
  state.quizList = state.baseList;
  state.quizIndex = 0;
  renderQuizQuestion();
  showApp("quiz");
}

// ---------- BOOKMARKS ----------
function toggleBookmark(id) {
  if (state.bookmarkedIds.has(id)) {
    state.bookmarkedIds.delete(id);
  } else {
    state.bookmarkedIds.add(id);
  }
  renderFlashcard();
  renderQuizQuestion();
}

function updateBookmarkButton(btnEl, id) {
  const isBookmarked = state.bookmarkedIds.has(id);
  btnEl.classList.toggle("is-bookmarked", isBookmarked);
  btnEl.textContent = isBookmarked ? "\u2605" : "\u2606";
}

// =========================================================================
// FLASHCARD MODE (simple swap, no flip animation)
// =========================================================================
function renderFlashcard() {
  const list = state.baseList;
  state.isFlipped = false;

  // Reset to the resting position (question showing) WITHOUT animating —
  // only an explicit click on the card should trigger the slide. We
  // briefly disable transitions, snap the classes back, then force the
  // browser to "notice" before re-enabling transitions.
  flashQuestionFaceEl.classList.add("no-anim");
  flashAnswerFaceEl.classList.add("no-anim");
  flashQuestionFaceEl.classList.remove("face-hidden-left");
  flashAnswerFaceEl.classList.add("face-hidden-right");
  void flashCardEl.offsetWidth; // force reflow
  flashQuestionFaceEl.classList.remove("no-anim");
  flashAnswerFaceEl.classList.remove("no-anim");

  if (list.length === 0) {
    questionTextEl.textContent = "No questions match this filter.";
    answerListEl.innerHTML = "";
    cardTagEl.textContent = "CARD 0/0";
    return;
  }

  const q = list[state.cardIndex];
  questionTextEl.textContent = q.question;
  answerListEl.innerHTML = q.answers.map((a) => `<li>${a}</li>`).join("");
  answerListEl.classList.toggle("answer-varies", !!q.varies);
  cardTagEl.textContent = `CARD ${String(state.cardIndex + 1).padStart(2, "0")}/${list.length}`;
}

function toggleFlashcardFace() {
  if (state.baseList.length === 0) return;
  state.isFlipped = !state.isFlipped;
  if (state.isFlipped) {
    // slide the question out to the left, answer in from the right
    flashQuestionFaceEl.classList.add("face-hidden-left");
    flashAnswerFaceEl.classList.remove("face-hidden-right");
  } else {
    // slide back: answer exits right, question re-enters from the left
    flashAnswerFaceEl.classList.add("face-hidden-right");
    flashQuestionFaceEl.classList.remove("face-hidden-left");
  }
}

function goToNextCard() {
  const list = state.baseList;
  if (list.length === 0) return;
  state.cardIndex = (state.cardIndex + 1) % list.length;
  renderFlashcard();
}

function goToPrevCard() {
  const list = state.baseList;
  if (list.length === 0) return;
  state.cardIndex = (state.cardIndex - 1 + list.length) % list.length;
  renderFlashcard();
}

function shuffleDeck() {
  state.baseList = shuffle(state.baseList);
  state.cardIndex = 0;
  renderFlashcard();
}

// =========================================================================
// QUIZ MODE (typed answer + Show Answer)
// =========================================================================
function renderQuizQuestion() {
  const list = state.quizList;

  state.quizRevealed = false;
  userAnswerInputEl.value = "";
  answerRevealEl.hidden = true;
  correctAnswerListEl.innerHTML = "";
  showAnswerBtn.textContent = t("app.showAnswer");

  if (list.length === 0) {
    quizQuestionTextEl.textContent = "No questions match this filter.";
    quizTagEl.textContent = "QUESTION 0/0";
    return;
  }

  const q = list[state.quizIndex];
  quizQuestionTextEl.textContent = q.question;
  quizTagEl.textContent = `QUESTION ${String(state.quizIndex + 1).padStart(2, "0")}/${list.length}`;
  updateBookmarkButton(quizBookmarkBtn, q.id);
}

function toggleAnswer() {
  const list = state.quizList;
  if (list.length === 0) return;
  const q = list[state.quizIndex];

  state.quizRevealed = !state.quizRevealed;

  if (state.quizRevealed) {
    correctAnswerListEl.innerHTML = q.answers.map((a) => `<li>${a}</li>`).join("");
    correctAnswerListEl.classList.toggle("answer-varies", !!q.varies);
    answerRevealEl.hidden = false;
    showAnswerBtn.textContent = t("app.hideAnswer");
  } else {
    answerRevealEl.hidden = true;
    showAnswerBtn.textContent = t("app.showAnswer");
  }
}

function goToNextQuizQuestion() {
  const list = state.quizList;
  if (list.length === 0) return;
  const isLastQuestion = state.quizIndex === list.length - 1;
  if (isLastQuestion) {
    showCompletion();
    return;
  }
  state.quizIndex += 1;
  renderQuizQuestion();
}

function goToPrevQuizQuestion() {
  const list = state.quizList;
  if (list.length === 0) return;
  state.quizIndex = (state.quizIndex - 1 + list.length) % list.length;
  renderQuizQuestion();
}

function shuffleQuizDeck() {
  state.quizList = shuffle(state.quizList);
  state.quizIndex = 0;
  renderQuizQuestion();
}

// =========================================================================
// COMPLETION VIEW
// =========================================================================
function showCompletion() {
  completionNoteEl.textContent =
    state.bookmarkedIds.size > 0
      ? `You bookmarked ${state.bookmarkedIds.size} question${state.bookmarkedIds.size === 1 ? "" : "s"} along the way.`
      : "You didn't bookmark any questions this round \u2014 tap the star on a card anytime to flag one for review.";
  showApp("completion");
}

function reviewBookmarked() {
  const bookmarked = state.baseList.filter((q) => state.bookmarkedIds.has(q.id));
  if (bookmarked.length === 0) {
    completionNoteEl.textContent = "You haven't bookmarked any questions yet \u2014 tap the star on a card while studying to flag it.";
    return;
  }
  state.quizList = bookmarked;
  state.quizIndex = 0;
  renderQuizQuestion();
  showApp("quiz");
}

function restartAllQuiz() {
  state.quizList = state.baseList;
  state.quizIndex = 0;
  renderQuizQuestion();
  showApp("quiz");
}

// =========================================================================
// EVENT LISTENERS
// =========================================================================
onboardNext1.addEventListener("click", goToStep2);
onboardNext2.addEventListener("click", finishOnboarding);

goFlashcardsBtn.addEventListener("click", () => startOnboarding("flashcards"));
goQuizBtn.addEventListener("click", () => startOnboarding("quiz"));
homeBtn.addEventListener("click", showLanding);

categoryFilterEl.addEventListener("change", applyFilters);
sixtyFiveTwentyToggle.addEventListener("change", applyFilters);

// Flashcards
flashCardEl.addEventListener("click", toggleFlashcardFace);
prevCardBtn.addEventListener("click", goToPrevCard);
nextCardBtn.addEventListener("click", goToNextCard);
shuffleCardsBtn.addEventListener("click", shuffleDeck);
flashSpeakBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const q = state.baseList[state.cardIndex];
  if (!q) return;
  const textToRead = state.isFlipped ? q.answers.join(". ") : q.question;
  speak(textToRead, flashSpeakBtn);
});

// Quiz
showAnswerBtn.addEventListener("click", toggleAnswer);
quizBookmarkBtn.addEventListener("click", () => {
  const q = state.quizList[state.quizIndex];
  if (q) toggleBookmark(q.id);
});
quizSpeakBtn.addEventListener("click", () => {
  const q = state.quizList[state.quizIndex];
  if (q) speak(q.question, quizSpeakBtn);
});
answerSpeakBtn.addEventListener("click", () => {
  const q = state.quizList[state.quizIndex];
  if (q) speak(q.answers.join(". "), answerSpeakBtn);
});
prevQuizBtn.addEventListener("click", goToPrevQuizQuestion);
nextQuizBtn.addEventListener("click", goToNextQuizQuestion);
shuffleQuizBtn.addEventListener("click", shuffleQuizDeck);

// Completion
reviewStarredBtn.addEventListener("click", reviewBookmarked);
restartAllBtn.addEventListener("click", restartAllQuiz);

// Keyboard support for flashcards
document.addEventListener("keydown", (e) => {
  if (flashcardModeEl.hidden) return;
  if (e.key === "ArrowRight") goToNextCard();
  if (e.key === "ArrowLeft") goToPrevCard();
});

// =========================================================================
// STARTUP
// Landing page is visible by default. Onboarding runs each time someone
// clicks into Flashcard View or Quiz View (see startOnboarding()).
// If arriving via a header nav link like index.html#flashcards or
// index.html#quiz, jump straight into onboarding for that mode. We listen
// for BOTH the initial page load AND "hashchange" — clicking a nav link
// while already sitting on index.html doesn't reload the page, it just
// changes the hash, so without the hashchange listener nothing happens.
// =========================================================================
function handleHashRouting() {
  const hashMode = window.location.hash.replace("#", "");
  if (hashMode === "flashcards" || hashMode === "quiz") {
    startOnboarding(hashMode);
    history.replaceState(null, "", window.location.pathname);
  }
}

window.addEventListener("hashchange", handleHashRouting);
handleHashRouting();

// Refreshes JS-generated text (category dropdown, Show/Hide Answer label)
// when the language is switched mid-session — see i18n.js.
window.refreshAppLanguageDependentUI = function () {
  if (!appShell.hidden) {
    const currentValue = categoryFilterEl.value;
    buildCategoryOptions();
    categoryFilterEl.value = currentValue;
    if (!quizModeEl.hidden) {
      showAnswerBtn.textContent = state.quizRevealed ? t("app.hideAnswer") : t("app.showAnswer");
    }
  }
};
