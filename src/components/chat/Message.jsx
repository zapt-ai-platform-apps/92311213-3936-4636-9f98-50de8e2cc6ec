import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';
import { FaRobot, FaUser } from 'react-icons/fa';

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-100 ml-2' : 'bg-green-100 mr-2'
        }`}>
          {isUser ? <FaUser className="text-blue-800" /> : <FaRobot className="text-green-700" />}
        </div>
        
        <div className={`py-3 px-4 rounded-lg ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-800'
        }`}>
          {isUser ? (
            <div>
              <p>{message.content}</p>
              <div className="text-xs mt-1 text-blue-200 text-right">{formattedTime}</div>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw, [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noreferrer'] }]]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold my-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-md font-bold my-1" {...props} />,
                  p: ({node, ...props}) => <p className="my-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                  li: ({node, ...props}) => <li className="my-1" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline 
                      ? <code className="bg-gray-100 px-1 rounded" {...props} />
                      : <code className="block bg-gray-100 p-2 rounded my-2 overflow-x-auto" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
              <div className="text-xs mt-1 text-gray-500 text-right">{formattedTime}</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;