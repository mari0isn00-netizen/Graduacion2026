// tv.js - Lógica completa de la TV
const socket = io();

// Registrar la TV
socket.emit('register-player', { name: 'TV', type: 'tv' });

// Generar QR
function generateQR() {
    const qrWrapper = document.getElementById('qr-wrapper');
    const host = window.location.hostname;
    const port = window.location.port;
    const playerUrl = \https://\System.Management.Automation.Internal.Host.InternalHost:\/player\;
    
    const qrImg = document.createElement('img');
    qrImg.src = \https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=\\;
    qrImg.alt = 'QR para unirse';
    qrImg.className = 'qr-code-img';
    qrWrapper.innerHTML = '';
    qrWrapper.appendChild(qrImg);
}

// Renderizar jugadores
function renderPlayers(players) {
    const list = document.getElementById('players-list');
    const count = document.getElementById('players-count');
    
    list.innerHTML = '';
    players.forEach(p => {
        const li = document.createElement('li');
        li.className = 'player-item';
        li.textContent = \\\;
        list.appendChild(li);
    });
    count.textContent = players.length;
}

// Renderizar marcador
function renderScoreboard(scores) {
    const tbody = document.querySelector('#global-scoreboard tbody');
    tbody.innerHTML = '';
    
    Object.entries(scores).forEach(([playerId, pts]) => {
        const player = window.currentPlayers?.find(p => p.id === playerId);
        const name = player ? player.name : '???';
        const tr = document.createElement('tr');
        tr.innerHTML = \<td>\</td><td>\</td>\;
        tbody.appendChild(tr);
    });
}

// Actualizar fase del juego
function renderPhase(phase) {
    const phaseEl = document.querySelector('#game-phase span');
    phaseEl.textContent = phase;
}

// Escuchar actualizaciones del servidor
socket.on('game-state-update', (state) => {
    window.currentPlayers = state.players;
    renderPlayers(state.players);
    renderScoreboard(state.scores || {});
    renderPhase(state.gamePhase || 'Lobby');
});

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    generateQR();
    
    // Reconexión
    socket.io.on('reconnect', () => {
        socket.emit('register-player', { name: 'TV', type: 'tv' });
    });
});
