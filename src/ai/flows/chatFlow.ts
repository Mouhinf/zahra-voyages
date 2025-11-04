import { generate, defineFlow } from '@genkit-ai/flow';
import { geminiPro } from '@genkit-ai/google-cloud';
import * as z from 'zod';

export const chatFlow = defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await generate({
      model: geminiPro,
      prompt: prompt,
      config: {
        temperature: 0.7, // Ajustez la créativité de la réponse
      },
    });
    return llmResponse.text();
  }
);