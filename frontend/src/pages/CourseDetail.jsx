import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/api/learning/courses/${courseId}`),
          api.get(`/api/learning/courses/${courseId}/progress`) // This endpoint will need to exist
        ]);
        setCourse(courseRes.data);
        setProgress(progressRes.data.completed_lessons || []);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId]);

  const isLessonCompleted = (lessonId) => {
    return progress.includes(lessonId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="course-detail-container">
      <div className="course-header card">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>

      {course.modules.map(module => (
        <div key={module.id} className="module-section card">
          <h3>{module.title}</h3>
          <ul className="lesson-list">
            {module.lessons.map(lesson => (
              <li key={lesson.id} className={`lesson-item ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}>
                <Link to={`/lessons/${lesson.id}`}>
                  {isLessonCompleted(lesson.id) ? '✅' : '📖'} {lesson.title}
                </Link>
                <span className={`lesson-type-badge lesson-type-${lesson.content_type}`}>
                  {lesson.content_type}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CourseDetail;