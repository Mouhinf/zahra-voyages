import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { chatFlow } from './flows/chatFlow'; // Import the flow

console.log('Initializing Genkit...');
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
  flows: { chatFlow }, // Explicitly register the flow
});
console.log('Genkit initialized successfully.');