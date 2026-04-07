import { memo } from 'react';
import type { Job } from '../types/job';
import { JobItem } from './JobItem';

interface JobListProps {
  jobs: Job[];
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
  onViewJob: (job: Job) => void;
}

/** Renders the job grid. Memoized to prevent re-renders on unrelated parent state changes (e.g. toasts). */
export const JobList = memo(({ jobs, onDeleteJob, onEditJob, onViewJob }: JobListProps) => {
  return (
    <div className="jobs-grid">
      {jobs.map(job => (
        <JobItem
          key={job.id}
          job={job}
          onDeleteJob={onDeleteJob}
          onEditJob={onEditJob}
          onViewJob={onViewJob}
        />
      ))}
    </div>
  );
});

JobList.displayName = 'JobList';
