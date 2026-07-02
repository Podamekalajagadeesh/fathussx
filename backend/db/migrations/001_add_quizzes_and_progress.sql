-- Add quiz-related columns to the lessons table
ALTER TABLE lessons
ADD COLUMN quiz_options JSONB,
ADD COLUMN correct_answer TEXT;

-- Create a table to track user progress on lessons
CREATE TABLE user_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);