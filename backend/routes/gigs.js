const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { awardAchievement } = require('../utils/achievements');
const { createNotification } = require('../utils/notifications');

// @route   GET api/gigs
// @desc    Get all available gigs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM gigs WHERE status = $1', ['open']);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/gigs
// @desc    Create a new gig
// @access  Private (Admin or Client)
router.post('/', authMiddleware, async (req, res) => {
  // For now, we'll assume only authorized users can post gigs.
  // In a real app, you'd have role-based access control.
  const { title, description, budget, technologies } = req.body;

  try {
    const newGig = await db.query(
      'INSERT INTO gigs (title, description, budget, technologies, client_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, budget, technologies, req.user.id]
    );

    // Award 'first-gig-created' achievement
    const gigCountRes = await db.query('SELECT COUNT(*) FROM gigs WHERE client_id = $1', [req.user.id]);
    if (parseInt(gigCountRes.rows[0].count, 10) === 1) {
      await awardAchievement(req.user.id, 'first-gig-created');
    }

    res.json(newGig.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/gigs/:id/complete
// @desc    Mark a gig as completed
// @access  Private (Client only)
router.put('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const gigId = req.params.id;
    const clientId = req.user.id;

    // 1. Verify the user is the client for this gig
    const gigRes = await db.query('SELECT * FROM gigs WHERE id = $1 AND client_id = $2', [gigId, clientId]);

    if (gigRes.rows.length === 0) {
      return res.status(403).json({ msg: 'You are not authorized to complete this gig.' });
    }

    const gig = gigRes.rows[0];

    if (gig.status !== 'in-progress') {
      return res.status(400).json({ msg: 'Gig is not in-progress and cannot be completed.' });
    }

    // 2. Update the gig status to 'completed'
    const updatedGig = await db.query(
      "UPDATE gigs SET status = 'completed' WHERE id = $1 RETURNING *",
      [gigId]
    );

    // 3. Notify the freelancer
    if (gig.freelancer_id) {
      const message = `The gig "${gig.title}" has been marked as complete by the client.`;
      const link = `/gigs/${gig.id}`;
      await createNotification(gig.freelancer_id, 'gig_completed', message, link);
    }

    res.json(updatedGig.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/gigs/:id/status
// @desc    Update gig status
// @access  Private
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const gig = await db.query('SELECT * FROM gigs WHERE id = $1', [id]);
    if (gig.rows.length === 0) {
      return res.status(404).json({ msg: 'Gig not found' });
    }

    if (gig.rows[0].client_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updatedGig = await db.query(
      'UPDATE gigs SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(updatedGig.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;