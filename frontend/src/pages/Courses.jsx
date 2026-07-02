import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import SubNav from '../components/SubNav';
import './Courses.css';

const CourseNav = [
  { to: '/courses', label: 'All Courses', end: true },
  { to: '/my-courses', label: 'My Courses' },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/learning/courses');
        setCourses(res.data);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-container">
      <SubNav links={CourseNav} />
      <h1>Available Courses</h1>
      <div className="course-list">
        {courses.map(course => (
          <div key={course.id} className="course-card card">
            <div className="course-card-header">
              <h3>{course.title}</h3>
            </div>
            <div className="course-card-body">
              <p>{course.description}</p>
            </div>
            <div className="course-card-footer">
              <Link to={`/courses/${course.id}`} className="btn btn-primary">
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
