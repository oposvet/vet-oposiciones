// ==================================================
// ===== CONFIGURACIÓN =============================
// ==================================================
const MAX_QUESTIONS = 10;

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
      "Se han añadido preguntas nuevas de etiquetado. Incluye 1169/2011, lote, alegaciones nutricionales, aditivos, IG y más.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🆕 Estructura modular con 4 categorías",
    descripcion:
      "La app carga preguntas desde 4 categorías distintas: Bienestar Animal, Higiene Alimentaria, Etiquetado y Sanidad Animal.",
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

    // Validar/normalizar
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
      setError(
        "No se han podido cargar preguntas. Verifica que los archivos JSON existan en la misma carpeta que index.html."
      );
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

  // Mantener opción "all"
  categoryFilter.innerHTML = `<option value="all">📚 Todas las catego
