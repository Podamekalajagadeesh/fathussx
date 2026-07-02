import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [gig, setGig] = useState(null);
  const { gigId } = useParams();
  const { user } = useContext(AuthContext);
  const [isGigOwner, setIsGigOwner] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let res;
        if (gigId) {
          res = await api.get(`/api/applications/gig/${gigId}`);
          const gigRes = await api.get(`/api/gigs/${gigId}`);
          setGig(gigRes.data);
          setIsGigOwner(gigRes.data.client_id === user.id);
        } else {
          res = await api.get('/api/applications/my-applications');
        }
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [gigId, user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.put(`/api/applications/${id}/status`, { status });
      setApplications(applications.map(app => app.id === id ? { ...app, status: res.data.status } : app));
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  return (
    <div className="applications-container">
      <h2>{gigId ? `Applications for ${gig?.title}` : 'My Applications'}</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="application-list">
          {applications.map(app => (
            <li key={app.id} className="application-item">
              {isGigOwner ? (
                <div className="application-details">
                  <p><strong>Applicant:</strong> <Link to={`/profile/${app.user_id}`}>{app.username}</Link></p>
                  <p><strong>Message:</strong> {app.message}</p>
                  <p><strong>Status:</strong> <span className={`status status-${app.status}`}>{app.status}</span></p>
                  {app.status === 'pending' && (
                    <div className="application-actions">
                      <button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="btn btn-approve">Accept</button>
                      <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="btn btn-reject">Reject</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="application-summary">
                  <h3><Link to={`/gigs/${app.gig_id}`}>{app.title}</Link></h3>
                  <p><strong>My Message:</strong> {app.message}</p>
                  <p><strong>Status:</strong> <span className={`status status-${app.status}`}>{app.status}</span></p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Applications;