import { useState, useEffect } from 'react';
import api from '../services/api';

const Mentorship = () => {
  const [profile, setProfile] = useState({
    is_mentor: false,
    is_mentee: false,
    skills: [],
    interests: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/mentorship/profile');
        if (res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        // It's ok if the profile doesn't exist yet
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setProfile({ ...profile, [name]: checked });
    } else {
      setProfile({ ...profile, [name]: value.split(',') });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/mentorship/profile', profile);
      alert('Profile updated!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="mentorship-container">
      <h1>Mentorship Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            name="is_mentor"
            checked={profile.is_mentor}
            onChange={handleChange}
          />
          I want to be a mentor
        </label>
        <label>
          <input
            type="checkbox"
            name="is_mentee"
            checked={profile.is_mentee}
            onChange={handleChange}
          />
          I am looking for a mentor
        </label>
        <input
          type="text"
          name="skills"
          value={profile.skills.join(',')}
          onChange={handleChange}
          placeholder="Skills (comma-separated)"
        />
        <input
          type="text"
          name="interests"
          value={profile.interests.join(',')}
          onChange={handleChange}
          placeholder="Interests (comma-separated)"
        />
        <button type="submit">Update Profile</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Mentorship;