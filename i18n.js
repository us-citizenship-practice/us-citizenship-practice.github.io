// i18n.js
// -----------------------------------------------------------------------
// A light translation layer for site CHROME (navigation, buttons,
// onboarding copy, etc.) — English and Spanish to start.
//
// IMPORTANT SCOPE NOTE: this does NOT translate the 128/100 civics
// question-and-answer content itself. Machine-translating immigration
// test content is too risky to get subtly wrong, and USCIS publishes
// its own official translations. If official Spanish (or other
// language) question/answer PDFs are provided, a parallel dataset like
// CIVICS_QUESTIONS_2025_ES could be added and swapped in — this file
// doesn't attempt that on its own.
//
// How it works: any element with a data-i18n="key" attribute gets its
// text replaced; data-i18n-html="key" allows inline HTML (for strings
// with a link or <br> inside); data-i18n-placeholder="key" sets an
// input's placeholder instead. The selected language is remembered via
// localStorage so it persists across page loads.
// -----------------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    "nav.studyTools": "Study Tools",
    "nav.resources": "Resources & Guides",
    "nav.about": "About",
    "nav.flashcards.title": "Civics Flashcards",
    "nav.flashcards.sub": "Master the questions with active recall",
    "nav.quiz.title": "Civics Quiz Mode",
    "nav.quiz.sub": "Test your knowledge with mock exams",
    "nav.english.title": "English Test Practice",
    "nav.english.sub": "Practice official reading and writing vocabulary",
    "nav.process.title": "Naturalization Process",
    "nav.process.sub": "Step-by-step guide from N-400 to Oath",
    "nav.testFormat.title": "Test Format & Rules",
    "nav.testFormat.sub": "Understand passing scores and the 65/20 rule",
    "nav.officialResources.title": "Official USCIS Resources",
    "nav.officialResources.sub": "Access official study booklets and materials",
    "nav.faq.title": "FAQ",
    "nav.faq.sub": "Quick answers to common citizenship test questions",

    "landing.headline": "Welcome to<br>Civics Test<br>Practice",
    "landing.tagline": "Free study tool for the U.S. naturalization civics test",
    "landing.flashcardBtn": "Flashcard View",
    "landing.quizBtn": "Quiz View",

    "onboard.step1.eyebrow": "Step 1 of 2",
    "onboard.step1.title": "A couple quick questions first",
    "onboard.ageLabel": "How old are you?",
    "onboard.lprLabel": "How many years have you been a lawful permanent resident (green card holder)?",
    "onboard.step1.why": "<strong>Why we ask:</strong> If you're 65 or older and have been a permanent resident for 20+ years, USCIS lets you study a shorter list of just 20 questions instead of the full test \u2014 this is called the \u201c65/20\u201d rule.",
    "onboard.step1.error": "Please fill in both fields.",
    "onboard.continue": "Continue \u2192",
    "onboard.step2.eyebrow": "Step 2 of 2",
    "onboard.step2.title": "When did you file (or plan to file) Form N-400?",
    "onboard.filingDateLabel": "Filing date",
    "onboard.step2.why": "<strong>Why we ask:</strong> Your test version depends on your <em>filing</em> date, not your interview date. If you filed before October 20, 2025, you'll take the 2008 test (100 questions). On or after that date, you'll take the 2025 test (128 questions).",
    "onboard.step2.error": "Please select a date.",
    "onboard.startStudying": "Start Studying \u2192",

    "app.homeBtn": "\u2190 Home",
    "app.showAnswer": "Show Answer",
    "app.hideAnswer": "Hide Answer",
    "app.previous": "\u2190 Previous",
    "app.next": "Next \u2192",
    "app.shuffle": "Shuffle",
    "app.answer": "Answer",
    "app.correctAnswer": "Correct Answer",
    "app.answerPlaceholder": "Type your answer here\u2026",
    "app.allCategories": "All categories",

    "footer.disclaimer.html": "Questions and official answers are sourced directly from the 2025 test bank and 2008 test bank on the <a href=\"https://www.uscis.gov/citizenship/find-study-materials-and-resources\" target=\"_blank\" rel=\"noopener\">USCIS website</a>. This is an independent study tool and is not affiliated with USCIS or the U.S. government.",
    "footer.privacy": "Privacy Policy",
    "footer.contact": "Contact",
  },

  es: {
    "nav.studyTools": "Herramientas de Estudio",
    "nav.resources": "Recursos y Gu\u00edas",
    "nav.about": "Acerca de",
    "nav.flashcards.title": "Tarjetas de C\u00edvica",
    "nav.flashcards.sub": "Domina las preguntas con repaso activo",
    "nav.quiz.title": "Modo de Cuestionario",
    "nav.quiz.sub": "Pon a prueba tus conocimientos con ex\u00e1menes de pr\u00e1ctica",
    "nav.english.title": "Pr\u00e1ctica del Examen de Ingl\u00e9s",
    "nav.english.sub": "Practica el vocabulario oficial de lectura y escritura",
    "nav.process.title": "Proceso de Naturalizaci\u00f3n",
    "nav.process.sub": "Gu\u00eda paso a paso, desde el N-400 hasta el Juramento",
    "nav.testFormat.title": "Formato y Reglas del Examen",
    "nav.testFormat.sub": "Entiende los puntajes de aprobaci\u00f3n y la regla 65/20",
    "nav.officialResources.title": "Recursos Oficiales de USCIS",
    "nav.officialResources.sub": "Accede a folletos y materiales oficiales de estudio",
    "nav.faq.title": "Preguntas Frecuentes",
    "nav.faq.sub": "Respuestas r\u00e1pidas sobre el examen de ciudadan\u00eda",

    "landing.headline": "Bienvenido a la<br>Pr\u00e1ctica del Examen<br>de C\u00edvica",
    "landing.tagline": "Herramienta gratuita para estudiar el examen c\u00edvico de naturalizaci\u00f3n de EE. UU.",
    "landing.flashcardBtn": "Ver Tarjetas",
    "landing.quizBtn": "Ver Cuestionario",

    "onboard.step1.eyebrow": "Paso 1 de 2",
    "onboard.step1.title": "Primero, un par de preguntas r\u00e1pidas",
    "onboard.ageLabel": "\u00bfCu\u00e1ntos a\u00f1os tienes?",
    "onboard.lprLabel": "\u00bfCu\u00e1ntos a\u00f1os has sido residente permanente legal (titular de tarjeta verde)?",
    "onboard.step1.why": "<strong>Por qu\u00e9 preguntamos:</strong> Si tienes 65 a\u00f1os o m\u00e1s y has sido residente permanente por 20 a\u00f1os o m\u00e1s, USCIS te permite estudiar una lista m\u00e1s corta de solo 20 preguntas en lugar del examen completo \u2014 esto se llama la regla \u201c65/20\u201d.",
    "onboard.step1.error": "Por favor completa ambos campos.",
    "onboard.continue": "Continuar \u2192",
    "onboard.step2.eyebrow": "Paso 2 de 2",
    "onboard.step2.title": "\u00bfCu\u00e1ndo presentaste (o planeas presentar) el Formulario N-400?",
    "onboard.filingDateLabel": "Fecha de presentaci\u00f3n",
    "onboard.step2.why": "<strong>Por qu\u00e9 preguntamos:</strong> Tu versi\u00f3n del examen depende de tu fecha de <em>presentaci\u00f3n</em>, no de tu fecha de entrevista. Si presentaste antes del 20 de octubre de 2025, tomar\u00e1s el examen de 2008 (100 preguntas). En o despu\u00e9s de esa fecha, tomar\u00e1s el examen de 2025 (128 preguntas).",
    "onboard.step2.error": "Por favor selecciona una fecha.",
    "onboard.startStudying": "Comenzar a Estudiar \u2192",

    "app.homeBtn": "\u2190 Inicio",
    "app.showAnswer": "Mostrar Respuesta",
    "app.hideAnswer": "Ocultar Respuesta",
    "app.previous": "\u2190 Anterior",
    "app.next": "Siguiente \u2192",
    "app.shuffle": "Mezclar",
    "app.answer": "Respuesta",
    "app.correctAnswer": "Respuesta Correcta",
    "app.answerPlaceholder": "Escribe tu respuesta aqu\u00ed\u2026",
    "app.allCategories": "Todas las categor\u00edas",

    "footer.disclaimer.html": "Las preguntas y respuestas oficiales provienen directamente del banco de ex\u00e1menes de 2025 y del banco de ex\u00e1menes de 2008 del <a href=\"https://www.uscis.gov/citizenship/find-study-materials-and-resources\" target=\"_blank\" rel=\"noopener\">sitio web de USCIS</a>. Esta es una herramienta de estudio independiente y no est\u00e1 afiliada con USCIS ni con el gobierno de los EE. UU.",
    "footer.privacy": "Pol\u00edtica de Privacidad",
    "footer.contact": "Contacto",
  },
};

function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });

  document.documentElement.setAttribute("lang", lang);
  localStorage.setItem("civicsAppLanguage", lang);

  // Some text is generated by JS at runtime (dropdown options, toggle
  // button labels) rather than sitting in the HTML, so data-i18n can't
  // reach it directly. If the page defines this hook, call it so that
  // text updates too when the language changes mid-session.
  if (typeof window.refreshAppLanguageDependentUI === "function") {
    window.refreshAppLanguageDependentUI();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("civicsAppLanguage") || "en";
  const select = document.getElementById("languageSelect");
  if (select) select.value = savedLang;
  applyLanguage(savedLang);

  if (select) {
    select.addEventListener("change", (e) => applyLanguage(e.target.value));
  }
});
