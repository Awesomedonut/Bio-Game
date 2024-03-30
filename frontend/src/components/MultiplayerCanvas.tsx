import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { CanvasProps } from "../interfaces/CanvasProps";

// establish WebSocket connection to server
const socket = io('http://localhost:4000');

const MultiplayerCanvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Listen for 'connect' event
        socket.on('connect', () => {
            console.log('Connected to server');
        })
    }, [socket])

    return ( 
        <h1>Multiplayer Canvas Works!</h1>
    );
}
 
export default MultiplayerCanvas;