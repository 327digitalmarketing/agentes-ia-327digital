// routes/chat.js
// Proxy seguro entre el browser y Anthropic API
// La API key nunca llega al cliente

const express = require('express');
const router  = express.Router();

router.post('/api/chat', async (req, res) => {
  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array requerido' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 400,
        system,
        messages
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error('Error proxy Anthropic:', err);
    res.status(500).json({ error: 'Error conectando con Anthropic' });
  }
});

module.exports = router;
