// tv.js - Lógica básica de la TV
const socket = io();
socket.emit('register-player', { name: 'TV', type: 'tv' });

// Generar QR
const qrWrapper = document.querySelector('.qr-wrapper');
const host = location.hostname;
const port = location.port;
const playerUrl = \http://\System.Management.Automation.Internal.Host.InternalHost:\/player\;
const qrImg = document.createElement('img');
qrImg.src = \https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=\\;
qrImg.alt = 'QR para unirse';
qrImg.className = 'qr-code-img';
qrWrapper.innerHTML = '';
qrWrapper.appendChild(qrImg);

socket.on('game-state-update', (state) => {
  const list = document.getElementById('players-list');
  const count = document.getElementById('players-count');
  list.innerHTML = '';
  (state.players || []).forEach(p => {
    const li = document.createElement('li');
    li.textContent = \\\;
    list.appendChild(li);
  });
  count.textContent = (state.players || []).length;
});
