const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/leaderboard
// @desc    Get the top users by completed tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const leaderboard = await db.query(
      `SELECT
         u.username,
         COUNT(up.id) AS completed_tasks
       FROM users u
       JOIN user_progress up ON u.id = up.user_id
       GROUP BY u.username
       ORDER BY completed_tasks DESC
       LIMIT 10;`
    );
    res.json(leaderboard.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;