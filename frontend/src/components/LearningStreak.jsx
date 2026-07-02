import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LearningStreak = () => {
  const [streak, setStreak] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) return;
      try {
        const res = await api.get('/api/learning/streak');
        setStreak(res.data.streak);
      } catch (err) {
        console.error('Failed to load learning streak.');
      }
    };

    fetchStreak();
  }, [user]);

  return (
    <div className="learning-streak-container">
      <h3>Learning Streak</h3>
      <p>You have a {streak}-day streak!</p>
    </div>
  );
};

export default LearningStreak;