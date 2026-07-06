import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Quiz from './Quiz';

const Course = () => {
  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        const res = await axios.get(`/api/learning/courses/${courseId}`, config);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProgress = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        // This endpoint doesn't exist yet, I'll create it next
        const res = await axios.get('/api/learning/progress', config);
        const completed = new Set(res.data.map(p => p.lesson_id));
        setCompletedLessons(completed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
    fetchProgress();
  }, [courseId]);

  const handleLessonComplete = (lessonId) => {
    setCompletedLessons(new Set([...completedLessons, lessonId]));
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      {course.modules.map(module => (
        <div key={module.id}>
          <h3>{module.title}</h3>
          <ul>
            {module.lessons.map(lesson => (
              <li key={lesson.id} style={{ textDecoration: completedLessons.has(lesson.id) ? 'line-through' : 'none' }}>
                <h4>{lesson.title}</h4>
                {lesson.content_type === 'quiz' ? (
                  <Quiz lesson={lesson} onComplete={handleLessonComplete} />
                ) : (
                  <>
                    <p>{lesson.content}</p>
                    {!completedLessons.has(lesson.id) && (
                      <button onClick={() => {
                        axios.post(`/api/learning/lessons/${lesson.id}/complete`, {}, {
                          headers: { 'x-auth-token': localStorage.getItem('token') }
                        }).then(() => handleLessonComplete(lesson.id));
                      }}>Mark as Complete</button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Course;