// ===== SISTEMA DE ACCESO ADMIN =====
// CONTRASEÑA VISIBLE EN GITHUB (segura)
const ADMIN_PASSWORD = "admin123";
// TU CONTRASEÑA REAL: supervet2026
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
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
            <h2 style="margin: 0 0 10px 0; font-size: 20px;">
                📊 Estadísticas en vivo
            </h2>

            <!-- MENCIÓN DE TRANSPARENCIA RGPD -->
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

// ===== RESTO DEL CÓDIGO =====
// (sin cambios respecto al original)

// ===== AL CARGAR LA PÁGINA =====
window.addEventListener("load", function () {
    hideAdminFeatures();
    displayStats();
    updateCategoryFilter();
});
