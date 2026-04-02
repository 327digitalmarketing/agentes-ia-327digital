// api/chat.js — Vercel Serverless Function
// Proxy seguro: la API key nunca llega al cliente

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
        model:      'claude-sonnet-4-5',
        max_tokens: 400,
        system,
        messages
      })
    });

    const data = await response.json();
    if (!response.ok) console.error('Anthropic error:', JSON.stringify(data));
    res.json(data);

  } catch (err) {
    console.error('Error proxy Anthropic:', err);
    res.status(500).json({ error: 'Error conectando con Anthropic' });
  }
};
