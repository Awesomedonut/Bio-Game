import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Player } from './classes/Player';
import { Position } from './interfaces/Position';
import { Velocity } from './interfaces/Velocity';

export function initializeSocketIO(server: HttpServer):void {
    const players: Player[] = [];

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST", "DELETE", "UPDATE"]
        }
    });

    io.on('connection', (socket: Socket) => {
        // Add player to the array upon connection
        console.log(`A user connected with ID: ${socket.id}`);
        createPlayer(socket.id);
        console.log(players);

        // Tell frontend about changes
        io.emit('updatePlayers', players);

        // Removes player from the array when disconnected
        socket.on('disconnect', () => {
            console.log(`User with ID ${socket.id} disconnected`);
            deletePlayer(socket.id);
            console.log(players);
            io.emit('updatePlayers', players);
        })
    })

    // helper function to create a player and add it to the players array
    function createPlayer(id: string) {
        let player = new Player({
            id: id,
            position: {
                x: 500 * Math.random(),
                y: 500 * Math.random(),
            },
            velocity: {x: 0, y: 0},
            hp: 1
        })
        players.push(player);
    }

    // helper function to delete a player from the players array
    function deletePlayer(id: string) {
        let index = players.findIndex(player => player.id === id);
        if (index !== -1) {
            players.splice(index, 1);
        }
    }
}