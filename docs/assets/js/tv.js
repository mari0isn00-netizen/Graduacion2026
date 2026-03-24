/* tv.js – Lógica cliente para la vista TV */
(() => {
  const socket = io();

  // 1️⃣ Registramos la TV al conectarse
  socket.emit('register-player', { name: 'TV', type: 'tv' });

  // 2️⃣ Generamos QR que apunta a la ruta /player con el mismo host/puerto
  const qrWrapper = document.getElementById('qr-wrapper');
  const host = location.hostname;
  const port = location.port;
  const playerUrl = `http://${host}:${port}/player`;

  // Usamos la API pública de QRServer (es gratis y sin CORS)
  const qrImg = document.createElement('img');
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(playerUrl)}`;
  qrImg.alt = 'QR para unirse';
  qrImg.className = 'qr-code-img';
  qrWrapper.innerHTML = '';
  qrWrapper.appendChild(qrImg);

  // 3️⃣ Función para refrescar la lista de jugadores
  function renderPlayers(players) {
    const list = document.getElementById('players-list');
    const count = document.getElementById('players-count');
    list.innerHTML = '';
    players.forEach(p => {
      const li = document.createElement('li');
      li.className = 'player-item';
      li.textContent = `${p.name} ${p.connected ? '' : '(desconectado)'}`;
      list.appendChild(li);
    });
    count.textContent = players.length;
  }

  // 4️⃣ Render scoreboard global
  function renderScoreboard(scores) {
    const tbody = document.querySelector('#global-scoreboard tbody');
    tbody.innerHTML = '';
    Object.entries(scores).forEach(([playerId, pts]) => {
      const player = window.currentPlayers?.find(p => p.id === playerId);
      const name = player ? player.name : '???';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${name}</td><td>${pts}</td>`;
      tbody.appendChild(tr);
    });
  }

  // 5️⃣ Actualizamos fase del juego
  function renderPhase(phase) {
    const phaseEl = document.querySelector('#game-phase span');
    phaseEl.textContent = phase;
  }

  // 6️⃣ Escuchamos al servidor
  socket.on('game-state-update', (state) => {
    // Guardamos jugadores globalmente para usar en scoreboard
    window.currentPlayers = state.players;
    renderPlayers(state.players);
    renderScoreboard(state.scores);
    renderPhase(state.gamePhase);
  });

  // 7️⃣ Manejo de reconexión sencilla
  socket.io.on('reconnect', () => {
    socket.emit('register-player', { name: 'TV', type: 'tv' });
  });
})();
