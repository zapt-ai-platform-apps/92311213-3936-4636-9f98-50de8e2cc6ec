import React from 'react';
import Header from './components/Header';
import ChatContainer from './components/chat/ChatContainer';
import { ChatProvider } from './context/ChatContext';
import ZaptBadge from './components/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 text-gray-800">
      <ChatProvider>
        <div className="max-w-5xl mx-auto px-4 py-2 flex flex-col h-screen">
          <Header />
          <ChatContainer />
          <ZaptBadge />
        </div>
      </ChatProvider>
    </div>
  );
}