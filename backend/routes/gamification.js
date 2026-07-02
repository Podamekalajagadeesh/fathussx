const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/gamification/award-points
// @desc    Award points to a user for completing a course
// @access  Private
router.post('/award-points', authMiddleware, async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // Check if the user has already been awarded points for this course
    const existingPoints = await db.query(
      'SELECT * FROM user_points WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (existingPoints.rows.length > 0) {
      return res.status(400).json({ msg: 'Points already awarded for this course' });
    }

    // Award 10 points for completing a course
    const points = 10;

    await db.query(
      'INSERT INTO user_points (user_id, course_id, points) VALUES ($1, $2, $3)',
      [userId, courseId, points]
    );

    res.json({ msg: 'Points awarded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/gamification/leaderboard
// @desc    Get the leaderboard
// @access  Private
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const leaderboard = await db.query(
      `SELECT u.username, SUM(p.points) as total_points
       FROM users u
       JOIN user_points p ON u.id = p.user_id
       GROUP BY u.username
       ORDER BY total_points DESC
       LIMIT 10`
    );

    res.json(leaderboard.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;