const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   GET api/activity
// @desc    Get the user activity feed
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const activities = await db.query(`
      SELECT 'new_project' as type, p.title, p.id, u.username, p.created_at
      FROM projects p
      JOIN users u ON p.user_id = u.id
      UNION ALL
      SELECT 'completed_course' as type, c.title, c.id, u.username, uc.completed_at as created_at
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      JOIN users u ON uc.user_id = u.id
      WHERE uc.completed_at IS NOT NULL
      UNION ALL
      SELECT 'new_forum_thread' as type, ft.title, ft.id, u.username, ft.created_at
      FROM forum_threads ft
      JOIN users u ON ft.author_id = u.id
      UNION ALL
      SELECT 'new_gig' as type, g.title, g.id, u.username, g.created_at
      FROM gigs g
      JOIN users u ON g.user_id = u.id
      UNION ALL
      SELECT 'new_blog_post' as type, b.title, b.id, u.username, b.created_at
      FROM blog_posts b
      JOIN users u ON b.author_id = u.id
      UNION ALL
      SELECT 'new_follower' as type, u.username as title, f.follower_id as id, u2.username, f.created_at
      FROM followers f
      JOIN users u ON f.following_id = u.id
      JOIN users u2 ON f.follower_id = u2.id
      ORDER BY created_at DESC
      LIMIT 20
    `);
    res.json(activities.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;