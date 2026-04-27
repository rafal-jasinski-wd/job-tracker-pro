import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Job } from '../types/job';

interface InsightsProps {
  jobs: Job[];
}

export const InsightsPage = ({ jobs }: InsightsProps) => {
  // 1. Compute Funnel Breakdown
  const funnelData = useMemo(() => {
    let applied = 0;
    let interview = 0;
    let offer = 0;
    let rejected = 0;

    jobs.forEach(job => {
      if (job.status === 'applied') applied++;
      if (job.status === 'interview') interview++;
      if (job.status === 'offer') offer++;
      if (job.status === 'rejected') rejected++;
    });

    return [
      { name: 'Applied', value: applied, color: '#9ca3af' },
      { name: 'Interview', value: interview, color: '#eab308' },
      { name: 'Offer', value: offer, color: '#22c55e' },
      { name: 'Rejected', value: rejected, color: '#ef4444' }
    ].filter(v => v.value > 0);
  }, [jobs]);

  // 2. Compute 14 Day Velocity
  const velocityData = useMemo(() => {
    const map = new Map<string, number>();
    const d = new Date();
    d.setHours(0, 0, 0, 0);

    // Initialize last 14 days
    for (let i = 13; i >= 0; i--) {
      const past = new Date(d);
      past.setDate(past.getDate() - i);
      const str = `${past.getMonth() + 1}/${past.getDate()}`;
      map.set(str, 0);
    }

    jobs.forEach(job => {
      const jd = new Date(job.date);
      const str = `${jd.getMonth() + 1}/${jd.getDate()}`;
      if (map.has(str)) {
        map.set(str, map.get(str)! + 1);
      }
    });

    return Array.from(map.entries()).map(([date, apps]) => ({
      date,
      apps
    }));
  }, [jobs]);

  const upcomingInterviewCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return jobs.filter(j => j.interviewDate && new Date(j.interviewDate) >= today).length;
  }, [jobs]);

  const totalInterviews = funnelData.find(v => v.name === 'Interview')?.value || 0;
  const totalOffers = funnelData.find(v => v.name === 'Offer')?.value || 0;
  const metrics = [
    { label: 'Total Tracked', value: jobs.length },
    { label: 'Upcoming Interviews', value: upcomingInterviewCount },
    { label: 'Conversion to Interview', value: jobs.length ? Math.round((totalInterviews / jobs.length) * 100) + '%' : '0%' },
    { label: 'Total Offers', value: totalOffers }
  ];

  if (jobs.length === 0) {
    return (
      <div className="main-content empty-state empty-state--min-h-50">
        <p className="search-scanning-text">No data to analyze. Add some jobs first!</p>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ animation: 'fadeIn 0.3s ease', padding: '1rem' }}>
      
      <div className="insights-metrics-grid">
        {metrics.map((metric, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '2px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{metric.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{metric.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Status Funnel Pie Chart */}
        <div className="card" style={{ padding: '1rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', textAlign: 'center' }}>Application Funnel Breakdown</h2>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 14 Day Velocity Bar Chart */}
        <div className="card" style={{ padding: '1rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', textAlign: 'center' }}>14-Day Velocity Map</h2>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--border)', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="apps" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Applications Sent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
