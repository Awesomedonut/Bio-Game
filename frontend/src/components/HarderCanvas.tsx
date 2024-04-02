import { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasProps } from '../interfaces/CanvasProps';
import { Player } from '../classes/Player';
import { Projectile } from '../classes/Projectile';
import { Enemy } from '../classes/Enemy';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Shop from '../components/Shop';
import { EnemyInterface } from '../interfaces/Enemy';
import PlayerInterface from '../interfaces/Player';

const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com/";

const HarderCanvas: React.FC<CanvasProps> = ({ width, height }) => {
    // Use the existing code structure but adjust the variables for difficulty
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [playerData, setPlayer] = useState<PlayerInterface | null>(null);
    const [enemiesData, setEnemies] = useState<EnemyInterface[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [showShop, setShowShop] = useState(false);

    // Adjusted player variables for difficulty
    let PLAYER_DAMAGE = useRef(1);  // Consider keeping damage the same to maintain game balance
    let PLAYER_SPEED = useRef(1.2);  // Increase player speed slightly for more challenging dodging
    let PLAYER_NUM_PROJECTILES = useRef(1);  // Keep the number of projectiles the same
    let PLAYER_PROJECTILE_SPEED = useRef(1.2);  // Increase projectile speed for faster gameplay
    let PLAYER_HP = useRef(0.8);  // Reduce player HP for increased difficulty
    let PLAYER_CURRENCY = useRef(1);

    // Adjusted enemy spawn rate and enemy stats to increase difficulty
    const ENEMY_SPAWN_RATE = 2500;  // Reduce spawn rate time for more enemies
    const ENEMY_SPEED_MULTIPLIER = 1.2;  // Increase enemy speed
    const ENEMY_HP_MULTIPLIER = 1.2;  // Increase enemy HP

    // Use the same useEffect hooks and game setup logic but adjust for the new variables

    useEffect(() => {
        // Fetch player and enemy data, then adjust for difficulty
        const fetchPlayer = async () => {
            // Existing fetch logic here
        };

        fetchPlayer();
    }, []);

    useEffect(() => {
        // Set up the canvas and context
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (playerData != null && enemiesData.length > 0 && canvas && ctx && !gameStarted) {
            // Adjust player stats based on new level
            PLAYER_DAMAGE.current = playerData.damage;
            PLAYER_SPEED.current *= playerData.movement_speed;  // Increase speed
            PLAYER_NUM_PROJECTILES.current = playerData.projectile_number;
            PLAYER_PROJECTILE_SPEED.current *= playerData.projectile_speed;  // Increase projectile speed
            PLAYER_HP.current *= playerData.hp;  // Reduce HP
            PLAYER_CURRENCY.current = playerData.currency;

            start(ctx, width, height);
            setGameStarted(true);
        }
    }, [width, height, playerData, enemiesData]);

    // Adjust the start function to include the new enemy spawn rate and adjusted enemy stats
    function start(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        // Existing start logic here

        const interval = window.setInterval(() => {
            // Existing enemy spawn logic here, but adjust enemy stats based on new multipliers
        }, ENEMY_SPAWN_RATE);
    }

    function upgradeDamage(): void {
        throw new Error('Function not implemented.');
    }

    function upgradeHp(): void {
        throw new Error('Function not implemented.');
    }

    function upgradeProjectileCount(): void {
        throw new Error('Function not implemented.');
    }

    function upgradeProjectileSpeed(): void {
        throw new Error('Function not implemented.');
    }

    function upgradeSpeed(): void {
        throw new Error('Function not implemented.');
    }

    // Use the existing rendering logic but ensure it uses the new adjusted variables

    return (
        <h1>test</h1>
        // <>
        //     <canvas ref={canvasRef} width={width} height={height} />
        //     {showShop && <Shop upgradeDamage={upgradeDamage} upgradeHp={upgradeHp} upgradeProjectileCount={upgradeProjectileCount}
        //         upgradeProjectileSpeed={upgradeProjectileSpeed} upgradeSpeed={upgradeSpeed} />}
        // </>
    );
};

export default HarderCanvas;
