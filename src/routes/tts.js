// routes/tts.js
// Proxy seguro para ElevenLabs TTS
// La API key nunca llega al cliente

const express = require('express');
const router  = express.Router();

// Voces seleccionadas para español natural
// eleven_multilingual_v2 maneja ambas variantes sin configuración extra
const VOICES = {
  es:      'pNInz6obpgDQGcFmaJgB', // español neutro (Latinoamérica)
  default: 'pNInz6obpgDQGcFmaJgB', // fallback
};

router.post('/api/tts', async (req, res) => {
  const { text, lang } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  // Limitar longitud para evitar costes excesivos
  const cleanText = text.trim().slice(0, 800);
  const voiceId   = VOICES[lang] || VOICES.default;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'xi-api-key':    process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',   // soporta ES España + Latinoamérica
          voice_settings: {
            stability:         0.45,  // más natural, menos robótico
            similarity_boost:  0.80,
            style:             0.30,  // algo de expresividad
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.detail || 'Error ElevenLabs' });
    }

    // Devolver el audio directamente como stream
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error('Error TTS proxy:', err);
    res.status(500).json({ error: 'Error conectando con ElevenLabs' });
  }
});

module.exports = router;
