 // ==================================================
// ===== CONFIGURACIÓN ==============================
// ==================================================

const MAX_QUESTIONS = 10; // número máximo de preguntas por test

// ==================================================
// ===== NOVEDADES =================================
// ==================================================

const novedades = [
    {
        fecha: "03/01/2026",
        titulo: "Nuevas preguntas de bienestar animal",
        descripcion: "Actualización conforme a normativa básica estatal y reglamentos europeos vigentes."
    }
];

function renderNovedades() {
    const sections = document.querySelectorAll("section");
    let novedadesSection = null;

    sections.forEach(sec => {
        const h2 = sec.querySelector("h2");
        if (h2 && h2.textContent.includes("Novedades")) {
            novedadesSection = sec;
        }
    });

    if (!novedadesSection) return;

    const container = novedadesSection.querySelector("div");
    if (!container) return;

    container.innerHTML = "";

    novedades.forEach(nov => {
        container.innerHTML += `
            <div style="background:white; padding:20px; border-left:5px solid #667eea; border-radius:8px;">
                <strong>📅 ${nov.fecha}</strong>
                <p style="margin:5px 0; font-weight:bold;">${nov.titulo}</p>
                <p style="font-size:14px; color:#555;">${nov.descripcion}</p>
            </div>
        `;
    });
}

// ==================================================
// ===== VARIABLES GLOBALES ==========================
// ==================================================

let allQuestions = [];
let currentTest = [];

// ==================================================
// ===== UTILIDADES =================================
// ==================================================

function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function shuffleQuestionOptions(question) {
    const options = [
        { key: "A", text: question.a },
        { key: "B", text: question.b },
        { key: "C", text: question.c },
        { key: "D", text: question.d }
    ];

    const shuffled = shuffleArray(options);

    const correctOption = shuffled.find(opt => opt.key === question.correct);

    return {
        question: question.question,
        options: shuffled,
        correct: correctOption.key,
        category: question.category
    };
}

// ==================================================
// ===== CARGA DE PREGUNTAS ==========================
// ==================================================

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        if (!response.ok) throw new Error("Error al cargar questions.json");
        allQuestions = await response.json();
        updateCategoryFilter();
    } catch (error) {
        document.getElementById("test").innerHTML =
            "<p>Error al cargar el banco de preguntas.</p>";
        console.error(error);
    }
}

// ==================================================
// ===== FILTRO DE CATEGORÍAS =======================
// ==================================================

function updateCategoryFilter() {
    const categoryFilter = document.getElementById("category-filter");
    if (!categoryFilter) return;

    const categories = [...new Set(allQuestions.map(q => q.category))];

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// ==================================================
// ===== TEST =======================================
// ==================================================

function startTest() {
    const testDiv = document.getElementById("test");
    const category = document.getElementById("category-filter").value;
    const resultDiv = document.getElementById("result");

    let filtered = allQuestions.filter(
        q => category === "all" || q.category === category
    );

    if (filtered.length === 0) {
        testDiv.innerHTML = "<p>No hay preguntas disponibles para esta categoría.</p>";
        return;
    }

    filtered = shuffleArray(filtered).slice(0, MAX_QUESTIONS);

    currentTest = filtered.map(q => shuffleQuestionOptions(q));

    testDiv.innerHTML = currentTest.map((q, i) => `
        <div style="margin-bottom:15px;">
            <p><strong>${i + 1}. ${q.question}</strong></p>
            ${q.options.map(opt => `
                <label>
                    <input type="radio" name="q${i}" value="${opt.key}">
                    ${opt.text}
                </label><br>
            `).join("")}
        </div>
    `).join("");

    resultDiv.textContent = "";
}

function correctTest() {
    let score = 0;

    currentTest.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.correct) {
            score++;
        }
    });

    const total = currentTest.length;
    const finalScore = total ? (score / total * 10).toFixed(1) : 0;

    document.getElementById("result").textContent =
        `Tu puntuación: ${finalScore}/10 (${score}/${total})`;
}

// ==================================================
// ===== INICIALIZACIÓN =============================
// ==================================================

window.addEventListener("load", () => {
    renderNovedades();
    loadQuestions();
});
