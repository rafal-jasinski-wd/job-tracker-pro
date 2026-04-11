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
