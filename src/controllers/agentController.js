const supabase = require('../config/supabase');
const { callClaude } = require('../utils/claude');

async function processMessage(clientId, userId, userMessage) {
  try {
    // 1. Obtener configuración del cliente
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (clientError) throw new Error('Cliente no encontrado');

    // 2. Obtener historial de conversación
    const { data: history, error: historyError } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('client_id', clientId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (historyError) throw new Error('Error al obtener historial');

    // 3. Crear system prompt dinámico
    const systemPrompt = buildSystemPrompt(clientData);

    // 4. Llamar a Claude
    const messages = [
      ...history.map(h => ({role: h.role, content: h.content})),
      {role: 'user', content: userMessage}
    ];

    const aiResponse = await callClaude(systemPrompt, messages);

    // 5. Guardar en conversación
    await supabase.from('conversations').insert([
      {client_id: clientId, user_id: userId, role: 'user', content: userMessage},
      {client_id: clientId, user_id: userId, role: 'assistant', content: aiResponse}
    ]);

    return aiResponse;
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}

function buildSystemPrompt(clientData) {
  const config = clientData.config || {};

  return `Eres un agente de atención al cliente para ${clientData.name}.

Industria: ${clientData.industry}
Ubicación: ${config.location || 'No especificada'}
Horarios: ${config.hours || 'No especificados'}

Servicios: ${JSON.stringify(config.services || [])}

Tu rol es:
1. Responder preguntas sobre servicios
2. Manejar objeciones
3. Agendar citas cuando sea posible
4. Hacer seguimiento

Sé profesional, amable y conciso.`;
}

module.exports = { processMessage };
