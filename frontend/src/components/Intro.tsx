// Intro.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Intro: React.FC = () => {
  const navigate = useNavigate();
  const textSections = [
    "Welcome, adventurer, to the hidden world inside the human body! It's a place of giant structures, twisty highways, and endless battles...",
    "..And YOU are about to get a front-row seat. You see, you're not just any visitor. You're E.coli, one of the millions of microbes that call our bodies home. Most of the time, you're a good citizen, but today...today, you're feeling mischievous.",
    "But how exactly did you, a tiny E.coli, end up in this giant human body? That's a great question! See, E.coli live in many places, including our intestines. They're usually helpful, even! They aid in digestion, which means they help break down our food so our bodies can absorb the nutrients.",
    "But sometimes, if someone eats food that isn't cleaned properly, or isn't cooked all the way through, E.coli from that food can hitch a ride into the intestines. That's what might have happened to you! Now you're on an unexpected adventure, and the human body isn't exactly prepared for a bunch of uninvited guests.",
    "Ready to cause a little trouble? Your mission, should you choose to accept it, is to invade! Explore the strange landscapes of the human body, dodge the defenses, and see how far you and your fellow bacteria can spread!",
    "THE BASICS\n\nMovement: Use the arrow keys to navigate your E.coli through the body's systems.\nDefenses: Be careful! The immune system will send out white blood cells to try and stop you. Watch their paths and dodge their attacks!\nKnowledge is Power: Along your journey, you'll find info about the world. Learn fun facts about the body parts you're exploring and the mighty immune system!",
    "Are you ready, brave microbe? Your Anatomy Adventure begins... NOW!"
  ];

  const [currentSection, setCurrentSection] = useState(0);

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

  useEffect(() => {
    const handleSpaceBar = (event: KeyboardEvent) => {
      if (event.code === 'Space' && currentSection < textSections.length - 1) {
        event.preventDefault(); // Prevent the default action to avoid scrolling the page
        setCurrentSection(currentSection + 1);
      }
    };

    window.addEventListener('keydown', handleSpaceBar);

    // Cleanup to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleSpaceBar);
    };
  }, [currentSection, textSections.length]);

  return (
    <div>
      {/* <h1>Welcome to the Game</h1>
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
      </div> */}
      <h1>Welcome!</h1>
      <h2>Press spacebar to continue</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{textSections[currentSection]}</p>
      {currentSection === textSections.length - 1 && (
        <button onClick={() => navigate('/flappy')}>Start Game</button>
      )}
    </div>
  );
};

export default Intro;
