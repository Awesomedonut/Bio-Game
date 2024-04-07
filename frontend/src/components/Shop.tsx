import React, { MouseEventHandler, MutableRefObject, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shop.css';

type ShopProps = {
    playerDamageRef: number
    playerSpeedRef: number
    playerProjCountRef: number
    playerProjSpeedRef: number
    playerCurrencyRef: number

    upgradeDamage: () => void;
    upgradeProjectileCount: () => void;
    upgradeProjectileSpeed: () => void;
    upgradeSpeed: () => void;
    upgradeHp: () => void;

    decrementCurrencyRef: (cost: number) => void;
}

const Shop: React.FC<ShopProps> = ({playerDamageRef, playerSpeedRef, playerProjCountRef, playerProjSpeedRef, playerCurrencyRef,
    upgradeDamage, upgradeProjectileCount, upgradeProjectileSpeed, upgradeSpeed, decrementCurrencyRef}) => {

    const UPGRADE_COST_MULTIPLIER = 5;

    const [playerDamageUpgradeCount, setPlayerDamageUpgradeCount] = useState(playerDamageRef);
    const [playerSpeedUpgradeCount, setPlayerSpeedUpgradeCount] = useState(playerSpeedRef);
    const [playerProjSpeedUpgradeCount, setPlayerProjSpeedUpgradeCount] = useState(playerProjSpeedRef);
    const [playerProjCountUpgradeCount, setPlayerProjCountUpgradeCount] = useState(playerProjCountRef);
    const [playerCurrencyCount, setPlayerCurrencyCount] = useState(playerCurrencyRef);

    const decrementCurrency = (cost: number) => {
        setPlayerCurrencyCount(playerCurrencyCount - cost);
        decrementCurrencyRef(cost);
    }

    const canPlayerAffordUpgrade = (upgradeCount: number) => {
        const cost = upgradeCount * UPGRADE_COST_MULTIPLIER;

        if (playerCurrencyCount < cost) {
            return false;
        }

        return true;
    }
    const incrementDamageUpgradeCount = () => {
        if (!canPlayerAffordUpgrade(playerDamageUpgradeCount)) {
            return;
        }

        upgradeDamage();
        decrementCurrency(playerDamageUpgradeCount * UPGRADE_COST_MULTIPLIER);
        setPlayerDamageUpgradeCount(playerDamageUpgradeCount + 1);
    }

    const incrementSpeedUpgradeCount = () => {
        if (!canPlayerAffordUpgrade(playerSpeedUpgradeCount)) {
            return;
        }

        upgradeSpeed();
        decrementCurrency(playerSpeedUpgradeCount * UPGRADE_COST_MULTIPLIER);
        setPlayerSpeedUpgradeCount(playerSpeedUpgradeCount + 1);
    }

    const incrementProjSpeedUpgradeCount = () => {
        if (!canPlayerAffordUpgrade(playerProjSpeedUpgradeCount)) {
            return;
        }

        upgradeProjectileSpeed();
        decrementCurrency(playerProjSpeedUpgradeCount * UPGRADE_COST_MULTIPLIER);
        setPlayerProjSpeedUpgradeCount(playerProjSpeedUpgradeCount + 1);
    }

    const incrementProjCountUpgradeCount = () => {
        if (!canPlayerAffordUpgrade(playerProjCountUpgradeCount)) {
            return;
        }

        upgradeProjectileCount();
        decrementCurrency(playerProjCountUpgradeCount * UPGRADE_COST_MULTIPLIER);
        setPlayerProjCountUpgradeCount(playerProjCountUpgradeCount + 1);
    }


    return (
        <div className="popup">
            <div className="shopPopupContainer">

                <div className="shopProperty">
                    <p>Upgrade Damage {`(${playerDamageUpgradeCount})`}</p>
                    <div className="propertyUpgradeContainer">
                        <span>Upgrade Cost: {playerDamageUpgradeCount * UPGRADE_COST_MULTIPLIER}</span>
                        <div className={`propertyUpgradeButton ${(playerCurrencyCount >= playerDamageUpgradeCount * UPGRADE_COST_MULTIPLIER) ? "enabled" : "disabled"}`}
                            onClick={incrementDamageUpgradeCount}>+</div>
                    </div>
                </div>

                <div className="shopProperty">
                    <p>Upgrade Movement Speed {`(${playerSpeedUpgradeCount})`}</p>

                    <div className="propertyUpgradeContainer">
                        <span>Upgrade Cost: {playerSpeedUpgradeCount * UPGRADE_COST_MULTIPLIER}</span>
                        <div className={`propertyUpgradeButton ${(playerCurrencyCount >= playerSpeedUpgradeCount * UPGRADE_COST_MULTIPLIER) ? "enabled" : "disabled"}`}
                            onClick={incrementSpeedUpgradeCount}>+</div>
                    </div>
                    
                </div>

                <div className="shopProperty">
                    <p>Upgrade Number of Projectiles {`(${playerProjCountUpgradeCount})`}</p>
                    <div className="propertyUpgradeContainer">
                        <span>Upgrade Cost: {playerProjCountUpgradeCount * UPGRADE_COST_MULTIPLIER}</span>
                        <div className={`propertyUpgradeButton ${(playerCurrencyCount >= playerProjCountUpgradeCount * UPGRADE_COST_MULTIPLIER) ? "enabled" : "disabled"}`}
                            onClick={incrementProjCountUpgradeCount}>+</div>
                    </div>
                </div>

                <div className="shopProperty">
                    <p>Upgrade Projectile Speed {`(${playerProjSpeedUpgradeCount})`}</p>
                    <div className="propertyUpgradeContainer">
                        <span>Upgrade Cost: {playerProjSpeedUpgradeCount * UPGRADE_COST_MULTIPLIER}</span>
                        <div className={`propertyUpgradeButton ${(playerCurrencyCount >= playerProjSpeedUpgradeCount * UPGRADE_COST_MULTIPLIER) ? "enabled" : "disabled"}`}
                            onClick={incrementProjSpeedUpgradeCount}>+</div>
                    </div>  
                </div>

                <div className='currency'>Currency: {playerCurrencyCount}</div>
            </div>
        </div>
    )
}

export default Shop;