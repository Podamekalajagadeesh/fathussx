
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const NewFlashcard = () => {
    const [frontContent, setFrontContent] = useState('');
    const [backContent, setBackContent] = useState('');
    const { deckId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/flashcard-decks/${deckId}/cards`, { front_content: frontContent, back_content: backContent });
            navigate(`/flashcards/decks/${deckId}`);
        } catch (err) {
            console.error('Failed to create card');
        }
    };

    return (
        <div className="container">
            <h1>Add New Card</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Front</label>
                    <textarea value={frontContent} onChange={(e) => setFrontContent(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                    <label>Back</label>
                    <textarea value={backContent} onChange={(e) => setBackContent(e.target.value)} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Card</button>
            </form>
        </div>
    );
};

export default NewFlashcard;