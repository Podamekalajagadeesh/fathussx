const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/companies/profile
// @desc    Create or update a company profile
// @access  Private (for employers)
router.post('/profile', authMiddleware, async (req, res) => {
  // Add role check for employer
  const { name, description, website, logo } = req.body;
  try {
    let profile = await db.query('SELECT * FROM company_profiles WHERE employer_id = $1', [req.user.id]);
    if (profile.rows.length > 0) {
      // Update
      profile = await db.query(
        'UPDATE company_profiles SET name = $1, description = $2, website = $3, logo = $4 WHERE employer_id = $5 RETURNING *',
        [name, description, website, logo, req.user.id]
      );
    } else {
      // Create
      profile = await db.query(
        'INSERT INTO company_profiles (employer_id, name, description, website, logo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.user.id, name, description, website, logo]
      );
    }
    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companies/:id
// @desc    Get a company profile by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const profile = await db.query('SELECT * FROM company_profiles WHERE id = $1', [req.params.id]);
    if (profile.rows.length === 0) {
      return res.status(404).json({ msg: 'Company profile not found' });
    }
    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;