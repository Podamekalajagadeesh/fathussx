import { useState, useEffect } from 'react';
import api from '../services/api';
import SubNav from '../components/SubNav';

const BadgeNav = [
  { to: '/badges', label: 'All Badges', end: true },
  { to: '/my-badges', label: 'My Badges' },
];

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await api.get('/api/badges');
        setBadges(res.data);
      } catch (err) {
        setError('Failed to fetch badges.');
      }
    };
    fetchBadges();
  }, []);

  return (
    <div className="badges-container">
      <SubNav links={BadgeNav} />
      <h1>Badges</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="badge-list">
        {badges.map(badge => (
          <div key={badge.id} className="badge-card">
            <img src={badge.icon} alt={badge.name} />
            <h2>{badge.name}</h2>
            <p>{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
