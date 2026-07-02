import { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/api/leaderboard', {
          headers: { 'x-auth-token': token },
        });
        setLeaderboard(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      }
    };

    fetchLeaderboard();
  }, []);

  if (error) return <div>{error}</div>;
  if (leaderboard.length === 0) return <div>The leaderboard is currently empty.</div>;

  return (
    <div>
      <h1>Leaderboard</h1>
      <ol>
        {leaderboard.map((user, index) => (
          <li key={index}>
            <strong>{user.username}</strong> - {user.completed_tasks} tasks completed
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;