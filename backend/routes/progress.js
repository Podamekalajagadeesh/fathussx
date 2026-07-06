const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   POST api/progress/complete/:taskId
// @desc    Mark a task as complete for the current user
// @access  Private
router.post('/complete/:taskId', auth, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    // Use INSERT ... ON CONFLICT DO NOTHING to prevent duplicate entries
    const progress = await db.query(
      'INSERT INTO user_progress (user_id, task_id) VALUES ($1, $2) ON CONFLICT (user_id, task_id) DO NOTHING RETURNING *',
      [userId, taskId]
    );

    if (progress.rows.length === 0) {
      return res.status(200).json({ msg: 'Task already marked as complete.' });
    }

    res.status(201).json(progress.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/progress/project/:projectId
// @desc    Get user's completed tasks for a specific project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const completedTasks = await db.query(
      `SELECT up.task_id FROM user_progress up
       JOIN tasks t ON up.task_id = t.id
       WHERE up.user_id = $1 AND t.project_id = $2`,
      [userId, projectId]
    );

    // Return an array of task IDs
    res.json(completedTasks.rows.map(row => row.task_id));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/progress/dashboard
// @desc    Get user's progress on all started projects
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT
         p.id AS project_id,
         p.title AS project_title,
         COUNT(t.id) AS total_tasks,
         COUNT(up.id) AS completed_tasks,
         (COUNT(up.id) * 100.0 / COUNT(t.id)) AS completion_percentage
       FROM projects p
       JOIN tasks t ON p.id = t.project_id
       LEFT JOIN user_progress up ON t.id = up.task_id AND up.user_id = $1
       WHERE p.id IN (SELECT DISTINCT t.project_id FROM tasks t JOIN user_progress up ON t.id = up.task_id WHERE up.user_id = $1)
       GROUP BY p.id, p.title
       ORDER BY p.title;`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;