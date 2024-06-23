import React, { useState } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('https://api.anthropic.com/v1/claude', {
        prompt: input,
        max_tokens: 150,
        n: 1,
        stop: ['\n'],
      }, {
        headers: {
          'Authorization': `Bearer YOUR_CLAUDE_API_KEY`,
        },
      });

      const aiMessage = response.data.choices[0].text.trim();
      setMessages([...newMessages, { sender: 'ai', text: aiMessage }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([...newMessages, { sender: 'ai', text: 'Error fetching response from AI' }]);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
