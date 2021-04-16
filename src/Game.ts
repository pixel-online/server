import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./config";

import Ball from "./Ball";
import Player from "./Player";
import Server from "./Server";

const MAX_PLAYER_ROOM = 2;

class Game {
	private _server: Server;
	private _players: Player[];
	private _ball: Ball;
	private _pendingStart: boolean;
	private _run: boolean;

	constructor() {
		this._initGame();
		this._log();
		this._server = new Server()
		this._on();
		setInterval(() => this._loop(), 1000/60);
	}

	private _initGame(): void {
		this._players = [];
		this._ball = new Ball(SCREEN_WIDTH/2 - 32, SCREEN_HEIGHT/2 - 32);
		this._ball.moveX('RIGHT');
		this._pendingStart = false;
		this._run = false;
	}

	private _reset(): void {
		this._initGame()
	}

	private _log(): void {
		setInterval(() => {
			console.log('--------------\nINFO SERVEUR\n--------------');
			console.log(`Nombre de joueurs connecté: ${this._players.length}`);
			this._players.map((player) => {
				console.log(`id: ${player.getId()}`);
			})
			console.log();
		}, 4000)
	}

	private _loop() {
		if (this._run || this._pendingStart) {
			// Mise à jour
			if (!this._pendingStart) {
				this._ball.update();
				// this._bonus.update();
				this._players.map(player => player.update());
			}
			this._server.getServer().emit('gameUpdate', {
				players: this._players.map(player => ({
					id: player.getId(),
					x: player.getX(),
					y: player.getY(),
					moveX: player.getMoveX(),
					moveY: player.getMoveY(),
				})),
				ball: {
					x: this._ball.getX(),
					y: this._ball.getY(),
					moveX: this._ball.getMoveX(),
					moveY: this._ball.getMoveY(),
				},
			});
		}
	}

	private _on(): void {
		this._server.getServer().on('connection', (socket) => {
			if (this._players.length < MAX_PLAYER_ROOM) {
				console.log('Demande de connection utilisateur: ', socket.id);
				const player = new Player()
				player.setId(socket.id)
				this._players.push(player)
		
				player.setScreenPosition(this._players.length === 1 ? 'LEFT' : 'RIGHT')
				if (player.getScreenPosition() === 'LEFT') {
					player.setX(32)
					player.setY(384-32)
				} else if (player.getScreenPosition() === 'RIGHT') {
					player.setX(1190)
					player.setY(384-32)
				}
				// On ajoute le joueur à la partie
				socket.broadcast.emit("connectUser", {
					id: socket.id,
					name: socket.handshake.query.name,
					position: player.getScreenPosition()
				});

		
				if (this._players.length > 1) {
					const player = this._players[0];
					socket.emit("connectUser", {
						id: player.getId(),
						position: player.getScreenPosition()
					});
					this._pendingStart = true;
					setTimeout(() => {
						this._pendingStart = false;
						this._run = true;
					}, 3000);
					this._server.getServer().emit("startGame")
				}
				
		
			} else {
				// Forcer la déconnection du joueur
				console.log('Connection utilisateur refusé: ', socket.id);
				socket.disconnect()
			}
		
			socket.on('playerMove', ({ direction, id }) => {
				const player = this._players.find((player) => player.getId() === socket.id)
				if (player) {
					if (
						direction === 'TOP' ||
						direction === 'BOTTOM' ||
						direction === 'STOP_TOP' ||
						direction === 'STOP_BOTTOM'
					) {
						player.moveY(direction)
					} else {
						player.moveX(direction)
					}
				}
			});
		
			socket.on('updateMove', ({x, y}) => {
				socket.broadcast.emit("updateMove", { x, y, id: socket.id });
			});
		
			
			socket.on('disconnecting', (direction: any) => {
				console.log('Deconnection de l\'utilisateur: ', socket.id);
				const index = this._players.findIndex((player) => player.getId() === socket.id)
				if (index) {
					this._players.splice(index, 1)
					socket.broadcast.emit("deconnectUser", socket.id);
					this._reset()
				}
			});
		});
	}
}

export default Game;