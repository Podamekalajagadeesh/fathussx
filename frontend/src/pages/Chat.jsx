import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';

const Chat = () => {
  const { recipientId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chat/messages/${recipientId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages.');
      }
    };
    fetchMessages();

    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';

    socketRef.current = io(socketUrl);
    socketRef.current.on('private message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [recipientId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = {
      recipientId,
      message: newMessage,
    };
    socketRef.current.emit('private message', message);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;