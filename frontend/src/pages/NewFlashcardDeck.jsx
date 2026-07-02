
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewFlashcardDeck = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/flashcard-decks', { title, description });
            navigate('/flashcards');
        } catch (err) {
            console.error('Failed to create deck');
        }
    };

    return (
        <div className="container">
            <h1>Create New Flashcard Deck</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Create Deck</button>
            </form>
        </div>
    );
};

export default NewFlashcardDeck;