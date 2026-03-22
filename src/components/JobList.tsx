import React from 'react';
import type { Job } from '../types/job';
import { JobItem } from './JobItem';

interface JobListProps {
  jobs: Job[];
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onDeleteJob, onEditJob }) => {
  return (
    <div className="jobs-grid">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} onDeleteJob={onDeleteJob} onEditJob={onEditJob} />
      ))}
    </div>
  );
};
