import { PlayerProps } from "../interfaces/PlayerProps";
import { Position } from "../interfaces/Position";
import { Velocity } from "../interfaces/Velocity";

export class Player {
    id?: string
    position: Position;
    velocity: Velocity;
    angle: number;  // radians
    hp: number;
    color: string;
    sequenceNumber: number;

    constructor({position, velocity, hp}: PlayerProps) {
        this.id = ''; 
        this.position = position;
        this.velocity = velocity;
        this.angle = 0;
        this.hp = hp;
        this.color = 'green';
        this.sequenceNumber = 0;
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

        ctx.strokeStyle = this.color;
        ctx.stroke();

        ctx.restore();
    }

    // Draw the player 
    update(ctx: CanvasRenderingContext2D): void {
        this.draw(ctx);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    // https://www.youtube.com/watch?v=9jxkWxCHuq0&t=309s
    getVertices(): Position[] {
        let cos = Math.cos(this.angle);
        let sin = Math.sin(this.angle);

        let p1: Position = {
            x: this.position.x + cos * 30 - sin * 0,
            y: this.position.y + sin * 30 + cos * 0,
        }

        let p2: Position = {
            x: this.position.x + cos * -10 - sin * 10,
            y: this.position.y + sin * -10 + cos * 10,
        }

        let p3: Position = {
            x: this.position.x + cos * -10 - sin * -10,
            y: this.position.y + sin * -10 + cos * -10,
        }

        return [p1, p2, p3]
    }
}