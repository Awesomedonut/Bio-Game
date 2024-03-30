import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { CanvasProps } from "../interfaces/CanvasProps";

// establish WebSocket connection to server
const socket = io('http://localhost:4000');

const MultiplayerCanvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        return () => {
            socket.disconnect();
            console.log('Disconnected from server');
        }
    }, [socket])

    function start(ctx: CanvasRenderingContext2D, width: number, height: number) {
        let animationFrameID: number;

        function animate() {
            // Create animation loop
            animationFrameID = window.requestAnimationFrame(animate);

            // Clear background in frame
            ctx.fillStyle = "rgb(255, 131, 122";
            ctx.fillRect(0, 0, width, height);
        }

        animate();
    }

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
    );
}
 
export default MultiplayerCanvas;