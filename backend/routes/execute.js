const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   POST api/execute
// @desc    Execute code
// @access  Public
router.post('/', async (req, res) => {
  console.log('Executing code...');
  const { code, language } = req.body;

  const languageId = {
    javascript: 93, // Node.js
    python: 71,     // Python 3.8
    java: 62,       // Java (OpenJDK 13.0.1)
    c: 50,          // C (GCC 9.2.0)
    cpp: 54         // C++ (GCC 9.2.0)
  };

  if (!languageId[language]) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
    },
    data: {
      language_id: languageId[language],
      source_code: code
    }
  };

  try {
    const submissionResponse = await axios.request(options);
    const token = submissionResponse.data.token;

    // Poll for the result
    let resultResponse;
    let statusId = 1; // In Queue

    while (statusId === 1 || statusId === 2) { // 1 = In Queue, 2 = Processing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      try {
        resultResponse = await axios.request({
          method: 'GET',
          url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          params: {
            base64_encoded: 'false',
            fields: '*'
          },
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
          }
        });
        statusId = resultResponse.data.status.id;
      } catch (error) {
        console.error('Error polling for result:', error);
        return res.status(500).send('Error executing code');
      }
    }

    res.json(resultResponse.data);

  } catch (error) {
    console.error('Error during code submission:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).send('Error executing code');
  }
});

module.exports = router;