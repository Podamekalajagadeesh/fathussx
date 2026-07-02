import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    technologies: '',
  });
  const navigate = useNavigate();

  const { title, description, budget, technologies } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const body = JSON.stringify({ title, description, budget, technologies: technologies.split(',').map(t => t.trim()) });
      await axios.post('/api/gigs', body, config);
      navigate('/gigs');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h2>Create a New Gig</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            name="description"
            value={description}
            onChange={onChange}
            required
          ></textarea>
        </div>
        <div>
          <input
            type="number"
            placeholder="Budget"
            name="budget"
            value={budget}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Technologies (comma-separated)"
            name="technologies"
            value={technologies}
            onChange={onChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateGig;