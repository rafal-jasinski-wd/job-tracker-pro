import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler: Handler = async (event, context) => {
  // Only allow POST requests for security
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        error: 'Gemini API Key is not configured on Netlify.',
        details: 'Go to your Netlify dashboard -> Site Settings -> Environment variables and add GEMINI_API_KEY.'
      }) 
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Parse the job details sent securely from the client browser
    const { title, company, description, notes } = JSON.parse(event.body || '{}');

    if (!title) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Job title is required.' }) };
    }

    const systemPrompt = `You are an elite Silicon Valley Tech Recruiter. The user is applying for the position of "${title}" at "${company}".
    
    Here is the job description snippet they saved: 
    ${description || 'No description provided.'}
    
    Here are their personal notes:
    ${notes || 'No extra notes provided.'}
    
    Using this information, generate an AI Mock Interview guide containing exactly:
    1. 5 highly tailored, specific interview questions they will likely face for this exact role and company.
    2. 3 strategic tips on how to pass the interview and stand out.
    
    Format the output cleanly in Markdown. Do not include any greeting or conversational filler—just output the markdown directly.`;

    const result = await model.generateContent(systemPrompt);
    
    // Logic to handle safety filters or empty responses
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('The AI generated an empty response. This usually happens if the safety filters are too strict.');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: text }),
    };

  } catch (error: any) {
    console.error("AI Generation failed:", error);
    
    // Return the EXACT error message to the frontend for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message || 'Failed to generate mock interview.',
        details: error.toString()
      }),
    };
  }
};
