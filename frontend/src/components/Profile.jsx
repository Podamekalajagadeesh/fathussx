import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';
import './Badges.css';
import './Certifications.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import defaultAvatar from '../assets/default-avatar.svg';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      try {
        const res = await api.get('/api/profile/me');
        setProfile(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      }
    };

    fetchProfile();
  }, [token]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header card">
        <div className="avatar-container">
          <img src={profile.avatar_url || defaultAvatar} alt={`${profile.username}'s avatar`} className="avatar-large" />
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p>{profile.email}</p>
          <div className="social-links">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${profile.username}'s GitHub profile`}
              >
                <FaGithub aria-hidden="true" />
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${profile.username}'s LinkedIn profile`}
              >
                <FaLinkedin aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;