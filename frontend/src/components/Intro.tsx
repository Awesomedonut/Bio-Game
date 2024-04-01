// Intro.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Intro: React.FC = () => {
  const navigate = useNavigate();
  // State to hold the user's question
  const [userQuestion, setUserQuestion] = useState('');

  // Function to handle the submission of questions
  const handleSubmitQuestion = async () => {
    if (!userQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }
    console.log(`Submitting question: ${userQuestion}`);
    // Implement the API call to /dialogue endpoint with the question
    // Reset the question input after submission
    setUserQuestion('');
  };

  return (
    <div>
      <h1>Welcome to the Game</h1>
      <p>This is the intro of the game where we explain what's going on.</p>
      <button onClick={() => navigate('/game')}>Start Game</button>
      <div>
        <h2>Have a Question?</h2>
        <input 
          type="text" 
          placeholder="Ask your question here..." 
          value={userQuestion} // Bind the input value to userQuestion state
          onChange={(e) => setUserQuestion(e.target.value)} // Update state on input change
        />
        <button onClick={handleSubmitQuestion}>Submit</button>
      </div>
    </div>
  );
};

export default Intro;
