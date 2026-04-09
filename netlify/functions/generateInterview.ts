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

    // Try a series of models in case one is restricted or missing on this specific API key
    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let result;
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(systemPrompt);
        if (result) break; 
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Debug] Model ${modelName} failed:`, err.message);
        continue;
      }
    }

    if (!result) {
      throw lastError || new Error('All attempting AI models failed to respond.');
    }
    
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('The AI generated an empty response.');
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
