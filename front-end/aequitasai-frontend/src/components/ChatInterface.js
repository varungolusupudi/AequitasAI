import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import './ChatInterface.css';

const ChatInterface = ({ activeSection }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  const legalDocuments = [
    'Non-Disclosure Agreement (NDA)',
    'Articles of Incorporation',
    'Employment Agreement',
    'Operating Agreement (for LLCs)',
    'Will Document',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: input }],
        max_tokens: 1000
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const aiMessage = { role: 'assistant', content: response.data.choices[0]?.message?.content || 'No response from AI' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = { role: 'assistant', content: 'Error fetching response from AI' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>{activeSection}</h2>
      </div>
      {activeSection === 'legalDocs' && (
        <div className="document-list">
          <h3>Select a document type:</h3>
          {legalDocuments.map((doc, index) => (
            <button key={index} onClick={() => setInput(`Create a ${doc}`)}>
              {doc}
            </button>
          ))}
        </div>
      )}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="message assistant">Loading...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send)"
          rows="3"
        />
        <button onClick={sendMessage} className="send-btn" disabled={isLoading}>
          <PaperAirplaneIcon className="icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;