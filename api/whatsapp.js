// api/whatsapp.js — WhatsApp AI Agent (Nova) for 327 Digital Marketing
// Receives Twilio webhook, calls Gemini, replies via Twilio API

const GEMINI_KEY  = process.env.GEMINI_API_KEY;
const TWILIO_SID  = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

const SYSTEM_PROMPT = `Eres Nova, asistente virtual de 327 Digital Marketing, agencia especializada en marketing digital con inteligencia artificial.

SERVICIOS:
1. Agentes de IA personalizados para negocios (clinicas, restaurantes, hoteles, inmobiliarias, etc.) que atienden clientes 24/7, responden preguntas y agendan citas automaticamente
2. Marketing Digital con IA — estrategias potenciadas con inteligencia artificial
3. Chatbots para WhatsApp, web y redes sociales
4. Automatizacion de procesos con IA
5. Demo en vivo disponible en: https://agentesia327digital.vercel.app/chat-iframe.html

AGENDAR CITA O DEMO — recopila uno por uno de forma natural:
- Nombre completo
- Email
- Tipo de negocio
- Mejor dia y hora para una llamada

REGLAS:
- Responde en el mismo idioma del usuario (espanol o ingles)
- Se breve, amigable y profesional (maximo 3 parrafos)
- Ofrece siempre ver la demo como primer paso
- No inventes precios ni servicios adicionales
- Mas informacion: info@327digital.com o www.327digital.com`;

async function callGemini(userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
    })
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Hola, soy Nova de 327 Digital Marketing. ¿En qué puedo ayudarte?';
}

async function sendWhatsApp(to, from, body) {
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  return res.json();
}

module.exports = async function handler(req, res) {
  const body = req.body || {};
  const msgBody = body.Body || body.body || '';
  const msgFrom = body.From || body.from || '';

  // Respond to Twilio immediately with empty TwiML
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send('<Response></Response>');

  if (!msgBody || !msgFrom) return;

  try {
    const reply = await callGemini(msgBody);
    await sendWhatsApp(msgFrom, TWILIO_FROM, reply);
  } catch (err) {
    console.error('Nova error:', err);
  }
};
