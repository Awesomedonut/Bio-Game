// InstructionsPopup.js

import React from 'react';
import '../styles/instructionsPopup.css'; 

interface InstructionsPopupProps {
    onClose: () => void; // Defines a function type that takes no arguments and returns void
}


const InstructionsPopup: React.FC<InstructionsPopupProps> = ({ onClose }) => {
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
