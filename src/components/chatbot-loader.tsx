'use client';

import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/components/chatbot'), {
  ssr: false,
  loading: () => null,
});

export default function ChatbotLoader() {
  return <Chatbot />;
}
