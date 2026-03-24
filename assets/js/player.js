// player.js - Lógica del jugador
const socket = io();

const registerSection = document.getElementById('register-section');
const gameArea = document.getElementById('game-area');
const nameInput = document.getElementById('player-name');
const registerBtn = document.getElementById('player-register-btn');

registerBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || \Invitado-\\;
    socket.emit('register-player', { name, type: 'player' });
    registerSection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    window.myName = name;
});

socket.on('game-state-update', (state) => {
    const gameTitle = document.getElementById('current-game-title');
    gameTitle.textContent = state.currentGame ? \Juego: \\ : 'Esperando al admin…';
});
