import { Position } from "./Position";
import { Velocity } from "./Velocity";

export interface PlayerProps {
    id: string;
    position: Position;
    velocity: Velocity;
    hp: number;
}