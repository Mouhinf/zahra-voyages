import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

console.log('Initializing Genkit...');
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
console.log('Genkit initialized successfully.');