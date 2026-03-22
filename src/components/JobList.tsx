import React from 'react';
import type { Job } from '../types/job';
import { JobItem } from './JobItem';

interface JobListProps {
  jobs: Job[];
  onDeleteJob: (id: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onDeleteJob }) => {
  return (
    <div className="jobs-grid">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} onDeleteJob={onDeleteJob} />
      ))}
    </div>
  );
};
