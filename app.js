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
// ===== NOVEDADES ===================================
// ==================================================
const novedades = [
  {
    fecha: "04/01/2026",
    titulo: "🆕 Estructura modular con 4 categorías",
    descripcion:
      "La app ahora carga preguntas desde 4 categorias distintas. Más mantenible, escalable y fácil de actualizar.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🐄 Bienestar Animal (questions_bienestar_animal.json)",
    descripcion:
      "10 preguntas sobre transporte de animales, sacrificio humanitario y videovigilancia en mataderos.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🍗 Higiene Alimentaria (questions_higiene_alimentaria.json)",
    descripcion:
      "10 preguntas sobre temperaturas, APPCC, patógenos y límites microbiológicos.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🏷️ Etiquetado (questions_etiquetado.json)",
    descripcion:
      "10 preguntas sobre Reglamento (UE) 1169/2011, alérgenos, códigos E y marcado de establecimiento.",
  },
  {
    fecha: "04/01/2026",
    titulo: "🦠 Sanidad Animal (questions_sanidad_animal.json)",
    descripcion:
      "10 preguntas sobre enfermedades virales, bacterianas, zoonosis y vectores en ganado.",
  },
];

function renderNovedades() {
  const container = document.getElementById("news-container");
  if (!container) return;
  container.innerHTML = "";
  novedades.forEach((nov) => {
    const div = document.createElement("div");
    div.style.cssText =
      "background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;";
    div.innerHTML = `
      <h3 style="margin: 0 0 5px 0; color: #667eea;">${nov.titulo}</h3>
      <p style="margin: 0; color: #666; font-size: 14px;">${nov.descripcion}</p>
      <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">${nov.fecha}</p>
    `;
    container.appendChild(div);
  });
}

// ==================================================
// ===== CARGA DE PREGUNTAS (Múltiples JSONs) =====
// ==================================================
async function loadAllQuestions() {
  try {
    // Cargar todos los archivos en paralelo
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

    // Combinar todos los resultados
    const allData = results.flat();

    // Validar y filtrar
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
      .map((q) => ({
        ...q,
        correct: String(q.correct).toUpperCase(),
      }));

    console.log(
      `✅ Cargadas ${allQuestions.length} preguntas de ${QUESTION_FILES.length} archivos`
    );

    updateCategoryFilter();

    if (allQuestions.length === 0) {
      const testDiv = document.getElementById("test");
      if (testDiv) {
        testDiv.innerHTML =
          "<p style='color: red;'>No se han podido cargar preguntas. Verifica que los archivos JSON existan.</p>";
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
  if (testDiv) {
    testDiv.innerHTML = `<p style="color: red; font-weight: bold;">${message}</p>`;
  }
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
    testDiv.innerHTML =
      "<p style='color: orange;'>No hay preguntas disponibles para esta categoría.</p>";
    if (correctBtn) correctBtn.style.display = "none";
    return;
  }

  filtered = shuffleArray(filtered).slice(
    0,
    Math.min(MAX_QUESTIONS, filtered.length)
  );
  currentTest = filtered.map((q) => shuffleQuestionOptions(q));

  testDiv.innerHTML = currentTest
    .map(
      (q, i) => `
    <div class="question-block" id="question-${i}">
      <p style="font-size: 12px; color: #999; margin-bottom: 5px;">${q.category}</p>
      <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
        <strong>${i + 1}. ${q.question}</strong>
      </h3>
      <div>
        ${q.options
          .map(
            (opt) => `
          <label style="display: block; padding: 10px; margin: 8px 0; border-radius: 5px; cursor: pointer; background: #f8f9fa; transition: all 0.2s;">
            <input 
              type="radio" 
              name="question-${i}" 
              value="${opt.key}"
              onchange="userAnswers[${i}] = this.value"
              style="cursor: pointer; margin-right: 10px;"
            />
            ${opt.key}. ${opt.text}
          </label>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");

  if (correctBtn) correctBtn.style.display = "inline-block";
}

// ==================================================
// ===== CORRECCIÓN ==================================
// ==================================================
function correctTest() {
  const resultDiv = document.getElementById("result");
  if (!resultDiv) return;

  let correctCount = 0;

  // Colorea cada pregunta
  currentTest.forEach((q, i) => {
    const userAnswer = userAnswers[i];
    const questionBlock = document.getElementById(`question-${i}`);
    const isCorrect = userAnswer === q.correct;

    if (isCorrect) {
      correctCount++;
    }

    if (questionBlock) {
      // Color de fondo según acierto/error
      if (isCorrect) {
        questionBlock.style.cssText =
          "background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 5px; opacity: 0.8;";
      } else {
        questionBlock.style.cssText =
          "background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 15px 0; border-radius: 5px; opacity: 0.8;";
      }

      // Colorea los labels (opciones)
      const labels = questionBlock.querySelectorAll("label");
      labels.forEach((label) => {
        const radio = label.querySelector("input[type='radio']");
        if (!radio) return;

        const optionKey = radio.value;

        if (optionKey === q.correct) {
          // Opción correcta en verde
          label.style.background = "#c3e6cb";
          label.style.borderLeft = "3px solid #28a745";
          label.style.fontWeight = "bold";
        } else if (optionKey === userAnswer && userAnswer !== q.correct) {
          // Opción seleccionada incorrecta en rojo
          label.style.background = "#f5c6cb";
          label.style.borderLeft = "3px solid #dc3545";
          label.style.fontWeight = "bold";
        }
      });
    }
  });

  // Calcula nota
  const totalQuestions = currentTest.length;
  const score = ((correctCount / totalQuestions) * 10).toFixed(2);

  // Selecciona frase motivadora según nota
  let phraseCategory;
  if (score >= 9) phraseCategory = "excellent";
  else if (score >= 7) phraseCategory = "good";
  else if (score >= 5) phraseCategory = "medium";
  else phraseCategory = "low";

  const phrase =
    motivationalPhrases[phraseCategory][
      Math.floor(Math.random() * motivationalPhrases[phraseCategory].length)
    ];

  // Muestra resultado
  resultDiv.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin-top: 30px;
    ">
      <h2 style="margin: 0 0 10px 0; font-size: 24px;">Tu Resultado</h2>
      <div style="
        background: rgba(255,255,255,0.2);
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      ">
        <p style="font-size: 48px; margin: 0; font-weight: bold;">${score} / 10</p>
        <p style="font-size: 18px; margin: 10px 0 0 0;">Acertos: ${correctCount}/${totalQuestions}</p>
      </div>
      <p style="font-size: 20px; margin: 20px 0 0 0; font-weight: bold;">
        ${phrase}
      </p>
    </div>
  `;

  // Oculta botón de corregir
  const correctBtn = document.getElementById("correctBtn");
  if (correctBtn) correctBtn.style.display = "none";
}

// ==================================================
// ===== INICIALIZACIÓN ==============================
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
  renderNovedades();
  loadAllQuestions(); // Cambio: ahora se llama loadAllQuestions()
});
