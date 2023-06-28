const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
require("dotenv").config()

app.use(cors())
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
app.get('/shayari/:word', async (req, res) => {
  try {
    const { word } = req.params;
    console.log(word)
    // Make a request to the ChatGPT API
    const response = await axios.post('https://api.openai.com/v1/chat/completions',{
      model: 'gpt-3.5-turbo', // Update with your desired model
      messages: [
        { role: 'system', content: 'You are a poet.' },
        { role: 'user', content: `Generate a shayari for ${word} in 
        English` }
      ],
      max_tokens: 50,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`, // Replace with your ChatGPT API key
        'Content-Type': 'application/json'
      }
    });

    const shayari = response.data.choices[0].message.content;
    res.json({ shayari });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(process.env.Port, () => {
  console.log(`Server is running on port ${process.env.Port}`);
});