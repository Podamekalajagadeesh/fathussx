import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ModuleList from './ModuleList';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const res = await api.get(`/api/courses/${id}`);
          setTitle(res.data.title);
          setDescription(res.data.description);
          setIsPublished(res.data.is_published);
        } catch (err) {
          console.error('Failed to fetch course.');
        }
      };
      fetchCourse();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = { title, description, is_published: isPublished };
    try {
      if (id) {
        await api.put(`/api/courses/${id}`, courseData);
      } else {
        await api.post('/api/courses', courseData);
      }
      navigate('/creator/dashboard');
    } catch (err) {
      console.error('Failed to save course.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Published
        </label>
      </div>
      <button type="submit">Save</button>
      {id && <ModuleList courseId={parseInt(id, 10)} />}
    </form>
  );
};

export default CourseEditor;