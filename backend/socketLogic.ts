import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export function initializeSocketIO(server: HttpServer):void {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST", "DELETE", "UPDATE"]
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`A user connected with ID: ${socket.id}`);
    })
}