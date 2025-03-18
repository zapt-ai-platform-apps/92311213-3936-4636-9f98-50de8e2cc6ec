import React, { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { motion } from 'framer-motion';

const TopicSuggestions = () => {
  const { suggestions, sendMessage, isLoading } = useContext(ChatContext);
  
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className="p-3 bg-blue-50 border-t border-blue-100">
      <p className="text-xs text-blue-700 mb-2">Suggested topics:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => sendMessage(suggestion)}
            disabled={isLoading}
            className="text-sm bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TopicSuggestions;