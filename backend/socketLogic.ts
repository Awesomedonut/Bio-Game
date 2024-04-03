import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
// import { Player } from './classes/Player';
import { Player2 } from './classes/Player2';
import { Position } from './interfaces/Position';
import { Velocity } from './interfaces/Velocity';

export function initializeSocketIO(server: HttpServer):void {
    const SPEED = 3
    const ROTATIONAL_SPEED = 0.05
    const FRICTION = 0.97
    const PROJECTILE_SPEED = 3

    const backendPlayers: {[id: string]: Player2} = {};

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST", "DELETE", "UPDATE"]
        },
        pingInterval: 2000,
        pingTimeout: 5000
    });

    io.on('connection', (socket: Socket) => {
        // Add player to the array upon connection
        console.log(`A user connected with ID: ${socket.id}`);
        createPlayer(socket.id);
        console.log(backendPlayers);

        // Tell frontend about changes
        io.emit('updatePlayers', backendPlayers);

        // Removes player from the array when disconnected
        socket.on('disconnect', (reason) => {
            console.log(`User with ID ${socket.id} disconnected due to: ${reason}`);
            deletePlayer(socket.id);
            console.log(backendPlayers);
            io.emit('updatePlayers', backendPlayers);
        })

        // Respond to player movement
        socket.on('keydown', ( keycode, sequenceNumber )  => {
            // let player = backendPlayers[socket.id];
            // if (!player) return;
            
            // player.sequenceNumber = sequenceNumber;
            // switch (keycode) {
            //     case 'KeyW':
            //         // console.log(`Player ${socket.id} pressed W`)
            //         player.velocity.x = Math.cos(player.angle) * SPEED;
            //         player.velocity.y = Math.sin(player.angle) * SPEED;
            //         player.position.x += player.velocity.x;
            //         player.position.y += player.velocity.y;
            //         break;
            //     case 'KeyA':
            //         // console.log(`Player ${socket.id} pressed A`)
            //         player.angle += ROTATIONAL_SPEED;
            //         break;
            //     case 'KeyD':
            //     //     console.log(`Player ${socket.id} pressed D`)
            //         player.angle -= ROTATIONAL_SPEED;
            //         break;
            // }
            // // console.log(backendPlayers);
        })
    })
    
    // backend tic rate to give us 66fps
    // setInterval(() => {
    //     io.emit('updatePlayers', backendPlayers);
    // }, 15);

    // helper function to create a player and add it to the players array
    function createPlayer(socketID: string) {
        let player = new Player2({
                id: socketID,
                position: {
                    x: 1000 * Math.random(),
                    y: 1000 * Math.random(),
                }
        })
        backendPlayers[socketID] = player;
        // let player = new Player({
        //     id: id,
        //     position: {
        //         x: 500 * Math.random(),
        //         y: 500 * Math.random(),
        //     },
        //     velocity: {x: 0, y: 0},
        //     hp: 1
        // })
        // backendPlayers[id] = player;
    }

    // helper function to delete a player from the players array
    function deletePlayer(id: string) {
        delete backendPlayers[id];
    }
}