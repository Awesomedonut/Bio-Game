import { useRef, useEffect } from 'react';
import { CanvasProps } from '../interfaces/CanvasProps';

const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, []); 

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
     );
}
 
export default Canvas;