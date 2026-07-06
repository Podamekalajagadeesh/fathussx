CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    rated_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user being rated (freelancer)
    rating_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user giving the rating (client)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gig_id, rating_user_id) -- A client can only rate a freelancer once per gig
);