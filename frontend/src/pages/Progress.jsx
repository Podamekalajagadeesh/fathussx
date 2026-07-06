import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import './Progress.css';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const res = await api.get('/api/learning/progress');
        setProgress(res.data);
      } catch (err) {
        setError('Failed to load your progress.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!progress) return <div>No progress data available.</div>;

  return (
    <div className="progress-container">
      <h1>My Progress</h1>
      <div className="progress-summary card">
        <div className="summary-item">
          <span className="summary-value">{progress.points || 0}</span>
          <span className="summary-label">Points Earned</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{progress.completed_courses || 0}</span>
          <span className="summary-label">Courses Completed</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{progress.badges ? progress.badges.length : 0}</span>
          <span className="summary-label">Badges Unlocked</span>
        </div>
      </div>

      <div className="badges-section card">
        <h2>My Badges</h2>
        {progress.badges && progress.badges.length > 0 ? (
          <div className="badges-grid">
            {progress.badges.map(badge => (
              <div key={badge.id} className="badge">
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No badges earned yet. Keep learning to unlock them!</p>
        )}
      </div>
    </div>
  );
};

export default Progress;