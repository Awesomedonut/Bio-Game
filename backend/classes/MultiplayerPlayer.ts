import { Position } from "../interfaces/Position";

export class MultiplayerPlayer {
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
}