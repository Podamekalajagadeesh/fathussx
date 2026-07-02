const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

// @route   GET api/users/:userId/progress
// @desc    Get user's progress
// @access  Private
router.get('/:userId/progress', auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate that the logged-in user can only access their own progress
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ msg: 'User not authorized' });
    }

    const progressQuery = `
      WITH ProjectTasks AS (
        SELECT
          project_id,
          COUNT(*) AS total_tasks
        FROM tasks
        GROUP BY project_id
      ), UserCompletedTasks AS (
        SELECT
          project_id,
          COUNT(*) AS completed_tasks
        FROM completed_tasks
        WHERE user_id = $1
        GROUP BY project_id
      )
      SELECT
        p.id AS project_id,
        p.title AS project_title,
        p.description AS project_description,
        COALESCE(pt.total_tasks, 0) AS total_tasks,
        COALESCE(uct.completed_tasks, 0) AS completed_tasks,
        CASE
          WHEN COALESCE(pt.total_tasks, 0) > 0
          THEN (COALESCE(uct.completed_tasks, 0) * 100.0) / pt.total_tasks
          ELSE 0
        END AS completion_percentage
      FROM projects p
      LEFT JOIN ProjectTasks pt ON p.id = pt.project_id
      LEFT JOIN UserCompletedTasks uct ON p.id = uct.project_id
      WHERE uct.completed_tasks > 0
      ORDER BY p.title;
    `;

    const { rows } = await pool.query(progressQuery, [userId]);

    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;