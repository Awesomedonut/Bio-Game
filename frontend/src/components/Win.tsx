import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import '../styles/Intro.css'; // Import the CSS file for styling

const Win: React.FC = () => {
  const navigate = useNavigate(); // Use the useNavigate hook for navigation

  // Function to handle click event for the button
  const handleBackToHome = () => {
    navigate('/home'); // Navigate back to the home route
  };

  return (
    <div className='homepage' style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Victory in the Microcosm!</h1> {/* Display the winning message */}
    <p className="outroText">Bravo! You've proven the formidable power of bacteria by overcoming the defenses of the human body. While this victory marks the end of the game, it's important to reflect on the real-world implications. In reality, bacterial infections can pose serious threats to human health, leading to illnesses that range from the mild to the life-threatening. This game serves as a reminder of the delicate balance within our bodies and the constant battle between our immune system and microbial invaders.</p>

<p className="outroText">In our daily lives, maintaining this balance is key to good health. Simple habits like regular hand washing, staying up-to-date with vaccinations, and leading a healthy lifestyle with a balanced diet and exercise can bolster our defenses against harmful bacteria. Remember, a strong immune system is our best protection against the myriad of microscopic challenges we face unknowingly every day.</p>
      <p>Will you challenge the defenses once more?</p>
      {/* Button to go back to home or play again */}
      <button onClick={handleBackToHome} style={{ fontSize: '18px', padding: '10px 20px', cursor: 'pointer' }}>
        Back to Home
      </button>
    </div>
  );
};

export default Win;
