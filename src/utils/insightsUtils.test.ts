import { describe, it, expect } from 'vitest';
import { computeFunnelData, computeVelocityData } from './insightsUtils';
import type { Job } from '../types/job';

describe('insightsUtils', () => {
  const mockJobs: Job[] = [
    { id: '1', company: 'A', position: 'P', status: 'applied', date: '2026-06-18' },
    { id: '2', company: 'B', position: 'P', status: 'interview', date: '2026-06-18' },
    { id: '3', company: 'C', position: 'P', status: 'interview', date: '2026-06-19' },
    { id: '4', company: 'D', position: 'P', status: 'offer', date: '2026-06-10' }
  ];

  it('should compute funnel data correctly and exclude empty categories', () => {
    const funnel = computeFunnelData(mockJobs);
    
    // There are 1 applied, 2 interview, 1 offer, 0 rejected (rejected should be excluded)
    expect(funnel).toEqual([
      { name: 'Applied', value: 1, color: '#9ca3af' },
      { name: 'Interview', value: 2, color: '#eab308' },
      { name: 'Offer', value: 1, color: '#22c55e' }
    ]);
  });

  it('should compute velocity data for the last 14 days', () => {
    const referenceDate = new Date('2026-06-19T12:00:00');
    const velocity = computeVelocityData(mockJobs, referenceDate);
    
    expect(velocity.length).toBe(14);
    
    // Check specific days
    // 2026-06-19 is June 19 (6/19). It should have 1 job (id: 3)
    const day19 = velocity.find(d => d.date === '6/19');
    expect(day19).toEqual({ date: '6/19', apps: 1 });

    // 2026-06-18 is June 18 (6/18). It should have 2 jobs (id: 1, 2)
    const day18 = velocity.find(d => d.date === '6/18');
    expect(day18).toEqual({ date: '6/18', apps: 2 });

    // 2026-06-10 is June 10 (6/10). It should have 1 job (id: 4)
    const day10 = velocity.find(d => d.date === '6/10');
    expect(day10).toEqual({ date: '6/10', apps: 1 });

    // 2026-06-05 is June 5 (6/5). It is outside the last 14 days (June 6 to June 19)
    // June 19 - 13 days = June 6. So June 5 should not be in the list.
    const day5 = velocity.find(d => d.date === '6/5');
    expect(day5).toBeUndefined();
  });
});
