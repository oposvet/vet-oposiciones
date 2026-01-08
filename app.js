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
// ===== FRASES MOTIVADORAS ========================
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
// ===== VARIABLES GLOBALES =========================
// ==================================================
let allQuestions = [];
let currentTest = [];
let userAnswers = [];
let lastScore = 0;
let lastCorrectCount = 0;
let lastTotalQuestions = 0;

// ================================================== 
// ===== NOVEDADES ==================================
// ==================================================
const novedades = [
  {
    fecha: "05/01/2026",
    titulo: "🏷️ Etiquetado ampliado",
    descripcion: "Se han añadido preguntas nuevas de etiquetado. Incluye 1169/2011, lote, alegaciones nutricionales, aditivos, IG y más.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🆕 Estructura modular con 4 categorías",
    descripcion: "La app carga preguntas desde 4 categorías distintas: Bienestar Animal, Higiene Alimentaria, Etiquetado y Sanidad Animal.",
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
// ===== UTILIDADES ==================================
// ==================================================
function getSelectedCategory() {
  return document.getElementById("category-filter")?.value || "all";
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
  if (testDiv) testDiv.innerHTML = `<p style="color:red; font-weight:bold;">${message}</p>`;
}

// ================================================== 
// ===== CARGA DE PREGUNTAS ==========================
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
// ===== FUNCIÓN COMPARTIR ===========================
// ==================================================
function shareResult() {
  const score = lastScore.toFixed(2);
  const correctCount = lastCorrectCount;
  const totalQuestions = lastTotalQuestions;
  const category = getSelectedCategory();

  const categoryText = category === "all" ? "todas las categorías" : category;

  const shareText = `📊 He conseguido ${score}/10 en VetOposiciones\n\n✅ Aciertos: ${correctCount}/${totalQuestions}\n📚 Categoría: ${categoryText}\n\n¿Te atreves a competir? 🩺`;

  navigator.clipboard.writeText(shareText).then(
    () => {
      const shareBtn = document.getElementById("shareBtn");
      if (shareBtn) {
        const originalText = shareBtn.textContent;
        shareBtn.textContent = "✅ ¡Copiado!";
        shareBtn.style.background = "#28a745";

        setTimeout(() => {
          shareBtn.textContent = originalText;
          shareBtn.style.background = "#667eea";
        }, 2000);
      }
    },
    (err) => {
      console.error("Error al copiar:", err);
      alert("No se pudo copiar al portapapeles. Intenta nuevamente.");
    }
  );
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

  resultDiv.innerHTML = "";
  userAnswers = [];

  const category = getSelectedCategory();
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
      <div class="question-block">
        <div style="font-size:12px; color:#666; margin-bottom:8px;">${q.category}</div>
        <div style="font-weight:bold; margin-bottom:10px;">${i + 1}. ${q.question}</div>
        ${q.options
          .map(
            (opt) => `
            <label>
              <input type="radio" name="q${i}" value="${opt.key}" onchange="saveAnswer(${i}, '${opt.key}')" />
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
  const resultDiv = document.getElementById("result");
  const correctBtn = document.getElementById("correctBtn");

  if (!resultDiv) return;

  let correctCount = 0;

  currentTest.forEach((q, i) => {
    const selected = userAnswers[i];
    const radios = document.getElementsByName(`q${i}`);

    radios.forEach((r) => {
      const label = r.parentElement;
      if (!label) return;

      label.classList.remove("correct", "incorrect");

      if (r.value === q.correct) {
        label.classList.add("correct");
      }
      if (selected && r.value === selected && selected !== q.correct) {
        label.classList.add("incorrect");
      }
    });

    if (selected === q.correct) correctCount++;
  });

  const totalQuestions = currentTest.length;
  const score = (correctCount / totalQuestions) * 10;

  lastScore = score;
  lastCorrectCount = correctCount;
  lastTotalQuestions = totalQuestions;

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
      <button id="shareBtn" onclick="shareResult()" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 14px; cursor: pointer; font-weight: bold; margin-top: 15px;">📤 Compartir resultado</button>
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

  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      updateStatsForSelectedCategory();
    });
  }
});
