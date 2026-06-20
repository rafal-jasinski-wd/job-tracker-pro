import type { Job } from '../types/job';

export interface CalendarDay {
  day: number;
  jobs: Job[];
}

export const daysInMonth = (year: number, month: number): number => 
  new Date(year, month + 1, 0).getDate();

export const firstDayOfMonth = (year: number, month: number): number => 
  new Date(year, month, 1).getDay();

export const formatInterviewTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatInterviewDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const isToday = (day: number, month: number, year: number): boolean => {
  const today = new Date();
  return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
};

export const generateCalendarDays = (
  year: number,
  month: number,
  scheduledJobs: Job[]
): (CalendarDay | null)[] => {
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const days: (CalendarDay | null)[] = [];

  // Padding for previous month days
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    const jobsForDay = scheduledJobs.filter(job => {
      if (!job.interviewDate) return false;
      const jDate = new Date(job.interviewDate);
      return jDate.getDate() === i && jDate.getMonth() === month && jDate.getFullYear() === year;
    });
    days.push({ day: i, jobs: jobsForDay });
  }

  return days;
};
