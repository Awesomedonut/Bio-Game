import { PlayerProps } from "../interfaces/PlayerProps";
import { Position } from "../interfaces/Position";
import { Velocity } from "../interfaces/Velocity";

export class Player {
    position: Position;
    velocity: Velocity;
    angle: number;  // radians

    constructor({position, velocity}: PlayerProps) {
        this.position = position;
        this.velocity = velocity;
        this.angle = 0;
    }

    // Draw the player based on it's current position, velocity
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // point the character in the correct direction
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.position.x, -this.position.y);

        // draw the player (triangle)
        ctx.beginPath();
        ctx.moveTo(this.position.x + 30, this.position.y);
        ctx.lineTo(this.position.x - 10, this.position.y - 10);
        ctx.lineTo(this.position.x - 10, this.position.y + 10);
        ctx.closePath();

        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.restore();
    }

    // Draw the player 
    update(ctx: CanvasRenderingContext2D): void {
        this.draw(ctx);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}