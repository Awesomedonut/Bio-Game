import React, { useState } from 'react';

interface Message {
  role: string;
  content: string;
}

const Dialogue: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = { role: 'player', content: inputText };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await fetch('https://backend-dot-group-project372.uw.r.appspot.com/dialogue', {
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
    <div>
      <div id="chatbox">
        {messages.map((message, index) => (
          <div key={index} className={message.role}>
            <strong>{message.role === 'player' ? 'Bacteria: ' : 'White blood cell: '}</strong>
            {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Dialogue;
