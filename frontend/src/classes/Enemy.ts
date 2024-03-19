import { EnemyProps } from "../interfaces/EnemyProps";
import { Position } from "../interfaces/Position";
import { Velocity } from "../interfaces/Velocity";

export class Enemy {
    position: Position;
    velocity: Velocity;
    hp: number;
    radius: number;

    constructor({position, velocity, hp}: EnemyProps) {
        this.position = position;
        this.velocity = velocity;
        this.hp = hp;
        this.radius = hp;
    }

    draw(ctx: CanvasRenderingContext2D):void {
        ctx. beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
      }

    update(ctx: CanvasRenderingContext2D): void {
        this.draw(ctx);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}