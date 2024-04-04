import { EnemyProps } from "../interfaces/EnemyProps";
import { Position } from "../interfaces/Position";
import { Velocity } from "../interfaces/Velocity";

export class Enemy {
    position: Position;
    velocity: Velocity;
    radius: number;

    constructor({position, velocity, radius}: EnemyProps) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }
}