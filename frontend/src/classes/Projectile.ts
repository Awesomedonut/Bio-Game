import { Position } from "../interfaces/Position";
import { ProjectileProps } from "../interfaces/ProjectileProps";
import { Velocity } from "../interfaces/Velocity";

export class Projectile {
    position: Position;
    velocity: Velocity;
    radius: number;

    constructor({position, velocity}: ProjectileProps) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }

    // Draw a circle based on its current position and velocity
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = 'green';
        ctx.fill();
    }

    // Update the bullet based on its current position and velocity
    update(ctx: CanvasRenderingContext2D): void {
        this.draw(ctx);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}