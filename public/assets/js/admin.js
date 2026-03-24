/* admin.js – Lógica del panel de administrador */
(() => {
  const socket = io();

  // UI ELEMENTS
  const registerSection = document.getElementById('register-section');
  const controlPanel    = document.getElementById('control-panel');
  const nameInput       = document.getElementById('admin-name');
  const registerBtn     = document.getElementById('admin-register-btn');
  const playersListEl   = document.getElementById('admin-players-list');
  const playersCountEl  = document.getElementById('admin-players-count');
  const team1List       = document.querySelector('#team-1 .team-list');
  const team2List       = document.querySelector('#team-2 .team-list');
  const autoAssignBtn   = document.getElementById('auto-assign-btn');
  const gameSelect      = document.getElementById('game-select');
  const startGameBtn    = document.getElementById('start-game-btn');
  const eventLog        = document.getElementById('event-log');

  // -------------------------------------------------
  // Registro del admin
  // -------------------------------------------------
  registerBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || 'Admin';
    socket.emit('register-player', { name, type: 'admin' });
    registerSection.classList.add('hidden');
    controlPanel.classList.remove('hidden');
    log(`✍️ Registrado como "${name}"`);
  });

  // -------------------------------------------------
  // Funciones UI auxiliares
  // -------------------------------------------------
  function renderPlayers(players) {
    playersListEl.innerHTML = '';
    players.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} ${p.connected ? '' : '(desconectado)'}`;
      li.dataset.id = p.id;
      playersListEl.appendChild(li);
    });
    playersCountEl.textContent = players.length;
  }

  function renderTeam(teamArray, listEl) {
    listEl.innerHTML = '';
    teamArray.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p.name;
      listEl.appendChild(li);
    });
  }

  function log(message) {
    const li = document.createElement('li');
    li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    eventLog.appendChild(li);
    eventLog.scrollTop = eventLog.scrollHeight;
  }

  // -------------------------------------------------
  // Recepción de estado global del servidor
  // -------------------------------------------------
  socket.on('game-state-update', (state) => {
    // Guardamos jugadores globalmente
    window.currentPlayers = state.players;

    // Renderizamos la lista de jugadores
    renderPlayers(state.players);

    // Renderizamos los equipos (si existen)
    if (state.teams) {
      const t1 = state.teams.team1 || [];
      const t2 = state.teams.team2 || [];
      renderTeam(t1, team1List);
      renderTeam(t2, team2List);
    }
  });

  // -------------------------------------------------
  // Auto‑asignar equipos aleatoriamente (2vs2)
  // -------------------------------------------------
  autoAssignBtn.addEventListener('click', () => {
    const players = window.currentPlayers.filter(p => p.id !== socket.id);
    if (players.length < 4) {
      alert('Necesitamos al menos 4 jugadores para formar 2 vs 2.');
      return;
    }
    // Barajar
    const shuffled = players.sort(() => Math.random() - 0.5);
    const team1 = shuffled.slice(0, 2);
    const team2 = shuffled.slice(2, 4);
    socket.emit('admin-set-teams', { team1: team1.map(p => p.id), team2: team2.map(p => p.id) });
    log('🔀 Equipos asignados aleatoriamente');
  });

  // -------------------------------------------------
  // Iniciar juego seleccionado
  // -------------------------------------------------
  startGameBtn.addEventListener('click', () => {
    const game = gameSelect.value;
    if (!game) {
      alert('Selecciona un juego antes de iniciar.');
      return;
    }
    socket.emit('admin-start-game', { game });
    log(`🚦 Juego "${game}" iniciado`);
  });

  // -------------------------------------------------
  // Evento de confirmación de servidor (ej. start ok)
  // -------------------------------------------------
  socket.on('admin-action-result', ({ success, message }) => {
    log(success ? `✅ ${message}` : `❌ ${message}`);
  });

  // -------------------------------------------------
  // Reconexión
  // -------------------------------------------------
  socket.io.on('reconnect', () => {
    // Si el admin vuelve a conectarse, enviamos su nombre otra vez
    const name = nameInput.value.trim() || 'Admin';
    socket.emit('register-player', { name, type: 'admin' });
  });
})();
