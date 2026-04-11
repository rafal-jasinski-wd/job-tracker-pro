import type { Handler } from '@netlify/functions';

interface GenerateInterviewBody {
  title?: string;
  company?: string;
  description?: string;
  notes?: string;
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'GROQ_API_KEY is not configured.',
        details: 'Add GROQ_API_KEY to Netlify → Site Settings → Environment variables. Get your free key at console.groq.com',
      }),
    };
  }

  let body: GenerateInterviewBody;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  const { title, company, description, notes } = body;

  if (!title) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Job title is required.' }) };
  }

  const userPrompt = `I am applying for the position of "${title}" at "${company ?? 'the company'}".

Job description: ${description ?? 'Not provided.'}
My personal notes: ${notes ?? 'None.'}

Please generate an AI Mock Interview guide with:
1. 5 highly tailored interview questions for this specific role and company.
2. 3 strategic tips on how to stand out and pass the interview.

Format the output in clean Markdown. No greeting or intro — just the markdown content directly.`;

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content:
        'You are an elite Silicon Valley recruiter and career coach. You help job seekers prepare for interviews by generating tailored interview questions and strategic advice. Always respond in clean, well-formatted Markdown.',
    },
    {
      role: 'user',
      content: userPrompt,
    },
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = (await response.json()) as GroqResponse;

    if (!response.ok) {
      const errMsg = data?.error?.message ?? `Groq API error: HTTP ${response.status}`;
      console.error('[Groq] Error:', errMsg);
      return { statusCode: 500, body: JSON.stringify({ error: errMsg }) };
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Groq returned an empty response.' }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: text }),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reach Groq API.';
    console.error('[Groq] Fetch error:', message);
    return { statusCode: 500, body: JSON.stringify({ error: message }) };
  }
};
