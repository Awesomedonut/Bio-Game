import React, { useState } from 'react';
import LevelSelector from './levelSelector'

const HomePage: React.FC = () => {
    const [showLevelSelector, setShowLevelSelector] = useState(false);
  
    const closeLevelSelector = () => {
      setShowLevelSelector(false);
    }
  
    return (
      <div>
        <h1>Bio-Game</h1>
        <button onClick={() => setShowLevelSelector(true)}>Play!</button>
        {showLevelSelector && <LevelSelector closeLevelSelector={closeLevelSelector}></LevelSelector>}
      </div>
    );
  };
  
  export default HomePage;
  