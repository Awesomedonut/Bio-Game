import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/dialogue.css';

interface Message {
  role: string;
  content: string;
}

const Dialogue: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const navigate = useNavigate();
  const handleStartGame = () => {
    navigate('/game');
  }

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = { role: 'player', content: inputText };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // const backendUri ="http://localhost:4000/dialogue";
    // const back = "https://backend-dot-group-project372.uw.r.appspot.com/dialogue";
    try {
      const response = await fetch('http://localhost:4000/dialogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });
      const data = await response.json();
      console.log("data is " + data);
      const apiResponse: Message = { role: 'white blood cell', content: data.message };
      setMessages((prevMessages) => [...prevMessages, apiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInputText('');
};

  return (
    <div className="dialogueContainer">
      <div id="chatbox">
        {messages.map((message, index) => (
          <div key={index} className={message.role}>
            <strong>{message.role === 'player' ? 'Bacteria: ' : 'White blood cell: '}</strong>
            {message.content}
          </div>
        ))}
      </div>
      <div className="dialogueInputBar">
        <input
          id="dialogueInput"
          type="text"
          value={inputText}
          placeholder="Enter text here..."
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="dialogueButton" onClick={sendMessage}>Send</button>
        <button className="dialogueButton start" onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
};

export default Dialogue;
