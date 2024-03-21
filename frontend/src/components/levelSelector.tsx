import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/levelSelector.css';

type LevelSelectorProps = {
    closeLevelSelector: () => void,
}

type LevelObject = {
    level: number,
    unlocked: boolean
}


const LevelSelector: React.FC<LevelSelectorProps> = ({ closeLevelSelector }) => {
    // Implement endpoints to get this information per player
    const maxLevel: number = 0;

    const levels: Array<LevelObject> = []

    // Discuss how many levels is realistically implementable for the future
    const MAX_LEVELS: number = 25
    for (let i: number = 1; i <= MAX_LEVELS; i++) {
        let unlocked: boolean = false;
        if (i <= maxLevel) {
            unlocked = true;
        }
        const levelsObject: LevelObject = {
            level: i,
            unlocked: unlocked
        }
        levels.push(levelsObject);
    }

    const infiniteLevelObject: LevelObject = {
        level: Infinity,
        unlocked: true
    }
    levels.push(infiniteLevelObject);

    const navigate = useNavigate();
    const handleLevelSelected = () => {
        navigate('/dialogue');
    }

    return (
        <div className="popup">
            <div className="levelsPopupContainer">
                <div className="levelsHeader">
                    <div className="levelsHeading">Select Level</div>
                    <div className="closeButton" onClick={closeLevelSelector}>Close</div>
                </div>
                <div className="levelsContainer">
                    {
                        levels.map(levelObject => {
                            return <div className={`levelButton ${levelObject.unlocked ? "unlocked" : "locked"}`} onClick={levelObject.unlocked ? handleLevelSelected : () => {}}>{levelObject.level}</div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default LevelSelector;