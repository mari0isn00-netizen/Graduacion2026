// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Configuración básica
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Puerto
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Estado global del juego
let gameState = {
  players: {},           // { playerId: { name, score, team, ... } }
  currentPlayerId: null, // ID del jugador actual en turno
  currentGame: null,     // Juego activo
  gamePhase: 'lobby',    // lobby, playing, finished
  scores: {},            // Puntuaciones globales
  teams: { team1: [], team2: [] }, // Equipos
  adminId: null,         // ID del admin
};

// Juegos disponibles
const GAMES = [
  'musica-stop',
  'la-bomba', 
  'undercover',
  'quien-lo-dijo',
  'esconder-objeto',
  'telefono-roto',
  'escondite-extremo',
  'soga-digital'
];

// Conexión de sockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Registro de jugador
  socket.on('register-player', (data) => {
    const { name, type } = data; // type: 'player', 'admin', 'tv'
    
    if (type === 'admin') {
      gameState.adminId = socket.id;
      socket.join('admin');
      console.log('Admin registrado:', name);
    } else if (type === 'tv') {
      socket.join('tv');
      console.log('TV conectada');
    } else {
      // Registro de jugador normal
      gameState.players[socket.id] = {
        id: socket.id,
        name: name,
        score: 0,
        connected: true,
        gameId: null
      };
      
      socket.join('players');
      console.log('Jugador registrado:', name);
    }

    // Emitir estado actualizado a todos
    emitGameState();
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    // Remover jugador del estado
    if (gameState.players[socket.id]) {
      delete gameState.players[socket.id];
      emitGameState();
    }
    
    // Si era admin, resetear
    if (gameState.adminId === socket.id) {
      gameState.adminId = null;
    }
  });

  // Eventos específicos de juegos irán aquí...
});

// Función para emitir el estado del juego a todos los clientes relevantes
function emitGameState() {
  // Emitir a TV
  io.to('tv').emit('game-state-update', {
    players: Object.values(gameState.players),
    currentGame: gameState.currentGame,
    gamePhase: gameState.gamePhase,
    scores: gameState.scores
  });

  // Emitir a admin
  if (gameState.adminId) {
    io.to(gameState.adminId).emit('game-state-update', gameState);
  }

  // Emitir a jugadores individuales (si necesario)
  Object.keys(gameState.players).forEach(playerId => {
    const player = gameState.players[playerId];
    io.to(playerId).emit('player-update', {
      yourId: playerId,
      yourName: player.name,
      yourScore: player.score,
      currentGame: gameState.currentGame,
      gamePhase: gameState.gamePhase
    });
  });
}

// Rutas básicas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tv', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tv', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.get('/player', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player', 'index.html'));
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📱 TV: http://TU_IP_LOCAL:${PORT}/tv`);
  console.log(`👑 Admin: http://TU_IP_LOCAL:${PORT}/admin`);
  console.log(`🎮 Jugador: http://TU_IP_LOCAL:${PORT}/player`);
});

// Exportar para testing o expansión futura
module.exports = { app, server, io, gameState };
