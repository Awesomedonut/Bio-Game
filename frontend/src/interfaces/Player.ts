interface PlayerInterface {
    id: number | null;
    user_id: number | null;
    damage: number;
    projectile_number: number;
    projectile_speed: number;
    movement_speed: number;
    hp: number;
    currency: number;
}

export default PlayerInterface;