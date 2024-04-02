import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dialogue.css';
import callApi from '../api/Dialogue';
import { Message } from "../models/Message";

const Dialogue: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const navigate = useNavigate();
  const handleStartGame = () => {
    navigate('/flappy');
  }

  const appendNewBotMessage = (inputText: string) => {
    appendNewMessage(inputText, "bot");
  }

  const appendNewMessage = (inputText: string, role: string) => {
    const newMessage: Message = { role: role, content: inputText };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    appendNewMessage(inputText, "player");
    callApi(inputText, appendNewBotMessage);
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