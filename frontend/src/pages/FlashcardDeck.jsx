
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const FlashcardDeck = () => {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchDeckAndCards = async () => {
            try {
                const deckRes = await api.get(`/api/flashcard-decks/${id}`);
                setDeck(deckRes.data);
                const cardsRes = await api.get(`/api/flashcard-decks/${id}/cards`);
                setCards(cardsRes.data);
            } catch (err) {
                setError('Failed to fetch deck and cards.');
            }
        };
        fetchDeckAndCards();
    }, [id]);

    if (error) return <p className="error">{error}</p>;
    if (!deck) return <p>Loading...</p>;

    return (
        <div className="container">
            <h1>{deck.title}</h1>
            <p>{deck.description}</p>
            <Link to={`/flashcards/decks/${id}/new-card`} className="btn btn-primary">Add New Card</Link>
            <div className="card-list">
                {cards.map(card => (
                    <div key={card.id} className="card">
                        <p>{card.front_content}</p>
                        <p>{card.back_content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashcardDeck;