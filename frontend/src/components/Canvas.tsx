import { useRef, useEffect } from 'react';
import { CanvasProps } from '../interfaces/CanvasProps';
import { Player } from '../classes/Player';
import { Position } from '../interfaces/Position';
import { Projectile } from '../classes/Projectile';

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

    // Create player
    let spawn: Position = {x: width/2, y: height/2};
    const player = spawnPlayer(ctx, spawn);

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

// helper function to spawn the player
function spawnPlayer(ctx: CanvasRenderingContext2D, spawn: Position): Player {
    let player = new Player({
        position: {x: spawn.x, y: spawn.y},
        velocity: {x: 0, y: 0}
    });
    player.draw(ctx);
    return player;
}

// helper function to spawn enemies
function spawnEnemy() {
    // Insert code here
}

// helper functions to detect if projectiles and asteroid collide
function circleCollision() {
    // insert code here
}

// helper function to animate th projectiles
function animateProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[], width: number, height: number) {
    let is_offscreen_left: boolean, is_offscreen_right: boolean, is_offscreen_top: boolean, is_offscreen_bot: boolean;
    
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectile = projectiles[i];
        projectile.update(ctx);

        // Check if offscreen
        is_offscreen_left = projectile.position.x + projectile.radius < 0;
        is_offscreen_right = projectile.position.x - projectile.radius > width;
        is_offscreen_top = projectile.position.y - projectile.radius > height;
        is_offscreen_bot = projectile.position.y + projectile.radius < 0;

        if ( is_offscreen_left || is_offscreen_right || is_offscreen_top || is_offscreen_bot ) {
            projectiles.splice(i, 1);
        }
    }
}
export default Canvas;
