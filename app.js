// ==================================================
// ===== CONFIGURACIÓN =============================
// ==================================================
const MAX_QUESTIONS = 10;

// Lista de archivos JSON a cargar
const QUESTION_FILES = [
  "questions_bienestar_animal.json",
  "questions_higiene_alimentaria.json",
  "questions_etiquetado.json",
  "questions_sanidad_animal.json",
];

// ==================================================
// ===== FRASES MOTIVADORAS (RESULTADO) ==============
// ==================================================
const motivationalPhrases = {
  excellent: [
    "🏆 ¡Excelente! ¡Eres un crack!",
    "⭐ ¡Bravo! Dominas el tema perfectamente.",
    "🎯 ¡Impresionante! Sigue así, campeón.",
  ],
  good: [
    "👍 ¡Muy bien! ¡Vas por el buen camino!",
    "💪 ¡Bien hecho! Con más práctica serás imparable.",
    "🌟 ¡Buen trabajo! Cada vez lo haces mejor.",
  ],
  medium: [
    "📚 Vamos bien. Repasa algunos temas y volverás.",
    "💡 ¡Ánimo! La próxima lo harás mejor.",
    "🔄 Buen esfuerzo. Practica más y mejorarás.",
  ],
  low: [
    "📖 Necesitas repasar. ¡Tú puedes!",
    "💯 Sigue practicando, ¡la mejoría está cerca!",
    "🚀 No te desanimes, cada intento suma.",
  ],
};

// ==================================================
// ===== VARIABLES GLOBALES ==========================
// ==================================================
let allQuestions = [];
let currentTest = [];
let userAnswers = [];

// ==================================================
// ===== NOVEDADES ==================================
// ==================================================
const novedades = [
  {
    fecha: "05/01/2026",
    titulo: "🏷️ Etiquetado ampliado",
    descripcion:
      "Se han añadido 50 preguntas nuevas de etiquetado (total: 60). Incluye 1169/2011, lote, alegaciones nutricionales, aditivos, IG y más.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🆕 Estructura modular con 4 categorías",
    descripcion:
      "La app ahora carga preguntas desde 4 categorías distintas. Más mantenible, escalable y fácil de actualizar.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🐄 Bienestar Animal",
    descripcion:
      "10 preguntas sobre transporte de animales, sacrificio humanitario y videovigilancia en mataderos.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🍗 Higiene Alimentaria",
    descripcion:
      "10 preguntas sobre temperaturas, APPCC, patógenos y límites microbiológicos.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🏷️ Etiquetado",
    descripcion:
      "Preguntas sobre Reglamento (UE) 1169/2011, alérgenos, códigos E y marcado de establecimiento.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🦠 Sanidad Animal",
    descripcion:
      "10 preguntas sobre enfermedades virales, bacterianas, zoonosis y vectores en ganado.",
  },
];

function renderNovedades() {
  const container = document.getElementById("news-container");
  if (!container) return;

  container.innerHTML = "";

  novedades.forEach((nov) => {
    const item = document.createElement("div");
    item.style.cssText =
      "background:#fff; padding:15px; border-radius:8px; border-left:4px solid #667eea;";

    item.innerHTML = `
      <h3 style="margin:0 0 6px 0; color:#667eea;">${nov.titulo}</h3>
      <p style="margin:0; color:#666; font-size:14px;">${nov.descripcion}</p>
      <p style="margin:10px 0 0 0; color:#999; font-size:12px;">${nov.fecha}</p>
    `;

    container.appendChild(item);
  });
}

// ==================================================
// ===== UTIL: CATEGORÍA SELECCIONADA ================
// ==================================================
function getSelectedCategory() {
  return document.getElementById("category-filter")?.value || "all";
}

// ==================================================
// ===== CARGA DE PREGUNTAS (Múltiples JSONs) ========
// ==================================================
async function loadAllQuestions() {
  try {
    const promises = QUESTION_FILES.map((file) =>
      fetch(file, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
          return res.json();
        })
        .catch((err) => {
          console.error(`Error cargando ${file}:`, err);
          return [];
        })
    );

    const results = await Promise.all(promises);
    const allData = results.flat();

    allQuestions = allData
      .filter((q) => {
        return (
          q &&
          typeof q.question === "string" &&
          typeof q.a === "string" &&
          typeof q.b === "string" &&
          typeof q.c === "string" &&
          typeof q.d === "string" &&
          ["A", "B", "C", "D"].includes(String(q.correct).toUpperCase()) &&
          typeof q.category === "string"
        );
      })
      .map((q) => ({ ...q, correct: String(q.correct).toUpperCase() }));

    updateCategoryFilter();
    renderQuestionStats();
    updateStatsForSelectedCategory();

    if (allQuestions.length === 0) {
      const testDiv = document.getElementById("test");
      if (testDiv) {
        testDiv.innerHTML =
          "<p>No se han podido cargar preguntas. Verifica que los archivos JSON existan.</p>";
      }
    }
  } catch (error) {
    console.error("Error general al cargar preguntas:", error);
    setError("Error al cargar el banco de preguntas. Verifica los archivos JSON.");
  }
}

// ==================================================
// ===== FILTRO DE CATEGORÍAS =======================
// ==================================================
function updateCategoryFilter() {
  const categoryFilter = document.getElementById("category-filter");
  if (!categoryFilter) return;

  categoryFilter.innerHTML = `<option value="all">📚 Todas las categorías</option>`;

  const categories = [...new Set(allQuestions.map((q) => q.category))].sort();
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// ==================================================
// ===== ESTADÍSTICAS BANCO ==========================
// ==================================================
function getCountsByCategory() {
  return allQuestions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});
}

function getAvailableInSelectedCategory() {
  const selected = getSelectedCategory();
  if (selected === "all") return allQuestions.length;
  return allQuestions.filter((q) => q.category === selected).length;
}

function renderQuestionStats() {
  const statsTop = document.getElementById("stats-top");
  const byCatEl = document.getElementById("questions-by-category");
  if (!statsTop || !byCatEl) return;

  const total = allQuestions.length;
  const counts = getCountsByCategory();
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  statsTop.innerHTML = `
    <div>• Total de preguntas: <b>${total}</b></div>
    <div>• Preguntas por test: <b>${MAX_QUESTIONS}</b></div>
    <div id="available-selected" style="margin-top:6px;"></div>
  `;

  byCatEl.innerHTML = sorted
    .map(([cat, n]) => `<div>• ${cat}: ${n}</div>`)
    .join("");
}

function updateStatsForSelectedCategory() {
  const availableEl = document.getElementById("available-selected");
  if (!availableEl) return;

  const selected = getSelectedCategory();
  const available = getAvailableInSelectedCategory();

  const label =
    selected === "all" ? "Disponibles (todas)" : `Disponibles en ${selected}`;

  availableEl.innerHTML = `• ${label}: <b>${available}</b>`;

  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    const willUse = Math.min(MAX_QUESTIONS, available);
    startBtn.textContent = `▶ Iniciar test (${willUse} de ${available})`;
  }
}

// ==================================================
// ===== UTILIDADES ==================================
// ==================================================
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function shuffleQuestionOptions(question) {
  const options = ["A", "B", "C", "D"].map((key) => ({
    key,
    text: question[key.toLowerCase()],
  }));

  shuffleArray(options);
  return { ...question, options };
}

function setError(message) {
  const testDiv = document.getElementById("test");
  if (testDiv) testDiv.innerHTML = `<p style="color:red;">${message}</p>`;
}

// ==================================================
// ===== TEST ========================================
// =============================================
