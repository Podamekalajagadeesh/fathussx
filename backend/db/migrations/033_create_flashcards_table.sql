
-- Migration: Create flashcards table
-- Description: This table stores individual flashcards with spaced repetition metadata.

CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    ease_factor REAL NOT NULL DEFAULT 2.5,
    interval INTEGER NOT NULL DEFAULT 1,
    repetitions INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index to quickly find cards in a deck
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_id ON flashcards(deck_id);

-- Index to efficiently query for cards that are due
CREATE INDEX IF NOT EXISTS idx_flashcards_due_date ON flashcards(due_date);

-- Trigger to update the updated_at timestamp on any change
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_flashcards_updated_at
BEFORE UPDATE ON flashcards
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();