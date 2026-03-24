// player.js - Lógica básica del jugador
const socket = io();
const registerBtn = document.getElementById('player-register-btn');
registerBtn.addEventListener('click', () => {
  const name = document.getElementById('player-name').value.trim() || \Invitado-\\;
  socket.emit('register-player', { name, type: 'player' });
  document.getElementById('register-section').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');
});

socket.on('game-state-update', (state) => {
  document.getElementById('current-game-title').textContent = 
    state.currentGame ? \Juego: \\ : 'Esperando al admin…';
});
