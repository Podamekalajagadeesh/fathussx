import { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [messages, setMessages] = useState({});
  const [ratingState, setRatingState] = useState({}); // { gigId: { rating: 0, comment: '' } }
  const { user } = useContext(AuthContext);

  const fetchGigs = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/gigs');
      const allGigs = res.data;
      setGigs(allGigs.filter(gig => gig.client_id !== user.id && gig.status === 'open'));
      setMyGigs(allGigs.filter(gig => gig.client_id === user.id));
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleMessageChange = (gigId, value) => {
    setMessages({ ...messages, [gigId]: value });
  };

  const apply = async (gigId) => {
    try {
      const body = { message: messages[gigId] || '' };
      await api.post(`/api/applications/gig/${gigId}`, body);
      alert('Application submitted!');
      setMessages({ ...messages, [gigId]: '' });
    } catch (err) {
      console.error(err.response.data);
      alert(`Error: ${err.response.data.msg || 'Could not submit application.'}`);
    }
  };

  const markAsComplete = async (gigId) => {
    try {
      await api.put(`/api/gigs/${gigId}/complete`);
      alert('Gig marked as complete!');
      fetchGigs(); // Re-fetch to update status
    } catch (err) {
      console.error(err.response.data);
      alert(`Error: ${err.response.data.msg || 'Could not complete gig.'}`);
    }
  };

  const handleRatingChange = (gigId, rating) => {
    setRatingState({ ...ratingState, [gigId]: { ...ratingState[gigId], rating } });
  };

  const handleCommentChange = (gigId, comment) => {
    setRatingState({ ...ratingState, [gigId]: { ...ratingState[gigId], comment } });
  };

  const submitRating = async (gigId) => {
    const { rating, comment } = ratingState[gigId] || {};
    if (!rating || rating < 1 || rating > 5) {
      return alert('Please select a rating between 1 and 5.');
    }

    try {
      await api.post('/api/ratings', { gigId, rating, comment });
      alert('Thank you for your feedback!');
      // Optionally, hide the rating form after submission
      setRatingState({ ...ratingState, [gigId]: undefined }); 
      fetchGigs();
    } catch (err) {
      console.error(err.response.data);
      alert(`Error: ${err.response.data.msg || 'Could not submit rating.'}`);
    }
  };

  return (
    <div className="gigs-container">
      <div className="gigs-header">
        <h2>Gig Marketplace</h2>
        <Link to="/gigs/create" className="btn btn-primary">Create New Gig</Link>
      </div>

      {myGigs.length > 0 && (
        <div className="my-gigs-section">
          <h3>My Posted Gigs</h3>
          <ul className="gig-list">
            {myGigs.map(gig => (
              <li key={gig.id} className="gig-item my-gig">
                <h4>{gig.title}</h4>
                <p>Status: <span className={`status status-${gig.status}`}>{gig.status}</span></p>
                <Link to={`/gigs/${gig.id}/applications`} className="btn btn-secondary">View Applications</Link>
                {gig.status === 'in-progress' && (
                  <button onClick={() => markAsComplete(gig.id)} className="btn btn-success">Mark as Complete</button>
                )}
                {gig.status === 'completed' && !ratingState[gig.id] && (
                  <div className="rating-form">
                    <h5>Rate the Freelancer</h5>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star} 
                          className={star <= (ratingState[gig.id]?.rating || 0) ? 'star selected' : 'star'}
                          onClick={() => handleRatingChange(gig.id, star)}
                        >★</span>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Leave a comment..."
                      onChange={(e) => handleCommentChange(gig.id, e.target.value)}
                    />
                    <button onClick={() => submitRating(gig.id)} className="btn btn-primary">Submit Rating</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Available Gigs</h3>
      <ul className="gig-list">
        {gigs.map(gig => (
          <li key={gig.id} className="gig-item">
            <h4>{gig.title}</h4>
            <p>{gig.description}</p>
            <p><strong>Budget:</strong> ${gig.budget}</p>
            <p><strong>Technologies:</strong> {Array.isArray(gig.technologies) ? gig.technologies.join(', ') : gig.technologies}</p>
            <div className="apply-section">
              <textarea
                placeholder="Write a message to the client..."
                value={messages[gig.id] || ''}
                onChange={(e) => handleMessageChange(gig.id, e.target.value)}
              ></textarea>
              <button onClick={() => apply(gig.id)} className="btn btn-primary">Apply</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gigs;