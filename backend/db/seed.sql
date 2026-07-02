-- Seed data for the Universal Learning Ecosystem

-- Users
-- Passwords are hashed versions of 'password123'
INSERT INTO users (username, email, password) VALUES
('client_user', 'client@example.com', '$2b$10$E/gO9.6g3h3E/gO9.6g3h3E/gO9.6g3h3E/gO9.6g3h3E/gO9.6g3h3'),
('freelancer_user', 'freelancer@example.com', '$2b$10$E/gO9.6g3h3E/gO9.6g3h3E/gO9.6g3h3E/gO9.6g3h3E/gO9.6g3h3');

-- Courses, Modules, and Lessons
INSERT INTO courses (title, description) VALUES
('Web Development Fundamentals', 'A comprehensive introduction to web development.');

INSERT INTO modules (course_id, title, module_order) VALUES
(1, 'Introduction to HTML', 1),
(1, 'Introduction to CSS', 2);

INSERT INTO lessons (module_id, title, content_type, content, lesson_order, correct_answer) VALUES
(1, 'HTML Basics', 'text', '<h1>Welcome to HTML</h1><p>This is your first lesson.</p>', 1, NULL),
(1, 'HTML Quiz', 'quiz', '{"question": "What does HTML stand for?", "options": ["HyperText Markup Language", "High-Level Text Language", "Hyperlink and Text Markup Language"]}', 2, 'HyperText Markup Language'),
(2, 'CSS Basics', 'text', '<h1>Welcome to CSS</h1><p>Styling is fun!</p>', 1, NULL);

-- Gigs
INSERT INTO gigs (title, description, budget, technologies, client_id, status) VALUES
('Build a Simple Landing Page', 'I need a one-page website for my new startup.', 500.00, '{"HTML", "CSS"}', 1, 'open'),
('React Component Development', 'Looking for a developer to build a reusable React component.', 1200.00, '{"React", "JavaScript"}', 1, 'in-progress');

-- Achievements
INSERT INTO achievements (slug, name, description, icon) VALUES
('first-lesson-complete', 'First Lesson Complete', 'You finished your first lesson!', 'fa-star'),
('first-gig-posted', 'Gig Poster', 'You posted your first gig!', 'fa-briefcase'),
('first-quiz-passed', 'Quiz Master', 'You passed your first quiz!', 'fa-question-circle');