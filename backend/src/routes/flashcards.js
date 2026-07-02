
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const pool = require('../../db');

// @route   POST api/flashcard-decks
// @desc    Create a new flashcard deck
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;
    try {
        const newDeck = await pool.query(
            'INSERT INTO flashcard_decks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, title, description]
        );
        res.json(newDeck.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/flashcard-decks
// @desc    Get all flashcard decks for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const decks = await pool.query('SELECT * FROM flashcard_decks WHERE user_id = $1', [req.user.id]);
        res.json(decks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/flashcard-decks/:id
// @desc    Update a flashcard deck
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description } = req.body;
    try {
        const updatedDeck = await pool.query(
            'UPDATE flashcard_decks SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [title, description, req.params.id, req.user.id]
        );
        if (updatedDeck.rows.length === 0) {
            return res.status(404).json({ msg: 'Deck not found or user not authorized' });
        }
        res.json(updatedDeck.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/flashcard-decks/:id
// @desc    Delete a flashcard deck
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleteOp = await pool.query('DELETE FROM flashcard_decks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: 'Deck not found or user not authorized' });
        }
        res.json({ msg: 'Deck deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/flashcard-decks/:deckId/cards
// @desc    Add a card to a deck
// @access  Private
router.post('/:deckId/cards', auth, async (req, res) => {
    const { front_content, back_content } = req.body;
    try {
        const newCard = await pool.query(
            'INSERT INTO flashcards (deck_id, front_content, back_content) VALUES ($1, $2, $3) RETURNING *',
            [req.params.deckId, front_content, back_content]
        );
        res.json(newCard.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/flashcard-decks/:deckId/cards
// @desc    Get all cards from a deck
// @access  Private
router.get('/:deckId/cards', auth, async (req, res) => {
    try {
        const cards = await pool.query('SELECT * FROM flashcards WHERE deck_id = $1', [req.params.deckId]);
        res.json(cards.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/flashcard-decks/:deckId/cards/:cardId
// @desc    Update a flashcard
// @access  Private
router.put('/:deckId/cards/:cardId', auth, async (req, res) => {
    const { front_content, back_content } = req.body;
    try {
        const updatedCard = await pool.query(
            'UPDATE flashcards SET front_content = $1, back_content = $2 WHERE id = $3 AND deck_id = $4 RETURNING *',
            [front_content, back_content, req.params.cardId, req.params.deckId]
        );
        if (updatedCard.rows.length === 0) {
            return res.status(404).json({ msg: 'Card not found in this deck' });
        }
        res.json(updatedCard.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/flashcard-decks/:deckId/cards/:cardId
// @desc    Delete a flashcard
// @access  Private
router.delete('/:deckId/cards/:cardId', auth, async (req, res) => {
    try {
        const deleteOp = await pool.query('DELETE FROM flashcards WHERE id = $1 AND deck_id = $2', [req.params.cardId, req.params.deckId]);
        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: 'Card not found in this deck' });
        }
        res.json({ msg: 'Card deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;