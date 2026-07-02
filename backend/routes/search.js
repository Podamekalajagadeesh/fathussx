const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   GET api/search
// @desc    Search for gigs, projects, and learning resources
// @access  Public
router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ msg: 'Search query is required' });
  }

  try {
    const gigs = await db.query(
      "SELECT * FROM gigs WHERE title ILIKE $1 OR description ILIKE $1",
      [`%${q}%`]
    );

    const projects = await db.query(
      "SELECT * FROM projects WHERE title ILIKE $1 OR description ILIKE $1",
      [`%${q}%`]
    );

    const courses = await db.query(
      "SELECT * FROM courses WHERE title ILIKE $1 OR description ILIKE $1",
      [`%${q}%`]
    );

    res.json({
      gigs: gigs.rows,
      projects: projects.rows,
      courses: courses.rows,
    });
res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/search/users
// @desc    Search for users by username or skills
// @access  Private
router.get('/users', authMiddleware, async (req, res) => {
  const { q } = req.query;
  try {
    const users = await db.query(
      `SELECT u.id, u.username, array_agg(s.name) as skills
      FROM users u
      LEFT JOIN user_skills us ON u.id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.id
      WHERE u.username ILIKE $1 OR s.name ILIKE $1
      GROUP BY u.id, u.username`,
      [`%${q}%`]
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;