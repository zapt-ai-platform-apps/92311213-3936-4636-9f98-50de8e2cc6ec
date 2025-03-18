import React from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, isLoading }) => {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Start a conversation by typing a message...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
};

export default MessageList;