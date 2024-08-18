import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineMessage, AiOutlineClose } from 'react-icons/ai';
import {marked} from 'marked';
import { chatbotApiKey } from './assets';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ sender: 'bot', text: "Hello, How can I help you?" }]);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const chatbotRef = useRef(null);
  const isDragging = useRef(false);
  const [color,setColor]=useState('lightgreen')


  const { GoogleGenerativeAI } = require('@google/generative-ai');

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(chatbotApiKey);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const handleSend = async () => {
    setColor('green');
    setTimeout(() => {
      setColor('lightgreen');
    }, 100);
    if (!input.trim()) return;
    try {
      // Add the user's message to the messages state
      setMessages([...messages, { sender: 'user', text: input }]);

      const result = await model.generateContent(input);
      const response = await result.response;
      const botMessage = response.text();


      // Add the formatted bot's response to the messages state
      setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: marked(botMessage) }]);
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setError('You have reached the rate limit. Please wait and try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Error:', error);
    }

    setInput('');
  };


  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (chatbotRef.current) {
      chatbotRef.current.style.position = 'fixed';
      chatbotRef.current.style.bottom = '20px';
      chatbotRef.current.style.right = '20px';
    }
  }, [isOpen]);

  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          cursor: 'pointer',
          backgroundColor: 'lightgreen',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        <AiOutlineMessage size={30} />
      </div>

      {isOpen && (
        <div
          ref={chatbotRef}
          style={{
            width: '300px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 1000,
            backgroundColor: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'lightgreen', color: '#fff' }}>
            <h2 style={{ margin: 0 }}>Chatbot</h2>
            <AiOutlineClose style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div style={{ padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {messages.map((message, index) => (
              <div key={index} style={{ textAlign: message.sender === 'bot' ? 'left' : 'right' }}>
                <p style={{ margin: '5px 0', padding: '10px', backgroundColor: message.sender === 'bot' ? '#f1f1f1' : 'lightgreen', color: message.sender === 'bot' ? '#000' : '#fff', borderRadius: '10px', display: 'inline-block' }}>
                  {message.sender === 'bot' ? <span dangerouslySetInnerHTML={{ __html: message.text }} /> : message.text}
                </p>
              </div>
            ))}
          </div>
          {error && <p style={{ color: 'red', padding: '10px' }}>{error}</p>}
          <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, marginRight: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            <button onClick={handleSend} style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor:color, color: '#fff',cursor:'pointer' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;