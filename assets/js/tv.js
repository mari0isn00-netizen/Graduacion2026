/* -------------------------------------------------
   tv.js – TV screen (QR, socket, UI)
   ------------------------------------------------- */

const socket = io(); // Si utilizas un backend propio, cambia a io('https://<tu‑backend>.onrender.com');

/* -----------------------------------------------------------------
   1️⃣  Registrar la TV en el servidor
   ----------------------------------------------------------------- */
socket.emit('register-player', { name: 'TV', type: 'tv' });

/* -----------------------------------------------------------------
   2️⃣  Generar QR → apunta a la página de jugadores
   ----------------------------------------------------------------- */
function generateQR() {
  const host     = window.location.hostname;                  // ej: mari0isn00‑netizen.github.io
  const protocol = window.location.protocol;                  // https:
  const repoPath = '/Graduacion2026';                         // <-- nombre del repo
  const playerURL = `${protocol}//${host}${repoPath}/player/`;

  const wrapper = document.getElementById('qr-wrapper');
  const img = document.createElement('img');
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(playerURL)}`;
  img.alt = 'QR para unirse';
  img.style.maxWidth = '100%';
  wrapper.innerHTML = '';
  wrapper.appendChild(img);
}
generateQR();

/* -----------------------------------------------------------------
   3️⃣  Ticker – mensaje aleatorio (feel de programa)
   ----------------------------------------------------------------- */
const tickerMsgs = [
  '¡Bienvenidos a SEÑAL G! – La noche más épica de la graduación',
  'Ajusta tus auriculares – la música empieza en breve',
  'Recuerda: Cada minuto cuenta, cada respuesta vale puntos',
  '👾 Cada juego es un reto: presión y risas garantizadas',
  'Si te quedas sin batería, la TV sigue encendida – ¡no te pierdas nada!'
];
function startTicker(){
  const span = document.getElementById('ticker-text');
  const txt = tickerMsgs[Math.floor(Math.random()*tickerMsgs.length)];
  span.textContent = ` ${txt} — `;
}
startTicker();

/* -----------------------------------------------------------------
   4️⃣  Recepción de datos del servidor (players, scores, phase)
   ----------------------------------------------------------------- */
socket.on('game-state-update', state => {
  // ---- jugadores ----
  const list  = document.getElementById('players-list');
  const count = document.getElementById('players-count');
  list.innerHTML = '';
  (state.players || []).forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    list.appendChild(li);
  });
  count.textContent = (state.players || []).length;

  // ---- puntuación ----
  const tbody = document.querySelector('#global-scoreboard tbody');
  tbody.innerHTML = '';
  const scores = state.scores || {};
  Object.entries(scores).forEach(([id, pts]) => {
    const player = (state.players || []).find(p => p.id === id);
    const name = player ? player.name : '???';
    const tr = document.createElement('tr');
