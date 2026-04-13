// routes/tts.js
// Proxy ElevenLabs TTS con voces distintas para ES y EN

const express = require('express');
const router  = express.Router();

const VOICES = {
  es: 'XB0fDUnXU5powFXDhCwa', // Charlotte — cálida, natural, excelente en español neutro
  en: '21m00Tcm4TlvDq8ikWAM', // Rachel   — inglés americano claro y profesional
};

router.post('/api/tts', async (req, res) => {
  const { text, lang } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text required' });
  }

  const cleanText = text.trim().slice(0, 800);
  const voiceId   = VOICES[lang] || VOICES.es;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key':   process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability:         0.45,
            similarity_boost:  0.80,
            style:             0.30,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.detail || 'ElevenLabs error' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error('TTS proxy error:', err);
    res.status(500).json({ error: 'Error connecting to ElevenLabs' });
  }
});

module.exports = router;
