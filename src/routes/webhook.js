const express = require('express');
const router = express.Router();

// Para integraciones futuras (WhatsApp, Instagram, etc.)
router.post('/whatsapp', (req, res) => {
  res.json({ success: true });
});

module.exports = router;
