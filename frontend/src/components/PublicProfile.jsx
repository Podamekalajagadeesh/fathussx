import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const PublicProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/profile/user/${userId}`);
        setProfile(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      }
    };

    fetchProfile();
  }, [userId]);

  const handleMessage = () => {
    navigate('/messages', { state: { recipientId: userId, recipientUsername: profile.username } });
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="fade-in">
        <div className="card">
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt={`${profile.username}'s avatar`} className="avatar" />
          )}
          <h1>{profile.username}</h1>
          <p>Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
          <button onClick={handleMessage} className="btn btn-primary">Message {profile.username}</button>
          
          <div className="profile-details">
            <p><strong>Bio:</strong> {profile.bio || 'No bio yet.'}</p>
            <p><strong>Skills:</strong> {profile.skills && profile.skills.length > 0 ? profile.skills.join(', ') : 'No skills listed.'}</p>
            <p><strong>GitHub:</strong> {profile.github_url ? <a href={profile.github_url} target="_blank" rel="noopener noreferrer">{profile.github_url}</a> : 'Not provided.'}</p>
            <p><strong>LinkedIn:</strong> {profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">{profile.linkedin_url}</a> : 'Not provided.'}</p>
          </div>
        </div>

        <div className="card">
          <h3>Gigs Created</h3>
          {profile.gigs && profile.gigs.length > 0 ? (
            <ul>
              {profile.gigs.map(gig => (
                <li key={gig.id}>{gig.title} - ${gig.budget}</li>
              ))}
            </ul>
          ) : (
            <p>This user hasn&apos;t created any gigs yet.</p>
          )}
        </div>

        <div className="card">
          <h3>Ratings Received</h3>
          {profile.ratings && profile.ratings.average_rating ? (
            <div>
              <p><strong>Average Rating:</strong> {profile.ratings.average_rating} / 5</p>
              <ul>
                {profile.ratings.reviews.map(rating => (
                  <li key={rating.id}>
                    <p><strong>Rating:</strong> {rating.rating} / 5</p>
                    <p><strong>Comment:</strong> {rating.comment}</p>
                    <p><em>- {rating.rating_user_name}</em></p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>This user hasn&apos;t received any ratings yet.</p>
          )}
        </div>

        <div className="card">
          <h3>Achievements</h3>
          {profile.achievements && profile.achievements.length > 0 ? (
            <ul>
              {profile.achievements.map(ach => (
                <li key={ach.name}>
                  <i className={ach.icon}></i> {ach.name} - {ach.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>This user hasn&apos;t earned any achievements yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;