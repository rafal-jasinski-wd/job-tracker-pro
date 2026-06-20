export interface Job {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  location?: string;
  date: string;
  notes?: string;
  link?: string;
  type?: string;
  aiInterviewPrep?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  interviewDate?: string;
}

export type Tab = 'tracker' | 'jobs' | 'schedule' | 'insights';

export const VALID_TABS: Tab[] = ['tracker', 'jobs', 'schedule', 'insights'];

export function isJobStatus(value: string): value is Job['status'] {
  return ['applied', 'interview', 'offer', 'rejected'].includes(value);
}

export function isStatusFilter(value: string): value is Job['status'] | 'all' {
  return ['all', 'applied', 'interview', 'offer', 'rejected'].includes(value);
}

export function isTab(value: string): value is Tab {
  return (VALID_TABS as string[]).includes(value);
}

