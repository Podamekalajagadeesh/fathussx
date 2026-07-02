const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newProject = await db.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, req.user.id]
    );
    res.json(newProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects
// @desc    Get all projects for the user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await db.query('SELECT * FROM projects WHERE owner_id = $1', [req.user.id]);
    res.json(projects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects/:id/tasks
// @desc    Create a task for a project
// @access  Private
router.post('/:id/tasks', authMiddleware, async (req, res) => {
  const { title, description, due_date } = req.body;
  try {
    const newTask = await db.query(
      'INSERT INTO tasks (project_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.params.id, title, description, due_date]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/:id/tasks
// @desc    Get all tasks for a project
// @access  Private
router.get('/:id/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await db.query('SELECT * FROM tasks WHERE project_id = $1', [req.params.id]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;