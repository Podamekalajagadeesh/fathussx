const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// @route   POST /api/ratings
// @desc    Create a new rating for a completed gig
// @access  Private (Client only)
router.post('/', authMiddleware, async (req, res) => {
  const { gigId, rating, comment } = req.body;
  const ratingUserId = req.user.id; // The client giving the rating

  try {
    // 1. Get the gig and verify the user is the client and the gig is completed
    const gigRes = await db.query('SELECT * FROM gigs WHERE id = $1 AND client_id = $2', [gigId, ratingUserId]);

    if (gigRes.rows.length === 0) {
      return res.status(403).json({ msg: 'Not authorized to rate this gig.' });
    }

    const gig = gigRes.rows[0];

    if (gig.status !== 'completed') {
      return res.status(400).json({ msg: 'Gig must be completed before it can be rated.' });
    }

    if (!gig.freelancer_id) {
      return res.status(400).json({ msg: 'Cannot rate a gig with no assigned freelancer.' });
    }

    // 2. Insert the new rating
    const newRating = await db.query(
      'INSERT INTO ratings (gig_id, rated_user_id, rating_user_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [gigId, gig.freelancer_id, ratingUserId, rating, comment]
    );

    // 3. Notify the freelancer
    const message = `You have received a new ${rating}-star rating for the gig "${gig.title}".`;
    const link = `/profile/${gig.freelancer_id}`;
    await createNotification(gig.freelancer_id, 'new_rating', message, link);

    res.json(newRating.rows[0]);
  } catch (err) {
    // Handle unique constraint violation (client already rated)
    if (err.code === '23505') {
      return res.status(400).json({ msg: 'You have already rated this gig.' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;