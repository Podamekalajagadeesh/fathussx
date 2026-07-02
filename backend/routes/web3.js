const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { mintNftCertificate } = require('../utils/blockchain');

// @route   PUT api/web3/wallet
// @desc    Save or update user's wallet address
// @access  Private
router.put('/wallet', authMiddleware, async (req, res) => {
  const { walletAddress } = req.body;
  try {
    const updatedUser = await db.query(
      'UPDATE users SET wallet_address = $1 WHERE id = $2 RETURNING id, username, email, wallet_address',
      [walletAddress, req.user.id]
    );
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/web3/mint
// @desc    Mint a new NFT certificate for a user (simulated)
// @access  Private
router.post('/mint', authMiddleware, async (req, res) => {
  const { courseId } = req.body;
  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const course = await db.query('SELECT * FROM courses WHERE id = $1', [courseId]);

    if (user.rows.length === 0 || course.rows.length === 0) {
      return res.status(404).json({ msg: 'User or course not found' });
    }

    if (!user.rows[0].wallet_address) {
      return res.status(400).json({ msg: 'User does not have a wallet address set' });
    }

    const { transactionHash, tokenId } = await mintNftCertificate(user.rows[0], course.rows[0]);

    const newCertificate = await db.query(
      'INSERT INTO nft_certificates (user_id, course_id, transaction_hash, token_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, courseId, transactionHash, tokenId]
    );

    res.json(newCertificate.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/web3/my-certificates
// @desc    Get all NFT certificates earned by the user
// @access  Private
router.get('/my-certificates', authMiddleware, async (req, res) => {
  try {
    const certificates = await db.query(
      'SELECT c.name as course_name, nc.transaction_hash, nc.token_id, nc.minted_at FROM nft_certificates nc JOIN courses c ON nc.course_id = c.id WHERE nc.user_id = $1',
      [req.user.id]
    );
    res.json(certificates.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;