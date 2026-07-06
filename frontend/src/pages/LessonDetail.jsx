import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Quiz from '../components/Quiz';
import './LessonDetail.css';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/api/learning/lessons/${lessonId}`);
        setLesson(res.data);
        setIsCompleted(res.data.is_completed || false);
      } catch (err) {
        setError('Failed to load lesson details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleComplete = async () => {
    try {
      await api.post(`/api/learning/lessons/${lessonId}/complete`);
      setIsCompleted(true);

      // Award points for completing the lesson
      await api.post('/api/gamification/award-points', {
        userId: user.id,
        courseId: lesson.course_id,
      });
    } catch (err) {
      setError('Failed to mark lesson as complete.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!lesson) return <div>Lesson not found.</div>;

  return (
    <div className="lesson-detail-container card">
      <h2>{lesson.title}</h2>
      <div className="lesson-content">
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>
      
      {lesson.quiz_options && (
        <Quiz lesson={lesson} onComplete={handleComplete} />
      )}

      {isCompleted ? (
        <div className="completion-message">
          <h3>🎉 Lesson Complete!</h3>
          <p>Great job! You&apos;ve earned 10 points.</p>
          <Link to={`/courses/${lesson.course_id}`} className="btn">Back to Course</Link>
        </div>
      ) : (
        !lesson.quiz_options && (
          <button onClick={handleComplete} className="btn btn-primary">Mark as Complete</button>
        )
      )}
    </div>
  );
};

export default LessonDetail;