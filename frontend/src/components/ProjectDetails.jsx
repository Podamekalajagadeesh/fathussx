import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const projectRes = await api.get(`/api/projects/${id}`);
        setProject(projectRes.data.project);
        setTasks(projectRes.data.tasks);
        setEditForm({
          title: projectRes.data.project.title,
          description: projectRes.data.project.description,
        });

        const progressRes = await api.get(`/api/progress/project/${id}`);
        setCompletedTasks(new Set(progressRes.data));
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      }
    };

    fetchDetails();
  }, [id, token]);

  const handleCompleteTask = async (taskId) => {
    try {
      await api.post(`/api/progress/complete/${taskId}`);
      setCompletedTasks(new Set([...completedTasks, taskId]));
    } catch (err) {
      console.error('Failed to mark task as complete', err);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await api.delete(`/api/projects/${id}`);
        navigate('/projects');
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      }
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/projects/${id}`, editForm);
      setProject(res.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Server Error');
    }
  };

  if (error) return <div>{error}</div>;
  if (!project) return <div>Loading project details...</div>;

  return (
    <div className="project-details">
      {isEditing ? (
        <form onSubmit={handleUpdateProject}>
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          ></textarea>
          <button type="submit">Save</button>
          <button type="button" className="secondary" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit Project</button>
          <button onClick={handleDeleteProject} className="danger">Delete Project</button>
        </div>
      )}
      <hr />
      <h2>Tasks</h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${completedTasks.has(task.id) ? 'completed' : ''}`}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {!completedTasks.has(task.id) && (
              <button onClick={() => handleCompleteTask(task.id)}>Mark as Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;