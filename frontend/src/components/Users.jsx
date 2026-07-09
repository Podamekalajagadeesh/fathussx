import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Users.css';

const getAvatarUrl = (name) => {
  const initials = (name || 'User')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase() || 'U';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
    <rect width="100%" height="100%" fill="#0f172a" />
    <circle cx="80" cy="60" r="28" fill="#22d3ee" />
    <rect x="32" y="95" width="96" height="36" rx="18" fill="#38bdf8" />
    <text x="50%" y="145" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#f8fafc">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/users');
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handlePromote = async (userId) => {
    try {
      await api.put(`/api/users/${userId}/promote`);
      // Optionally, refetch users or update the user's role in the state
    } catch (err) {
      setError('Failed to promote user.');
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="users-container">
      <h1 className="users-title">Meet the Community</h1>
      <div className="users-search">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card-link">
            <div className="user-card card">
              <Link to={`/profile/${user.id}`}>
                <img src={user.avatar_url || getAvatarUrl(user.username)} alt={`${user.username}'s avatar`} className="user-avatar" />
                <h3 className="user-name">{user.username}</h3>
                <p className="user-skills">
                  {user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'No skills listed.'}
                </p>
              </Link>
              {currentUser && currentUser.role === 'admin' && (
                <button onClick={() => handlePromote(user.id)}>Promote to Admin</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;