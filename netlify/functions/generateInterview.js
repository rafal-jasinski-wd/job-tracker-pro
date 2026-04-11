// Groq AI Proxy — uses Groq's free OpenAI-compatible API
// Model: llama-3.3-70b-versatile (free, fast, powerful)
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'GROQ_API_KEY is not configured.',
        details: 'Go to Netlify -> Site Settings -> Environment variables and add GROQ_API_KEY. Get your free key at console.groq.com'
      })
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

  const userPrompt = `I am applying for the position of "${title}" at "${company}".

Job description: ${description || 'Not provided.'}
My personal notes: ${notes || 'None.'}

Please generate an AI Mock Interview guide with:
1. 5 highly tailored interview questions for this specific role and company.
2. 3 strategic tips on how to stand out and pass the interview.

Format the output in clean Markdown. No greeting or intro — just the markdown content directly.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an elite Silicon Valley recruiter and career coach. You help job seekers prepare for interviews by generating tailored interview questions and strategic advice. Always respond in clean, well-formatted Markdown.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || `Groq API error: HTTP ${response.status}`;
      console.error('[Groq] Error:', errMsg);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: errMsg }),
      };
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Groq returned an empty response.' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: text }),
    };

  } catch (err) {
    console.error('[Groq] Fetch error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Failed to reach Groq API.' }),
    };
  }
};
