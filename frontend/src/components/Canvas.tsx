import { useRef, useEffect } from 'react';
import { CanvasProps } from '../interfaces/CanvasProps';
import { Player } from '../classes/Player';
import { Position } from '../interfaces/Position';
import { Projectile } from '../classes/Projectile';
import { Enemy } from '../classes/Enemy';
import { Velocity } from '../interfaces/Velocity';

// Initialize Canvase
const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx) {
            handleAnimation(ctx, width, height);
        }
    }, [width, height]);

    return ( 
        <canvas ref={canvasRef} width={width} height={height}/>
     );
}

// Animates the game
function handleAnimation(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // initialize constants
    const keys = {
        w: { pressed: false },
        a: { pressed: false },
        d: { pressed: false }
    }

    const SPEED = 3;
    const SPEED_CHANGE_DIRECTION = 0.05;
    const FRICTION = 0.97;
    const PROJECTILE_SPEED = 10;

    const projectiles: Projectile[] = [];
    const enemies: Enemy[] = [];

    // Create player
    let spawn: Position = {x: width/2, y: height/2};
    const player = spawnPlayer(ctx, spawn);

    // Spawn an enemy every 3 seconds
    window.setInterval(() => {
        let newEnemy:Enemy = spawnEnemy(width, height);
        enemies.push(newEnemy);
        // console.log('Enemies: ', enemies);
    }, 3000);

    function animate() {
        // Create animation loop
        window.requestAnimationFrame(animate);
        
        // Clear the background in frame
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        // Draw player
        player.update(ctx)

        // animate projectiles
        animateProjectiles(ctx, projectiles, width, height);

        // animate enemies
        animateEnemies(ctx, enemies, width, height);

        // Check if projectile collides with enemy. If it does decrease the enemies "health" and remove from array if it "dies"
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            for (let j = projectiles.length - 1; j >= 0; j--) {
                let projectile = projectiles[j];
                if (circleCollision(enemy, projectile)) {
                    enemy.radius -= 10;
                    if (enemy.radius <= 10) {
                        enemies.splice(i, 1);
                        console.log('Boom!');
                    }
                    projectiles.splice(j, 1);
                }
            }
        }

        // update the player's velocity
        player.velocity.x = 0;
        if (keys.w.pressed) {
            player.velocity.x = Math.cos(player.angle) * SPEED;
            player.velocity.y = Math.sin(player.angle) * SPEED;
        } else {
            player.velocity.x *= FRICTION;
            player.velocity.y *= FRICTION;
        }

        if (keys.d.pressed) {
            player.angle += SPEED_CHANGE_DIRECTION;
        } else if (keys.a.pressed) {
            player.angle -= SPEED_CHANGE_DIRECTION;
        }

    }

    animate();

    // Listen for Events
    window.addEventListener('keydown', (event) => {
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
                )
                // console.log(projectiles);
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
        }
    })
}

// helper function to spawn the player in the middle
function spawnPlayer(ctx: CanvasRenderingContext2D, spawn: Position): Player {
    let player = new Player({
        position: {x: spawn.x, y: spawn.y},
        velocity: {x: 0, y: 0}
    });
    player.draw(ctx);
    return player;
}

// helper function to spawn enemies
function spawnEnemy(width: number, height: number): Enemy {
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
    let radius: number = 90 * Math.random() + 10;   // sets radius randomly between 10 or 100

    // Set Position and Velocity based on the randomly chosen spawn location
    switch(location) {
        case SpawnLocation.Top:
            position = {
                x: Math.random() * width, 
                y: 0 - radius
            }
            velocity = {
                x: 0,
                y: 1
            }
            break;
        case SpawnLocation.Bottom:
            position = {
                x: Math.random() * width,
                y: height + radius
            }
            velocity = {
                x: 0,
                y: -1
            }
            break;
        case SpawnLocation.Left:
            position = {
                x: 0 - radius,
                y: Math.random() * height
            }
            velocity = {
                x: 1,
                y: 0
            }
            break;
        case SpawnLocation.Right:
            position = {
                x: width + radius,
                y: Math.random() * height
            }
            velocity = {
                x: -1,
                y: 0
            }
            break;
    }

    // return the newly created enemy
    return new Enemy({position, velocity, radius});
}

// helper functions to detect if projectiles and asteroid collide
function circleCollision(projectile: Projectile, enemy: Enemy): Boolean {
    let xDifference = projectile.position.x - enemy.position.x;
    let yDifference = projectile.position.y - enemy.position.y;

    const distance = Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2));
    if (distance <= projectile.radius + enemy.radius) {
        return true;
    }

    return false;
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

export default Canvas;
