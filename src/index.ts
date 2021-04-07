const io = require("socket.io")(1337, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const MAX_PLAYER_ROOM = 2;
let players = [];

io.listen(3000);

io.on('connection', (socket) => {
  if (players.length < MAX_PLAYER_ROOM) {
    console.log('Demande de connection utilisateur: ', socket.id);
    players.push({
      id: socket.id,
      x: 0,
      y: 0,
    })
    // On ajoute le joueur à la partie
    
  } else {
    // Forcer la déconnection du joueur
    console.log('Connection utilisateur refusé: ', socket.id);
    socket.disconnect()
  }

  socket.on('playerMove', (direction) => {
    socket.broadcast.emit("playerMove", direction);
    // Envoi à tout les autre joueurs, le déplacement du joueur
  });
  
  socket.on('disconnecting', function(direction: any) {
    console.log('Deconnection de l\'utilisateur: ', socket.id);
    const index = players.findIndex((player) => player.id === socket.id)
    if (index) {
      players.splice(index, 1)
    }
  });
  socket.on("playerMove", function(direction: any) {
    console.log(direction);
  });
});


