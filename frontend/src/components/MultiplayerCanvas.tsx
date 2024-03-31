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
                player.draw(ctx);
            });

            // Create an animation loop by requesting next frame
            animationFrameID = window.requestAnimationFrame(animate);
        }

        // Start animation loop
        animate();
    }

    function syncData(backendPlayers: any[]) {
        // let temp: Player[] = [];
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

            // temp.push(player);
            frontendPlayers.push(player);
        }
        // console.log('temp', temp);
        console.log('frontendPlayers',frontendPlayers);
    }

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
    );
}
 
export default MultiplayerCanvas;