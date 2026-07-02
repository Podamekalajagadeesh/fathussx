const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../db');

// @route   GET api/profile/me
// @desc    Get current user's profile data
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const userRes = await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const profile = userRes.rows[0];

    // Get gigs created by the user
    const gigsRes = await db.query('SELECT id, title, description, budget, created_at FROM gigs WHERE client_id = $1', [userId]);
    profile.gigs = gigsRes.rows;

    // Get applications submitted by the user
    const appsRes = await db.query(
      `SELECT a.id, a.status, a.message, a.created_at, g.title AS gig_title
       FROM applications a
       JOIN gigs g ON a.gig_id = g.id
       WHERE a.user_id = $1`,
      [userId]
    );
    profile.applications = appsRes.rows;

    // Get completed lessons
    const progressRes = await db.query(
      `SELECT l.id, l.title, ulp.completed_at
       FROM user_lesson_progress ulp
       JOIN lessons l ON ulp.lesson_id = l.id
       WHERE ulp.user_id = $1`,
      [userId]
    );
    profile.completed_lessons = progressRes.rows;

    // Get user's achievements
    const achievementsRes = await db.query(
      `SELECT a.name, a.description, a.icon, ua.created_at
       FROM user_achievements ua
       JOIN achievements a ON ua.achievement_id = a.id
       WHERE ua.user_id = $1`,
      [userId]
    );
    profile.achievements = achievementsRes.rows;

    // Get user's ratings
    const ratingsRes = await db.query(
      `SELECT r.id, r.rating, r.comment, u.username as rating_user_name
       FROM ratings r
       JOIN users u ON r.rating_user_id = u.id
       WHERE r.rated_user_id = $1`,
      [userId]
    );

    if (ratingsRes.rows.length > 0) {
      const totalRating = ratingsRes.rows.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = (totalRating / ratingsRes.rows.length).toFixed(1);
      profile.ratings = {
        average_rating: averageRating,
        reviews: ratingsRes.rows
      };
    } else {
      profile.ratings = null;
    }

    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:userId
// @desc    Get public profile data for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user info (publicly safe fields)
    const userRes = await db.query('SELECT id, username, created_at FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const profile = userRes.rows[0];

    // Get gigs created by the user
    const gigsRes = await db.query('SELECT id, title, description, budget, created_at FROM gigs WHERE client_id = $1', [userId]);
    profile.gigs = gigsRes.rows;

    // Get completed lessons
    const progressRes = await db.query(
      `SELECT l.id, l.title
       FROM user_lesson_progress ulp
       JOIN lessons l ON ulp.lesson_id = l.id
       WHERE ulp.user_id = $1`,
      [userId]
    );
    profile.completed_lessons = progressRes.rows;

    // Get user's achievements
    const achievementsRes = await db.query(
      `SELECT a.name, a.description, a.icon, ua.created_at
       FROM user_achievements ua
       JOIN achievements a ON ua.achievement_id = a.id
       WHERE ua.user_id = $1`,
      [userId]
    );
    profile.achievements = achievementsRes.rows;

    // Get user's ratings
    const ratingsRes = await db.query(
      `SELECT r.id, r.rating, r.comment, u.username as rating_user_name
       FROM ratings r
       JOIN users u ON r.rating_user_id = u.id
       WHERE r.rated_user_id = $1`,
      [userId]
    );

    if (ratingsRes.rows.length > 0) {
      const totalRating = ratingsRes.rows.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = (totalRating / ratingsRes.rows.length).toFixed(1);
      profile.ratings = {
        average_rating: averageRating,
        reviews: ratingsRes.rows
      };
    } else {
      profile.ratings = null;
    }

    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const upload = require('../middleware/upload');

// @route   PUT api/profile/me
// @desc    Update user profile
// @access  Private
router.put('/me', [authMiddleware, upload], async (req, res) => {
  const {
    username,
    bio,
    github_url,
    linkedin_url,
    skills, // This will be a string of comma-separated values
    projects
  } = req.body;

  const profileFields = {};
  if (username) profileFields.username = username;
  if (bio) profileFields.bio = bio;
  if (github_url) profileFields.github_url = github_url;
  if (linkedin_url) profileFields.linkedin_url = linkedin_url;
  if (req.file) {
    profileFields.avatar_url = `/uploads/${req.file.filename}`;
  }

  try {
    // Using a transaction
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Update user table
      let user = await client.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      if (!user.rows[0]) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const updatedUser = { ...user.rows[0], ...profileFields };

      // Make sure to handle the case where avatar_url is not being updated
      if (!updatedUser.avatar_url) {
        updatedUser.avatar_url = user.rows[0].avatar_url;
      }

      await client.query(
        'UPDATE users SET username = $1, bio = $2, avatar_url = $3, github_url = $4, linkedin_url = $5 WHERE id = $6',
        [updatedUser.username, updatedUser.bio, updatedUser.avatar_url, updatedUser.github_url, updatedUser.linkedin_url, req.user.id]
      );

      // Update skills
      if (skills) {
        const skillsArr = skills.split(',').map(s => s.trim());

        // Clear existing skills
        await client.query('DELETE FROM user_skills WHERE user_id = $1', [req.user.id]);

        // Insert new skills
        for (const skillName of skillsArr) {
          let skill = await client.query('SELECT id FROM skills WHERE name = $1', [skillName]);
          if (skill.rows.length === 0) {
            skill = await client.query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [skillName]);
          }
          await client.query('INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2)', [req.user.id, skill.rows[0].id]);
        }
      }

      // Update projects
      if (projects) {
        // The projects might be sent as a stringified JSON array when using multipart/form-data
        const projectsArr = typeof projects === 'string' ? JSON.parse(projects) : projects;

        // Clear existing projects
        await client.query('DELETE FROM user_projects WHERE user_id = $1', [req.user.id]);

        // Insert new projects
        if (Array.isArray(projectsArr)) {
          for (const project of projectsArr) {
            if (project.name && project.url) {
              await client.query(
                'INSERT INTO user_projects (user_id, name, url) VALUES ($1, $2, $3)',
                [req.user.id, project.name, project.url]
              );
            }
          }
        }
      }

      await client.query('COMMIT');

      // Fetch updated profile to return
      const finalProfile = await client.query('SELECT id, username, email, bio, avatar_url, github_url, linkedin_url, created_at FROM users WHERE id = $1', [req.user.id]);
      const userSkills = await client.query('SELECT s.name FROM skills s JOIN user_skills us ON s.id = us.skill_id WHERE us.user_id = $1', [req.user.id]);
      const userProjects = await client.query('SELECT name, url FROM user_projects WHERE user_id = $1', [req.user.id]);
      
      const response = finalProfile.rows[0];
      response.skills = userSkills.rows.map(r => r.name);
      response.projects = userProjects.rows;

      res.json(response);

    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /uploads/:filename
// @desc    Serve user-uploaded files
// @access  Public
router.get('/uploads/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'uploads', req.params.filename));
});

module.exports = router;

// @route   GET api/profile
// @desc    Get all user profiles (publicly safe data)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const usersRes = await db.query('SELECT id, username, created_at FROM users ORDER BY created_at DESC');
    res.json(usersRes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});