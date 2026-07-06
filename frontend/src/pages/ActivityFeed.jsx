import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/api/activity');
        setActivities(res.data);
      } catch (err) {
        setError('Failed to fetch activity feed.');
      }
    };
    fetchActivities();
  }, []);

  const renderActivity = (activity) => {
    switch (activity.type) {
      case 'new_project':
        return (
          <span>
            <Link to={`/profile/${activity.username}`}>{activity.username}</Link> created a new project: <Link to={`/projects/${activity.id}`}>{activity.title}</Link>
          </span>
        );
      case 'completed_course':
        return (
          <span>
            <Link to={`/profile/${activity.username}`}>{activity.username}</Link> completed the course: <Link to={`/courses/${activity.id}`}>{activity.title}</Link>
          </span>
        );
      case 'new_forum_thread':
        return (
          <span>
            <Link to={`/profile/${activity.username}`}>{activity.username}</Link> started a new discussion: <Link to={`/forum/threads/${activity.id}`}>{activity.title}</Link>
          </span>
        );
      case 'new_gig':
        return (
          <span>
            <Link to={`/profile/${activity.username}`}>{activity.username}</Link> posted a new gig: <Link to={`/gigs/${activity.id}`}>{activity.title}</Link>
          </span>
        );
      case 'new_blog_post':
        return (
          <span>
            <Link to={`/profile/${activity.username}`}>{activity.username}</Link> published a new blog post: <Link to={`/blog/${activity.id}`}>{activity.title}</Link>
          </span>
        );
      case 'new_follower':
        return (
          <span>
            <Link to={`/profile/${activity.username}`}>{activity.username}</Link> is now following <Link to={`/profile/${activity.title}`}>{activity.title}</Link>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="activity-feed-container">
      <h1>Activity Feed</h1>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            {renderActivity(activity)}
            <span className="activity-time">{new Date(activity.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;