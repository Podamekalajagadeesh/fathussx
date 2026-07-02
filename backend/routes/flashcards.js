const express = require('express');
const router = express.Router();
const pool = require('../db');

// @route   GET api/flashcard-decks
// @desc    Get all flashcard decks
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Log the schema to debug
    const schemaInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'flashcard_decks'
    `);
    console.log('Flashcard Decks Schema:', schemaInfo.rows);

    const { rows } = await pool.query('SELECT fd.*, u.username FROM flashcard_decks fd JOIN users u ON fd.user_id = u.id');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;