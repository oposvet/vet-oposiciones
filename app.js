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
