import { defineFlow, run } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const chatFlow = defineFlow(
  {
    name: 'chatFlow',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        response: { type: 'string' },
      },
      required: ['response'],
    },
  },
  async (input) => {
    const model = googleAI.text;
    const response = await run(model, {
      prompt: `You are a helpful AI assistant for Zahra Voyages, a travel agency based in Dakar, Senegal. Your goal is to provide information and guidance regarding travel, destinations, visa procedures, and general inquiries about Zahra Voyages' services. Keep your answers concise and helpful.

User: ${input.message}
Assistant:`,
      temperature: 0.7,
    });

    return { response: response.text() };
  }
);