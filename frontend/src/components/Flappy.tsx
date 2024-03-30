import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  width: number;
  height: number;
}

const Flappy: React.FC<CanvasProps> = ({ width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Ensure canvas is not null

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Ensure ctx is not null

        let frameId: number;
        const gravity = 0.5;
        let speed = 0;
        const jump = -10;
        const bacteria = {
            x: 50,
            y: height / 2,
            width: 20,
            height: 20,
        };

        const obstacles: {x: number, y: number, width: number, height: number}[] = [];
        const obstacleWidth = 30;
        const obstacleGap = 200;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                speed = jump;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        function spawnObstacles() {
            if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < width - obstacleGap) {
                const obstacleHeight = Math.random() * (height - 100) + 50;
                obstacles.push({
                    x: width,
                    y: 0,
                    width: obstacleWidth,
                    height: obstacleHeight,
                });
                obstacles.push({
                    x: width,
                    y: obstacleHeight + 100,
                    width: obstacleWidth,
                    height: height - obstacleHeight - 100,
                });
            }
        }

        function drawBacteria() {
            if (ctx) { // Ensure ctx is not null
                ctx.fillStyle = '#00FF00';
                ctx.fillRect(bacteria.x, bacteria.y, bacteria.width, bacteria.height);
            }
        }

        function drawObstacles() {
            if (ctx) { // Ensure ctx is not null
                ctx.fillStyle = '#FF0000';
                obstacles.forEach(obstacle => {
                    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                });
            }
        }


        function updateGame() {
            ctx?.clearRect(0, 0, width, height);

            speed += gravity;
            bacteria.y += speed;

            if (bacteria.y + bacteria.height > height) {
                bacteria.y = height - bacteria.height;
                speed = 0;
            } else if (bacteria.y < 0) {
                bacteria.y = 0;
                speed = 0;
            }

            spawnObstacles();
            obstacles.forEach(obstacle => obstacle.x -= 2);
            drawBacteria();
            drawObstacles();

            obstacles.forEach(obstacle => {
                if (bacteria.x < obstacle.x + obstacle.width &&
                    bacteria.x + bacteria.width > obstacle.x &&
                    bacteria.y < obstacle.y + obstacle.height &&
                    bacteria.y + bacteria.height > obstacle.y) {
                    window.cancelAnimationFrame(frameId);
                    setIsGameOver(true);
                }
            });

            if (!isGameOver) {
                frameId = window.requestAnimationFrame(updateGame);
            } else if (ctx) {
                ctx.font = '30px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText('Game Over', width / 2 - 100, height / 2);
            }
        }

        frameId = window.requestAnimationFrame(updateGame);

        return () => {
            window.cancelAnimationFrame(frameId);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [height, width, isGameOver]);

    return <canvas ref={canvasRef} width={width.toString()} height={height.toString()} />;
};

export default Flappy;