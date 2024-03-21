import React, { useState } from 'react';
import LevelSelector from './levelSelector'
import '../styles/homepage.css';

const HomePage: React.FC = () => {
    const [showLevelSelector, setShowLevelSelector] = useState(false);
  
    const closeLevelSelector = () => {
      setShowLevelSelector(false);
    }
  
    return (
      <div className='homepage'>
        <h1 className="biogameHeader">Bio-Game</h1>
        <button className="button" onClick={() => setShowLevelSelector(true)}>Play!</button>
        {showLevelSelector && <LevelSelector closeLevelSelector={closeLevelSelector}></LevelSelector>}
      </div>
    );
  };
  
  export default HomePage;
  