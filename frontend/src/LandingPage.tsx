import React, { useState } from 'react';
import LoginModal from './LoginModal';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      <h1>Welcome to the Game</h1>
      <button onClick={() => setShowLogin(true)}>Login to Play</button>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default LandingPage;
