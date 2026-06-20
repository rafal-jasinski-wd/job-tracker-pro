import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Building2, Bell } from 'lucide-react';
import type { Job } from '../types/job';
import {
  formatInterviewTime,
  formatInterviewDate,
  isToday,
  generateCalendarDays
} from '../utils/dateUtils';

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

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays = useMemo(() => {
    return generateCalendarDays(year, month, scheduledJobs);
  }, [year, month, scheduledJobs]);

  return (
    <div className="main-content">
      <h1 className="page-title">Interview Schedule</h1>
      <p className="page-subtitle">Manage your upcoming interviews and set reminders for preparation.</p>

      <div className="schedule-layout">
        
        {/* Left Column: Calendar View */}
        <section className="card schedule-calendar-card">
          <div className="schedule-cal-header">
            <h2 className="schedule-cal-title">
              <CalendarIcon size={20} className="text-secondary" />
              {monthName} {year}
            </h2>
            <div className="schedule-cal-nav">
              <button onClick={prevMonth} className="btn btn--ghost schedule-cal-nav-btn"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="btn btn--ghost schedule-cal-today-btn">Today</button>
              <button onClick={nextMonth} className="btn btn--ghost schedule-cal-nav-btn"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="calendar-day-header">
                {d}
              </div>
            ))}
            {calendarDays.map((d, index) => (
              <div
                key={index}
                className={`calendar-cell ${!d ? 'calendar-cell--empty' : ''}`}
                style={{
                  minWidth: 0,
                  padding: '0.5rem',
                  borderRight: (index + 1) % 7 === 0 ? 'none' : '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  position: 'relative'
                }}
              >
                {d && (
                  <>
                    <span 
                      className={`calendar-day-number ${isToday(d.day, month, year) ? 'calendar-day-number--today' : ''}`}
                      aria-label={`${monthName} ${d.day}, ${year}`}
                    >
                      {d.day}
                    </span>
                    <div className="calendar-events">
                      {d.jobs.map(job => (
                        <div key={job.id} className="calendar-event" title={`${job.position} at ${job.company}`}>
                          <span className="event-text">{formatInterviewTime(job.interviewDate!)} {job.company}</span>
                          <span className="event-icon"><Building2 size={10} /></span>
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
          <div className="schedule-sidebar-header">
            <Bell size={18} className="text-secondary" />
            <h3 className="schedule-sidebar-title">Upcoming Interviews</h3>
          </div>

          <div className="schedule-sidebar-list">
            {upcomingInterviews.length === 0 ? (
              <div className="card schedule-empty-card">
                <p className="schedule-empty-text">No interviews scheduled.</p>
              </div>
            ) : (
              upcomingInterviews.map(job => (
                <div key={job.id} className="card schedule-interview-card">
                  <div className="schedule-interview-top">
                    <h4 className="schedule-interview-position">{job.position}</h4>
                    <span className="schedule-interview-date-badge">
                      {formatInterviewDate(job.interviewDate!)}
                    </span>
                  </div>
                  <div className="schedule-interview-details">
                    <div className="schedule-interview-detail">
                      <Building2 size={13} />
                      <span>{job.company}</span>
                    </div>
                    <div className="schedule-interview-detail">
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

    </div>
  );
};
