import { useState, useMemo, useCallback } from 'react';
import { Briefcase, LayoutList, LayoutGrid } from 'lucide-react';
import type { Job } from '../types/job';
import { JobList } from '../components/JobList';
import { FilterBar } from '../components/FilterBar';
import { Stats } from '../components/Stats';
import { JobDetailModal } from '../components/JobDetailModal';
import { KanbanBoard } from '../components/KanbanBoard';

interface TrackerPageProps {
  jobs: Job[];
  onAddClick?: () => void;
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
  onUpdateJob: (job: Job) => void;
}

export const TrackerPage = ({ jobs, onAddClick, onDeleteJob, onEditJob, onUpdateJob }: TrackerPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');
  const [viewJobId, setViewJobId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  // Stable reference — avoids unnecessary re-renders of the modal on unrelated state changes
  const handleCloseModal = useCallback(() => setViewJobId(null), []);

  const activeViewJob = useMemo(() => {
    if (!viewJobId) return null;
    return jobs.find(j => j.id === viewJobId) || null;
  }, [jobs, viewJobId]);

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
      
      <div className="tracker-header-container">
        <p className="page-subtitle" style={{ margin: 0 }}>Manage your active job applications and keep track of your progress.</p>
        
        {jobs.length > 0 && (
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <LayoutList size={18} />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
              title="Kanban Board View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        )}
      </div>

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
          <h3 className="empty-title">No applications yet</h3>
          <p className="empty-text">Start tracking your job search by adding your first application.</p>
          <button className="btn" onClick={onAddClick}>Add Application</button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state tracker-empty">
          <Briefcase size={40} className="empty-icon icon-dim-50" />
          <h3 className="empty-title">No matching applications</h3>
          <p className="empty-text">We couldn't find any applications matching your current filters.</p>
          <button className="btn btn--ghost" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <JobList jobs={filteredJobs} onDeleteJob={onDeleteJob} onEditJob={onEditJob} onViewJob={(job) => setViewJobId(job.id)} />
      ) : (
        <KanbanBoard 
          jobs={filteredJobs} 
          onUpdateJob={onUpdateJob}
          onDeleteJob={onDeleteJob}
          onEditJob={onEditJob}
          onViewJob={(job) => setViewJobId(job.id)}
        />
      )}

      {activeViewJob && (
        <JobDetailModal
          job={{
            title: activeViewJob.position,
            company: activeViewJob.company,
            status: activeViewJob.status,
            location: activeViewJob.location,
            date: activeViewJob.date,
            notes: activeViewJob.notes,
            aiInterviewPrep: activeViewJob.aiInterviewPrep,
            resumeUrl: activeViewJob.resumeUrl,
            coverLetterUrl: activeViewJob.coverLetterUrl,
            interviewDate: activeViewJob.interviewDate
          }}
          onClose={handleCloseModal}
          onUpdateJob={(updatedData) => {
            if (!activeViewJob) return;
            onUpdateJob({
              ...activeViewJob,
              status: (updatedData.status as Job['status']) || activeViewJob.status,
              aiInterviewPrep: updatedData.aiInterviewPrep,
              resumeUrl: updatedData.resumeUrl,
              coverLetterUrl: updatedData.coverLetterUrl,
              interviewDate: updatedData.interviewDate
            });
          }}
        />
      )}
    </div>
  );
};
