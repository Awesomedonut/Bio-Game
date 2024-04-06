import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { MultiplayerPlayer } from './classes/MultiplayerPlayer';
import { Position } from './interfaces/Position';
import { Velocity } from './interfaces/Velocity';

export function initializeSocketIO(server: HttpServer):void {
    const SPEED = 3;

    const backendPlayers: {[id: string]: MultiplayerPlayer} = {};

    const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com/";

    const io = new Server(server, {
        cors: {
            origin: backendUri,
            methods: ["GET", "POST", "DELETE", "UPDATE"]
        },
        pingInterval: 2000,
        pingTimeout: 5000
    });

    io.on('connection', (socket: Socket) => {
        console.log(`A user connected with ID: ${socket.id}`);

        // Add player to the array upon joining the game
        socket.on('join', ({width, height}) => {
            console.log(`A user joined the game!`);
            createPlayer(socket.id, width, height);
            console.log(backendPlayers);
            io.emit('updatePlayers', backendPlayers);
        });

        // Removes player from the array when disconnected
        socket.on('disconnect', (reason) => {
            console.log(`User with ID ${socket.id} disconnected due to: ${reason}`);
            deletePlayer(socket.id);
            console.log(backendPlayers);
            io.emit('updatePlayers', backendPlayers);
        })

        // Respond to player movement
        socket.on('keydown', ({keycode, sequenceNumber}) => {
            let player = backendPlayers[socket.id];
            if (!player) return;
            
            player.sequenceNumber = sequenceNumber;
            switch(keycode) {
                case 'KeyW':
                    backendPlayers[socket.id].position.y -= SPEED;
                    break;
                case 'KeyA':
                    backendPlayers[socket.id].position.x -= SPEED;
                    break;
                case 'KeyS':
                    backendPlayers[socket.id].position.y += SPEED;
                    break;
                case 'KeyD':
                    backendPlayers[socket.id].position.x += SPEED;
            }
        })
    })
    
    // backend tic rate to give users ~66fps
    setInterval(() => {
        io.emit('updatePlayers', backendPlayers);
    }, 15);

    // helper function to create a player on a random spot and add it to the players array
    function createPlayer(socketID: string, width: number, height: number) {
        let player = new MultiplayerPlayer({
                id: socketID,
                position: {
                    x: width / 2,
                    y: height / 2
                }
        })
        backendPlayers[socketID] = player;
    }

    // helper function to delete a player from the players array
    function deletePlayer(id: string) {
        delete backendPlayers[id];
    }
}