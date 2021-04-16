import {Server as IOServer} from "socket.io"

const corsOrigin = process.env?.MODE === 'dev' ? "http://0.0.0.0:8000" : 'https://pixel-online.netlify.app';
const PORT: number = parseInt(process.env.PORT, 10) || 8080;

class Server {
	private _io: IOServer;

	constructor() {
		this._io = new IOServer(
			{
				cors: {
					origin: corsOrigin,
					methods: ["GET", "POST", "OPTIONS"]
				},
			}
			);
			this._io.listen(PORT)
	}

	public getServer(): IOServer {
		return this._io;
	}
}

export default Server;