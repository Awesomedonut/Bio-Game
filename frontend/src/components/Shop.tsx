import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shop.css';

type ShopProps = {
    upgradeDamage: () => void;
    upgradeProjectileCount: () => void;
    upgradeProjectileSpeed: () => void;
    upgradeSpeed: () => void;
    upgradeHp: () => void;
}

const Shop: React.FC<ShopProps> = ({upgradeDamage, upgradeProjectileCount, upgradeProjectileSpeed, upgradeSpeed}) => {

    return (
        <div className="popup">
            <div className="shopPopupContainer">

                <div className="shopProperty">
                    <p>Upgrade Damage</p>
                    <div className="propertyUpgradeButton" onClick={upgradeDamage}>+</div>
                </div>

                <div className="shopProperty">
                    <p>Upgrade Movement Speed</p>
                    <div className="propertyUpgradeButton" onClick={upgradeSpeed}>+</div>
                </div>

                <div className="shopProperty">
                    <p>Upgrade Number of Projectiles</p>
                    <div className="propertyUpgradeButton" onClick={upgradeProjectileCount}>+</div>
                </div>

                <div className="shopProperty">
                    <p>Upgrade Projectile Speed</p>
                    <div className="propertyUpgradeButton" onClick={upgradeProjectileSpeed}>+</div>
                </div>
            </div>
        </div>
    )
}

export default Shop;