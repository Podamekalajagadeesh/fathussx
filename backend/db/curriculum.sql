INSERT INTO projects (title, description) VALUES
('Web Development Basics', 'A project to learn the basics of web development.'),
('Data Structures and Algorithms', 'A project to practice data structures and algorithms.');

INSERT INTO tasks (project_id, title, description, order_num) VALUES
-- Web Development Basics
(1, 'HTML Fundamentals', 'Learn the basic syntax and structure of HTML.', 1),
(1, 'CSS Fundamentals', 'Learn how to style web pages using CSS.', 2),
(1, 'JavaScript Fundamentals', 'Learn the basics of JavaScript programming.', 3),

-- Data Structures and Algorithms
(2, 'Arrays and Strings', 'Practice problems involving arrays and strings.', 1),
(2, 'Linked Lists', 'Learn about and implement linked lists.', 2),
(2, 'Trees and Graphs', 'Practice problems involving trees and graphs.', 3);