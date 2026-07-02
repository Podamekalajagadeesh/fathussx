import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

const SearchResults = () => {
  const [results, setResults] = useState({ users: [], gigs: [], courses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        // This endpoint doesn't exist yet, but we're preparing the frontend.
        const res = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        setError('Failed to fetch search results. Is the search endpoint ready?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="search-results-container card">
      <h2>Search Results for &quot;{query}&quot;</h2>

      <div className="card">
        <h3>Users</h3>
        {results.users.length > 0 ? (
          <ul>
            {results.users.map(user => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      <div className="card">
        <h3>Gigs</h3>
        {results.gigs.length > 0 ? (
          <ul>
            {results.gigs.map(gig => (
              <li key={gig.id}>{gig.title}</li>
            ))}
          </ul>
        ) : (
          <p>No gigs found.</p>
        )}
      </div>

      <div className="card">
        <h3>Courses</h3>
        {results.courses.length > 0 ? (
          <ul>
            {results.courses.map(course => (
              <li key={course.id}>{course.title}</li>
            ))}
          </ul>
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;