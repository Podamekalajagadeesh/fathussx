const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/mentorship/profile
// @desc    Create or update a mentorship profile
// @access  Private
router.post('/profile', authMiddleware, async (req, res) => {
  const { is_mentor, is_mentee, skills, interests } = req.body;
  try {
    let profile = await db.query('SELECT * FROM mentorship_profiles WHERE user_id = $1', [req.user.id]);
    if (profile.rows.length > 0) {
      // Update
      profile = await db.query(
        'UPDATE mentorship_profiles SET is_mentor = $1, is_mentee = $2, skills = $3, interests = $4 WHERE user_id = $5 RETURNING *',
        [is_mentor, is_mentee, skills, interests, req.user.id]
      );
    } else {
      // Create
      profile = await db.query(
        'INSERT INTO mentorship_profiles (user_id, is_mentor, is_mentee, skills, interests) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.user.id, is_mentor, is_mentee, skills, interests]
      );
    }
    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/mentorship/mentors
// @desc    Get all mentors
// @access  Private
router.get('/mentors', authMiddleware, async (req, res) => {
  try {
    const mentors = await db.query(
      `SELECT u.id, u.username, mp.skills, mp.interests
      FROM users u
      JOIN mentorship_profiles mp ON u.id = mp.user_id
      WHERE mp.is_mentor = true`
    );
    res.json(mentors.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;