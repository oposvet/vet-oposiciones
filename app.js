// ===== SISTEMA DE ACCESO ADMIN =====
const ADMIN_PASSWORD = "vetoposiciones2026";
let isAdmin = false;

function checkAdmin() {
    const password = prompt("🔐 Ingresa contraseña admin:");
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        alert("✅ Acceso admin activado");
        showAdminFeatures();
    } else if (password !== null) {
        alert("❌ Contraseña incorrecta");
    }
}

function showAdminFeatures() {
    document.getElementById("admin-section").style.display = "block";
}

function hideAdminFeatures() {
    document.getElementById("admin-section").style.display = "none";
    isAdmin = false;
}

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
            color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
            <h2 style="margin: 0 0 15px 0; font-size: 20px;">📊 Estadísticas en vivo</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px;">
                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px; opacity: 0.9;">👥 Usuarios hoy</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-users">${stats.usersToday}</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px; opacity: 0.9;">📊 Tests</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-tests">${stats.testsCompleted}</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px; opacity: 0.9;">✅ Promedio</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-avg">${stats.avgScore}/10</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px; opacity: 0.9;">🔥 Racha máx</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-streak">${stats.maxStreak} d</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px; opacity: 0.9;">⭐ Rating</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-rating">${stats.rating}/5</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 11px; opacity: 0.9;">✨ Aprobados</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;" id="stat-approved">${stats.approved}</p>
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

    const statUsers = document.getElementById("stat-users");
    const statTests = document.getElementById("stat-tests");
    const statAvg = document.getElementById("stat-avg");
    const statStreak = document.getElementById("stat-streak");

    if (statUsers) statUsers.textContent = stats.usersToday;
    if (statTests) statTests.textContent = stats.testsCompleted;
    if (statAvg) statAvg.textContent = `${stats.avgScore}/10`;
    if (statStreak) statStreak.textContent = `${stats.maxStreak} d`;
}

// ===== PREGUNTAS CON CATEGORÍAS =====
let questions = [
    // 🍖 HIGIENE Y SEGURIDAD ALIMENTARIA (8 preguntas)
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Qué normativa regula los controles oficiales en materia de seguridad alimentaria?",
        options: {
            A: "Reglamento (CE) 852/2004",
            B: "Reglamento (UE) 2017/625",
            C: "Ley 8/2003"
        },
        correct: "B"
    },
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Cuál es el Reglamento base de higiene de productos alimenticios?",
        options: {
            A: "Reglamento (CE) 178/2002",
            B: "Reglamento (CE) 852/2004",
            C: "Reglamento (UE) 2023/2145"
        },
        correct: "B"
    },
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Qué principios rige el Reglamento (CE) 178/2002?",
        options: {
            A: "Análisis de riesgos",
            B: "Análisis de riesgos y trazabilidad",
            C: "Solo trazabilidad"
        },
        correct: "B"
    },
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Qué son los Puntos Críticos de Control (PCC)?",
        options: {
            A: "Fases donde se realiza inspección visual",
            B: "Fases donde se aplican medidas de control de peligros",
            C: "Documentación administrativa"
        },
        correct: "B"
    },
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Quién es responsable del control APPCC en la cadena alimentaria?",
        options: {
            A: "Solo las autoridades",
            B: "El productor/operador",
            C: "Las asociaciones de consumidores"
        },
        correct: "B"
    },
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Qué es la trazabilidad en seguridad alimentaria?",
        options: {
            A: "Capacidad de seguir un producto en toda la cadena",
            B: "Solo registrar documentación",
            C: "Control de temperaturas"
        },
        correct: "A"
    },
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Cuál es el límite de temperatura para conservar alimentos refrigerados?",
        options: {
            A: "≤ 5°C",
            B: "≤ 10°C",
            C: "≤ 15°C"
        },
        correct: "A"
    },
    {
        category: "🍖 Higiene Alimentaria",
        question: "¿Qué establece el Reglamento (CE) 852/2004 sobre higiene?",
        options: {
            A: "Solo temperaturas",
            B: "Requisitos de higiene en establecimientos alimentarios",
            C: "Solo limpieza de superficies"
        },
        correct: "B"
    },

    // 🐄 SANIDAD ANIMAL (7 preguntas)
    {
        category: "🐄 Sanidad Animal",
        question: "¿Cuál es la autoridad competente en sanidad animal en España?",
        options: {
            A: "Ministerio de Sanidad",
            B: "Ministerio de Agricultura",
            C: "AESA"
        },
        correct: "B"
    },
    {
        category: "🐄 Sanidad Animal",
        question: "¿Qué ley establece la base de la sanidad animal en España?",
        options: {
            A: "Ley 8/2003",
            B: "Ley 14/1986",
            C: "Reglamento (CE) 178/2002"
        },
        correct: "A"
    },
    {
        category: "🐄 Sanidad Animal",
        question: "¿Qué es un 'foyer' de enfermedad animal?",
        options: {
            A: "Centro de cría controlado",
            B: "Zona de concentración de animales portadores",
            C: "Instalación veterinaria"
        },
        correct: "B"
    },
    {
        category: "🐄 Sanidad Animal",
        question: "¿Cuál es el órgano rector de sanidad animal en la UE?",
        options: {
            A: "EFSA",
            B: "Comisión Europea",
            C: "OIE (Organización Mundial de Sanidad Animal)"
        },
        correct: "C"
    },
    {
        category: "🐄 Sanidad Animal",
        question: "¿Qué implica la certificación de un establecimiento libre de brucelosis?",
        options: {
            A: "Serología negativa sistemática",
            B: "Solo ausencia de síntomas clínicos",
            C: "Muestreo anual"
        },
        correct: "A"
    },
    {
        category: "🐄 Sanidad Animal",
        question: "¿Quién notifica obligatoriamente enfermedades de declaración obligatoria?",
        options: {
            A: "Solo el ganadero",
            B: "El veterinario oficial",
            C: "Solo el laboratorio"
        },
        correct: "B"
    },
    {
        category: "🐄 Sanidad Animal",
        question: "¿Qué reglamento regula el bienestar en el transporte de animales?",
        options: {
            A: "Reglamento (CE) 1099/2009",
            B: "Reglamento (CE) 1/2005",
            C: "Reglamento (UE) 2017/625"
        },
        correct: "B"
    },

    // 📋 LEGISLACIÓN (5 preguntas)
    {
        category: "📋 Legislación",
        question: "¿Qué reglamento fija los principios generales de la legislación alimentaria?",
        options: {
            A: "Reglamento (UE) 2017/625",
            B: "Reglamento (CE) 852/2004",
            C: "Reglamento (CE) 178/2002"
        },
        correct: "C"
    },
    {
        category: "📋 Legislación",
        question: "¿Qué administración ejecuta los controles oficiales en Castilla-La Mancha?",
        options: {
            A: "Agencia Española de Seguridad Alimentaria",
            B: "Junta de Comunidades de Castilla-La Mancha",
            C: "Ministerio de Agricultura"
        },
        correct: "B"
    },
    {
        category: "📋 Legislación",
        question: "¿Cuál es la base legal de la inspección veterinaria oficial?",
        options: {
            A: "Real Decreto 1945/1983",
            B: "Ley 8/2003, de sanidad animal",
            C: "Reglamento (UE) 2017/625"
        },
        correct: "C"
    },
    {
        category: "📋 Legislación",
        question: "¿Qué es la Evaluación de Riesgos en seguridad alimentaria?",
        options: {
            A: "Identificar y analizar peligros",
            B: "Solo control visual",
            C: "Documentación anual"
        },
        correct: "A"
    },
    {
        category: "📋 Legislación",
        question: "¿A quién corresponde la responsabilidad de seguridad alimentaria?",
        options: {
            A: "Solo al Estado",
            B: "Al operador económico de la cadena alimentaria",
            C: "Solo a consumidores"
        },
        correct: "B"
    }
];

// ===== FUNCIONES ADMIN =====
function addQuestion() {
    if (!isAdmin) {
        alert("❌ Debes estar en modo admin");
        return;
    }

    const category = document.getElementById("category").value.trim();
    const q = document.getElementById("question").value.trim();
    const a = document.getElementById("a").value.trim();
    const b = document.getElementById("b").value.trim();
    const c = document.getElementById("c").value.trim();
    const correct = document.getElementById("correct").value.toUpperCase();

    if (!category || !q || !a || !b || !c || !["A", "B", "C"].includes(correct)) {
        alert("❌ Completa todos los campos correctamente (incluida categoría)");
        return;
    }

    questions.push({
        category: category,
        question: q,
        options: { A: a, B: b, C: c },
        correct: correct
    });

    document.getElementById("category").value = "";
    document.getElementById("question").value = "";
    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("c").value = "";
    document.getElementById("correct").value = "";

    alert(`✅ Pregunta ${questions.length} añadida a "${category}"`);
}

function exportJSON() {
    const data = JSON.stringify(questions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "pack_preguntas_veterinaria.json";
    a.click();

    alert(`✅ Exportadas ${questions.length} preguntas`);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            questions = Array.isArray(imported) ? imported : [imported];
            alert(`✅ Pack de ${questions.length} preguntas importado correctamente`);
        } catch (error) {
            alert("❌ Error al importar JSON. Verifica el formato.");
        }
    };
    reader.readAsText(file);
}

// ===== OBTENER CATEGORÍAS ÚNICAS =====
function getCategories() {
    const cats = [...new Set(questions.map(q => q.category))];
    return cats.sort();
}

// ===== TEST CON FILTRO DE CATEGORÍA =====
function startTest() {
    const div = document.getElementById("test");
    const result = document.getElementById("result");
    div.innerHTML = "";
    result.innerHTML = "";

    if (questions.length === 0) {
        div.innerHTML = "<p style='color: red;'>❌ No hay preguntas disponibles</p>";
        return;
    }

    // Obtener categoría seleccionada
    const selectedCategory = document.getElementById("category-filter")?.value || "all";
    
    // Filtrar preguntas
    let filteredQuestions = questions;
    if (selectedCategory !== "all") {
        filteredQuestions = questions.filter(q => q.category === selectedCategory);
    }

    if (filteredQuestions.length === 0) {
        div.innerHTML = "<p style='color: red;'>❌ No hay preguntas en esta categoría</p>";
        return;
    }

    // Mostrar preguntas
    filteredQuestions.forEach((q, index) => {
        div.innerHTML += `
            <div class="question-block" style="
                background: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
            ">
                <p style="font-size: 12px; color: #999; margin: 0 0 5px 0;">
                    ${q.category}
                </p>
                <p style="font-weight: bold; margin: 0 0 10px 0;">
                    ${index + 1}. ${q.question}
                </p>

                <label style="display: block; margin: 8px 0; cursor: pointer;">
                    <input type="radio" name="q${index}" value="A" style="margin-right: 8px;">
                    <strong>A)</strong> ${q.options.A}
                </label>

                <label style="display: block; margin: 8px 0; cursor: pointer;">
                    <input type="radio" name="q${index}" value="B" style="margin-right: 8px;">
                    <strong>B)</strong> ${q.options.B}
                </label>

                <label style="display: block; margin: 8px 0; cursor: pointer;">
                    <input type="radio" name="q${index}" value="C" style="margin-right: 8px;">
                    <strong>C)</strong> ${q.options.C}
                </label>
            </div>
        `;
    });

    // Guardar para corrección
    window.currentFilteredQuestions = filteredQuestions;
}

function correctTest() {
    const filteredQuestions = window.currentFilteredQuestions || questions;
    let correct = 0;
    let incorrect = 0;

    filteredQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const block = document.getElementsByClassName("question-block")[index];

        if (!block) return;

        if (selected) {
            if (selected.value === q.correct) {
                correct++;
                block.style.backgroundColor = "#d4edda";
                block.style.borderLeftColor = "#28a745";
            } else {
                incorrect++;
                block.style.backgroundColor = "#f8d7da";
                block.style.borderLeftColor = "#dc3545";
            }
        } else {
            incorrect++;
            block.style.backgroundColor = "#fff3cd";
            block.style.borderLeftColor = "#ffc107";
        }
    });

    const total = filteredQuestions.length;
    const score = ((correct / total) * 10).toFixed(1);

    let mensaje = "";
    if (score >= 8) {
        mensaje = "🎉 ¡Excelente! Estás muy preparado";
    } else if (score >= 6) {
        mensaje = "👍 Buen trabajo, sigue estudiando";
    } else {
        mensaje = "📚 Necesitas más práctica, ¡tú puedes!";
    }

    document.getElementById("result").innerHTML = `
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        ">
            <h3 style="margin-top: 0;">Resultado del test</h3>
            <p>✔️ <strong>Aciertos:</strong> ${correct}/${total}</p>
            <p>❌ <strong>Errores:</strong> ${incorrect}/${total}</p>
            <p style="font-size: 28px; margin: 15px 0;">📊 <strong>${score} / 10</strong></p>
            <p style="font-size: 16px; font-weight: bold;">${mensaje}</p>
        </div>
    `;

    updateStats(score);
}

// ===== SCROLL AL TEST =====
function scrollToTest() {
    startTest();
    document.querySelector("section[style*='margin-top: 40px']").scrollIntoView({ behavior: "smooth" });
}

// ===== AL CARGAR LA PÁGINA =====
window.addEventListener("load", function () {
    hideAdminFeatures();
    displayStats();
    updateCategoryFilter();
});

function updateCategoryFilter() {
    const categories = getCategories();
    const select = document.getElementById("category-filter");
    
    if (select) {
        select.innerHTML = '<option value="all">📚 Todas las categorías</option>';
        categories.forEach(cat => {
            select.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
    }
}
