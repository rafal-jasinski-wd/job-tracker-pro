import React from 'react';
import { Building2, Clock, Briefcase } from 'lucide-react';
import type { Job } from '../types/job';

interface TrackerPageProps {
  jobs: Job[];
  onAddClick?: () => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({ jobs, onAddClick }) => {
  return (
    <div className="main-content">
      <h1 className="page-title">Applications Tracker</h1>
      <p className="page-subtitle">Manage your active job applications and keep track of your progress.</p>
      
      {jobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} className="empty-icon" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No applications yet</h3>
          <p style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>Start tracking your job search by adding your first application.</p>
          <button className="btn" onClick={onAddClick}>Add Application</button>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{job.position}</h3>
                <span className={`badge ${job.status === 'offer' ? 'success' : job.status === 'interview' ? 'warning' : ''}`}>
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
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: job.notes ? '0' : '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} />
                  <span>{job.date}</span>
                </div>
                <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', backgroundColor: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
