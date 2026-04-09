import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export const handler: Handler = async (event, context) => {
  // Only allow POST requests for security
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const ai = new GoogleGenAI({ 
      // This pulls directly from Netlify's secure Environment Variables area, NOT from Vite!
      apiKey: process.env.GEMINI_API_KEY 
    });

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: response.text }),
    };

  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate mock interview.', details: error.message }),
    };
  }
};
