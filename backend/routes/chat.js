const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   GET api/chat/messages/:recipientId
// @desc    Get chat messages with a specific user
// @access  Private
router.get('/messages/:recipientId', authMiddleware, async (req, res) => {
  try {
    const messages = await db.query(
      'SELECT * FROM chat_messages WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) ORDER BY timestamp ASC',
      [req.user.id, req.params.recipientId]
    );
    res.json(messages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;