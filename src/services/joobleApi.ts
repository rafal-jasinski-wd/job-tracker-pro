/**
 * joobleApi.ts
 *
 * The API key is NEVER in the browser bundle.
 * - In dev:        requests go to /api/jobs → Vite proxy → Jooble (key in Node process only)
 * - In production: requests go to /.netlify/functions/jobs → serverless proxy
 */

const IS_DEV = import.meta.env.DEV;

export interface JoobleJob {
  title: string;
  location: string;
  snippet: string;
  salary?: string;   // not rendered in UI
  source?: string;   // not rendered in UI
  type: string;
  link: string;
  company: string;
  updated: string;
  id: string;
}

interface JoobleResponse {
  totalCount: number;
  jobs: JoobleJob[];
}

export const fetchJoobleJobs = async (
  keywords: string,
  location: string,
  signal?: AbortSignal   // accepts AbortSignal for request cancellation
): Promise<JoobleJob[]> => {
  const body = JSON.stringify({ keywords: keywords || '', location: location || '' });

  // Dev → Vite proxy (no key in browser), Production → Netlify function
  const url = IS_DEV ? '/api/jobs' : '/.netlify/functions/jobs';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid Jooble API key. Please check your .env file.');
    }
    throw new Error(`Error fetching jobs: ${response.statusText} (${response.status})`);
  }

  const result: JoobleResponse = await response.json();
  return result.jobs || [];
};
