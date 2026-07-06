const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/calendar/events
// @desc    Create a calendar event
// @access  Private
router.post('/events', authMiddleware, async (req, res) => {
  const { title, start, end } = req.body;
  try {
    const newEvent = await db.query(
      'INSERT INTO calendar_events (user_id, title, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, start, end]
    );
    res.json(newEvent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calendar/events
// @desc    Get all calendar events for the user
// @access  Private
router.get('/events', authMiddleware, async (req, res) => {
  try {
    const events = await db.query('SELECT * FROM calendar_events WHERE user_id = $1', [req.user.id]);
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;