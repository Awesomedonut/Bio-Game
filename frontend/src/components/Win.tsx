import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

const Win: React.FC = () => {
  const navigate = useNavigate(); // Use the useNavigate hook for navigation

  // Function to handle click event for the button
  const handleBackToHome = () => {
    navigate('/home'); // Navigate back to the home route
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Congratulations, You Won!</h1> {/* Display the winning message */}
      <p>Would you like to play again?</p>
      {/* Button to go back to home or play again */}
      <button onClick={handleBackToHome} style={{ fontSize: '18px', padding: '10px 20px', cursor: 'pointer' }}>
        Back to Home / Play Again
      </button>
    </div>
  );
};

export default Win;
