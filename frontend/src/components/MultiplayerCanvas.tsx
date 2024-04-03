import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { CanvasProps } from "../interfaces/CanvasProps";
// import { Player } from '../classes/Player';
import { Player2 } from '../classes/Player2';
import { Position } from '../interfaces/Position';
import { Velocity } from '../interfaces/Velocity';
import { playerHit } from '../utils/collision';
import { posix } from 'path';
// import gsap from 'gsap';


// Register AttrPlugin to allow GSAP to animate custom properties
// gsap.registerPlugin(AttrPlugin);

// establish WebSocket connection to server
const socket = io('http://localhost:4000');

const MultiplayerCanvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontendPlayers: {[id: string]: Player2} = {};
    const playerInputs: {sequenceNumber: number, velocity: Velocity}[] = [];
    let sequenceNumber = 0;

    const SPEED = 3;
    // const ROTATIONAL_SPEED = 0.05
    // const FRICTION = 0.97
    // const PROJECTILE_SPEED = 3

    const keys = {
        w: {
            pressed: false,
        },
        a: {
            pressed: false,
        },
        s: {
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

        socket.on('updatePlayers', (backendPlayers: {[id: string]: Player2}) => {
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
                frontendPlayers[id].draw(ctx);
            }
            
            // Create an animation loop by requesting next frame
            animationFrameID = window.requestAnimationFrame(animate);
        }

        // Client side prediction (immediately move player)
        setInterval(() => {
            let yourPlayer: Player2 = frontendPlayers[socket.id as string];
            if (yourPlayer) {
                if (keys.w.pressed) {
                    sequenceNumber++;
                    playerInputs.push({
                        sequenceNumber,
                        velocity: {
                            x: 0,
                            y: -SPEED
                        }
                    });
                    yourPlayer.position.y -= SPEED;
                    socket.emit('keydown', { keycode: 'KeyW', sequenceNumber});
                }
                // if (keys.w.pressed) {
                //     sequenceNumber++;
                //     playerInputs.push({
                //         sequenceNumber, 
                //         dx: Math.cos(yourPlayer.angle) * SPEED,
                //         dy: Math.sin(yourPlayer.angle) * SPEED
                //     });
                //     yourPlayer.velocity.x = Math.cos(yourPlayer.angle) * SPEED;
                //     yourPlayer.velocity.y = Math.sin(yourPlayer.angle) * SPEED;
                //     socket.emit('keydown', { keycode: 'KeyW', sequenceNumber });
                // } else {
                //     // yourPlayer.velocity.x *= FRICTION;
                //     // yourPlayer.velocity.y *= FRICTION;
                // }

                if (keys.a.pressed) {
                    playerInputs.push({
                        sequenceNumber,
                        velocity: {
                            x: -SPEED,
                            y: 0
                        }
                    });
                    yourPlayer.position.x -= SPEED;
                    socket.emit('keydown', { keycode: 'KeyA', sequenceNumber});
                }
                // if (keys.a.pressed) {
                //     sequenceNumber++;
                //     playerInputs.push({
                //         sequenceNumber, 
                //         dx: 0,
                //         dy: 0,
                //     });
                //     yourPlayer.angle -= ROTATIONAL_SPEED;
                //     socket.emit('keydown', { keycode: 'KeyA', sequenceNumber });  
                // }

                if (keys.s.pressed) {
                    playerInputs.push({
                        sequenceNumber,
                        velocity: {
                            x: 0,
                            y: SPEED
                        }
                    });
                    yourPlayer.position.y += SPEED;
                    socket.emit('keydown', { keycode: 'KeyS', sequenceNumber});
                }

                if (keys.d.pressed) {
                    playerInputs.push({
                        sequenceNumber,
                        velocity: {
                            x: SPEED,
                            y: 0
                        }
                    });
                    yourPlayer.position.x += SPEED;
                    socket.emit('keydown', { keycode: 'KeyD', sequenceNumber});
                }
                // if (keys.d.pressed) {
                //     sequenceNumber++;
                //     playerInputs.push({
                //         sequenceNumber, 
                //         dx: 0,
                //         dy: 0,
                //     });
                //     yourPlayer.angle += ROTATIONAL_SPEED;
                //     socket.emit('keydown', { keycode: 'KeyD', sequenceNumber });
                // }
            }
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
                    // socket.emit('keydown', 'KeyW');
                    break;
                case 'KeyA':
                    keys.a.pressed = true;
                    // console.log('A was pressed!');
                    // socket.emit('keydown', 'KeyA');
                    break;
                case 'KeyS':
                    keys.s.pressed = true;
                    // socket.emit('keydown', 'KeyS');
                    break;
                case 'KeyD':
                    keys.d.pressed = true;
                    // console.log('D was pressed!');   
                    // socket.emit('keydown', 'KeyD');
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
            case 'KeyS':
                keys.s.pressed = false
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
    function syncData(backendPlayers: {[id: string]: Player2}) {
        // Remove players not in the backend
        for (const id in frontendPlayers ) {
            if (!(id in backendPlayers)) {
                delete frontendPlayers[id];
            }
        }
    
        // Update or add players in frontend
        for (const id in backendPlayers ) {
            const backendPlayer = backendPlayers[id];
            const frontendPlayer = frontendPlayers[id];
    
            if (!frontendPlayer) {
                // Add player if not in frontend
                frontendPlayers[id] = new Player2({
                    id: backendPlayer.id,
                    position: backendPlayer.position
                });
            } else {
                // Update a player based on backend data
                frontendPlayer.position = { ...backendPlayer.position};

                // Update player based on backend data
                // frontendPlayer.position = { ...backendPlayer.position };
                // frontendPlayer.velocity = { ...backendPlayer.velocity };
                // frontendPlayer.hp = backendPlayer.hp;
                // frontendPlayer.angle = backendPlayer.angle;
    
                // Perform server reconciliation for the client's player
                if (id === socket.id) {
                    const lastBackendInputIndex = playerInputs.findIndex(input => {
                        return backendPlayer.sequenceNumber === input.sequenceNumber;
                    })

                    if (lastBackendInputIndex > -1) {
                        playerInputs.splice(0, lastBackendInputIndex + 1);
                    }

                    playerInputs.forEach((input) => {
                        frontendPlayer.position.x += input.velocity.x;
                        frontendPlayer.position.y += input.velocity.y;
                    })
                } else {
                    // Apply Player Interpolation for other players
                    // let backendTicRate = 0.015;
                    // gsap.to(frontendPlayer, {
                    //     x: backendPlayer.position.x,
                    //     y: backendPlayer.position.y,
                    //     duration: backendTicRate,
                    //     ease: 'linear'
                    // })
                }

                // if (id === socket.id) {
                //     const lastBackendInputIndex = playerInputs.findIndex(input => {
                //         return backendPlayer.sequenceNumber === input.sequenceNumber;
                //     });
    
                //     if (lastBackendInputIndex > -1) {
                //         playerInputs.splice(0, lastBackendInputIndex + 1);
                //     }
    
                //     playerInputs.forEach((input) => {
                //         frontendPlayer.velocity.x += input.dx;
                //         frontendPlayer.velocity.y += input.dy;
                //         frontendPlayer.position.x += frontendPlayer.velocity.x;
                //         frontendPlayer.position.y += frontendPlayer.velocity.y;
                //     });
                // }
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