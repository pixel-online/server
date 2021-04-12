const corsOrigin = process.env?.MODE === 'dev' ? "http://0.0.0.0:3000" : 'https://pixel-online.netlify.app';
const PORT = process.env?.MODE === 'dev' ? 8080 : 80;

const express = require('express');

const socketIO = require("socket.io")
//(
//   PORT, {
//   cors: {
//     origin: corsOrigin,
//     methods: ["GET", "POST", "OPTIONS"]
//   },
// }
//);

const MAX_PLAYER_ROOM = 2;
let players = [];

const server = express()
  //.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  if (players.length < MAX_PLAYER_ROOM) {
    console.log('Demande de connection utilisateur: ', socket.id);
    players.push({
      id: socket.id,
      name: socket.handshake.query.name,
      x: 0,
      y: 0,
    })

    // On ajoute le joueur à la partie
    socket.broadcast.emit("connectUser", {
      id: socket.id,
      name: socket.handshake.query.name,
    });

    if (players.length > 1) {
      const player = players[0];
      socket.emit("connectUser", {
        id: player.id,
        name: player.name,
      });
    }
    

  } else {
    // Forcer la déconnection du joueur
    console.log('Connection utilisateur refusé: ', socket.id);
    socket.disconnect()
  }

  socket.on('playerMove', ({ direction, id }) => {
    socket.broadcast.emit("playerMove", { direction, id });
    socket.emit("playerMove", { direction, id });
    // Envoi à tout les autre joueurs, le déplacement du joueur
  });

  socket.on('updateMove', ({x, y}) => {
    console.log('updateMove');
    socket.broadcast.emit("updateMove", { x, y, id: socket.id });
  });

  
  socket.on('disconnecting', function(direction: any) {
    console.log('Deconnection de l\'utilisateur: ', socket.id);
    const index = players.findIndex((player) => player.id === socket.id)
    if (index) {
      players.splice(index, 1)
      socket.broadcast.emit("deconnectUser", socket.id);
    }
  });
  socket.on("playerMove", function(direction: any) {
    console.log(direction);
  });
});


