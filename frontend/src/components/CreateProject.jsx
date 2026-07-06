import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([{ title: '', description: '' }]);
  const navigate = useNavigate();

  const handleTaskChange = (index, e) => {
    const newTasks = [...tasks];
    newTasks[index][e.target.name] = e.target.value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { title: '', description: '' }]);
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/projects', { title, description, tasks });
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="create-project-container">
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <h3>Tasks</h3>
        {tasks.map((task, index) => (
          <div key={index} className="task-item">
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={task.title}
              onChange={(e) => handleTaskChange(index, e)}
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={task.description}
              onChange={(e) => handleTaskChange(index, e)}
              required
            ></textarea>
            <button type="button" onClick={() => removeTask(index)} className="danger">
              Remove
            </button>
          </div>
        ))}
        <div className="form-buttons">
          <button type="button" onClick={addTask} className="secondary">
            Add Task
          </button>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;