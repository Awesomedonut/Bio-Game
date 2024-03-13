import { PlayerProps } from "../interfaces/PlayerProps";
import { Position } from "../interfaces/Position";
import { Velocity } from "../interfaces/Velocity";

export class Player {
    position: Position;
    velocity: Velocity;
    rotation: number;

    constructor({position, velocity}: PlayerProps) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.position.x + 30, this.position.y);
        ctx.lineTo(this.position.x - 10, this.position.y - 10);
        ctx.lineTo(this.position.x - 10, this.position.y + 10);
        ctx.closePath();

        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}