import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';

const TypingIndicator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex max-w-[85%]"
    >
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 mr-2 flex items-center justify-center">
        <FaRobot className="text-green-700" />
      </div>
      <div className="py-3 px-4 rounded-lg bg-white border border-gray-200">
        <div className="flex space-x-1">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;