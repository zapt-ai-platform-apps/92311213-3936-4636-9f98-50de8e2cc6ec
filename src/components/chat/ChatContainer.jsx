import React, { useContext, useRef, useEffect } from 'react';
import { ChatContext } from '../../context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TopicSuggestions from './TopicSuggestions';
import { FaTrash } from 'react-icons/fa';

const ChatContainer = () => {
  const { messages, isLoading, error, clearChat } = useContext(ChatContext);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-50">
        <h2 className="text-lg font-medium text-blue-900">AI Money Mentor Chat</h2>
        <button 
          onClick={clearChat}
          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          aria-label="Clear chat"
          title="Clear chat history"
        >
          <FaTrash />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList messages={messages} isLoading={isLoading} />
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <TopicSuggestions />
      <ChatInput />
    </div>
  );
};

export default ChatContainer;