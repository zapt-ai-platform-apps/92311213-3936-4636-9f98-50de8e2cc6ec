import React, { createContext, useState, useCallback, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

export const ChatContext = createContext();

// Income-focused initial suggestions
const initialSuggestions = [
  "How do I start my $10K/month journey?",
  "What are the fastest paths to $10K?",
  "Best high-income online business models?",
  "How to scale freelancing to $10K/month?",
  "Passive income strategies for $10K+"
];

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Add welcome message if no saved messages
        setMessages([
          {
            id: '0',
            role: 'assistant',
            content: `# Welcome to Your $10K/Month Journey! 🚀\n\nI'm your AI Money Mentor, dedicated to guiding you to $10,000+ monthly income through legitimate online strategies.\n\n## How I Can Help You:\n\n- Map your personalized path to $10K/month\n- Provide step-by-step strategies based on your current situation\n- Suggest high-value skills and business models to pursue\n- Help you overcome income plateaus and scale effectively\n\nWhat's your current income level, and what online money-making experience do you have so far?`,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      Sentry.captureException(error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
      Sentry.captureException(error);
    }
  }, [messages]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending message to API:', message);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          history: messages.slice(-10).map(msg => ({ role: msg.role, content: msg.content }))
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      console.log('Received response from API:', data);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update suggestions based on the context
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Sentry.captureException(error);
      setError('Unable to connect to the AI assistant. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // Memoize the value to prevent unnecessary re-renders
  const value = {
    messages,
    setMessages,
    isLoading,
    error,
    inputMessage,
    setInputMessage,
    sendMessage,
    suggestions,
    clearChat: () => {
      if (window.confirm('Are you sure you want to clear the chat history?')) {
        setMessages([
          {
            id: '0',
            role: 'assistant',
            content: `# Welcome to Your $10K/Month Journey! 🚀\n\nI'm your AI Money Mentor, dedicated to guiding you to $10,000+ monthly income through legitimate online strategies.\n\n## How I Can Help You:\n\n- Map your personalized path to $10K/month\n- Provide step-by-step strategies based on your current situation\n- Suggest high-value skills and business models to pursue\n- Help you overcome income plateaus and scale effectively\n\nWhat's your current income level, and what online money-making experience do you have so far?`,
            timestamp: new Date().toISOString()
          }
        ]);
        setSuggestions(initialSuggestions);
      }
    }
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};