// server.js
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;

// Create http server
const app = express();

app.use(bodyParser.json());

// Serve static files from the "dist/client" directory (assuming you have built your client-side code)
app.use(express.static('./dist/client'));

// Endpoint to handle chatbot requests
app.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    // Here, you can use the 'message' received from the user and call the OpenAI API
    // to get the chatbot response. Replace 'YOUR_OPENAI_API_KEY' with your actual API key.
    const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    const chatbotResponse = data.choices[0]?.text ?? 'Sorry, I could not understand that.';
    res.json({ chatbotResponse });
  } catch (e) {
    console.error(e); // Add this line to log errors to the console
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
