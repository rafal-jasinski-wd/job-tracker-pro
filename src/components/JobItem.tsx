import React from 'react';
import { Building2, Clock, Trash2, Pencil } from 'lucide-react';
import type { Job } from '../types/job';

interface JobItemProps {
  job: Job;
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
}

export const JobItem: React.FC<JobItemProps> = ({ job, onDeleteJob, onEditJob }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{job.position}</h3>
        <span className={`badge ${job.status}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
        <Building2 size={16} />
        <span>{job.company}</span>
      </div>
      
      {job.notes && (
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>{job.notes}</p>
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderTop: '1px solid var(--border)', 
        paddingTop: '1rem', 
        fontSize: '0.875rem', 
        color: 'var(--text-muted)', 
        marginTop: job.notes ? '0' : '1.5rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={14} />
          <span>{job.date}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onEditJob(job)}
            className="btn" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}
            title="Edit Application"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDeleteJob(job.id)}
            className="btn" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}
            title="Delete Application"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
