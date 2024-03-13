import { useRef, useEffect } from 'react';
import { CanvasProps } from '../interfaces/CanvasProps';
import { Player } from '../classes/Player';

const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx) {
            // Fill background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create player
            const player = new Player({
                position: {x: width / 2, y: height /2},
                velocity: {x: 0, y: 0}
            });

            player.draw(ctx);
            console.log(player);
        }
    }, [width, height]); // Will only rerender when screen size chages or twice on initial render because of React.StrictMode

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
     );
}
 
export default Canvas;
