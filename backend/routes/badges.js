const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   GET api/badges
// @desc    Get all available badges
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const badges = await db.query('SELECT * FROM badges');
    res.json(badges.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/badges/my-badges
// @desc    Get all badges earned by the user
// @access  Private
router.get('/my-badges', authMiddleware, async (req, res) => {
  try {
    const badges = await db.query(
      'SELECT b.* FROM badges b JOIN user_badges ub ON b.id = ub.badge_id WHERE ub.user_id = $1',
      [req.user.id]
    );
    res.json(badges.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;