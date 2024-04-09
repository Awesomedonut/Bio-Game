// Intro.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INTRO_TEXT_LIST } from '../Constants';
const Intro: React.FC = () => {
  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState(0); // initial value is 0

  useEffect(() => {
    const handleSpaceBar = (event: KeyboardEvent) => {
      // Allow incrementing currentSection to textSections.length + 1
      if (event.code === 'Space' && currentSection <= INTRO_TEXT_LIST.length) {
        event.preventDefault(); // Prevent the default action to avoid scrolling the page
        setCurrentSection(currentSection + 1);
      }
    };

    window.addEventListener('keydown', handleSpaceBar);

    // Cleanup to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleSpaceBar);
    };
  }, [currentSection, INTRO_TEXT_LIST.length]);

  return (
    <div>
      <h1>Welcome!</h1>
      {currentSection <= INTRO_TEXT_LIST.length ? (
        <div>
          <h2>Press spacebar to continue</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{INTRO_TEXT_LIST[currentSection - 1]}</p>
        </div>
      ) : (
        <div>
          <h2>Do you still have any questions?</h2>
          <button onClick={() => navigate('/dialogue')}>Ask questions!</button>
          <button onClick={() => navigate('/flappy')}>Start Game</button>
        </div>
      )}
    </div>
  );
  
};

export default Intro;
