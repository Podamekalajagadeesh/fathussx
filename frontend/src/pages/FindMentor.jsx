import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const FindMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await api.get('/api/mentorship/mentors');
        setMentors(res.data);
      } catch (err) {
        setError('Failed to fetch mentors.');
      }
    };
    fetchMentors();
  }, []);

  return (
    <div className="find-mentor-container">
      <h1>Find a Mentor</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="mentor-list">
        {mentors.map(mentor => (
          <div key={mentor.id} className="mentor-card">
            <h2><Link to={`/profile/${mentor.username}`}>{mentor.username}</Link></h2>
            <p><strong>Skills:</strong> {mentor.skills.join(', ')}</p>
            <p><strong>Interests:</strong> {mentor.interests.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindMentor;