import { useRef, useEffect } from 'react';

interface CanvasProps {
    width: number;
    height: number;
}

const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 50, 50);
    }, []); 

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
     );
}
 
export default Canvas;