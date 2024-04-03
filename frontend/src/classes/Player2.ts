import { Position } from "../interfaces/Position";

export class Player2 {
    id: string;
    position: Position;
    radius: number;
    color: string;
    sequenceNumber: number

    constructor({id, position}: {id: string, position: Position}) {
        this.id = id;
        this.position = position;
        this.radius = 20;
        this.color = 'green';
        this.sequenceNumber = 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}