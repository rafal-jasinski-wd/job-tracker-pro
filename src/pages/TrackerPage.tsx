import React, { useState, useMemo } from 'react';
import { Briefcase } from 'lucide-react';
import type { Job } from '../types/job';
import { JobList } from '../components/JobList';
import { FilterBar } from '../components/FilterBar';
import { Stats } from '../components/Stats';

interface TrackerPageProps {
  jobs: Job[];
  onAddClick?: () => void;
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({ jobs, onAddClick, onDeleteJob, onEditJob }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = 
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  return (
    <div className="main-content">
      <h1 className="page-title">Applications Tracker</h1>
      <p className="page-subtitle">Manage your active job applications and keep track of your progress.</p>
      
      {jobs.length > 0 && <Stats jobs={jobs} />}
      
      {jobs.length > 0 && (
        <FilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} className="empty-icon" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No applications yet</h3>
          <p style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>Start tracking your job search by adding your first application.</p>
          <button className="btn" onClick={onAddClick}>Add Application</button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem 2rem' }}>
          <Briefcase size={40} className="empty-icon" style={{ opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No matching applications</h3>
          <p style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>We couldn't find any applications matching your current filters.</p>
          <button className="btn" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Clear Filters</button>
        </div>
      ) : (
        <JobList jobs={filteredJobs} onDeleteJob={onDeleteJob} onEditJob={onEditJob} />
      )}
    </div>
  );
};
