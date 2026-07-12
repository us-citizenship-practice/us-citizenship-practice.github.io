// english-practice.js
// -----------------------------------------------------------------------
// A small, self-contained flashcard deck for the official English test
// vocabulary lists (english-vocab.js). Same state->render pattern as the
// main app, just simpler since there's no question/answer split here —
// each card is just one vocabulary word plus which category it's in.
// -----------------------------------------------------------------------

const listFilterEl = document.getElementById("listFilter");
const categoryFilterEl = document.getElementById("categoryFilter");
const vocabCardEl = document.getElementById("vocabCard");
const vocabTagEl = document.getElementById("vocabTag");
const vocabWordEl = document.getElementById("vocabWord");
const vocabCategoryEl = document.getElementById("vocabCategory");
const vocabSpeakBtn = document.getElementById("vocabSpeakBtn");
const prevWordBtn = document.getElementById("prevWord");
const nextWordBtn = document.getElementById("nextWord");
const shuffleWordsBtn = document.getElementById("shuffleWords");

const state = {
  list: [],
  index: 0,
};

function speak(text, btnEl) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  if (btnEl) {
    utterance.onstart = () => btnEl.classList.add("is-speaking");
    utterance.onend = () => btnEl.classList.remove("is-speaking");
  }
  window.speechSynthesis.speak(utterance);
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function activeSource() {
  return listFilterEl.value === "writing" ? WRITING_VOCAB : READING_VOCAB;
}

function buildCategoryOptions() {
  categoryFilterEl.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All categories";
  categoryFilterEl.appendChild(allOption);

  const seen = new Set();
  activeSource().forEach((item) => {
    if (seen.has(item.category)) return;
    seen.add(item.category);
    const opt = document.createElement("option");
    opt.value = item.category;
    opt.textContent = item.category;
    categoryFilterEl.appendChild(opt);
  });
}

function applyFilters() {
  const category = categoryFilterEl.value;
  state.list = activeSource().filter(
    (item) => category === "all" || item.category === category
  );
  state.index = 0;
  render();
}

function render() {
  if (state.list.length === 0) {
    vocabWordEl.textContent = "No words match this filter.";
    vocabTagEl.textContent = "WORD 0/0";
    vocabCategoryEl.textContent = "";
    return;
  }
  const item = state.list[state.index];
  vocabWordEl.textContent = item.word;
  vocabCategoryEl.textContent = `Category: ${item.category}`;
  vocabTagEl.textContent = `WORD ${String(state.index + 1).padStart(2, "0")}/${state.list.length}`;
}

function goNext() {
  if (state.list.length === 0) return;
  state.index = (state.index + 1) % state.list.length;
  render();
}

function goPrev() {
  if (state.list.length === 0) return;
  state.index = (state.index - 1 + state.list.length) % state.list.length;
  render();
}

function shuffleDeck() {
  state.list = shuffle(state.list);
  state.index = 0;
  render();
}

listFilterEl.addEventListener("change", () => {
  buildCategoryOptions();
  applyFilters();
});
categoryFilterEl.addEventListener("change", applyFilters);
prevWordBtn.addEventListener("click", goPrev);
nextWordBtn.addEventListener("click", goNext);
shuffleWordsBtn.addEventListener("click", shuffleDeck);
vocabSpeakBtn.addEventListener("click", () => {
  const item = state.list[state.index];
  if (item) speak(item.word, vocabSpeakBtn);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goNext();
  if (e.key === "ArrowLeft") goPrev();
});

buildCategoryOptions();
applyFilters();
