import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBadges = async () => {
      if (token) {
        try {
          const res = await api.get('/api/badges/my-badges');
          setBadges(res.data);
        } catch (err) {
          console.error('Failed to fetch badges:', err);
        }
      }
    };

    fetchBadges();
  }, [token]);

  if (badges.length === 0) {
    return <p>You haven&apos;t earned any badges yet.</p>;
  }

  return (
    <div className="card">
      <h3>My Badges</h3>
      <div className="badges-container">
        {badges.map(badge => (
          <div key={badge.id} className="badge">
            <i className={badge.icon}></i>
            <div className="badge-info">
              <strong>{badge.name}</strong>
              <p>{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;