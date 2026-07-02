import { useState } from 'react';
import axios from 'axios';

const AIHelper = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newConversation = [...conversation, { sender: 'user', text: message }];
    setConversation(newConversation);
    setMessage('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify({ messages: newConversation });
      const res = await axios.post('/api/ai/chat', body, config);

      const aiMessage = { sender: 'ai', text: res.data.response };
      setConversation([...newConversation, aiMessage]);

    } catch (err) {
      console.error(err.response.data);
      const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error.' };
      setConversation([...newConversation, errorMessage]);
    }
  };

  return (
    <div>
      <h2>AI Project Helper</h2>
      <div className="chat-window">
        {conversation.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask the AI for help..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default AIHelper;