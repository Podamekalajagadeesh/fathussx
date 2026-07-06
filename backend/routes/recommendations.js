const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   GET api/recommendations
// @desc    Get personalized recommendations for the user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get user's skills
    const userSkills = await db.query(
      'SELECT s.name FROM skills s JOIN user_skills us ON s.id = us.skill_id WHERE us.user_id = $1',
      [req.user.id]
    );
    const skills = userSkills.rows.map(s => s.name);

    if (skills.length === 0) {
      return res.json({ courses: [], gigs: [], projects: [] });
    }

    // Get course recommendations
    const courseRecs = await db.query(
      `SELECT * FROM courses WHERE id NOT IN (SELECT course_id FROM user_courses WHERE user_id = $1) AND (
        title ILIKE ANY (array_cat(ARRAY[]::varchar[], $2)))
      LIMIT 5`,
      [req.user.id, skills.map(s => `%${s}%`)]
    );

    // Get gig recommendations
    const gigRecs = await db.query(
      `SELECT * FROM gigs WHERE status = 'open' AND (
        title ILIKE ANY (array_cat(ARRAY[]::varchar[], $1)) OR
        skills_required ILIKE ANY (array_cat(ARRAY[]::varchar[], $1))
      )
      LIMIT 5`,
      [skills.map(s => `%${s}%`)]
    );

    // Get project recommendations
    const projectRecs = await db.query(
      `SELECT * FROM projects WHERE (
        title ILIKE ANY (array_cat(ARRAY[]::varchar[], $1)) OR
        required_skills ILIKE ANY (array_cat(ARRAY[]::varchar[], $1))
      )
      LIMIT 5`,
      [skills.map(s => `%${s}%`)]
    );

    res.json({
      courses: courseRecs.rows,
      gigs: gigRecs.rows,
      projects: projectRecs.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;