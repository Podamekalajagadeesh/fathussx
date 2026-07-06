
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const FlashcardDecks = () => {
    const [decks, setDecks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const res = await api.get('/api/flashcard-decks');
                setDecks(res.data);
            } catch (err) {
                setError('Failed to fetch flashcard decks.');
            }
        };
        fetchDecks();
    }, []);

    return (
        <div className="container">
            <h1>Flashcard Decks</h1>
            {error && <p className="error">{error}</p>}
            <Link to="/flashcards/new-deck" className="btn btn-primary">Create New Deck</Link>
            <div className="deck-list">
                {decks.map(deck => (
                    <div key={deck.id} className="card">
                        <h2>{deck.title}</h2>
                        <p>{deck.description}</p>
                        <Link to={`/flashcards/decks/${deck.id}`} className="btn">View Deck</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashcardDecks;