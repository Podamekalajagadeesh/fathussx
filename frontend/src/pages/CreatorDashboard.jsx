import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseTable from '../components/CourseTable';

const CreatorDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses.');
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Creator Dashboard</h1>
      <Link to="/creator/course/new">Create New Course</Link>
      <CourseTable courses={courses} />
    </div>
  );
};

export default CreatorDashboard;