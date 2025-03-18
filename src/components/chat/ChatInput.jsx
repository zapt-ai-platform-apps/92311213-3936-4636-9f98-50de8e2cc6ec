import React, { useContext, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { FaPaperPlane } from 'react-icons/fa';

const ChatInput = () => {
  const { inputMessage, setInputMessage, sendMessage, isLoading } = useContext(ChatContext);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading || !inputMessage.trim()) return;
    sendMessage(inputMessage);
  };

  const handleChange = (e) => {
    setInputMessage(e.target.value);
    setIsTyping(e.target.value !== '');
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={handleChange}
          disabled={isLoading}
          placeholder={isLoading ? "AI is thinking..." : "Ask about making money online..."}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg box-border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={`px-4 py-2 rounded-r-lg cursor-pointer flex items-center justify-center ${
            isLoading || !inputMessage.trim()
              ? 'bg-gray-300 text-gray-500'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } transition-colors`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;