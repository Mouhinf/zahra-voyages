import { chatFlow } from '@/ai/genkit'; // Import the flow from genkit.ts

// Exporte les gestionnaires GET et POST pour le flow
export const { GET, POST } = chatFlow;