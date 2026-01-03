// ==================================================
// ===== NOVEDADES ==================================
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
// ===== FILTRO DE CATEGORÍAS =======================
// ==================================================

function updateCategoryFilter() {
    const categoryFilter = document.getElementById("category-filter");
    if (!categoryFilter) return;

    const categories = [
        "🍖 Higiene y Seguridad Alimentaria",
        "🐄 Bienestar Animal",
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
            question: "¿En qué momento una hembra preñada se considera no apta para el transporte según el Reglamento (CE) nº 1/2005?",
            a: "Cuando ha superado el 50 % del tiempo de gestación previsto.",
            b: "Cuando ha superado al menos el 90 % del tiempo de gestación previsto.",
            c: "Únicamente durante la última semana antes del parto.",
            d: "Las hembras preñadas siempre son aptas si el viaje es corto.",
            correct: "B",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "¿Cuál es la probabilidad estimada por la EFSA de que los fetos en el último tercio de la gestación tengan las estructuras anatómicas y neurofisiológicas para experimentar dolor?",
            a: "Entre un 1 % y un 33 %.",
            b: "Entre un 33 % y un 66 %.",
            c: "Entre un 90 % y un 100 %.",
            d: "No existen evidencias científicas al respecto.",
            correct: "C",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "Si una hembra preñada es sacrificada, ¿cuánto tiempo debe permanecer el feto en el útero sin ser perturbado para garantizar su muerte por hipoxia?",
            a: "Al menos 5 minutos.",
            b: "Exactamente 15 minutos.",
            c: "Como mínimo 30 minutos.",
            d: "60 minutos en todos los casos.",
            correct: "C",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "En el caso de una avería en el sistema de videovigilancia (SVBA) que no pueda repararse de forma inmediata, ¿cuál es el plazo máximo para sustituir el equipo?",
            a: "48 horas.",
            b: "5 días naturales.",
            c: "10 días desde que se produjo la avería.",
            d: "Un mes.",
            correct: "C",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "¿Qué zona del matadero está exceptuada de la obligación de disponer de cámaras de videovigilancia según el Real Decreto 695/2022?",
            a: "Los pasillos de conducción.",
            b: "Las zonas de espera donde se encuentran los vehículos antes del inicio de la descarga.",
            c: "Las instalaciones de aturdimiento.",
            d: "La zona de sangrado.",
            correct: "B",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "Con carácter general, ¿cuál es el tiempo máximo de permanencia de los animales en el matadero desde su llegada hasta su sacrificio?",
            a: "12 horas.",
            b: "24 horas.",
            c: "48 horas.",
            d: "72 horas.",
            correct: "C",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "¿Qué procedimiento debe seguirse con un animal que no puede caminar al llegar al matadero?",
            a: "Debe ser arrastrado cuidadosamente hasta la zona de aturdimiento.",
            b: "Debe ser descargado mediante carretillas elevadoras.",
            c: "Debe ser sacrificado o matado in situ, allí donde yazca.",
            d: "Se le debe obligar a levantarse mediante el uso de picas eléctricas.",
            correct: "C",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "Según el dictamen de la EFSA, si un feto se exterioriza accidentalmente y muestra signos de vida, ¿qué acción debe tomarse?",
            a: "Devolverlo al útero para que muera por anoxia.",
            b: "Aturdirlo y matarlo inmediatamente utilizando métodos aprobados para neonatos.",
            c: "Esperar 30 minutos a que fallezca de forma natural.",
            d: "Ignorarlo, ya que el Reglamento (CE) nº 1099/2009 no ampara a los fetos.",
            correct: "B",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "¿Cuál es la duración mínima de los cursos de formación para obtener el certificado de competencia como conductor o cuidador de animales?",
            a: "10 horas.",
            b: "15 horas.",
            c: "20 horas.",
            d: "40 horas.",
            correct: "C",
            category: "🐄 Bienestar Animal"
        },
        {
            question: "¿Durante cuánto tiempo debe el operador del matadero conservar las grabaciones del sistema de videovigilancia (SVBA)?",
            a: "Durante 72 horas.",
            b: "Durante un mes desde la fecha en que se captaron.",
            c: "Durante un año de forma obligatoria.",
            d: "Durante tres años para posibles inspecciones.",
            correct: "B",
            category: "🐄 Bienestar Animal"
        }
    ];

    currentTest = questions.filter(
        q => category === "all" || q.category === category
    );

    if (currentTest.length === 0) {
        testDiv.innerHTML = "<p>No hay preguntas disponibles para esta categoría.</p>";
        return;
    }

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
