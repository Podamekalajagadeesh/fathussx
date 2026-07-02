require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socket = require('./socket');
const initializeChat = require('./chat');

const app = express();
const server = http.createServer(app);
const io = socket.init(server);

initializeChat(io);

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/gigs', require('./routes/gigs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/learning', require('./routes/learning'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/search', require('./routes/search'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/flashcard-decks', require('./routes/flashcards'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/mentorship', require('./routes/mentorship'));
app.use('/api/reputation', require('./routes/reputation'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/files', require('./routes/files'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/web3', require('./routes/web3'));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});