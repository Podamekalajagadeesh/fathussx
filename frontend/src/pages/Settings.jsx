import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Settings = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState({ username: '', email: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setUser({ username: authUser.username, email: authUser.email });
      setLoading(false);
    }
  }, [authUser]);

  const handleProfileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/settings/profile', user);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/settings/password', password);
      alert('Password updated successfully!');
      setPassword({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error('Failed to update password.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Profile Settings</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={user.username}
                onChange={handleProfileChange}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={user.email}
                onChange={handleProfileChange}
                placeholder="Email"
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="form-control"
                value={password.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-control"
                value={password.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
              />
            </div>
            <button type="submit" className="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;