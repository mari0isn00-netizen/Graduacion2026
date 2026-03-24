// admin.js - Lógica del admin
const socket = io();

const registerSection = document.getElementById('register-section');
const controlPanel = document.getElementById('control-panel');
const nameInput = document.getElementById('admin-name');
const registerBtn = document.getElementById('admin-register-btn');

registerBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || 'Admin';
    socket.emit('register-player', { name, type: 'admin' });
    registerSection.classList.add('hidden');
    controlPanel.classList.remove('hidden');
});

socket.on('game-state-update', (state) => {
    const playersList = document.getElementById('admin-players-list');
    const countEl = document.getElementById('admin-players-count');
    
    playersList.innerHTML = '';
    (state.players || []).forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.name;
        playersList.appendChild(li);
    });
    countEl.textContent = (state.players || []).length;
});
