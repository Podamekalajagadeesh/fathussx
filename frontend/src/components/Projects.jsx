import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      try {
        const res = await api.get('/api/projects', {
          params: { search },
        });
        setProjects(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      }
    };

    const timer = setTimeout(() => {
      fetchProjects();
    }, 500); // Debounce search requests

    return () => clearTimeout(timer);
  }, [search, token]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        <Link to="/projects/create" className="button">Create Project</Link>
      </div>
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      {projects.length === 0 && !error ? (
        <div>No projects found.</div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <Link to={`/projects/${project.id}`}>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </Link>
              <div className="progress-container">
                <p>{project.completed_tasks} / {project.total_tasks} tasks completed</p>
                <progress value={project.completion_percentage || 0} max="100"></progress>
                <span>{Math.round(project.completion_percentage || 0)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;