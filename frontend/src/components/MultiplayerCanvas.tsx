import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { CanvasProps } from "../interfaces/CanvasProps";
import { MultiplayerPlayer } from '../classes/MultiplayerPlayer';
import { Position } from '../interfaces/Position';
import { Velocity } from '../interfaces/Velocity';
import { playerHit } from '../utils/collision';
import { posix } from 'path';
import { MultiplayerEnemy } from '../classes/MultiplayerEnemy';
// import gsap from 'gsap';

// establish WebSocket connection to server
const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com/";
const socket = io(backendUri);


const MultiplayerCanvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontendPlayers: {[id: string]: MultiplayerPlayer} = {};
    const frontendEnemies: MultiplayerEnemy[] = [];
    const playerInputs: {sequenceNumber: number, velocity: Velocity}[] = [];
    let sequenceNumber = 0;
    let playerAlive: boolean = true;
    const SPEED = 3;
    const navigate = useNavigate();

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
            socket.emit('join', {width, height});
            start(ctx, width, height);
        }

        socket.on('connect', () => {
            console.log('Connected to server');
        })

        socket.on('updatePlayers', (backendPlayers: {[id: string]: MultiplayerPlayer}) => {
            updatePlayersData(backendPlayers);
        })

        socket.on('updateEnemies', (backendEnemies: MultiplayerEnemy[]) => {
            updateEnemiesData(backendEnemies);
        });

        // Navigate to the homepage 3 seconds after the player dies
        socket.on('playerKilled', () => {
            playerAlive = false;
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        })

        return () => {
            socket.disconnect();
            console.log('Disconnected from server');
        }
    }, [socket])

    // useEffect(() => {
    //     if (!playerAlive) {
    //         setTimeout(() => {
    //             navigate('/home');
    //         }, 3000);
    //     }
    // }, [playerAlive, navigate]);

    function start(ctx: CanvasRenderingContext2D, width: number, height: number) {
        let animationFrameID: number;

        function animate() {
            // Clear background in frame
            // ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgb(255, 131, 122";
            ctx.fillRect(0, 0, width, height);

            // Display Game over text if player is dead
            if (!playerAlive) {
                ctx.font = "60px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("GAME OVER", width / 2, height /2);
            }

            // Draw the players
            for (const id in frontendPlayers) {
                frontendPlayers[id].draw(ctx);
            }

            // Draw the enemies
            frontendEnemies.forEach((enemy: MultiplayerEnemy) => {
                enemy.draw(ctx);
            })
            
            // Create an animation loop by requesting next frame
            animationFrameID = window.requestAnimationFrame(animate);
        }

        // Client side prediction (immediately move player)
        setInterval(() => {
            let yourPlayer: MultiplayerPlayer = frontendPlayers[socket.id as string];
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

                if (keys.a.pressed) {
                    sequenceNumber++;
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

                if (keys.s.pressed) {
                    sequenceNumber++;
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
                    sequenceNumber++;
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
            }
        }, 15)


        // Listen for Events
        window.addEventListener('keydown', async (event) => {
            // check if player exists
            if (!frontendPlayers.hasOwnProperty(socket.id as string)) return;
            switch (event.code) {
                case 'KeyW':
                    keys.w.pressed = true;
                    break;
                case 'KeyA':
                    keys.a.pressed = true;
                    break;
                case 'KeyS':
                    keys.s.pressed = true;
                    break;
                case 'KeyD':
                    keys.d.pressed = true;
                    break;
            }
        })

        window.addEventListener('keyup', async (event) => {
            // check if player exists
            if (!frontendPlayers.hasOwnProperty(socket.id as string)) return;
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

    // Update frontend player data with backend data
    function updatePlayersData(backendPlayers: {[id: string]: MultiplayerPlayer}) {
        // Remove players from frontend if not in the backend
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
                frontendPlayers[id] = new MultiplayerPlayer({
                    id: backendPlayer.id,
                    position: backendPlayer.position
                });
            } else {
                // Update a player based on backend data
                frontendPlayer.position = { ...backendPlayer.position};

                // Perform server reconciliation for the client's player
                if (id === socket.id) {
                    const lastBackendInputIndex = playerInputs.findIndex(input => {
                        return backendPlayer.sequenceNumber === input.sequenceNumber;
                    })

                    if (lastBackendInputIndex > -1) {
                        playerInputs.splice(0, lastBackendInputIndex + 1);
                        // console.log(JSON.stringify(playerInputs));
                    }

                    playerInputs.forEach((input) => {
                        frontendPlayer.position.x += input.velocity.x;
                        frontendPlayer.position.y += input.velocity.y;
                    })
                } else {
                    // Animate other players movemnt using GSAP and player interpolation
                    // let backendTicRate = 0.015;
                    // gsap.to(frontendPlayer.position, {
                    //     x: backendPlayer.position.x,
                    //     y: backendPlayer.position.y,
                    //     duration: backendTicRate,
                    //     ease: 'linear'
                    // })
                }
            }
    
            // Indicate which player is the user
            if (frontendPlayers[id].id === socket.id) {
                frontendPlayers[id].color = 'lime';
            }
        }
    }
    
    // Update frontend enemies data with backend data
    function updateEnemiesData(backendEnemies: MultiplayerEnemy[]) {
        frontendEnemies.length = 0;
        let enemy: MultiplayerEnemy;
        let position: Position;
        let velocity: Velocity;
        let radius: number;
        for (let i=0; i<backendEnemies.length; i++) {
            position = backendEnemies[i].position;
            velocity = backendEnemies[i].velocity;
            radius = backendEnemies[i].radius;

            enemy = new MultiplayerEnemy(position, velocity, radius);
            frontendEnemies.push(enemy);
        }
    }

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
    );
}
 
export default MultiplayerCanvas;