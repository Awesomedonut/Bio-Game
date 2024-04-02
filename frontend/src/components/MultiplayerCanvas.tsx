import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { CanvasProps } from "../interfaces/CanvasProps";
import { Player } from '../classes/Player';
import { Position } from '../interfaces/Position';
import { Velocity } from '../interfaces/Velocity';
import { playerHit } from '../utils/collision';
import { posix } from 'path';

// establish WebSocket connection to server
const socket = io('http://localhost:4000');

const MultiplayerCanvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontendPlayers: {[id: string]: Player} = {};

    const SPEED = 3
    const ROTATIONAL_SPEED = 0.05
    const FRICTION = 0.97
    const PROJECTILE_SPEED = 3

    const keys = {
        w: {
            pressed: false,
        },
        a: {
            pressed: false,
        },
        d: {
            pressed: false,
        },
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx) {
            start(ctx, width, height);
        }

        // Listen for 'connect' event
        socket.on('connect', () => {
            console.log('Connected to server');
        })

        socket.on('updatePlayers', (backendPlayers: {[id: string]: Player}) => {
            syncData(backendPlayers);
            // console.log('frontendPlayers: ',frontendPlayers);
            console.log('Updated!');
        })

        return () => {
            socket.disconnect();
            console.log('Disconnected from server');
        }
    }, [socket])

    function start(ctx: CanvasRenderingContext2D, width: number, height: number) {
        let animationFrameID: number;

        function animate() {
            // Clear background in frame
            ctx.fillStyle = "rgb(255, 131, 122";
            ctx.fillRect(0, 0, width, height);

            // Draw the players
            for (const id in frontendPlayers) {
                frontendPlayers[id].update(ctx);
            }
            
            // Create an animation loop by requesting next frame
            animationFrameID = window.requestAnimationFrame(animate);
        }

        // Client side prediction (immediately move player)
        setInterval(() => {
            // let yourPlayer: Player = frontendPlayers[socket.id as string];
            // if (yourPlayer) {
            //     if (keys.w.pressed) {
            //         yourPlayer.velocity.x = Math.cos(yourPlayer.angle) * SPEED;
            //         yourPlayer.velocity.y = Math.sin(yourPlayer.angle) * SPEED;
            //     } else {
            //         yourPlayer.velocity.x *= FRICTION;
            //         yourPlayer.velocity.y *= FRICTION;
            //     }
    
            //     if (keys.d.pressed) {
            //         yourPlayer.angle += ROTATIONAL_SPEED;  
            //     }
    
            //     if (keys.a.pressed) {
            //         yourPlayer.angle -= ROTATIONAL_SPEED;
            //     }
            // }
        }, 15)


        // Listen for Events
        window.addEventListener('keydown', async (event) => {
            // check if player exists
        if (!frontendPlayers.hasOwnProperty(socket.id as string)) return;

            // let player = frontendPlayers[index];
            switch (event.code) {
                case 'KeyW':
                    keys.w.pressed = true;
                    // console.log('W was pressed!');
                    socket.emit('keydown', 'KeyW');
                    break;
                case 'KeyA':
                    keys.a.pressed = true;
                    // console.log('A was pressed!');
                    socket.emit('keydown', 'KeyA');
                    break;
                case 'KeyD':
                    keys.d.pressed = true;
                    // console.log('D was pressed!');   
                    socket.emit('keydown', 'KeyD');
                    break;
            }

            // console.log('frontendPlayers: ', frontendPlayers);
        })

        window.addEventListener('keyup', async (event) => {
            switch (event.code) {
              case 'KeyW':
                keys.w.pressed = false
                break
              case 'KeyA':
                keys.a.pressed = false
                break
              case 'KeyD':
                keys.d.pressed = false
                break
            }
          })

        // Start animation loop
        animate();
    }

    // Update frontend data with backend data
    function syncData(backendPlayers: {[id: string]: Player}) {
        // iterate over frontendPlayers and remove players not in the backend
        for (const id in frontendPlayers ) {
            if (!(id in backendPlayers)) {
                delete frontendPlayers[id];
            }
        }

        // iterate over backendPlayers and update/add players in frontend
        for ( const id in backendPlayers ) {
            let backEndPlayer = backendPlayers[id];

            // Add player if not in frontend or update it
            if (!frontendPlayers[id]) {
                frontendPlayers[id] = new Player({
                    position: {x: backEndPlayer.position.x, y: backEndPlayer.position.y},
                    velocity: {x: backEndPlayer.velocity.x, y: backEndPlayer.velocity.y},
                    hp: backEndPlayer.hp
                });
                frontendPlayers[id].id = backEndPlayer.id;
            } else {
                frontendPlayers[id].position = {x: backEndPlayer.position.x, y: backEndPlayer.position.y};
                frontendPlayers[id].velocity = {x: backEndPlayer.velocity.x, y: backEndPlayer.velocity.y};
                frontendPlayers[id].hp = backEndPlayer.hp;
                frontendPlayers[id].angle = backEndPlayer.angle;
            }

            // Indicate which player is the user
            if (frontendPlayers[id].id === socket.id) {
                frontendPlayers[id].color = 'lime';
            }
        }
    }

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
    );
}
 
export default MultiplayerCanvas;