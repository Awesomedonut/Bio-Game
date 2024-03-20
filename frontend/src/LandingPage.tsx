import React, { useState } from 'react';
import LoginModal from './LoginModal';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      { !showLogin &&       
        <div>
          <h1>Welcome to the Game</h1>
          <button onClick={() => setShowLogin(true)}>Login to Play</button>
        </div>
      }
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default LandingPage;
