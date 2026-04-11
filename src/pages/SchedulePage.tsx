import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Building2, Bell } from 'lucide-react';
import type { Job } from '../types/job';

interface SchedulePageProps {
  jobs: Job[];
}

export const SchedulePage = ({ jobs }: SchedulePageProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter jobs with interview dates
  const scheduledJobs = useMemo(() => {
    return jobs.filter(job => job.interviewDate);
  }, [jobs]);

  // Sort upcoming interviews (future only)
  const upcomingInterviews = useMemo(() => {
    const now = new Date();
    return scheduledJobs
      .filter(job => new Date(job.interviewDate!) >= now)
      .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime());
  }, [scheduledJobs]);

  // Calendar logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Padding for previous month days
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
       const jobsForDay = scheduledJobs.filter(job => {
         const jDate = new Date(job.interviewDate!);
         return jDate.getDate() === i && jDate.getMonth() === month && jDate.getFullYear() === year;
       });
       days.push({ day: i, jobs: jobsForDay });
    }

    return days;
  }, [year, month, scheduledJobs]);

  const formatInterviewTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatInterviewDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Interview Schedule</h1>
      <p className="page-subtitle">Manage your upcoming interviews and set reminders for preparation.</p>

      <div className="schedule-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Left Column: Calendar View */}
        <section className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CalendarIcon size={20} className="text-secondary" />
              {monthName} {year}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={prevMonth} className="btn btn--ghost" style={{ padding: '0.4rem' }}><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="btn btn--ghost" style={{ fontSize: '0.85rem' }}>Today</button>
              <button onClick={nextMonth} className="btn btn--ghost" style={{ padding: '0.4rem' }}><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="calendar-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ padding: '0.75rem', textAlign: 'center', backgroundColor: 'var(--bg-accent)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                {d}
              </div>
            ))}
            {calendarDays.map((d, index) => (
              <div key={index} style={{ 
                minHeight: '100px', 
                padding: '0.5rem', 
                borderRight: (index + 1) % 7 === 0 ? 'none' : '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                backgroundColor: !d ? 'var(--bg-dim)' : 'transparent',
                position: 'relative'
              }}>
                {d && (
                  <>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 500, 
                      color: d.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? 'var(--primary)' : 'inherit'
                    }}>
                      {d.day}
                    </span>
                    <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {d.jobs.map(job => (
                        <div key={job.id} style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.2rem 0.4rem', 
                          backgroundColor: 'rgba(56, 189, 248, 0.1)', 
                          color: 'var(--primary)',
                          borderRadius: '4px',
                          borderLeft: '2px solid var(--primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }} title={`${job.position} at ${job.company}`}>
                          {formatInterviewTime(job.interviewDate!)} {job.company}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Upcoming Sidebar */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bell size={18} className="text-secondary" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Upcoming Interviews</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingInterviews.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-accent)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No interviews scheduled.</p>
              </div>
            ) : (
              upcomingInterviews.map(job => (
                <div key={job.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{job.position}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {formatInterviewDate(job.interviewDate!)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Building2 size={13} />
                      <span>{job.company}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Clock size={13} />
                      <span>{formatInterviewTime(job.interviewDate!)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        .calendar-grid > div:nth-last-child(-n+7) {
          border-bottom: none;
        }
        @media (max-width: 1024px) {
          .schedule-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
