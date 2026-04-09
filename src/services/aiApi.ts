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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to communicate with AI endpoint.');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("AI Proxy Service Error:", error);
    throw error;
  }
};
