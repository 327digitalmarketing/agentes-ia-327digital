const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

async function callClaude(systemPrompt, messages) {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });
    return response.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

module.exports = { callClaude };
