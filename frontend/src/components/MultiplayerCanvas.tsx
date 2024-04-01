import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { CanvasProps } from "../interfaces/CanvasProps";
import { Player } from '../classes/Player';
import { Position } from '../interfaces/Position';
import { Velocity } from '../interfaces/Velocity';
import { playerHit } from '../utils/collision';

// establish WebSocket connection to server
const socket = io('http://localhost:4000');

const MultiplayerCanvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontendPlayers:Player[] = [];

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

        socket.on('updatePlayers', (backendPlayers) => {
            syncData(backendPlayers);
            // console.log('frontendPlayers: ',frontendPlayers);
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
            frontendPlayers.forEach(player => {
                player.update(ctx);
            });


            // movement
            // let index = frontendPlayers.findIndex(player => player.id === socket.id);
            // if (index != -1) {
            //     let player = frontendPlayers[index];
            //     if (keys.w.pressed) {
            //         player.velocity.x = Math.cos(player.angle) * SPEED;
            //         player.velocity.y = Math.sin(player.angle) * SPEED;
            //     } else {
            //         player.velocity.x *= FRICTION;
            //         player.velocity.y *= FRICTION;
            //     }
    
            //     if (keys.d.pressed) {
            //         player.angle += ROTATIONAL_SPEED;  
            //     }
            //     if (keys.a.pressed) {
            //         player.angle -= ROTATIONAL_SPEED;
            //     }
            // }
            
            // Create an animation loop by requesting next frame
            animationFrameID = window.requestAnimationFrame(animate);
        }

        // movement
        setInterval(() => {
            let index = frontendPlayers.findIndex(player => player.id === socket.id);
            if (index != -1) {
                let yourPlayer = frontendPlayers[index];
                if (keys.w.pressed) {
                    yourPlayer.velocity.x = Math.cos(yourPlayer.angle) * SPEED;
                    yourPlayer.velocity.y = Math.sin(yourPlayer.angle) * SPEED;
                } else {
                    yourPlayer.velocity.x *= FRICTION;
                    yourPlayer.velocity.y *= FRICTION;
                }
    
                if (keys.d.pressed) {
                    yourPlayer.angle += ROTATIONAL_SPEED;  
                }
                if (keys.a.pressed) {
                    yourPlayer.angle -= ROTATIONAL_SPEED;
                }
            }
        }, 15)

        // Listen for Events
        window.addEventListener('keydown', async (event) => {
            // check if player exists
            // let index = frontendPlayers.findIndex(player => player.id === socket.id);
            // if (index == -1) return;

            // let player = frontendPlayers[index];
            switch (event.code) {
                case 'KeyW':
                    // console.log('W was pressed!');
                    // socket.emit('keydown', 'KeyW');
                    keys.w.pressed = true;
                    // player.velocity.x = Math.cos(player.angle) * 3;
                    // player.velocity.y = Math.sin(player.angle) * 3;
                    break;
                case 'KeyA':
                    keys.a.pressed = true;
                    // console.log('A was pressed!');
                    // socket.emit('keydown', 'KeyA');
                    // player.angle += 0.05;   
                    break;
                case 'KeyD':
                    keys.d.pressed = true;
                    // console.log('D was pressed!');   
                    // socket.emit('keydown', 'KeyD');
                    // player.angle -= 0.05;
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
    function syncData(backendPlayers: any[]) {
        frontendPlayers.splice(0, frontendPlayers.length);  // empty array
        for (let i=0; i<backendPlayers.length; i++) {
            let player = new Player({
                position: {x: backendPlayers[i].position.x, y: backendPlayers[i].position.y},
                velocity: {x: backendPlayers[i].velocity.x, y: backendPlayers[i].velocity.y},
                hp: backendPlayers[i].hp
            });

            player.id = backendPlayers[i].id
            if (backendPlayers[i].id == socket.id) {
                player.color = 'lime';
            }


            frontendPlayers.push(player);
        }
        // console.log('frontendPlayers',frontendPlayers);
    }

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
    );
}
 
export default MultiplayerCanvas;