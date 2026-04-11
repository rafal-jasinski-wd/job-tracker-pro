import type { JoobleJob } from '../services/joobleApi';
import type { Job } from '../types/job';

/**
 * Transforms external API job data into the local application Job format.
 */
export const mapApiJobToJob = (apiJob: JoobleJob): Job => {
  // Strip out HTML bold tags natively passed by Jooble's snippet highlighting
  const cleanSnippet = apiJob.snippet ? apiJob.snippet.replace(/<[^>]*>?/gm, '') : 'No description provided';

  return {
    id: crypto.randomUUID(),
    company: apiJob.company || 'Unknown Company',
    position: apiJob.title || 'Unknown Position',
    // Set default status
    status: 'applied',
    // Default to today's date
    date: new Date().toISOString().split('T')[0],
    notes: `Saved via Search.\n\nLocation: ${apiJob.location}\n\nDescription:\n${cleanSnippet}`,
    link: apiJob.link,
    resumeUrl: undefined,
    coverLetterUrl: undefined,
    interviewDate: undefined
  };
};
