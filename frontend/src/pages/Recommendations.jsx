import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/api/recommendations');
        setRecommendations(res.data);
      } catch (err) {
        setError('Failed to fetch recommendations.');
      }
    };
    fetchRecommendations();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!recommendations) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="recommendations-container">
      <h1>Recommendations</h1>
      
      <div className="recommendation-section">
        <h2>Courses</h2>
        {recommendations.courses.length > 0 ? (
          <ul>
            {recommendations.courses.map(course => (
              <li key={course.id}><Link to={`/courses/${course.id}`}>{course.title}</Link></li>
            ))}
          </ul>
        ) : (
          <p>No course recommendations at this time.</p>
        )}
      </div>

      <div className="recommendation-section">
        <h2>Gigs</h2>
        {recommendations.gigs.length > 0 ? (
          <ul>
            {recommendations.gigs.map(gig => (
              <li key={gig.id}><Link to={`/gigs/${gig.id}`}>{gig.title}</Link></li>
            ))}
          </ul>
        ) : (
          <p>No gig recommendations at this time.</p>
        )}
      </div>

      <div className="recommendation-section">
        <h2>Projects</h2>
        {recommendations.projects.length > 0 ? (
          <ul>
            {recommendations.projects.map(project => (
              <li key={project.id}><Link to={`/projects/${project.id}`}>{project.title}</Link></li>
            ))}
          </ul>
        ) : (
          <p>No project recommendations at this time.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;