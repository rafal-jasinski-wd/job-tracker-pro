import type { JobDetailData } from '../components/JobDetailModal';

export const generateMockInterview = async (job: JobDetailData): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/generateInterview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: job.title,
        company: job.company,
        description: job.descriptionSnippet,
        notes: job.notes,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('AI Function not found. If you are testing locally, please use "netlify dev" instead of "npm run dev". If on production, wait 1 minute for the functions to propagate.');
      }
      const errorData = await response.json().catch(() => ({}));
      const detailedMsg = errorData.details ? `${errorData.error}: ${errorData.details}` : (errorData.error || `Server Error (${response.status}): Failed to generate prep.`);
      throw new Error(detailedMsg);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("AI Proxy Service Error:", error);
    throw error;
  }
};
