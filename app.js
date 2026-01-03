// ===== ESTADÍSTICAS EN VIVO =====
let stats = {
    usersToday: 247,
    testsCompleted: 1832,
    avgScore: 6.4,
    maxStreak: 15,
    rating: 4.8,
    approved: 94
};

function displayStats() {
    const statsHTML = `
        <div id="stats-panel" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
            <h2 style="margin: 0 0 10px 0; font-size: 20px;">
                📊 Estadísticas en vivo
            </h2>

            <p style="
                margin: 0 0 15px 0;
                font-size: 12px;
                opacity: 0.9;
                font-style: italic;
            ">
                ℹ️ Las estadísticas mostradas son simuladas y no reflejan datos reales de usuarios.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px;">
                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px;">👥 Usuarios hoy</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-users">
                        ${stats.usersToday}
                    </p>
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px;">📊 Tests</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-tests">
                        ${stats.testsCompleted}
                    </p>
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px;">✅ Promedio</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-avg">
                        ${stats.avgScore}/10
                    </p>
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px;">🔥 Racha máx</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-streak">
                        ${stats.maxStreak} d
                    </p>
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px;">⭐ Rating</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-rating">
                        ${stats.rating}/5
                    </p>
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px;">✨ Aprobados</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-approved">
                        ${stats.approved}
                    </p>
                </div>
            </div>
        </div>
    `;

    const mainElement = document.querySelector("main");
    if (mainElement && !document.getElementById("stats-panel")) {
        mainElement.insertAdjacentHTML("afterbegin", statsHTML);
    }
}

function updateStats(score) {
    if (Math.random() > 0.7) {
        stats.usersToday += 1;
    }

    stats.testsCompleted += 1;
    stats.avgScore = score;
    stats.maxStreak = Math.max(stats.maxStreak, Math.floor(Math.random() * 20) + 5);

    if (document.getElementById("stat-users")) {
        document.getElementById("stat-users").textContent = stats.usersToday;
        document.getElementById("stat-tests").textContent = stats.testsCompleted;
        document.getElementById("stat-avg").textContent = `${stats.avgScore}/10`;
        document.getElementById("stat-streak").textContent = `${stats.maxStreak} d`;
    }
}

// ===== FILTRO DE CATEGORÍAS =====
function updateCategoryFilter() {
    const categoryFilter = document.getElementById("category-filter");
    if (!categoryFilter) return;

    // Suponiendo categorías predefinidas
    const categories = ["🍖 Higiene y Seguridad Alimentaria", "🐄 Sanidad Animal", "📋 Legislación"];
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// ===== TEST =====
let currentTest = [];

function startTest() {
    const testDiv = document.getElementById("test");
    const categoryFilter = document.getElementById("category-filter").value;

    // Simulación: preguntas dummy
    const allQuestions = [
        { question: "Pregunta A", a: "1", b: "2", c: "3", d: "4", correct: "A", category: "🍖 Higiene y Seguridad Alimentaria" },
        { question: "Pregunta B", a: "1", b: "2", c: "3", d: "4", correct: "B", category: "🐄 Sanidad Animal" },
        { question: "Pregunta C", a: "1", b: "2", c: "3", d: "4", correct: "C", category: "📋 Legislación" }
    ];

    currentTest = allQuestions.filter(q => categoryFilter === "all" || q.category === categoryFilter);

    let html = "";
    currentTest.forEach((q, idx) => {
        html += `<div style="margin-bottom:15px;">
            <p><strong>${idx + 1}. ${q.question}</strong></p>
            <label><input type="radio" name="q${idx}" value="A"> ${q.a}</label><br>
            <label><input type="radio" name="q${idx}" value="B"> ${q.b}</label><br>
            <label><input type="radio" name="q${idx}" value="C"> ${q.c}</label><br>
            <label><input type="radio" name="q${idx}" value="D"> ${q.d}</label>
        </div>`;
    });

    testDiv.innerHTML = html;
    document.getElementById("result").textContent = "";
}

function correctTest() {
    let score = 0;
    currentTest.forEach((q, idx) => {
        const selected = document.querySelector(`input[name="q${idx}"]:checked`);
        if (selected && selected.value === q.correct) {
            score += 1;
        }
    });

    const total = currentTest.length;
    const finalScore = total ? (score / total * 10).toFixed(1) : 0;

    document.getElementById("result").textContent = `Tu puntuación: ${finalScore}/10 (${score}/${total})`;
    updateStats(parseFloat(finalScore));
}

// ===== AL CARGAR LA PÁGINA =====
window.addEventListener("load", function () {
    displayStats();
    updateCategoryFilter();
});
