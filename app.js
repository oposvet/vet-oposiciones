// ===== SISTEMA DE ACCESO ADMIN =====
const ADMIN_PASSWORD = "vetoposiciones2026"; // CAMBIA ESTO

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
}

// ===== AL CARGAR LA PÁGINA =====
window.addEventListener("load", function() {
    hideAdminFeatures(); // Oculta funciones admin al inicio
});
let questions = [
    {
        question: "¿Qué normativa regula los controles oficiales en materia de seguridad alimentaria?",
        options: {
            A: "Reglamento (CE) 852/2004",
            B: "Reglamento (UE) 2017/625",
            C: "Ley 8/2003"
        },
        correct: "B"
    },
    {
        question: "¿Cuál es la autoridad competente en sanidad animal en España?",
        options: {
            A: "Ministerio de Sanidad",
            B: "Ministerio de Agricultura",
            C: "AESA"
        },
        correct: "B"
    },
    {
        question: "¿Qué ley establece la base de la sanidad animal en España?",
        options: {
            A: "Ley 8/2003",
            B: "Ley 14/1986",
            C: "Reglamento (CE) 178/2002"
        },
        correct: "A"
    },
    {
        question: "¿Qué reglamento fija los principios generales de la legislación alimentaria?",
        options: {
            A: "Reglamento (UE) 2017/625",
            B: "Reglamento (CE) 852/2004",
            C: "Reglamento (CE) 178/2002"
        },
        correct: "C"
    },
    {
        question: "¿Qué administración ejecuta los controles oficiales en Castilla-La Mancha?",
        options: {
            A: "Agencia Española de Seguridad Alimentaria",
            B: "Junta de Comunidades de Castilla-La Mancha",
            C: "Ministerio de Agricultura"
        },
        correct: "B"
    }
];

function addQuestion() {
    const q = document.getElementById("question").value;
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;
    const c = document.getElementById("c").value;
    const correct = document.getElementById("correct").value.toUpperCase();

    questions.push({
        question: q,
        options: { A: a, B: b, C: c },
        correct: correct
    });

    alert("Pregunta añadida correctamente");
}

function exportJSON() {
    const data = JSON.stringify(questions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "pack_preguntas_veterinaria.json";
    a.click();
}

function importJSON(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        questions = JSON.parse(e.target.result);
        alert("Pack de preguntas importado correctamente");
    };

    reader.readAsText(file);
}

function startTest() {
    const div = document.getElementById("test");
    const result = document.getElementById("result");
    div.innerHTML = "";
    result.innerHTML = "";

    questions.forEach((q, index) => {
        div.innerHTML += `
            <div class="question-block">
                <p><strong>${index + 1}. ${q.question}</strong></p>

                <label>
                    <input type="radio" name="q${index}" value="A">
                    A) ${q.options.A}
                </label><br>

                <label>
                    <input type="radio" name="q${index}" value="B">
                    B) ${q.options.B}
                </label><br>

                <label>
                    <input type="radio" name="q${index}" value="C">
                    C) ${q.options.C}
                </label><br>
            </div>
            <hr>
        `;
    });
}

function correctTest() {
    let correct = 0;
    let incorrect = 0;

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const block = document.getElementsByClassName("question-block")[index];

        if (selected) {
            if (selected.value === q.correct) {
                correct++;
                block.style.backgroundColor = "#d4edda";
            } else {
                incorrect++;
                block.style.backgroundColor = "#f8d7da";
            }
        } else {
            incorrect++;
            block.style.backgroundColor = "#fff3cd";
        }
    });

    const total = questions.length;
    const score = ((correct / total) * 10).toFixed(2);

    document.getElementById("result").innerHTML = `
        <h3>Resultado del test</h3>
        <p>✔️ Aciertos: ${correct}</p>
        <p>❌ Errores: ${incorrect}</p>
        <p>📊 Nota final: <strong>${score} / 10</strong></p>
    `;
}
