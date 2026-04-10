const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Netlify Environment Variables.' })
    };
  }

  let title, company, description, notes;
  try {
    const body = JSON.parse(event.body || '{}');
    title = body.title;
    company = body.company;
    description = body.description;
    notes = body.notes;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  if (!title) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Job title is required.' }) };
  }

  const prompt = `You are an elite recruiter. The user is applying for the position of "${title}" at "${company}".

Job description: ${description || 'Not provided.'}
Personal notes: ${notes || 'None.'}

Generate an AI Mock Interview guide with:
1. 5 highly tailored interview questions for this specific role and company.
2. 3 strategic tips to stand out and pass the interview.

Format the output cleanly in Markdown. No greeting or filler text — just the markdown.`;

  const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest'];
  let lastError = null;

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) throw new Error('Empty AI response.');

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: text }),
      };
    } catch (err) {
      console.log(`[AI] Model ${modelName} failed: ${err.message}`);
      lastError = err;
      // continue to next model
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: lastError ? lastError.message : 'All AI models failed.',
    }),
  };
};
