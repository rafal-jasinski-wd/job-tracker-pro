// Uses raw fetch to call Google AI REST API — no SDK version issues
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

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  // Try multiple model endpoints — v1beta and v1, with current model names
  const endpoints = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-8b:generateContent',
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${endpoint}?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(`[AI] ${endpoint} failed: ${JSON.stringify(data)}`);
        lastError = data.error || { message: `HTTP ${res.status}` };
        continue;
      }

      // Extract text from Google's response format
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = { message: 'Empty AI response from ' + endpoint };
        continue;
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: text }),
      };

    } catch (err) {
      console.log(`[AI] Fetch error for ${endpoint}: ${err.message}`);
      lastError = { message: err.message };
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: lastError ? (lastError.message || JSON.stringify(lastError)) : 'All AI models failed.',
    }),
  };
};
