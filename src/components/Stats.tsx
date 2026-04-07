import { useMemo, memo } from 'react';
import { Briefcase, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { Job } from '../types/job';

interface StatsProps {
  jobs: Job[];
}

export const Stats = memo<StatsProps>(({ jobs }) => {
  const stats = useMemo(() => ({
    total: jobs.length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length
  }), [jobs]);

  return (
    <div className="stats-grid">
      <div className="card stat-card stat-card--total">
        <p className="stat-label">Total Applications</p>
        <div className="stat-body">
          <p className="stat-number">{stats.total}</p>
          <div className="stat-icon stat-icon--total">
            <Briefcase size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="card stat-card stat-card--interview">
        <p className="stat-label">Interviews</p>
        <div className="stat-body">
          <p className="stat-number">{stats.interview}</p>
          <div className="stat-icon stat-icon--interview">
            <Calendar size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="card stat-card stat-card--offer">
        <p className="stat-label">Offers</p>
        <div className="stat-body">
          <p className="stat-number">{stats.offer}</p>
          <div className="stat-icon stat-icon--offer">
            <CheckCircle size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="card stat-card stat-card--rejected">
        <p className="stat-label">Rejected</p>
        <div className="stat-body">
          <p className="stat-number">{stats.rejected}</p>
          <div className="stat-icon stat-icon--rejected">
            <XCircle size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
});

Stats.displayName = 'Stats';
