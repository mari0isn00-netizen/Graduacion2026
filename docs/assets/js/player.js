/* player.js – Lógica del cliente jugador */
(() => {
  const socket = io();

  // UI
  const registerSection = document.getElementById('register-section');
  const gameArea        = document.getElementById('game-area');
  const nameInput       = document.getElementById('player-name');
  const registerBtn     = document.getElementById('player-register-btn');
  const gameTitle       = document.getElementById('current-game-title');
  const gameBody        = document.getElementById('game-body');
  const hpSpan          = document.getElementById('player-hp');
  const teamSpan        = document.getElementById('player-team');

  // Registro del jugador
  registerBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || `Invitado-${Math.floor(Math.random()*1000)}`;
    socket.emit('register-player', { name, type: 'player' });
    registerSection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    // Guardamos nombre localmente para usar en logs
    window.myName = name;
  });

  // -------------------------------------------------
  // Recepción de datos del servidor (estado propio y global)
  // -------------------------------------------------
  socket.on('player-update', (data) => {
    // data contiene: yourId, yourName, yourScore, currentGame, gamePhase, ... (puedes ampliarlo)
    hpSpan.textContent = data.yourScore !== undefined ? data.yourScore : '?';
    // Por ahora, 'yourScore' lo usamos como HP (se adaptará a cada juego)
  });

  // -------------------------------------------------
  // Estado global (útil para todos los juegos)
  // -------------------------------------------------
  socket.on('game-state-update', (state) => {
    // Estado del juego (gamePhase, currentGame, players, etc.)
    const game = state.currentGame || '';
    gameTitle.textContent = game ? `Juego: ${prettyGameName(game)}` : 'Esperando al admin…';
    // Si el juego cambió, limpiamos el cuerpo y dejamos que el módulo del juego lo rellene
    if (game && game !== window.activeGame) {
      gameBody.innerHTML = '';            // vaciar
      window.activeGame = game;
      loadGameModule(game);
    }
  });

  /* -------------------------------------------------
   * CARGAR MÓDULO DE JUEGO DINÁMICO (placeholder)
   * ------------------------------------------------- */
  function loadGameModule(gameKey) {
    // En esta fase solo vamos a crear placeholders muy simples.
    // Más adelante, cada juego tendrá su propio archivo JS en /public/juegos/XYZ.js
    switch (gameKey) {
      case 'musica-stop':
        gameBody.innerHTML = `
          <p class="center">🎧 La música está sonando… cuando pare, mantente quieto.</p>
          <button id="buzz-btn" class="big-btn">¡Buzz!</button>`;
        document.getElementById('buzz-btn').addEventListener('click', () => {
          socket.emit('player-action', { game: 'musica-stop', action: 'buzz' });
        });
        break;

      case 'la-bomba':
        gameBody.innerHTML = `
          <p class="center">💣 Tienes la bomba. Escribe una palabra con la sílaba <strong id="bomb-syllable">...</strong></p>
          <input type="text" id="bomb-input" placeholder="Tu palabra" class="big-input" />
          <button id="bomb-submit" class="big-btn">Enviar</button>`;
        document.getElementById('bomb-submit').addEventListener('click', () => {
          const word = document.getElementById('bomb-input').value.trim();
          socket.emit('player-action', { game: 'la-bomba', action: 'answer', word });
        });
        break;

      // Otros juegos irán aquí…
      default:
        gameBody.innerHTML = `<p class="center">⚙️ Próximamente: <em>${prettyGameName(gameKey)}</em></p>`;
    }
  }

  function prettyGameName(key) {
    const map = {
      'musica-stop': 'Música y Stop',
      'la-bomba': 'La Bomba',
      'undercover': 'Undercover',
      'quien-lo-dijo': '¿Quién lo dijo?',
      'esconder-objeto': 'Esconder Objeto',
      'telefono-roto': 'Teléfono Roto',
      'escondite-extremo': 'Escondite Extremo',
      'soga-digital': 'Soga Digital'
    };
    return map[key] || key;
  }

  // -------------------------------------------------
  // Reconexión
  // -------------------------------------------------
  socket.io.on('reconnect', () => {
    // Si el jugador se reconecta, reenviamos su nombre (si lo tenemos)
    if (window.myName) {
      socket.emit('register-player', { name: window.myName, type: 'player' });
    }
  });
})();
