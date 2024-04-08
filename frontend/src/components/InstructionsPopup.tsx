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
            instructionsText = "Here are the instructions for playing the game. Press Space to jump and avoid the obstacles.";
        } else if (gameLevel === 'asteroid') {
            instructionsText = "Here are the instructions for playing the game. Change directions using the A and D keys, move forward using the W key, and shoot using the Space key. Press P to open the shop; gain currency by killing enemies!";
        } else if (gameLevel == 'multi') {
            instructionsText = "Here are the instructions for playing the game. Change directions using the A and D keys, and move forward using the W key. Press P to open the shop; gain currency by killing enemies!";
        }else {
            instructionsText = "Invalid game level.";
        }
        
    return (
        <div className="instructionsPopup">
            <div className="instructionsContainer">
                <h2>Game Instructions</h2>
                <p>Here are the instructions for playing the game. Press Space to jump and avoid the obstacles.</p>
                <button onClick={onClose}>Start Game</button>
            </div>
        </div>
    );
};

export default InstructionsPopup;
