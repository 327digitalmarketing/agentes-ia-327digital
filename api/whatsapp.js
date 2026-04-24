// api/whatsapp.js — Middleware Twilio → Make
// Responde TwiML vacío a Twilio y reenvía datos a Make asíncronamente

const MAKE_WEBHOOK = 'https://hook.eu1.make.com/pdp837ftyuckpjoykfk5t115ale11jvd';

module.exports = async function handler(req, res) {
  // Responder inmediatamente a Twilio con TwiML vacío (evita el "Accepted")
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send('<Response></Response>');

  // Reenviar datos a Make en segundo plano
  const body = req.body || {};
  const payload = {
    Body:    body.Body    || body.body    || '',
    From:    body.From    || body.from    || '',
    To:      body.To      || body.to      || '',
    NumMedia: body.NumMedia || '0'
  };

  try {
    await fetch(MAKE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Error forwarding to Make:', err);
  }
};
