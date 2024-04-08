import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io, { Socket} from 'socket.io-client';
import { CanvasProps } from "../interfaces/CanvasProps";
import { MultiplayerPlayer } from '../classes/MultiplayerPlayer';
import { Position } from '../interfaces/Position';
import { Velocity } from '../interfaces/Velocity';
import { playerHit } from '../utils/collision';
import { posix } from 'path';
import { MultiplayerEnemy } from '../classes/MultiplayerEnemy';
import InstructionsPopup from './InstructionsPopup';
// import gsap from 'gsap';

// establish WebSocket connection to server
const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com/";
// const backendUri = "http://localhost:4000";



const MultiplayerCanvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontendPlayers: {[id: string]: MultiplayerPlayer} = {};
    const frontendEnemies: MultiplayerEnemy[] = [];

    const [socket, setSocket] = useState<Socket | null>(null);
    const [showInstructions, setShowInstructions] = useState(true);

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

    // Establish websocket connection to server before starting game
    useEffect(() => {
        const newSocket = io(backendUri);

        newSocket.on('connect', () => {
            setSocket(newSocket);
            console.log(`Connected to server with User ID: ${newSocket.id}`);
        });

        return () => {
            newSocket.disconnect();
        }
    }, []);


    // Starts the game once connection to the server has been established and player has read the instructionss
    useEffect(() => {
        if (socket && !showInstructions) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
    
            if (ctx) {
                socket.emit('join', {width, height});
                console.log('Entered Multiplayer Mode as User ' + socket.id);
                startAnimation(ctx, width, height);
            }
    
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
        }

        // Client side prediction (immediately move player) and send message to backend
        const interval = setInterval(() => {
            let yourPlayer: MultiplayerPlayer = frontendPlayers[socket?.id as string];
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
                    socket?.emit('keydown', { keycode: 'KeyW', sequenceNumber});
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
                    socket?.emit('keydown', { keycode: 'KeyA', sequenceNumber});
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
                    socket?.emit('keydown', { keycode: 'KeyS', sequenceNumber});
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
                    socket?.emit('keydown', { keycode: 'KeyD', sequenceNumber});
                }
            }
        }, 15)

        // Listen for Events
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Clear interval and remove event listeners to prevent memory leaks
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [socket, showInstructions])

    // Create animation loop based on data in frontendPlayers and frontendEnemies
    function startAnimation(ctx: CanvasRenderingContext2D, width: number, height: number) {
        let animationFrameID: number;

        function animate() {
            // Clear background in frame
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
                if (id === socket?.id) {
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
                }
            }
    
            // Indicate which player is the user
            if (frontendPlayers[id].id === socket?.id) {
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

    // hides Instructions
    const hideInstructions = () => {
        setShowInstructions(false); // Hide instructions popup and start the game
    };

    // helper function to collect player inputs
    const handleKeyDown = (event: KeyboardEvent) => {
        // check if player exists
        if (!frontendPlayers.hasOwnProperty(socket?.id as string)) return;
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
    }

    // helper function to collect player inputs
    const handleKeyUp = (event: KeyboardEvent) => {
        // check if player exists
        if (!frontendPlayers.hasOwnProperty(socket?.id as string)) return;
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
    }

    return ( 
        <>
            {showInstructions && <InstructionsPopup onClose={hideInstructions} gameLevel='multi'/>}
            <canvas ref={canvasRef} width={width} height={height}/>
        </>
        
    );
}
 
export default MultiplayerCanvas;