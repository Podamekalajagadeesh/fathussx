CREATE TABLE mentorship_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_mentor BOOLEAN DEFAULT false,
  is_mentee BOOLEAN DEFAULT false,
  skills TEXT[],
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);