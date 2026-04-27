import { memo } from 'react';
import { Building2, Clock, Trash2, Pencil, ExternalLink } from 'lucide-react';
import type { Job } from '../types/job';
import { isSafeUrl } from '../utils/urlUtils';

interface JobItemProps {
  job: Job;
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
  onViewJob: (job: Job) => void;
}

export const JobItem = memo<JobItemProps>(({ job, onDeleteJob, onEditJob, onViewJob }) => {
  return (
    <div className="card">
      <div className="ji-header">
        <h3 className="ji-title">{job.position}</h3>
        <span className={`badge badge--no-shrink badge--${job.status}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>

      <div className="ji-company-row">
        <Building2 size={16} />
        <span>{job.company}</span>
      </div>

      {job.interviewDate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.8rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px', width: 'fit-content' }}>
          <Clock size={14} />
          Scheduled: {new Date(job.interviewDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(job.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* Only render link if it's a safe http(s) URL */}
      {isSafeUrl(job.link) && (
        <div className="ji-link-row">
          <a href={job.link} target="_blank" rel="noopener noreferrer" className="ji-link">
            <ExternalLink size={14} /> Jooble Application Link
          </a>
        </div>
      )}

      {job.notes && (
        <div className="ji-notes">
          {job.notes}
        </div>
      )}

      <div className="ji-footer" style={{ marginTop: job.notes ? '0' : '1.5rem' }}>
        <div className="ji-date">
          <Clock size={14} />
          <span>{job.date}</span>
        </div>
        <div className="ji-actions">
          <button onClick={() => onViewJob(job)} className="btn ji-btn-view" title="View Details">
            View
          </button>
          <button onClick={() => onEditJob(job)} className="btn ji-btn-icon" title="Edit Application">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDeleteJob(job.id)} className="btn ji-btn-icon" title="Delete Application">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

JobItem.displayName = 'JobItem';
