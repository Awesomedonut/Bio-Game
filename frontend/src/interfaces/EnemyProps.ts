import { Position } from "./Position";
import { Velocity } from "./Velocity";

export interface EnemyProps {
    position: Position;
    velocity: Velocity;
    hp: number;
    damage: number;
    currency_drop: number;
}

