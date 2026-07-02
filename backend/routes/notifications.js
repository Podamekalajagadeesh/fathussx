const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const markNotificationsRead = async (userId, notificationId = null) => {
  if (notificationId) {
    return db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [notificationId, userId]
    );
  }

  return db.query(
    'UPDATE notifications SET is_read = true WHERE user_id = $1 RETURNING *',
    [userId]
  );
};

// @route   GET api/notifications
// @desc    Get all notifications for the user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(notifications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notifications/mark-read
// @desc    Mark all notifications as read
// @access  Private
router.post('/mark-read', authMiddleware, async (req, res) => {
  try {
    await markNotificationsRead(req.user.id);
    res.json({ msg: 'Notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notifications/:id/mark-read
// @desc    Mark a single notification as read
// @access  Private
router.post('/:id/mark-read', authMiddleware, async (req, res) => {
  try {
    await markNotificationsRead(req.user.id, req.params.id);
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    await markNotificationsRead(req.user.id, req.params.id);
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;