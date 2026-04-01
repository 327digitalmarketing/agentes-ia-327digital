const express = require('express');
const router = express.Router();
const { processMessage } = require('../controllers/agentController');

// POST /api/agent/message
router.post('/message', async (req, res) => {
  try {
    const { clientId, userId, message } = req.body;

    // Validación
    if (!clientId || !userId || !message) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    const response = await processMessage(clientId, userId, message);

    res.json({
      success: true,
      reply: response
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
