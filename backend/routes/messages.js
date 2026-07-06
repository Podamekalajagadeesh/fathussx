const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// @route   GET api/messages/conversations
// @desc    Get all of a user's conversations
// @access  Private
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await db.query(
      `SELECT DISTINCT ON (u.id) u.id, u.username, m.content, m.created_at
       FROM messages m
       JOIN users u ON u.id = m.sender_id OR u.id = m.receiver_id
       WHERE (m.sender_id = $1 OR m.receiver_id = $1) AND u.id != $1
       ORDER BY u.id, m.created_at DESC`,
      [userId]
    );
    res.json(conversations.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/:userId
// @desc    Get message history with a specific user
// @access  Private
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const messages = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [currentUserId, otherUserId]
    );
    res.json(messages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/messages/:userId
// @desc    Send a message to a user
// @access  Private
router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;
    const { content } = req.body;

    const newMessage = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [senderId, receiverId, content]
    );

    // Create a notification for the recipient
    const sender = await db.query('SELECT username FROM users WHERE id = $1', [senderId]);
    const message = `You have a new message from ${sender.rows[0].username}`;
    const link = `/messages/${senderId}`;
    await createNotification(receiverId, 'new_message', message, link);

    res.json(newMessage.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;