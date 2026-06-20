import { describe, it, expect } from 'vitest';
import { daysInMonth, firstDayOfMonth, formatInterviewTime, formatInterviewDate, isToday, generateCalendarDays } from './dateUtils';
import type { Job } from '../types/job';

describe('dateUtils', () => {
  it('should compute days in month correctly', () => {
    // February 2024 (Leap year)
    expect(daysInMonth(2024, 1)).toBe(29);
    // February 2023 (Non-leap year)
    expect(daysInMonth(2023, 1)).toBe(28);
    // December
    expect(daysInMonth(2023, 11)).toBe(31);
  });

  it('should compute first day of month correctly', () => {
    // Jan 1, 2026 is Thursday (getDay() = 4)
    expect(firstDayOfMonth(2026, 0)).toBe(4);
  });

  it('should format interview time correctly', () => {
    const timeStr = '2026-06-19T14:30:00';
    expect(formatInterviewTime(timeStr)).toMatch(/02:30|14:30/);
  });

  it('should format interview date correctly', () => {
    const timeStr = '2026-06-19T14:30:00';
    expect(formatInterviewDate(timeStr)).toMatch(/Jun 19|19 Jun/);
  });

  it('should identify today correctly', () => {
    const today = new Date();
    expect(isToday(today.getDate(), today.getMonth(), today.getFullYear())).toBe(true);
    expect(isToday(today.getDate() - 1, today.getMonth(), today.getFullYear())).toBe(false);
  });

  it('should generate calendar days with padding and assigned jobs', () => {
    const mockJobs: Job[] = [
      {
        id: '1',
        company: 'Google',
        position: 'Engineer',
        status: 'interview',
        date: '2026-06-01',
        interviewDate: '2026-06-15T10:00:00'
      }
    ];

    // June 2026: starts on Monday (1). Total days: 30.
    const cells = generateCalendarDays(2026, 5, mockJobs);
    
    // Padding: June 1st is Monday, so Sunday is padded (1 null cell)
    expect(cells[0]).toBeNull();
    // June 1st is at cells[1]
    expect(cells[1]).toEqual({ day: 1, jobs: [] });
    
    // June 15th is at index 15
    const cell15 = cells[15];
    expect(cell15).not.toBeNull();
    expect(cell15?.day).toBe(15);
    expect(cell15?.jobs.length).toBe(1);
    expect(cell15?.jobs[0].company).toBe('Google');
  });
});
