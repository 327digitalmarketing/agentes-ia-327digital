const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/client - Crear cliente
router.post('/', async (req, res) => {
  try {
    const { clientId, name, industry, config } = req.body;

    const { data, error } = await supabase
      .from('clients')
      .insert([{ client_id: clientId, name, industry, config }]);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/client/:id - Obtener cliente
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
