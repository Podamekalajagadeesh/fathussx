import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects.');
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/projects', { name: newProjectName });
      setProjects([...projects, res.data]);
      setNewProjectName('');
    } catch (err) {
      console.error('Failed to create project.');
    }
  };

  return (
    <div className="projects-container">
      <h1>Projects</h1>
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New Project Name"
        />
        <button type="submit">Create Project</button>
      </form>
      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h2><Link to={`/projects/${project.id}`}>{project.name}</Link></h2>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;