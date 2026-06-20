import type { Job } from '../types/job';

export interface FunnelItem {
  name: string;
  value: number;
  color: string;
}

export interface VelocityItem {
  date: string;
  apps: number;
}

export const computeFunnelData = (jobs: Job[]): FunnelItem[] => {
  let applied = 0;
  let interview = 0;
  let offer = 0;
  let rejected = 0;

  jobs.forEach(job => {
    if (job.status === 'applied') applied++;
    if (job.status === 'interview') interview++;
    if (job.status === 'offer') offer++;
    if (job.status === 'rejected') rejected++;
  });

  return [
    { name: 'Applied', value: applied, color: '#9ca3af' },
    { name: 'Interview', value: interview, color: '#eab308' },
    { name: 'Offer', value: offer, color: '#22c55e' },
    { name: 'Rejected', value: rejected, color: '#ef4444' }
  ].filter(v => v.value > 0);
};

export const computeVelocityData = (jobs: Job[], referenceDate: Date = new Date()): VelocityItem[] => {
  const map = new Map<string, number>();
  const d = new Date(referenceDate);
  d.setHours(0, 0, 0, 0);

  // Initialize last 14 days
  for (let i = 13; i >= 0; i--) {
    const past = new Date(d);
    past.setDate(past.getDate() - i);
    const str = `${past.getMonth() + 1}/${past.getDate()}`;
    map.set(str, 0);
  }

  jobs.forEach(job => {
    const jd = new Date(job.date);
    const str = `${jd.getMonth() + 1}/${jd.getDate()}`;
    if (map.has(str)) {
      map.set(str, map.get(str)! + 1);
    }
  });

  return Array.from(map.entries()).map(([date, apps]) => ({
    date,
    apps
  }));
};
