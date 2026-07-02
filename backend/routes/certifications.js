const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   GET api/certifications
// @desc    Get all available certifications
// @access  Public
router.get('/', async (req, res) => {
  try {
    const certifications = await db.query('SELECT * FROM certifications');
    res.json(certifications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certifications/my-certifications
// @desc    Get all certifications earned by the user
// @access  Private
router.get('/my-certifications', authMiddleware, async (req, res) => {
  try {
    const certifications = await db.query(
      'SELECT c.* FROM certifications c JOIN user_certifications uc ON c.id = uc.certification_id WHERE uc.user_id = $1',
      [req.user.id]
    );
    res.json(certifications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;