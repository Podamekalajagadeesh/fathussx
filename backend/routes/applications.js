const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// @route   GET /api/applications/my-applications
// @desc    Get all applications for the logged-in user
// @access  Private
router.get('/my-applications', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT a.id, a.status, a.message, g.title, g.id as gig_id
       FROM applications a
       JOIN gigs g ON a.gig_id = g.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/applications/gig/:gigId
// @desc    Get all applications for a specific gig
// @access  Private (Gig owner only)
router.get('/gig/:gigId', authMiddleware, async (req, res) => {
  try {
    const { gigId } = req.params;
    const { user } = req;

    // First, verify the user owns the gig
    const gigRes = await db.query('SELECT client_id FROM gigs WHERE id = $1', [gigId]);
    if (gigRes.rows.length === 0 || gigRes.rows[0].client_id !== user.id) {
      return res.status(403).json({ msg: 'User does not have permission to view these applications.' });
    }

    const { rows } = await db.query(
      `SELECT a.id, a.status, a.message, a.created_at, u.id as user_id, u.username
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.gig_id = $1
       ORDER BY a.created_at DESC`,
      [gigId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update the status of an application
// @access  Private (Gig owner only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'
  const { user } = req;

  try {
    // 1. Get application and verify owner
    const appRes = await db.query(
      `SELECT a.user_id as applicant_id, g.id as gig_id, g.title as gig_title, g.client_id
       FROM applications a
       JOIN gigs g ON a.gig_id = g.id
       WHERE a.id = $1`,
      [id]
    );

    if (appRes.rows.length === 0) {
      return res.status(404).json({ msg: 'Application not found.' });
    }

    const { applicant_id, gig_id, gig_title, client_id } = appRes.rows[0];

    if (client_id !== user.id) {
      return res.status(403).json({ msg: 'User does not have permission to update this application.' });
    }

    // 2. Update application status
    const updatedApp = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // 3. If accepted, update gig status to 'in-progress'
    if (status === 'accepted') {
      await db.query("UPDATE gigs SET status = 'in-progress', freelancer_id = $1 WHERE id = $2", [applicant_id, gig_id]);
    }

    // 4. Create notification for the applicant
    const message = `Your application for the gig "${gig_title}" has been ${status}.`;
    const link = `/my-applications`;
    await createNotification(applicant_id, `application_${status}`, message, link);

    res.json(updatedApp.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/applications/gig/:gigId
// @desc    Apply for a gig
// @access  Private
router.post('/gig/:gigId', authMiddleware, async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const userId = req.user.id;
    const { message } = req.body;

    // Check if the user has already applied
    const existingApplication = await db.query(
      'SELECT * FROM applications WHERE gig_id = $1 AND user_id = $2',
      [gigId, userId]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ msg: 'You have already applied for this gig.' });
    }

    const newApplication = await db.query(
      'INSERT INTO applications (gig_id, user_id, message) VALUES ($1, $2, $3) RETURNING *',
      [gigId, userId, message]
    );

    // Award 'first-application' achievement
    const appCountRes = await db.query('SELECT COUNT(*) FROM applications WHERE user_id = $1', [userId]);
    if (parseInt(appCountRes.rows[0].count, 10) === 1) {
      await awardAchievement(userId, 'first-application');
    }

    // Notify the gig creator
    const gig = await db.query('SELECT client_id, title FROM gigs WHERE id = $1', [gigId]);
    const applicant = await db.query('SELECT username FROM users WHERE id = $1', [userId]);
    const { client_id, title } = gig.rows[0];
    const notificationMessage = `You have a new applicant, ${applicant.rows[0].username}, for your gig: "${title}"`;
    const link = `/gigs/${gigId}/applications`;
    await createNotification(client_id, 'new_application', notificationMessage, link);

    res.json(newApplication.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;