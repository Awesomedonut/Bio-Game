import React, { useState } from 'react';
import LevelSelector from './levelSelector'
import Leaderboard from './Leaderboard';
import '../styles/homepage.css';

const HomePage: React.FC = () => {
    const [showLevelSelector, setShowLevelSelector] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
  
    const closeLevelSelector = () => {
      setShowLevelSelector(false);
    }

    const closeLeaderboard = () => {
      setShowLeaderboard(false);
    }
  
    return (
      <div className='homepage'>
        <h1 className="biogameHeader">Anatomy Adventure</h1>
        <button className="button" onClick={() => setShowLevelSelector(true)}>Play!</button>
        {showLevelSelector && <LevelSelector closeLevelSelector={closeLevelSelector}></LevelSelector>}
        <button className="button" onClick={() => setShowLeaderboard(true)}>Leaderboards</button>
        {showLeaderboard && <Leaderboard closeLeaderboard={closeLeaderboard}></Leaderboard>}

      </div>
    );
  };
  
  export default HomePage;
  