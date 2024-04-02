import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/levelSelector.css';

type LevelSelectorProps = {
    closeLevelSelector: () => void;
};

type LevelObject = {
    level: number;
    unlocked: boolean;
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ closeLevelSelector }) => {
    const maxLevel = 3; // adjust based on player's progress

    const levels: LevelObject[] = Array.from({ length: 4 }, (_, index) => ({
        level: index + 1,
        unlocked: index + 1 <= maxLevel,
    }));

    const navigate = useNavigate();

    const handleLevelSelected = (level: number) => {
        switch (level) {
            case 1:
                navigate('/intro');
                break;
            case 2:
                navigate('/game');
                break;
            default:
                console.log(`Navigate to level ${level}`);
                navigate('/dialogue');
                break;
        }
    };

    return (
        <div className="popup">
            <div className="levelsPopupContainer">
                <div className="levelsHeader">
                    <div className="levelsHeading">Select Level</div>
                    <div className="closeButton" onClick={closeLevelSelector}>
                        Close
                    </div>
                </div>
                <div className="levelsContainer">
                    {levels.map((levelObject) => (
                        <div
                            key={levelObject.level}
                            className={`levelButton ${levelObject.unlocked ? 'unlocked' : 'locked'}`}
                            onClick={() => levelObject.unlocked && handleLevelSelected(levelObject.level)}
                        >
                            {levelObject.level === Infinity ? 'Infinite' : levelObject.level}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LevelSelector;
