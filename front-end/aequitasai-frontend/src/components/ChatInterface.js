import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { getAuth } from 'firebase/auth';
import './ChatInterface.css';

const ChatInterface = ({ activeSection }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const messagesEndRef = useRef(null);

  const documentTypes = [
    {
      name: 'Non-Disclosure Agreement (NDA)',
      type: 1,
      prompt: "Create a Non-Disclosure Agreement (NDA) for the following parties. Please provide:\n1. Names of the parties involved\n2. Purpose of the NDA\n3. Definition of confidential information\n4. Duration of the agreement\n5. Any specific restrictions or obligations"
    },
    {
      name: 'Articles of Incorporation',
      type: 2,
      prompt: "Create Articles of Incorporation for a new company. Please provide:\n1. Company name\n2. Purpose of the corporation\n3. Number and types of authorized shares\n4. Names and addresses of initial directors\n5. Registered agent information\n6. Incorporator details"
    },
    {
      name: 'Employment Agreement',
      type: 3,
      prompt: "Create an Employment Agreement. Please provide:\n1. Employer and employee names\n2. Job title and description\n3. Start date and employment term\n4. Compensation details (salary, bonuses, benefits)\n5. Work hours and location\n6. Confidentiality and non-compete clauses (if applicable)"
    },
    {
      name: 'Operating Agreement (for LLCs)',
      type: 4,
      prompt: "Create an Operating Agreement for an LLC. Please provide:\n1. LLC name\n2. Members' names and ownership percentages\n3. Management structure (member-managed or manager-managed)\n4. Capital contributions\n5. Profit and loss allocation\n6. Voting rights and procedures\n7. Rules for admitting new members or transferring interests"
    },
    {
      name: 'Will Document',
      type: 5,
      prompt: "Create a Last Will and Testament. Please provide:\n1. Full name and address of the testator (person making the will)\n2. Names and relationships of beneficiaries\n3. Specific bequests or gifts\n4. Residuary estate distribution\n5. Executor name and powers\n6. Guardian for minor children (if applicable)\n7. Any specific funeral or burial wishes"
    },
    
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '' || !selectedDocumentType) return;

    const newMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      if (selectedDocumentType === 'environmental') {
        response = await axios.post('http://localhost:8000/environmental-guidance', {
          user_query: input,
          receiver_email: userEmail
        });
      } else {
        response = await axios.post('http://localhost:8000/generate-document', {
          llm_prompt: input,
          receiver_email: userEmail,
          document_type: selectedDocumentType
        });
      }

      console.log('Response from FastAPI:', response.data);

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.message,
        isHtml: selectedDocumentType === 'environmental'
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error details:', error);

      let errorMessage = 'Error generating response: ';
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        errorMessage += error.response.data.detail || error.response.statusText;
      } else if (error.request) {
        console.error('Error request:', error.request);
        errorMessage += 'No response received from server';
      } else {
        console.error('Error message:', error.message);
        errorMessage += error.message;
      }

      const errorResponseMessage = { role: 'assistant', content: errorMessage };
      setMessages(prevMessages => [...prevMessages, errorResponseMessage]);
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

  const handleDocumentSelection = (doc) => {
    setInput(doc.prompt);
    setSelectedDocumentType(doc.type);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>{activeSection}</h2>
      </div>
      {activeSection === 'legalDocs' && (
        <div className="document-list">
          <h3>Select a document type:</h3>
          {documentTypes.map((doc, index) => (
            <button key={index} onClick={() => handleDocumentSelection(doc)}>
              {doc.name}
            </button>
          ))}
        </div>
      )}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: msg.content }} />
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isLoading && <div className="message assistant">Generating response...</div>}
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