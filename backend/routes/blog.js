const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/blog/posts
// @desc    Create a blog post
// @access  Private
router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = await db.query(
      'INSERT INTO blog_posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, req.user.id]
    );
    res.json(newPost.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/blog/posts
// @desc    Get all blog posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const posts = await db.query('SELECT bp.*, u.username as author_username FROM blog_posts bp JOIN users u ON bp.author_id = u.id ORDER BY bp.created_at DESC');
    res.json(posts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/blog/posts/:id
// @desc    Get a single blog post
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await db.query('SELECT bp.*, u.username as author_username FROM blog_posts bp JOIN users u ON bp.author_id = u.id WHERE bp.id = $1', [req.params.id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;