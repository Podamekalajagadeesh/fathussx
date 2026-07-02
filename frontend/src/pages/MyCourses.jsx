import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import LearningStreak from '../components/LearningStreak';
import SubNav from '../components/SubNav';
import './MyCourses.css';

const CourseNav = [
  { to: '/courses', label: 'All Courses' },
  { to: '/my-courses', label: 'My Courses', end: true },
];

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) return;
      try {
        const res = await api.get('/api/learning/my-courses');
        if (Array.isArray(res.data)) {
            setCourses(res.data);
        } else {
            setCourses([]);
        }
      } catch (err) {
        setError('Failed to load your courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-courses-container">
      <SubNav links={CourseNav} />
      <h1>My Learning</h1>
      <LearningStreak />
      {courses.length > 0 ? (
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
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-courses">
          <p>You are not enrolled in any courses yet.</p>
          <Link to="/courses" className="btn">Browse Courses</Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
