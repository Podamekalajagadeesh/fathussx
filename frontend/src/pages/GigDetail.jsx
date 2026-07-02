import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const GigDetail = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/api/gigs/${id}`);
        setGig(res.data);
      } catch (err) {
        setError('Failed to fetch gig details.');
      }
    };
    fetchGig();
  }, [id]);

  const handleMarkAsCompleted = async () => {
    try {
      const res = await api.put(`/api/gigs/${id}/status`, { status: 'completed' });
      setGig(res.data);
    } catch (err) {
      setError('Failed to update gig status.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!gig) {
    return <div className="loading">Loading...</div>;
  }

  const isClient = user && user.id === gig.client_id;

  return (
    <div className="gig-detail-container card">
      <h1>{gig.title}</h1>
      <p><strong>Budget:</strong> ${gig.budget}</p>
      <p><strong>Status:</strong> {gig.status}</p>
      <p>{gig.description}</p>
      
      {isClient && gig.status === 'open' && (
        <button onClick={handleMarkAsCompleted} className="btn btn-primary">
          Mark as Completed
        </button>
      )}
    </div>
  );
};

export default GigDetail;