import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/levelSelector.css';

type LevelSelectorProps = {
    closeLevelSelector: () => void,
};

type LevelObject = {
    level: number,
    unlocked: boolean,
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ closeLevelSelector }) => {
    const maxLevel: number = 3; // adjust based on player's progress

    const levels: Array<LevelObject> = [];
    const MAX_LEVELS: number = 4; // Total number of levels
    for (let i: number = 1; i <= MAX_LEVELS; i++) {
        let unlocked: boolean = i <= maxLevel;
        levels.push({ level: i, unlocked: unlocked });
    }

    const navigate = useNavigate();

    const handleLevelSelected = (levelObject: LevelObject) => {
        // Navigate to the Flappy level if level 1 is selected
        if (levelObject.level === 1) {
            navigate('/flappy');
        } else {
            // Placeholder for navigating to other levels

            console.log(`Navigate to level ${levelObject.level}`);
            navigate('/dialogue'); 
        }
    };

    return (
        <div className="popup">
            <div className="levelsPopupContainer">
                <div className="levelsHeader">
                    <div className="levelsHeading">Select Level</div>
                    <div className="closeButton" onClick={closeLevelSelector}>Close</div>
                </div>
                <div className="levelsContainer">
                    {levels.map((levelObject, index) => (
                        <div
                            key={index}
                            className={`levelButton ${levelObject.unlocked ? "unlocked" : "locked"}`}
                            onClick={() => levelObject.unlocked ? handleLevelSelected(levelObject) : undefined}
                        >
                            {levelObject.level === Infinity ? "Infinite" : levelObject.level}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LevelSelector;
