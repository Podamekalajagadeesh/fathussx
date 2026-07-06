import { useState, useEffect } from 'react';
import api from '../services/api';
import SubNav from '../components/SubNav';

const BadgeNav = [
  { to: '/badges', label: 'All Badges' },
  { to: '/my-badges', label: 'My Badges', end: true },
];

const MyBadges = () => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBadges = async () => {
      try {
        const res = await api.get('/api/badges/my-badges');
        setBadges(res.data);
      } catch (err) {
        setError('Failed to fetch your badges.');
      }
    };
    fetchMyBadges();
  }, []);

  return (
    <div className="my-badges-container">
      <SubNav links={BadgeNav} />
      <h1>My Badges</h1>
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

export default MyBadges;
