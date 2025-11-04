import { run } from 'genkit'; // Import correct de la fonction 'run'
import { chatFlow } from '@/ai/flows/chatFlow';

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Utilisation de la fonction 'run' pour exécuter le flux
    const flowResponse = await run(chatFlow, { message });
    return new Response(JSON.stringify(flowResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error running Genkit flow:', error);
    return new Response(JSON.stringify({ error: 'Failed to get response from AI assistant' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}