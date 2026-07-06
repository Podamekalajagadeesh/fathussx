CREATE TABLE reputation_votes (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(255) NOT NULL, -- e.g., 'forum_posts'
  content_id INTEGER NOT NULL,
  voter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(50) NOT NULL, -- 'up' or 'down'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_type, content_id, voter_id)
);