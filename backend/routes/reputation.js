const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// @route   POST api/reputation/vote
// @desc    Vote on a contribution (e.g., forum post)
// @access  Private
router.post('/vote', authMiddleware, async (req, res) => {
  const { content_type, content_id, vote_type } = req.body; // vote_type: 'up' or 'down'
  const voter_id = req.user.id;

  try {
    // Check if the user has already voted
    const existingVote = await db.query(
      'SELECT * FROM reputation_votes WHERE content_type = $1 AND content_id = $2 AND voter_id = $3',
      [content_type, content_id, voter_id]
    );

    if (existingVote.rows.length > 0) {
      // Update existing vote
      await db.query(
        'UPDATE reputation_votes SET vote_type = $1 WHERE id = $2',
        [vote_type, existingVote.rows[0].id]
      );
    } else {
      // Create new vote
      await db.query(
        'INSERT INTO reputation_votes (content_type, content_id, voter_id, vote_type) VALUES ($1, $2, $3, $4)',
        [content_type, content_id, voter_id, vote_type]
      );
    }

    // Recalculate and update the reputation of the content owner
    const contentOwner = await db.query(
      `SELECT author_id FROM ${content_type} WHERE id = $1`,
      [content_id]
    );
    const owner_id = contentOwner.rows[0].author_id;

    const reputation = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM reputation_votes WHERE content_id IN (SELECT id FROM ${content_type} WHERE author_id = $1) AND vote_type = 'up') -
        (SELECT COUNT(*) FROM reputation_votes WHERE content_id IN (SELECT id FROM ${content_type} WHERE author_id = $1) AND vote_type = 'down') as reputation
      `,
      [owner_id]
    );

    await db.query('UPDATE users SET reputation = $1 WHERE id = $2', [
      reputation.rows[0].reputation,
      owner_id,
    ]);

    res.json({ msg: 'Vote recorded' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;