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
// ===== FRASES MOTIVADORAS =========================
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
// Nota: Etiquetado pasa a 60 preguntas (10 + 50 nuevas) si actualizas questions_etiquetado.json.
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
// ==================================================
function startTest() {
  const testDiv = document.getElementById("test");
  const resultDiv = document.getElementById("result");
  const correctBtn = document.getElementById("correctBtn");

  if (!testDiv || !resultDiv) return;

  if (!allQuestions || allQuestions.length === 0) {
    setError("Aún no se han cargado preguntas. Espera un momento e intenta de nuevo.");
    return;
  }

  resultDiv.textContent = "";
  userAnswers = [];

  const category = document.getElementById("category-filter")?.value || "all";

  let filtered = allQuestions.filter(
    (q) => category === "all" || q.category === category
  );

  if (filtered.length === 0) {
    testDiv.innerHTML = "<p>No hay preguntas disponibles para esta categoría.</p>";
    if (correctBtn) correctBtn.style.display = "none";
    return;
  }

  filtered = shuffleArray(filtered).slice(0, Math.min(MAX_QUESTIONS, filtered.length));
  currentTest = filtered.map((q) => shuffleQuestionOptions(q));

  testDiv.innerHTML = currentTest
    .map(
      (q, i) => `
      <div style="background:#fff; padding:15px; border-radius:8px; margin-bottom:15px; border:1px solid #eee;">
        <div style="font-size:12px; color:#666; margin-bottom:8px;">${q.category}</div>
        <div style="font-weight:bold; margin-bottom:10px;">${i + 1}. ${q.question}</div>
        ${q.options
          .map(
            (opt) => `
            <label style="display:block; margin:6px 0; cursor:pointer;">
              <input type="radio" name="q${i}" value="${opt.key}" onchange="saveAnswer(${i}, '${opt.key}')"/>
              ${opt.key}) ${opt.text}
            </label>
          `
          )
          .join("")}
      </div>
    `
    )
    .join("");

  if (correctBtn) correctBtn.style.display = "inline-block";
}

function saveAnswer(index, value) {
  userAnswers[index] = value;
}

function correctTest() {
  const testDiv = document.getElementById("test");
  const resultDiv = document.getElementById("result");
  const correctBtn = document.getElementById("correctBtn");

  if (!testDiv || !resultDiv) return;

  let correctCount = 0;

  // Marcar respuestas
  currentTest.forEach((q, i) => {
    const selected = userAnswers[i];
    const radios = document.getElementsByName(`q${i}`);

    radios.forEach((r) => {
      const label = r.parentElement;
      if (!label) return;

      // Reset estilos
      label.style.fontWeight = "normal";
      label.style.color = "#000";

      if (r.value === q.correct) {
        label.style.color = "#28a745";
        label.style.fontWeight = "bold";
      }

      if (selected && r.value === selected && selected !== q.correct) {
        label.style.color = "#dc3545";
        label.style.fontWeight = "bold";
      }
    });

    if (selected === q.correct) correctCount++;
  });

  const totalQuestions = currentTest.length;
  const score = (correctCount / totalQuestions) * 10;

  let phraseList = motivationalPhrases.low;
  if (score >= 9) phraseList = motivationalPhrases.excellent;
  else if (score >= 7) phraseList = motivationalPhrases.good;
  else if (score >= 5) phraseList = motivationalPhrases.medium;

  const phrase = phraseList[Math.floor(Math.random() * phraseList.length)];

  resultDiv.innerHTML = `
    <div style="padding:15px; background:#f8f9fa; border-radius:8px; border:1px solid #eee;">
      <div>✅ Nota: ${score.toFixed(2)} / 10</div>
      <div>📌 Aciertos: ${correctCount}/${totalQuestions}</div>
      <div style="margin-top:10px;">${phrase}</div>
    </div>
  `;

  if (correctBtn) correctBtn.style.display = "none";
}

// ==================================================
// ===== INIT ========================================
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
  renderNovedades();
  loadAllQuestions();
});
