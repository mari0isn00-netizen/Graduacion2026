const socket = io(); // Si más tarde usas backend, cambia a io('https://<tu‑backend>.onrender.com');

/* -------------------------------------------------
   1️⃣ Register TV
   ------------------------------------------------- */
socket.emit('register-player', { name: 'TV', type: 'tv' });

/* -------------------------------------------------
   2️⃣ Generate QR (URL → https://<host>/Graduacion2026/player/)
   ------------------------------------------------- */
function generateQR() {
    const host = window.location.hostname;          // ej: mari0isn00‑netizen.github.io
    const protocol = window.location.protocol;      // https:
    const repoPath = '/Graduacion2026';            // <-- nombre del repo
    const playerUrl = ${protocol}//System.Management.Automation.Internal.Host.InternalHostC:\Users\jmmar\Desktop\Graduacion2026/player/;

    const wrapper = document.getElementById('qr-wrapper');
    const img = document.createElement('img');
    img.src = https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=;
    img.alt = 'QR para unirse';
    img.style.maxWidth = '100%';
    wrapper.innerHTML = '';
    wrapper.appendChild(img);
}
generateQR();

/* -------------------------------------------------
   3️⃣ Ticker (display a random message)
   ------------------------------------------------- */
const messages = [
    '¡Bienvenidos a SEÑAL G! – La noche más épica de la graduación',
    'Ajusta tus auriculares – la música empieza en breve',
    'Recuerda: Cada minuto cuenta, cada respuesta vale puntos',
    '👾 Cada juego es un reto: presión y risas garantizadas',
    'Si te quedas sin batería, la TV sigue encendida – ¡no te pierdas nada!'
];
function startTicker() {
    const span = document.getElementById('ticker-text');
    const txt = messages[Math.floor(Math.random()*messages.length)];
    span.textContent =   — ;
}
startTicker();

/* -------------------------------------------------
   4️⃣ Receive game updates (players, scores, phase)
   ------------------------------------------------- */
socket.on('game-state-update', (state) => {
    // ---- Players ----
    const list  = document.getElementById('players-list');
    const count = document.getElementById('players-count');
    list.innerHTML = '';
    (state.players || []).forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.name;
        list.appendChild(li);
    });
    count.textContent = (state.players || []).length;

    // ---- Scores ----
    const tbody = document.querySelector('#global-scoreboard tbody');
    tbody.innerHTML = '';
    const scores = state.scores || {};
    Object.entries(scores).forEach(([id, pts]) => {
        const player = (state.players || []).find(p => p.id === id);
        const name = player ? player.name : '???';
        const tr = document.createElement('tr');
        tr.innerHTML = <td></td><td></td>;
        tbody.appendChild(tr);
    });

    // ---- Phase ----
    const phaseSpan = document.querySelector('#game-phase span');
    phaseSpan.textContent = state.gamePhase || 'Lobby';
});
