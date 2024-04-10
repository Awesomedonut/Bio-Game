// InstructionsPopup.js

import React from 'react';
import '../styles/instructionsPopup.css'; 

interface InstructionsPopupProps {
    onClose: () => void; // Defines a function type that takes no arguments and returns void
    gameLevel: 'flappy' | 'asteroid' | 'multi';
}


const InstructionsPopup: React.FC<InstructionsPopupProps> = ({ onClose, gameLevel }) => {
    let instructionsText: string;

        // Determine instructions based on the game level
        if (gameLevel === 'flappy') {
            instructionsText = "Press Space to jump and avoid the obstacles. As the bacteria, find a way into the human body. The obstacles represent mucous membranes, which produce mucus and contain specialized cells that help trap and remove bacteria. Your goal is to dodge these obstacles!";
        } else if (gameLevel === 'asteroid') {
            instructionsText = "Change directions using the A and D keys, move forward using the W key, and shoot using the Space key. Press P to open the shop; gain currency by killing enemies! Survive the innate immune response! The white blood cells kill bacteria by engulfing and breaking them down after contact; your goal is to avoid or shoot them. The green bullets represent the toxins that bacteria release to harm the human body.";
        } else if (gameLevel == 'multi') {
            instructionsText = "Use WASD to move. Avoid collision with the white blood cells and survive as long as possible!";
        }else {
            instructionsText = "Invalid game level.";
        }
        
    return (
        <div className="instructionsPopup">
            <div className="instructionsContainer">
                <h2>Game Instructions</h2>
                <p>{instructionsText}</p>
                <button onClick={onClose}>Start Game</button>
            </div>
        </div>
    );
};

export default InstructionsPopup;
