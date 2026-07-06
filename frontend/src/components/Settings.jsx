import { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    walletAddress: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setFormData({
          username: res.data.username,
          email: res.data.email,
          walletAddress: res.data.wallet_address || '',
        });
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
    fetchUser();
  }, []);

  const { username, email, walletAddress } = formData;
  const { currentPassword, newPassword } = passwordData;

  const onProfileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onPasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const onProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/settings/profile', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setSuccess('Profile updated successfully');
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      setSuccess('');
    }
  };

  const onWalletSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/web3/wallet', { walletAddress }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setSuccess('Wallet address updated successfully');
      setError('');
    } catch (err) {
      setError('Failed to update wallet address');
      setSuccess('');
    }
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/settings/password', passwordData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setSuccess('Password updated successfully');
      setError('');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError('Failed to update password');
      setSuccess('');
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="settings-card">
        <h3>Profile Settings</h3>
        <form onSubmit={onProfileSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onProfileChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onProfileChange}
              required
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
      <div className="settings-card">
        <h3>Web3 Settings</h3>
        <form onSubmit={onWalletSubmit}>
          <div className="form-group">
            <label>Wallet Address</label>
            <input
              type="text"
              name="walletAddress"
              value={walletAddress}
              onChange={onProfileChange}
            />
          </div>
          <button type="submit">Save Wallet Address</button>
        </form>
      </div>
      <div className="settings-card">
        <h3>Change Password</h3>
        <form onSubmit={onPasswordSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={onPasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={onPasswordChange}
              required
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;