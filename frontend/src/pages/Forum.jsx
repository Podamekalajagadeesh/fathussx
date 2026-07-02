import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get('/api/forum/threads');
        setThreads(res.data);
      } catch (err) {
        setError('Failed to fetch forum threads.');
      }
    };
    fetchThreads();
  }, []);

  return (
    <div className="forum-container">
      <h1>Discussion Forum</h1>
      <Link to="/forum/new-thread" className="btn btn-primary">Create New Thread</Link>
      {error && <div className="error-message">{error}</div>}
      <div className="thread-list">
        {threads.map(thread => (
          <div key={thread.id} className="thread-item card">
            <h2><Link to={`/forum/threads/${thread.id}`}>{thread.title}</Link></h2>
            <p>by {thread.author_username} on {new Date(thread.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;