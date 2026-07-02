import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import useChat from '../hooks/useChat';
import './Messenger.css';

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const { messages, sendMessage } = useChat(selectedConversation?.id);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/api/messages/conversations');
        setConversations(res.data);
      } catch (err) {
        setError('Error fetching conversations.');
      }
    };
    if (user) fetchConversations();
  }, [user]);

  const handleSelectUser = useCallback(async (selectedUser) => {
    setSelectedConversation({ id: selectedUser.id, username: selectedUser.username });
    if (!conversations.some(c => c.id === selectedUser.id)) {
      setConversations(prev => [{ id: selectedUser.id, username: selectedUser.username }, ...prev]);
    }
    setSearchTerm('');
    setSearchResults([]);
  }, [conversations]);

  useEffect(() => {
    if (location.state?.recipientId) {
      handleSelectUser({
        id: location.state.recipientId,
        username: location.state.recipientUsername
      });
    }
  }, [location.state, handleSelectUser]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const res = await api.get(`/api/users/search?q=${searchTerm}`);
        const filteredResults = res.data.filter(u => 
          u.id !== user.id && !conversations.some(c => c.id === u.id)
        );
        setSearchResults(filteredResults);
      } catch (err) {
        console.error('Error searching users:', err);
      }
    };

    const debounceSearch = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm, user, conversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messenger-container">
      <div className="conversations-list card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((u) => (
              <div key={u.id} className="search-result-item" onClick={() => handleSelectUser(u)}>
                {u.username}
              </div>
            ))}
          </div>
        )}
        <h2>Conversations</h2>
        {error && <p className="error">{error}</p>}
        {conversations.map((convo) => (
          <div
            key={convo.id}
            className={`conversation-item ${selectedConversation?.id === convo.id ? 'selected' : ''}`}
            onClick={() => handleSelectUser(convo)}
          >
            <div className="convo-info">
              <strong>{convo.username}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-window card">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h3>{selectedConversation.username}</h3>
              <Link to={`/profile/${selectedConversation.id}`} className="view-profile-link">View Profile</Link>
            </div>
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}>
                  <div className="message-content">
                    <p>{msg.content}</p>
                    <span className="timestamp">{formatTimestamp(msg.created_at)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit" className="btn">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation or search for a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;