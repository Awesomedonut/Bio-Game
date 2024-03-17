import { Enemy } from "../classes/Enemy";
import { Position } from "../interfaces/Position";
import { Projectile } from "../classes/Projectile";

// function to detect if projectiles and asteroid collide
export function circleCollision(enemy: Enemy, projectile: Projectile): Boolean {
    let xDifference = projectile.position.x - enemy.position.x;
    let yDifference = projectile.position.y - enemy.position.y;

    const distance = Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2));
    if (distance <= projectile.radius + enemy.radius) {
        return true;
    }

    return false;
}

// function to detect if an enemy is touching a player
// Based on this Circle-Point Collision Algorithm: https://www.jeffreythompson.org/collision-detection/point-circle.php
export function playerHit(enemy: Enemy, vertices: Position[]): Boolean {
    // Loop through 3 points of the triangle, if any are in the enemy's radius return true, else return false
    for (let i = 0; i < vertices.length; i++) {
        let v = vertices[i];

        let xDifference = v.x - enemy.position.x;
        let yDifference = v.y - enemy.position.y;
        let distance = Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2));

        if (distance <= enemy.radius) {
            return true;
        }
    }


    return false;
}


