// Intro.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Intro: React.FC = () => {
  const navigate = useNavigate();

  // Function to handle the submission of questions
  const handleSubmitQuestion = async (question: string) => {
    // Implement the API call to /dialogue endpoint with the question
    console.log(`Submitting question: ${question}`);
    // For now, just log the question. You'll replace this with your API call.
  };

  return (
    <div>
      <h1>Welcome to the Game</h1>
      <p>This is the intro of the game where we explain what's going on.</p>
      <button onClick={() => navigate('/game')}>Start Game</button>
      <div>
        <h2>Have a Question?</h2>
        <input type="text" placeholder="Ask your question here..." />
        <button onClick={() => handleSubmitQuestion('Your question here')}>Submit</button>
      </div>
    </div>
  );
};

export default Intro;
