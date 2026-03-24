// admin.js - Lógica básica del admin
const socket = io();
const registerBtn = document.getElementById('admin-register-btn');
registerBtn.addEventListener('click', () => {
  const name = document.getElementById('admin-name').value.trim() || 'Admin';
  socket.emit('register-player', { name, type: 'admin' });
  document.getElementById('register-section').classList.add('hidden');
  document.getElementById('control-panel').classList.remove('hidden');
});

socket.on('game-state-update', (state) => {
  const list = document.getElementById('admin-players-list');
  list.innerHTML = '';
  (state.players || []).forEach(p => {
    const li = document.createElement('li');
    li.textContent = \\\;
    list.appendChild(li);
  });
  document.getElementById('admin-players-count').textContent = (state.players || []).length;
});
