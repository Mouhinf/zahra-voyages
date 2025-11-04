import { run } from '@genkit-ai/core';
import { chatFlow } from '@/ai/flows/chatFlow';

export async function POST(req: Request) {
  console.log('API /api/chat POST request received.');
  const { message } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const flowResponse = await run(chatFlow, { message });
    return new Response(JSON.stringify(flowResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error running Genkit flow in /api/chat:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to get response from AI assistant' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}