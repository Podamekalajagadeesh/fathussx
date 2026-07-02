import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/api/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Failed to fetch project details.');
      }
    };
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/api/projects/${id}/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks.');
      }
    };
    fetchProject();
    fetchTasks();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/projects/${id}/tasks`, { title: newTaskTitle });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Failed to create task.');
    }
  };

  if (!project) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="project-detail-container">
      <h1>{project.name}</h1>
      <p>{project.description}</p>

      <div className="task-list">
        <h2>Tasks</h2>
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New Task Title"
          />
          <button type="submit">Add Task</button>
        </form>
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;