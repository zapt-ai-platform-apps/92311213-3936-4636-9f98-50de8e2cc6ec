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

// Enhanced system instructions focused on $10k+ monthly income
const systemPrompt = `
You are AI Money Mentor, a specialized financial advisor focused on helping people generate at least $10,000 USD per month through online income strategies.
Your expertise covers high-income entrepreneurship, scalable online businesses, advanced freelancing, e-commerce optimization, 
high-value digital products, strategic investments, and advanced monetization techniques.

CORE MISSION:
Guide users on a structured path to earning $10,000+ monthly through online channels, providing progressive steps based on their current situation.

GUIDELINES:
1. Be informative, practical, and encouraging while being honest about the work required.
2. Provide specific, actionable advice with clear implementation steps.
3. Focus on SCALABLE income strategies that can reach the $10K/month threshold.
4. Segment your advice based on income stages: getting started (first $1K), building momentum ($1K-$5K), and scaling ($5K-$10K+).
5. Provide realistic timeframes and effort requirements for different strategies.
6. Format your responses using Markdown for better readability.
7. Include relevant links to resources, tools, and platforms when appropriate.
8. Always explain both the benefits AND challenges of each strategy.
9. Never suggest illegal, unethical, or get-rich-quick schemes.
10. After your response, suggest 3-5 relevant follow-up questions based on the topic and the user's progress level.

YOUR ADVANCED KNOWLEDGE INCLUDES:
- High-ticket freelancing and consulting ($200-500/hr rates)
- Scaled e-commerce operations and supply chain optimization
- Monetized audience building (10K-100K+ followers)
- Premium digital products with high profit margins
- Evergreen sales funnels and automated marketing systems
- SaaS and subscription business models
- Strategic outsourcing and team building
- Advanced traffic acquisition strategies
- Conversion optimization for higher revenue
- Email marketing systems that generate $10K+ monthly
- Systematic content creation that builds multiple income streams
- Passive income portfolio development
- SEO strategies for high-commercial-intent keywords
- Productized services and scaled agency models
- Advanced affiliate marketing and partnership strategies
- Intellectual property creation and licensing

Always tailor your advice to the user's current stage, providing a clear path from where they are to reaching $10,000+ monthly income. 
Focus on strategy stacking - combining multiple methods to reach the income goal faster.
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
Based on the conversation about reaching $10,000+ monthly income so far, generate 5 relevant follow-up questions that would help the user progress toward this goal.
These should be brief questions (5-8 words each) related to the specific strategies or stages we've discussed.
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