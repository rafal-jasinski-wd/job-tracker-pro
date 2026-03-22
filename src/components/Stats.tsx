import React, { useMemo } from 'react';
import { Briefcase, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { Job } from '../types/job';

interface StatsProps {
  jobs: Job[];
}

export const Stats: React.FC<StatsProps> = ({ jobs }) => {
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      interview: jobs.filter(j => j.status === 'interview').length,
      offer: jobs.filter(j => j.status === 'offer').length,
      rejected: jobs.filter(j => j.status === 'rejected').length
    };
  }, [jobs]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
      <div className="card" style={{ padding: '1.25rem', borderBottom: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>Total Applications</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1' }}>{stats.total}</p>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Briefcase size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', borderBottom: '4px solid #eab308' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>Interviews</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1' }}>{stats.interview}</p>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, #eab308 10%, transparent)', borderRadius: '12px', color: '#eab308' }}>
            <Calendar size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', borderBottom: '4px solid #22c55e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>Offers</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1' }}>{stats.offer}</p>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)', borderRadius: '12px', color: '#22c55e' }}>
            <CheckCircle size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', borderBottom: '4px solid #ef4444' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>Rejected</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1' }}>{stats.rejected}</p>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, #ef4444 10%, transparent)', borderRadius: '12px', color: '#ef4444' }}>
            <XCircle size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
};
