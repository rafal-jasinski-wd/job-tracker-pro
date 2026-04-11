import { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { JobForm } from './components/JobForm';
import { Toast } from './components/Toast';
import type { Job } from './types/job';
import { useFirestoreJobs } from './hooks/useFirestoreJobs';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './hooks/useTheme';
import type { JoobleJob } from './services/joobleApi';
import { mapApiJobToJob } from './utils/mappers';
import { Footer } from './components/Footer';
import { AuthPage } from './pages/AuthPage';

// Static imports for production stability (resolves potential chunk loading issues)
import { TrackerPage } from './pages/TrackerPage';
import { JobsPage } from './pages/JobsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SchedulePage } from './pages/SchedulePage';

import './index.css';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'tracker' | 'jobs' | 'schedule' | 'insights'>('tracker');
  const [jobs, setJobs, jobsLoading] = useFirestoreJobs();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useTheme();

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Clear the toast timer when the component unmounts
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleSaveFromSearch = useCallback((joobleJob: JoobleJob) => {
    const newJob = mapApiJobToJob(joobleJob);
    setJobs((prevJobs: Job[]) => [newJob, ...prevJobs]);
    showToast('Job successfully saved to your tracker!');
  }, [setJobs, showToast]);

  const handleSaveJob = useCallback((job: Job) => {
    const isEditing = jobToEdit !== null;
    setJobs((prevJobs: Job[]) => {
      const index = prevJobs.findIndex(j => j.id === job.id);
      if (index >= 0) {
        const nextJobs = [...prevJobs];
        nextJobs[index] = job;
        return nextJobs;
      }
      return [job, ...prevJobs];
    });
    setIsFormOpen(false);
    setJobToEdit(null);
    showToast(isEditing ? 'Application updated successfully' : 'Application added successfully');
  }, [jobToEdit, setJobs, showToast]);

  const handleDeleteJob = useCallback((id: string) => {
    setJobs((prevJobs: Job[]) => prevJobs.filter((job: Job) => job.id !== id));
    showToast('Application removed');
  }, [setJobs, showToast]);

  const handleUpdateJob = useCallback((updatedJob: Job) => {
    setJobs((prevJobs: Job[]) => prevJobs.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    ));
  }, [setJobs]);

  const openFormForNew = useCallback(() => {
    setJobToEdit(null);
    setIsFormOpen(true);
  }, []);

  const openFormForEdit = useCallback((job: Job) => {
    setJobToEdit(job);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setJobToEdit(null);
  }, []);

  if (authLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading application...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="app-container">
      <Header theme={theme} onThemeChange={setTheme} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} onAddClick={openFormForNew} />

      <main>
        {jobsLoading ? (
            <div className="main-content empty-state empty-state--min-h-50">
              <p className="search-scanning-text">Syncing from cloud...</p>
            </div>
        ) : activeTab === 'tracker' ? (
          <TrackerPage
            jobs={jobs}
            onAddClick={openFormForNew}
            onDeleteJob={handleDeleteJob}
            onEditJob={openFormForEdit}
            onUpdateJob={handleUpdateJob}
          />
        ) : activeTab === 'schedule' ? (
          <SchedulePage jobs={jobs} />
        ) : activeTab === 'insights' ? (
          <InsightsPage jobs={jobs} />
        ) : (
          <JobsPage onSaveJob={handleSaveFromSearch} />
        )}
      </main>

      {isFormOpen && (
        <JobForm
          key={jobToEdit?.id || 'new'}
          initialData={jobToEdit || undefined}
          onSubmit={handleSaveJob}
          onCancel={closeForm}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
      <Footer />
    </div>
  );
}

export default App;
