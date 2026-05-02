import { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { JobForm } from './components/JobForm';
import { Toast } from './components/Toast';
import type { Job } from './types/job';
import { useFirestoreJobs } from './hooks/useFirestoreJobs';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './hooks/useTheme';
import { useHashRoute } from './hooks/useHashRoute';
import type { JoobleJob } from './services/joobleApi';
import { mapApiJobToJob } from './utils/mappers';
import { Footer } from './components/Footer';
import { AuthPage } from './pages/AuthPage';

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy loaded routes for bundle splitting
const TrackerPage = lazy(() => import('./pages/TrackerPage').then(module => ({ default: module.TrackerPage })));
const JobsPage = lazy(() => import('./pages/JobsPage').then(module => ({ default: module.JobsPage })));
const InsightsPage = lazy(() => import('./pages/InsightsPage').then(module => ({ default: module.InsightsPage })));
const SchedulePage = lazy(() => import('./pages/SchedulePage').then(module => ({ default: module.SchedulePage })));

function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useHashRoute();
  const [jobs, setJobs, jobsLoading] = useFirestoreJobs();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
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

  // Handle offline/online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Connection restored. Syncing data...');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('You are offline. Changes will sync when reconnected.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

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
      {isOffline && (
        <div style={{ backgroundColor: '#ef4444', color: 'white', textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
          You are currently offline. Changes are saved locally.
        </div>
      )}
      <Header theme={theme} onThemeChange={setTheme} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} onAddClick={openFormForNew} />

      <main>
        {jobsLoading ? (
            <div className="main-content empty-state empty-state--min-h-50">
              <p className="search-scanning-text">Syncing from cloud...</p>
            </div>
        ) : (
          <Suspense fallback={
            <div className="main-content empty-state empty-state--min-h-50" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
          }>
            {activeTab === 'tracker' ? (
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
          </Suspense>
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
