import { useState } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';

const Quiz = ({ lesson, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setError('Please select an answer.');
      return;
    }
    try {
      const res = await api.post('/api/quizzes/submit', { lessonId: lesson.id, answer: selectedAnswer });
      setIsCorrect(res.data.isCorrect);
      if (res.data.isCorrect) {
        onComplete(lesson.id);
      }
    } catch (err) {
      setError('Failed to submit quiz.');
    }
  };

  return (
    <div className="quiz-container">
      <h3>Quiz: {lesson.title}</h3>
      <form onSubmit={handleSubmit}>
        <p>{lesson.content}</p>
        <div className="quiz-options">
          {lesson.quiz_options.options.map((option, index) => (
            <div key={index} className="quiz-option">
              <input
                type="radio"
                id={option}
                name="quiz"
                value={option}
                onChange={() => setSelectedAnswer(option)}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        {error && <div className="error-message">{error}</div>}
        {isCorrect !== null && (
          <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect, please try again.'}
          </div>
        )}
      </form>
    </div>
  );
};

Quiz.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    quiz_options: PropTypes.shape({
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default Quiz;