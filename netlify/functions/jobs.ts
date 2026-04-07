/**
 * SEC-01: Netlify serverless proxy for Jooble API
 * The API key lives only in Netlify environment variables — never in the browser.
 */

const JOOBLE_API_KEY = process.env.VITE_JOOBLE_API_KEY || '';
const JOOBLE_BASE_URL = 'https://jooble.org/api';
// Set ALLOWED_ORIGIN in Netlify dashboard to your production domain.
// Leave unset in dev to allow any origin.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string>;
};
type NetlifyResponse = { statusCode: number; headers?: Record<string, string>; body: string };

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Block requests from disallowed origins (production only)
  if (ALLOWED_ORIGIN && event.headers?.origin !== ALLOWED_ORIGIN) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  if (!JOOBLE_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured on server.' }) };
  }

  try {
    const response = await fetch(`${JOOBLE_BASE_URL}/${JOOBLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body ?? '{}'
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to contact Jooble API.' })
    };
  }
};
