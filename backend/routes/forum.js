const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   GET api/forum/threads
// @desc    Get all forum threads
// @access  Private
router.get('/threads', authMiddleware, async (req, res) => {
  try {
    const threads = await db.query(
      `SELECT t.*, u.username as author_username
       FROM forum_threads t
       JOIN users u ON t.author_id = u.id
       ORDER BY t.created_at DESC`
    );
    res.json(threads.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/forum/new-thread
// @desc    Create a new forum thread
// @access  Private
router.post('/new-thread', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const author_id = req.user.id;

  try {
    const newThread = await db.query(
      'INSERT INTO forum_threads (title, author_id) VALUES ($1, $2) RETURNING *',
      [title, author_id]
    );

    const firstPost = await db.query(
      'INSERT INTO forum_posts (thread_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
      [newThread.rows[0].id, author_id, content]
    );

    res.json(newThread.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/forum/threads/:id
// @desc    Get a single forum thread with its posts
// @access  Private
router.get('/threads/:id', authMiddleware, async (req, res) => {
  try {
    const thread = await db.query(
      `SELECT t.*, u.username as author_username
       FROM forum_threads t
       JOIN users u ON t.author_id = u.id
       WHERE t.id = $1`,
      [req.params.id]
    );

    if (thread.rows.length === 0) {
      return res.status(404).json({ msg: 'Thread not found' });
    }

    const posts = await db.query(
      `SELECT p.*, u.username as author_username
       FROM forum_posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.thread_id = $1
       ORDER BY p.created_at ASC`,
      [req.params.id]
    );

    res.json({ thread: thread.rows[0], posts: posts.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;