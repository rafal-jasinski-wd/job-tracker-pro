/**
 * Netlify serverless proxy for Jooble API
 * The API key lives only in Netlify environment variables — never in the browser.
 */

const JOOBLE_API_KEY = process.env.VITE_JOOBLE_API_KEY || '';
const JOOBLE_BASE_URL = 'https://jooble.org/api';
// Set ALLOWED_ORIGIN in Netlify dashboard to your production domain.
// Leave unset in dev to allow any origin.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';

// Maximum allowed request body size (4KB is generous for a search query)
const MAX_BODY_SIZE = 4096;

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string>;
};
type NetlifyResponse = { statusCode: number; headers?: Record<string, string>; body: string };

// Simple in-memory rate limiter (resets on container cold start, but effective against immediate spam)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_HOUR = 30;

function checkRateLimit(ip: string): boolean {
  if (!ip) return false; // Fail open if IP is missing
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (record && now < record.resetTime) {
    if (record.count >= MAX_REQUESTS_PER_HOUR) return true; // Rate limited
    record.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour window
  }
  return false;
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Block requests from disallowed origins (production only)
  if (ALLOWED_ORIGIN && event.headers?.origin !== ALLOWED_ORIGIN) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  // Rate Limiting
  const clientIp = event.headers?.['x-nf-client-connection-ip'] || event.headers?.['client-ip'] || '';
  if (checkRateLimit(clientIp)) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Too Many Requests. Please try again later.' }) };
  }

  if (!JOOBLE_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured on server.' }) };
  }

  // Validate request body size to prevent amplification attacks
  const rawBody = event.body ?? '{}';
  if (rawBody.length > MAX_BODY_SIZE) {
    return { statusCode: 413, body: JSON.stringify({ error: 'Request body too large.' }) };
  }

  // Validate that the body is valid JSON with expected shape
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  // Only forward expected fields to Jooble
  const sanitizedBody = JSON.stringify({
    keywords: typeof parsed.keywords === 'string' ? parsed.keywords.slice(0, 200) : '',
    location: typeof parsed.location === 'string' ? parsed.location.slice(0, 200) : '',
  });

  try {
    const response = await fetch(`${JOOBLE_BASE_URL}/${JOOBLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: sanitizedBody
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to contact Jooble API.' })
    };
  }
};
