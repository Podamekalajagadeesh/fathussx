import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/api/search/users?q=${query}`);
      setResults(res.data);
    } catch (err) {
      setError('Failed to search for users.');
    }
  };

  return (
    <div className="user-search-container">
      <h1>User Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or skill"
        />
        <button type="submit">Search</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="user-search-results">
        {results.map(user => (
          <div key={user.id} className="user-search-result">
            <Link to={`/profile/${user.username}`}>{user.username}</Link>
            <p>{user.skills.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;