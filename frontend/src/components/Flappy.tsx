import React, { useRef, useEffect, useState } from 'react';
import InstructionsPopup from './InstructionsPopup'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LevelPassPopup from './LevelPassPopup';

// game logic referenced from https://gist.github.com/Pro496951/a7537d2f313fbc6ebad1f74b83f84244

interface CanvasProps {
  width: number;
  height: number;
}

const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com/";
// const backendUri ="http://localhost:4000"


const Flappy: React.FC<CanvasProps> = ({ width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true); // State to manage instructions popup visibility
    const [gameStarted, setGameStarted] = useState(false);
    const [playerId, setPlayerId] = useState(null);
    const score = useRef(0);
    const [levelPassed, setLevelPassed] = useState(false); // State to manage level pass popup visibility

    const navigate = useNavigate();

    const handleGameOver = async () => {

        console.log(score.current);

        if (playerId) {
            axios.put(backendUri + '/score/highscores', {
                playerId: playerId,
                level: 3,
                score: score.current
            }).then(() => {
                console.log("Success: score saved");
            }).catch((e) => {
                console.log(e);
                console.log("Error: Could not save score");
            })
        }

        navigate('/home');
    };

    const incrementScore = () => {
        score.current += 1;
    }

    useEffect(() => {
        const fetchPlayer = async () => {
            const token = localStorage.getItem('token');

            const playerRes = await axios.post(backendUri + '/game/player/get', null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setPlayerId(playerRes.data.player.id);
        }

        fetchPlayer();
    }, [])

    useEffect(() => {
        


        if (!gameStarted) return; // Ensure game has started

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

        const levelPassTimer = setTimeout(() => {
            if (!isGameOver) { // Check if the game isn't over
                setLevelPassed(true); // Show the level pass popup
            }
        }, 30000); // 30 seconds

        return () => {
            clearTimeout(levelPassTimer); // Clean up the timer
        };

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

            incrementScore();

            if (ctx) {
                ctx.font = "12px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "left";
                ctx.fillText(`Score: ${score.current}`, 5, 15);
            }

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

                handleGameOver();
            }
        }

        frameId = window.requestAnimationFrame(updateGame);

        return () => {
            window.cancelAnimationFrame(frameId);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [height, width, isGameOver, gameStarted]);

    const closeInstructions = () => {
        setShowInstructions(false); // Function to hide the instructions popup
        startGame();
    };

    const startGame = () => {
        setGameStarted(true); // Function to start the game
    };

    const goToNextLevel = () => {
        navigate('/game');
    };

    return (
        <>
            {showInstructions && <InstructionsPopup onClose={closeInstructions} gameLevel='flappy'/>}
            {levelPassed && <LevelPassPopup onClose={goToNextLevel} />} // This is your level pass popup component
            <canvas ref={canvasRef} width={width.toString()} height={height.toString()} />
        </>
    );
};

export default Flappy;