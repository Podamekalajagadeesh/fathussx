const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/quizzes/submit
// @desc    Submit a quiz answer
// @access  Private
router.post('/submit', authMiddleware, async (req, res) => {
  const { lessonId, answer } = req.body;
  const userId = req.user.id;

  if (!lessonId || !answer) {
    return res.status(400).json({ msg: 'Lesson ID and answer are required' });
  }

  try {
    // Check if the lesson exists and get the correct answer
    const lessonRes = await db.query('SELECT correct_answer FROM lessons WHERE id = $1', [lessonId]);
    if (lessonRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    const correctAnswer = lessonRes.rows[0].correct_answer;
    const isCorrect = (answer === correctAnswer);

    // Record the attempt in user_lesson_progress
    // We'll mark it as complete if the answer is correct
    if (isCorrect) {
      await db.query(
        'INSERT INTO user_lesson_progress (user_id, lesson_id, completed_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id, lesson_id) DO NOTHING',
        [userId, lessonId]
      );
    }

    res.json({ isCorrect });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;