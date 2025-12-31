let questions = [
    {
        question: "¿Qué normativa regula los controles oficiales en materia de seguridad alimentaria?",
        options: { A: "Reglamento (CE) 852/2004", B: "Reglamento (UE) 2017/625", C: "Ley 8/2003" },
        correct: "B"
    },
    {
        question: "¿Cuál es la autoridad competente en sanidad animal en España?",
        options: { A: "Ministerio de Sanidad", B: "Ministerio de Agricultura", C: "AESA" },
        correct: "B"
    },
    {
        question: "¿Qué ley establece la base de la sanidad animal en España?",
        options: { A: "Ley 8/2003", B: "Ley 14/1986", C: "Reglamento 178/2002" },
        correct: "A"
    },
    {
        question: "¿Qué reglamento fija los principios generales de la legislación alimentaria?",
        options: { A: "2017/625", B: "852/2004", C: "178/2002" },
        correct: "C"
    },
    {
        question: "¿Qué administración ejecuta los controles en Castilla-La Mancha?",
        options: { A: "AESA", B: "Junta de Comunidades", C: "Ministerio" },
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

    alert("Pregunta añadida");
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

    reader.onload = function(e) {
        questions = JSON.parse(e.target.result);
        alert("Pack importado correctamente");
    };

    reader.readAsText(file);
}

function startTest() {
    const div = document.getElementById("test");
    div.innerHTML = "";

    questions.forEach((q, index) => {
        div.innerHTML += `
            <p><strong>${index + 1}. ${q.question}</strong></p>
            <p>A) ${q.options.A}</p>
            <p>B) ${q.options.B}</p>
            <p>C) ${q.options.C}</p>
            <hr>
        `;
    });
}
