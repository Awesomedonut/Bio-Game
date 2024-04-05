import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { MultiplayerPlayer } from './classes/MultiplayerPlayer';
import { Position } from './interfaces/Position';
import { Velocity } from './interfaces/Velocity';
import { Enemy } from './classes/Enemy';
import { SpawnLocation } from './interfaces/SpawnLocation';

export function initializeSocketIO(server: HttpServer):void {
    const SPEED = 3;
    let maxScreenWidth = 0;
    let maxScreenHeight = 0;
    
    const backendPlayers: {[id: string]: MultiplayerPlayer} = {};
    const backendEnemies: Enemy[] = [];

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
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
            updateScreenDimensions(width, height);
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
        moveEnemies();
        io.emit('updateEnemies', backendEnemies);
    }, 15);

    // Spawn an enmey every 3 seconds if there are players in the game
    setInterval(() => {
        let activePlayers: boolean = Object.keys(backendPlayers).length > 0;
        if (activePlayers) {
            createEnemy();
            io.emit('updateEnemies', backendEnemies);
        }
    }, 3000);

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

    // helper function to keep track of the maximum screen dimensions
    // usefull for spawning enemies
    function updateScreenDimensions(width: number, height: number) {
        if (width > maxScreenWidth) {
            maxScreenWidth = width;
        }
        if (height > maxScreenHeight) {
            maxScreenHeight = height;
        }
    }

    // helper function to create an enemy with random stats
    function createEnemy() {
        let position: Position;
        let velocity: Velocity;
        let radius = 50 * Math.random() + 10;
        let speed = Math.floor(10 * Math.random() + 3);
        let location: SpawnLocation = Math.floor(Math.random() * 3);

        switch (location) {
            case SpawnLocation.Top:
                position = {
                    x: Math.random() * maxScreenWidth,
                    y: 0 - radius
                }
                velocity = {
                    x: 0,
                    y: speed
                }
                break;
            case SpawnLocation.Bottom:
                position = {
                    x: Math.random() * maxScreenWidth,
                    y: maxScreenHeight + radius
                }
                velocity = {
                    x: 0 - radius,
                    y: -speed
                }
                break;        
            case SpawnLocation.Left:
                position = {
                    x: 0 - radius,
                    y: Math.random()* maxScreenHeight
                }
                velocity = {
                    x: speed,
                    y: 0
                }
                break;   
            case SpawnLocation.Right:
                position = {
                    x: maxScreenWidth + radius,
                    y: Math.random()* maxScreenHeight
                }
                velocity = {
                    x: -speed,
                    y: 0
                }
                break; 
        }

        let enemy = new Enemy({
            position: position,
            velocity: velocity,
            radius: radius
        })
        
        backendEnemies.push(enemy);
    }

    // helper function to move enemies position
    function moveEnemies() {
        let enemy: Enemy;
        for(let i=0; i<backendEnemies.length; i++) {
            enemy = backendEnemies[i];
            enemy.move();
        }
    }
}