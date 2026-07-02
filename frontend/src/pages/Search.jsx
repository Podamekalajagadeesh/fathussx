import { useState } from 'react';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/api/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      setError('Failed to perform search.');
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for gigs, projects, learning..."
        />
        <button type="submit">Search</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {results && (
        <div className="search-results">
          <h2>Gigs</h2>
          {results.gigs.length > 0 ? (
            <ul>
              {results.gigs.map(gig => (
                <li key={gig.id}>{gig.title}</li>
              ))}
            </ul>
          ) : (
            <p>No gigs found.</p>
          )}

          <h2>Projects</h2>
          {results.projects.length > 0 ? (
            <ul>
              {results.projects.map(project => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
          ) : (
            <p>No projects found.</p>
          )}

          <h2>Learning</h2>
          {results.courses.length > 0 ? (
            <ul>
              {results.courses.map(course => (
                <li key={course.id}>{course.title}</li>
              ))}
            </ul>
          ) : (
            <p>No learning resources found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;