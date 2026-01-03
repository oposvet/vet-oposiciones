// ==================================================
// ===== NOVEDADES ==================================
// ==================================================

const novedades = [
    {
        fecha: "05/01/2026",
        titulo: "Nuevas preguntas de sanidad animal",
        descripcion: "Actualización conforme a normativa básica estatal y reglamentos europeos vigentes."
    },
    
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
// ===== FILTRO DE CATEGORÍAS =======================
// ==================================================

function updateCategoryFilter() {
    const categoryFilter = document.getElementById("category-filter");
    if (!categoryFilter) return;

    const categories = [
        "🍖 Higiene y Seguridad Alimentaria",
        "🐄 Sanidad Animal",
        "📋 Legislación"
    ];

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

let currentTest = [];

function startTest() {
    const testDiv = document.getElementById("test");
    const category = document.getElementById("category-filter").value;

    const questions = [
        {
            question: "Pregunta A",
            a: "1",
            b: "2",
            c: "3",
            d: "4",
            correct: "A",
            category: "🍖 Higiene y Seguridad Alimentaria"
        },
        {
            question: "Pregunta B",
            a: "1",
            b: "2",
            c: "3",
            d: "4",
            correct: "B",
            category: "🐄 Sanidad Animal"
        },
        {
            question: "Pregunta C",
            a: "1",
            b: "2",
            c: "3",
            d: "4",
            correct: "C",
            category: "📋 Legislación"
        }
    ];

    currentTest = questions.filter(
        q => category === "all" || q.category === category
    );

    testDiv.innerHTML = currentTest.map((q, i) => `
        <div style="margin-bottom:15px;">
            <p><strong>${i + 1}. ${q.question}</strong></p>
            <label><input type="radio" name="q${i}" value="A"> ${q.a}</label><br>
            <label><input type="radio" name="q${i}" value="B"> ${q.b}</label><br>
            <label><input type="radio" name="q${i}" value="C"> ${q.c}</label><br>
            <label><input type="radio" name="q${i}" value="D"> ${q.d}</label>
        </div>
    `).join("");

    document.getElementById("result").textContent = "";
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
    updateCategoryFilter();
    renderNovedades();
});
