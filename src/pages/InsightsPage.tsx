import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Job } from '../types/job';
import { computeFunnelData, computeVelocityData } from '../utils/insightsUtils';

interface InsightsProps {
  jobs: Job[];
}

export const InsightsPage = ({ jobs }: InsightsProps) => {
  // 1. Compute Funnel Breakdown
  const funnelData = useMemo(() => {
    return computeFunnelData(jobs);
  }, [jobs]);

  // 2. Compute 14 Day Velocity
  const velocityData = useMemo(() => {
    return computeVelocityData(jobs);
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
    <div className="main-content insights-page">
      
      <div className="insights-metrics-grid">
        {metrics.map((metric, i) => (
          <div key={i} className="card insights-metric-card">
            <div className="insights-metric-label">{metric.label}</div>
            <div className="insights-metric-value">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="insights-charts-grid">
        
        {/* Status Funnel Pie Chart */}
        <div className="card insights-chart-card">
          <h2 className="insights-chart-title">Application Funnel Breakdown</h2>
          <div className="insights-chart-body">
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
        <div className="card insights-chart-card">
          <h2 className="insights-chart-title">14-Day Velocity Map</h2>
          <div className="insights-chart-body">
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

