import OpenAI from 'openai';
import * as Sentry from '@sentry/node';

// Initialize Sentry
Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System instructions for the AI
const systemPrompt = `
You are AI Money Mentor, a specialized financial advisor focused on helping people generate income online.
Your expertise covers freelancing, e-commerce, digital marketing, investments, passive income streams, 
online businesses, and many other methods of making money online.

GUIDELINES:
1. Be informative, practical, and encouraging.
2. Provide specific, actionable advice that people can implement.
3. Suggest realistic income opportunities based on the person's situation.
4. Be honest about the effort and time required for different opportunities.
5. Format your responses using Markdown for better readability (use headers, bullet points, etc.).
6. Include relevant links to resources when appropriate.
7. Answer follow-up questions based on your previous responses.
8. Never suggest illegal, unethical, or get-rich-quick schemes.
9. After your response, suggest 3-5 relevant follow-up questions based on the topic and conversation.

YOUR KNOWLEDGE INCLUDES:
- Freelancing platforms and strategies
- E-commerce and dropshipping
- Content creation (YouTube, blogs, podcasts)
- Digital product creation and sales
- Affiliate marketing
- Online tutoring and coaching
- Stock market and cryptocurrency investing
- Real estate investing and REITs
- Print-on-demand and merchandise
- App and software development
- Online surveys and micro-tasks
- Skills development for online income
- Work-from-home job opportunities
- Side hustle ideas
- Passive income generation
- Tax considerations for online income
- Scaling online businesses
- Tools and resources for online entrepreneurs

Always provide a balanced perspective on income opportunities, discussing both potential benefits and challenges.
`;

export default async function handler(req, res) {
  console.log('Chat API request received');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    console.log('Preparing OpenAI request');
    
    // Format conversation history for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1200,
    });

    console.log('Received OpenAI response');

    const reply = completion.choices[0].message.content;

    // Generate suggested topics based on the conversation
    const suggestionsPrompt = `
Based on the conversation about online money-making so far, generate 5 relevant follow-up questions that the user might want to ask next.
These should be brief questions (5-8 words each) related to the topic discussed.
Return only the questions as a JSON array without explanation.
`;

    const suggestionsCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        ...messages,
        { role: 'assistant', content: reply },
        { role: 'user', content: suggestionsPrompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
      response_format: { type: 'json_object' }
    });

    console.log('Received suggestions from OpenAI');

    let suggestions = [];
    try {
      const suggestionsJSON = JSON.parse(suggestionsCompletion.choices[0].message.content);
      suggestions = suggestionsJSON.questions || [];
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      Sentry.captureException(error);
      // Continue without suggestions if there's an error
    }

    // Return the AI response
    return res.status(200).json({
      reply,
      suggestions
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    Sentry.captureException(error);
    
    // Handle specific OpenAI error types
    if (error.name === 'APIError') {
      return res.status(500).json({ 
        error: 'AI service temporarily unavailable. Please try again later.',
        details: error.message
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message
    });
  }
}