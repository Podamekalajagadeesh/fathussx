const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @route   POST api/ai/chat
// @desc    Send a message to the AI helper
// @access  Private
router.post('/chat', authMiddleware, async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ msg: 'Messages are required.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ msg: 'AI service not configured.' });
  }

  try {
    const systemMessage = {
      role: 'system',
      content: 'You are a helpful and encouraging AI tutor for beginner web developers. Your purpose is to guide users through their learning journey, help them with coding problems, and explain complex concepts in a simple and easy-to-understand way. Always be patient and positive.'
    };

    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const completion = await openai.chat.completions.create({
      messages: [systemMessage, ...formattedMessages],
      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0].message.content;
    
    res.json({ response: aiResponse });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;