import { PlayerProps } from "../interfaces/PlayerProps";
import { Position } from "../interfaces/Position";
import { Velocity } from "../interfaces/Velocity";

export class Player {
    id: string;
    position: Position;
    velocity: Velocity;
    angle: number;  // radians
    hp: number;
    sequenceNumber: number;

    constructor({ id, position, velocity, hp}: PlayerProps) {
        this.id = id;
        this.position = position;
        this.velocity = velocity;
        this.angle = 0;
        this.hp = hp;
        this.sequenceNumber = 0;
    }

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