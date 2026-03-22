import React from 'react';
import { Building2, MapPin, DollarSign, Clock } from 'lucide-react';

const MOCK_JOBS = [
  { id: 1, company: 'Google', title: 'Senior Frontend Engineer', status: 'Interviewing', location: 'Mountain View, CA', salary: '$180k - $220k', date: '2 days ago' },
  { id: 2, company: 'Stripe', title: 'Fullstack Developer', status: 'Applied', location: 'Remote', salary: '$160k - $190k', date: '1 week ago' },
  { id: 3, company: 'Vercel', title: 'React Expert', status: 'Offer', location: 'Remote', salary: '$190k - $210k', date: '3 days ago' },
];

export const TrackerPage: React.FC = () => {
  return (
    <div className="main-content">
      <h1 className="page-title">Applications Tracker</h1>
      <p className="page-subtitle">Manage your active job applications and keep track of your progress.</p>
      
      <div className="jobs-grid">
        {MOCK_JOBS.map((job) => (
          <div key={job.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{job.title}</h3>
              <span className={`badge ${job.status === 'Offer' ? 'success' : job.status === 'Interviewing' ? 'warning' : ''}`}>
                {job.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              <Building2 size={16} />
              <span>{job.company}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              <DollarSign size={16} />
              <span>{job.salary}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} />
                <span>Applied {job.date}</span>
              </div>
              <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', backgroundColor: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
