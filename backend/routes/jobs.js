const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/jobs
// @desc    Create a job posting
// @access  Private (for employers)
router.post('/', authMiddleware, async (req, res) => {
  // Add role check for employer
  const { title, description, company, location, requirements } = req.body;
  try {
    const newJob = await db.query(
      'INSERT INTO jobs (title, description, company, location, requirements, employer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, company, location, requirements, req.user.id]
    );
    res.json(newJob.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs
// @desc    Get all job postings
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const jobs = await db.query('SELECT * FROM jobs WHERE status = \'open\'');
    res.json(jobs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/:id/apply', authMiddleware, async (req, res) => {
  const { cover_letter } = req.body;
  try {
    const newApplication = await db.query(
      'INSERT INTO job_applications (job_id, user_id, cover_letter) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, req.user.id, cover_letter]
    );
    res.json(newApplication.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;