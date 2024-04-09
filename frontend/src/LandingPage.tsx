import React, { useState } from 'react';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const handleContinueAsGuest = () => {
    // Perform any necessary actions here before routing to the desired page
  navigate('/intro'); // Route to the desired guest-only page
};
  return (
    <div>
      { !showLogin && <div className="flexbox">
        <div className='welcome'>
            <h1>Welcome to the Game!</h1>
            <p>Created by Group 2 for CMPT 372! We hope you enjoy! :D</p>
            <div className="flex-container">
              <button onClick={() => setShowLogin(true)}>Login to Play</button>
              <button onClick={handleContinueAsGuest}>Continue As Guest</button>
            </div>
          </div>
      </div>      
      }
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default LandingPage;
