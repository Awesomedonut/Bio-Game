import { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasProps } from '../interfaces/CanvasProps';
import { Player } from '../classes/Player';
import { Position } from '../interfaces/Position';
import { Projectile } from '../classes/Projectile';
import { Enemy } from '../classes/Enemy';
import { Velocity } from '../interfaces/Velocity';
import { circleCollision, playerHit } from '../utils/collision';

import PlayerInterface from "../interfaces/Player";
import { EnemyInterface } from '../interfaces/Enemy';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Initialize Canvase
const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [playerData, setPlayer] = useState<PlayerInterface | null>(null);
    const [enemiesData, setEnemies] = useState<EnemyInterface[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    const navigate = useNavigate();
    const handleGameOver = useCallback(() => {
        navigate('/home');
    }, [navigate]);

    useEffect(() => {
        const fetchPlayer = async () => {
            const playerRes = await axios.get('http://localhost:8080/game/player/1');
            const enemyRes = await axios.get('http://localhost:8080/game/enemy');

            setPlayer(playerRes.data.player);
            setEnemies(enemyRes.data.enemies);
        }

        fetchPlayer();
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        console.log(enemiesData);

        if (playerData != null && enemiesData.length > 0 && canvas && ctx && !gameStarted) {
            console.log(playerData);
            console.log(enemiesData);
            start(ctx, width, height, playerData, enemiesData, handleGameOver);
            setGameStarted(true);
        }
    }, [width, height, playerData, enemiesData, handleGameOver]);

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
     );
}

// Animates the player/enemies/projectiles and detect collisions, and detect keyboard input
function start(ctx: CanvasRenderingContext2D, width: number, height: number, playerData: PlayerInterface, enemiesData: EnemyInterface[], handleGameOver: () => void) {
    // initialize constants
    let animationFrameID: number;
    
    const keys = {
        w: { pressed: false },
        a: { pressed: false },
        d: { pressed: false }
    }

    let PLAYER_DAMAGE = playerData.damage;
    let PLAYER_SPEED = playerData.movement_speed;
    let NUM_PROJECTILES = playerData.projectile_number;
    let PROJECTILE_SPEED = playerData.projectile_speed;
    let HP = playerData.hp;
    let CURRENCY = playerData.currency;

    const CHAIN_PROJECTILE_DELAY = 90;
    const SPEED_CHANGE_DIRECTION = 0.05;
    const FRICTION = 0.97;

    const projectiles: Projectile[] = [];
    const enemies: Enemy[] = [];

    // Create player
    let spawn: Position = {x: width/2, y: height/2};
    const player = spawnPlayer(ctx, spawn, HP);

    // Spawn an enemy every 3 seconds
    const interval = window.setInterval(() => {
        const randomNumber: number = Math.floor(Math.random() * 100);

        let enemyIndex = 0;

        // TODO: Make this better for future, temporarily here to make this work for checkpoint.
        switch (true) {
            case (randomNumber < 25):
                enemyIndex = 0;
                break;
            case (randomNumber < 50):
                enemyIndex = 1;
                break;
            case (randomNumber < 75):
                enemyIndex = 2;
                break;
            case (randomNumber < 90):
                enemyIndex = 3;
                break;
            case (randomNumber <= 100):
                enemyIndex = 4;
                break;
        }

        let newEnemy: Enemy = spawnEnemy(width, height, enemiesData[enemyIndex]);
        enemies.push(newEnemy);
        // console.log('Enemies: ', enemies);
    }, 3000);

    function animate() {
        // Create animation loop
        animationFrameID = window.requestAnimationFrame(animate);
        
        // Clear the background in frame
        ctx.fillStyle = "rgb(255, 131, 122)";
        ctx.fillRect(0, 0, width, height);

        // Draw player
        player.update(ctx)

        // animate projectiles
        animateProjectiles(ctx, projectiles, width, height);

        // animate enemies
        animateEnemies(ctx, enemies, width, height);

        // check if player hit and game over
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            if (playerHit(enemy, player.getVertices())) {
                HP -= enemy.damage;
                if (HP <= 0) {
                    // console.log('GAME OVER');

                    // Print Game Over On Screen
                    ctx.font = "60px Arial";
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    ctx.fillText("GAME OVER", width/2, height/2);

                    window.cancelAnimationFrame(animationFrameID);
                    clearInterval(interval);

                    // Redirect to homescreen after 3 seconds
                    setTimeout(() => {
                        handleGameOver();
                    }, 3000);
                }
            }
        }


        // Check if projectile collides with enemy. If it does decrease the enemies "health" and remove from array if it "dies"
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            for (let j = projectiles.length - 1; j >= 0; j--) {
                let projectile = projectiles[j];
                if (circleCollision(enemy, projectile)) {
                    enemy.radius -= PLAYER_DAMAGE;
                    if (enemy.radius < 10) {
                        enemies.splice(i, 1);
                        // console.log('Boom!');
                        CURRENCY += enemy.currency_drop;
                        console.log(`Currency: ${CURRENCY}`);
                    }
                    projectiles.splice(j, 1);
                }
            }
        }

        const PLAYER_WIDTH = 30
        const PLAYER_EDGE_OFFSET = PLAYER_WIDTH + 1;
        // update the player's velocity
        if (player.position.x > width - PLAYER_WIDTH || player.position.x < 0 + PLAYER_WIDTH) {
            player.velocity.x = 0;
            player.position.x = (player.position.x > (width - PLAYER_WIDTH)) ? (width - PLAYER_EDGE_OFFSET) : (0 + PLAYER_EDGE_OFFSET);
        } else if (player.position.y > height - PLAYER_WIDTH || player.position.y < 0 + PLAYER_WIDTH) {
            player.velocity.y = 0;
            player.position.y = (player.position.y > (height - PLAYER_WIDTH)) ? (height - PLAYER_EDGE_OFFSET) : (0 + PLAYER_EDGE_OFFSET);
        } else {
            player.velocity.x = 0;
            if (keys.w.pressed) {
                player.velocity.x = Math.cos(player.angle) * PLAYER_SPEED;
                player.velocity.y = Math.sin(player.angle) * PLAYER_SPEED;
            } else {
                player.velocity.x *= FRICTION;
                player.velocity.y *= FRICTION;
            }
        }

        if (keys.d.pressed) {
            player.angle += SPEED_CHANGE_DIRECTION;
        } else if (keys.a.pressed) {
            player.angle -= SPEED_CHANGE_DIRECTION;
        }

    }

    // Listen for Events
    window.addEventListener('keydown', async (event) => {
        switch (event.code) {
            case 'KeyW':
                player.velocity.x = 1;
                keys.w.pressed = true;
                break;
            case 'KeyA':
                keys.a.pressed = true;
                break;
            case 'KeyD':
                keys.d.pressed = true;
                break;
            case 'Space':
                for (let i: number = 0; i < NUM_PROJECTILES; i++) {
                    projectiles.push(
                        new Projectile({
                            position: {
                                x: player.position.x,
                                y: player.position.y
                            },
                            velocity: {
                                x: Math.cos(player.angle) * PROJECTILE_SPEED,
                                y: Math.sin(player.angle) * PROJECTILE_SPEED
                            }
                        })
                    );

                    await sleep(CHAIN_PROJECTILE_DELAY);
                }
                // console.log(projectiles);
                break;
            case 'KeyP':    // Pause
                console.log('Pause');
                window.cancelAnimationFrame(animationFrameID);
                break;

        }
    })

    window.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW':
                keys.w.pressed = false;
                break;
            case 'KeyA':
                keys.a.pressed = false;
                break;
            case 'KeyD':
                keys.d.pressed = false;
                break;
            case 'KeyP':    // Unpause
                animationFrameID = requestAnimationFrame(animate);
                break;
        }
    })

    animate();

}

// helper function to spawn the player in the middle
function spawnPlayer(ctx: CanvasRenderingContext2D, spawn: Position, hp: number): Player {
    let player = new Player({
        position: {x: spawn.x, y: spawn.y},
        velocity: {x: 0, y: 0},
        hp: hp   // placeholder for now
    });
    player.draw(ctx);
    return player;
}

// helper function to spawn enemies
function spawnEnemy(width: number, height: number, enemyData: EnemyInterface): Enemy {
    // initialize some variables
    enum SpawnLocation {
        Top,
        Bottom,
        Left,
        Right
    }
    const location:SpawnLocation = Math.floor(Math.random() * 3);

    let position: Position;
    let velocity: Velocity;
    // let hp: number = 90 * Math.random() + 10;   // sets radius randomly between 10 or 100
    const hp = enemyData.hp;
    const damage = enemyData.damage;
    const currency_drop = enemyData.currency_drop;

    // Set Position and Velocity based on the randomly chosen spawn location
    switch(location) {
        case SpawnLocation.Top:
            position = {
                x: Math.random() * width, 
                y: 0 - hp
            }
            velocity = {
                x: 0,
                y: enemyData.movement_speed
            }
            break;
        case SpawnLocation.Bottom:
            position = {
                x: Math.random() * width,
                y: height + hp
            }
            velocity = {
                x: 0,
                y: -enemyData.movement_speed
            }
            break;
        case SpawnLocation.Left:
            position = {
                x: 0 - hp,
                y: Math.random() * height
            }
            velocity = {
                x: enemyData.movement_speed,
                y: 0
            }
            break;
        case SpawnLocation.Right:
            position = {
                x: width + hp,
                y: Math.random() * height
            }
            velocity = {
                x: -enemyData.movement_speed,
                y: 0
            }
            break;
    }

    // return the newly created enemy
    return new Enemy({position, velocity, hp, damage, currency_drop});
}

// helper function to animate th projectiles
function animateProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[], width: number, height: number) {
    let is_offscreen_left: boolean, is_offscreen_right: boolean, is_offscreen_top: boolean, is_offscreen_bot: boolean;
    
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectile = projectiles[i];
        projectile.update(ctx);

        // Check if each projectile is offscreen and remove if it is
        is_offscreen_left = projectile.position.x + projectile.radius < 0;
        is_offscreen_right = projectile.position.x - projectile.radius > width;
        is_offscreen_top = projectile.position.y - projectile.radius > height;
        is_offscreen_bot = projectile.position.y + projectile.radius < 0;

        if ( is_offscreen_left || is_offscreen_right || is_offscreen_top || is_offscreen_bot ) {
            projectiles.splice(i, 1);
        }
    }
}

// helper function to animate enemies
function animateEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[], width: number, height: number) {
    let is_offscreen_left: boolean, is_offscreen_right: boolean, is_offscreen_top: boolean, is_offscreen_bot: boolean;
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.update(ctx);
        
        // Check if each enemy is offscreen and remove if it is
        is_offscreen_left = enemy.position.x + enemy.radius < 0;
        is_offscreen_right = enemy.position.x - enemy.radius > width;
        is_offscreen_top = enemy.position.y - enemy.radius > height;
        is_offscreen_bot = enemy.position.y + enemy.radius < 0;

        if ( is_offscreen_left || is_offscreen_right || is_offscreen_top || is_offscreen_bot ) {
            enemies.splice(i, 1);
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Canvas;
