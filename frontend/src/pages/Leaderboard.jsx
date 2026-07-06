import { useState, useEffect } from 'react';
import api from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/api/gamification/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        setError('Failed to fetch leaderboard.');
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container card">
      <h1>Leaderboard</h1>
      {error && <div className="error-message">{error}</div>}
      <ol>
        {leaderboard.map((user, index) => (
          <li key={index}>
            <span>{user.username}</span>
            <span>{user.total_points} points</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;