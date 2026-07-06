import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Progress = () => {
  const [progressData, setProgressData] = useState([]);
  const [tasks, setTasks] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/api/progress/dashboard', {
          headers: { 'x-auth-token': token },
        });
        setProgressData(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Server Error');
      }
    };

    fetchProgress();
  }, []);

  const fetchTasks = async (projectId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    try {
      const [projectRes, progressRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/projects/${projectId}`, {
          headers: { 'x-auth-token': token },
        }),
        axios.get(`http://localhost:3000/api/progress/project/${projectId}`, {
          headers: { 'x-auth-token': token },
        }),
      ]);

      const completedTaskIds = new Set(progressRes.data);
      const tasksWithCompletion = projectRes.data.tasks.map((task) => ({
        ...task,
        completed: completedTaskIds.has(task.id),
      }));

      setTasks((prevTasks) => ({
        ...prevTasks,
        [projectId]: tasksWithCompletion,
      }));
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Server Error');
    }
  };

  const markAsComplete = async (taskId, projectId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/progress/complete/${taskId}`, {}, {
        headers: { 'x-auth-token': token },
      });

      setTasks((prevTasks) => {
        const updatedTasks = prevTasks[projectId].map((task) => {
          if (task.id === taskId) {
            return { ...task, completed: true };
          }
          return task;
        });
        return { ...prevTasks, [projectId]: updatedTasks };
      });

      setProgressData((prevData) => {
        return prevData.map((project) => {
          if (project.project_id === projectId) {
            const newCompletedTasks = project.completed_tasks + 1;
            return {
              ...project,
              completed_tasks: newCompletedTasks,
              completion_percentage: (newCompletedTasks * 100.0) / project.total_tasks,
            };
          }
          return project;
        });
      });
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Server Error');
    }
  };

  if (error) return <div>{error}</div>;
  if (progressData.length === 0) return <div>You have not started any projects yet. Go to the &quot;Projects&quot; page to get started!</div>;

  return (
    <div>
      <h1>My Progress</h1>
      {progressData.map((project) => (
        <div key={project.project_id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <Link to={`/projects/${project.project_id}`}>
            <h2>{project.project_title}</h2>
          </Link>
          <p>
            {project.completed_tasks} / {project.total_tasks} tasks completed
          </p>
          <progress value={project.completion_percentage} max="100"></progress>
          <p>{Math.round(project.completion_percentage)}% complete</p>
          <button onClick={() => fetchTasks(project.project_id)}>Show Tasks</button>
          {tasks[project.project_id] && (
            <ul>
              {tasks[project.project_id].map((task) => (
                <li key={task.id}>
                  {task.title} - {task.completed ? 'Complete' : 'Incomplete'}
                  {!task.completed && (
                    <button onClick={() => markAsComplete(task.id, project.project_id)}>
                      Mark as Complete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Progress;