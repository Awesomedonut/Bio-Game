import React, { useState } from 'react';
import LoginModal from './LoginModal';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className='flexbox'>
      { !showLogin &&       
        <div className='welcome'>
          <h1>Welcome to the Game!</h1>
          <p>Created by Group 2 for CMPT 372! We hope you enjoy! :D</p>
          <button onClick={() => setShowLogin(true)}>Login to Play</button>
        </div>
      }
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default LandingPage;
