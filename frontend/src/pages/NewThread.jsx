import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewThread = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/forum/new-thread', { title, content });
      navigate(`/forum/threads/${res.data.id}`);
    } catch (err) {
      setError('Failed to create new thread.');
    }
  };

  return (
    <div className="new-thread-container card">
      <h1>Create New Thread</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Create Thread</button>
      </form>
    </div>
  );
};

export default NewThread;