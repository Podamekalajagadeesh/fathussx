import { useEffect, useState, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const useChat = (conversationId) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';

    socketRef.current = io(socketUrl, {
      query: { userId: user.id },
    });

    socketRef.current.emit('joinConversation', conversationId);

    socketRef.current.on('previousMessages', (previousMessages) => {
      setMessages(previousMessages);
    });

    socketRef.current.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [conversationId, user]);

  const sendMessage = (content) => {
    socketRef.current.emit('sendMessage', { conversationId, content });
  };

  return { messages, sendMessage };
};

export default useChat;