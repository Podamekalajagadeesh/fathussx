import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import './Dashboard.css'; // Import the new stylesheet

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/api/progress/dashboard`);
        setDashboardData(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const renderProgress = () => {
    if (!dashboardData || dashboardData.length === 0) {
      return (
        <div className="empty-state">
          <p>You have not started any courses yet.</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      );
    }

    return (
      <div className="progress-list">
        {dashboardData.map((project) => (
          <div key={project.project_id} className="progress-item">
            <Link to={`/courses/${project.project_id}`}>
              <h3>{project.project_title}</h3>
            </Link>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                role="progressbar"
                aria-label={`Progress for ${project.project_title}`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(project.completion_percentage)}
                style={{ width: `${project.completion_percentage}%` }}
              ></div>
            </div>
            <div className="progress-meta">
              <span>{Math.round(project.completion_percentage)}% Complete</span>
              <span>
                {project.completed_tasks} / {project.total_tasks} Tasks
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading)
    return (
      <div className="dashboard-container" aria-busy="true" aria-live="polite">
        <header className="dashboard-header">
          <h1>Welcome, {user?.username || 'User'}</h1>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-widget card">
            <div className="skeleton-item">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line bar"></div>
              <div className="skeleton-line meta"></div>
            </div>
            <div className="skeleton-item">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line bar"></div>
              <div className="skeleton-line meta"></div>
            </div>
          </div>
          <div className="dashboard-widget card">
            <div className="skeleton-item">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line text"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error) return <div className="error" role="alert">{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username || 'User'}</h1>
      </header>
      
      <div className="dashboard-grid">
        <div className="dashboard-widget card">
          <h2>My Progress</h2>
          {dashboardData && renderProgress()}
        </div>
        
        {/* Add more widgets here as the app grows */}
        <div className="dashboard-widget card">
          <h2>My Achievements</h2>
          <div className="empty-state">
            <p>Achievements are coming soon!</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;