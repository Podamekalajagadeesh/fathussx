const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    if (user.rows[0].role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const users = await db.query('SELECT id, username, email, role FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    // Check if the user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/users/:id/role
// @desc    Update user role
// @access  Admin
router.put('/users/:id/role', [authMiddleware, adminMiddleware], async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  // Simple validation for the role
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role specified' });
  }

  try {
    const user = await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role', [role, id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/admin/gigs
// @desc    Get all gigs
// @access  Admin
router.get('/gigs', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const gigs = await db.query('SELECT * FROM gigs ORDER BY created_at DESC');
    res.json(gigs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/gigs/:id
// @desc    Delete a gig
// @access  Admin
router.delete('/gigs/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const gig = await db.query('SELECT * FROM gigs WHERE id = $1', [req.params.id]);
    if (gig.rows.length === 0) {
      return res.status(404).json({ msg: 'Gig not found' });
    }

    await db.query('DELETE FROM gigs WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Gig deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;