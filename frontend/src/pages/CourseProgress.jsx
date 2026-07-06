import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CourseProgress = () => {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  useContext(AuthContext);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/api/learning/courses/${courseId}/progress`);
        setProgress(res.data);
      } catch (err) {
        setError('Failed to fetch course progress.');
      }
    };
    fetchProgress();
  }, [courseId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!progress) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="course-progress-container card">
      <h1>{progress.course_title}</h1>
      <p><strong>Overall Progress:</strong> {progress.overall_progress}%</p>
      
      <h2>Lessons</h2>
      <ul className="progress-list">
        {progress.lessons.map(lesson => (
          <li key={lesson.lesson_id} className={lesson.is_completed ? 'completed' : ''}>
            {lesson.lesson_title}
          </li>
        ))}
      </ul>

      <h2>Quizzes</h2>
      <ul className="progress-list">
        {progress.quizzes.map(quiz => (
          <li key={quiz.quiz_id}>
            {quiz.quiz_title} - <strong>Score:</strong> {quiz.score}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseProgress;