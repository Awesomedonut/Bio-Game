import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from './levelSelector'
import Leaderboard from './Leaderboard';
import '../styles/homepage.css';

const HomePage: React.FC = () => {
    const [showLevelSelector, setShowLevelSelector] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
 
    const navigate = useNavigate();

    const closeLevelSelector = () => {
      setShowLevelSelector(false);
    }

    const closeLeaderboard = () => {
      setShowLeaderboard(false);
    }
  
    const redirectMultiplayer = () => {
      navigate('/multiplayer');
    }

    return (
      <div className='homepage'>
        <h1 className="biogameHeader">Anatomy Adventure</h1>
        console.log("ISAAC WAS HERE")
        <button className="button" onClick={() => setShowLevelSelector(true)}>Singleplayer</button>
        <button className='button' onClick={() => redirectMultiplayer()}>Multiplayer</button>
        {showLevelSelector && <LevelSelector closeLevelSelector={closeLevelSelector}></LevelSelector>}
        <button className="button" onClick={() => setShowLeaderboard(true)}>Leaderboards</button>
        {showLeaderboard && <Leaderboard closeLeaderboard={closeLeaderboard}></Leaderboard>}

      </div>
    );
  };
  
  export default HomePage;
  