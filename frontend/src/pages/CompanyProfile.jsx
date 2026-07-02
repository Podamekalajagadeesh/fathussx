import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const CompanyProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/companies/${id}`);
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch company profile.');
      }
    };
    fetchProfile();
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="company-profile-container">
      <img src={profile.logo} alt={profile.name} />
      <h1>{profile.name}</h1>
      <a href={profile.website} target="_blank" rel="noopener noreferrer">
        {profile.website}
      </a>
      <p>{profile.description}</p>
    </div>
  );
};

export default CompanyProfile;