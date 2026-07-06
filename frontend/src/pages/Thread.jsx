import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Thread = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await api.get(`/api/forum/threads/${id}`);
        setThread(res.data.thread);
        setPosts(res.data.posts);
      } catch (err) {
        setError('Failed to fetch thread.');
      }
    };
    fetchThread();
  }, [id]);

  const handleVote = async (postId, voteType) => {
    try {
      await api.post('/api/reputation/vote', {
        content_type: 'forum_posts',
        content_id: postId,
        vote_type: voteType,
      });
    } catch (err) {
      setError('Failed to record vote.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!thread) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="thread-container">
      <h1>{thread.title}</h1>
      <p>by {thread.author_username} on {new Date(thread.created_at).toLocaleDateString()}</p>
      
      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-item card">
            <p>{post.content}</p>
            <p>by {post.author_username} on {new Date(post.created_at).toLocaleDateString()}</p>
            <div className="vote-buttons">
              <button onClick={() => handleVote(post.id, 'up')}>Upvote</button>
              <button onClick={() => handleVote(post.id, 'down')}>Downvote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Thread;