import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { JobForm } from './components/JobForm';
import { Toast } from './components/Toast';
import type { Job } from './types/job';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import type { JoobleJob } from './services/joobleApi';
import { mapApiJobToJob } from './utils/mappers';
import { Footer } from './components/Footer';
import './index.css';

// Pages are lazy-loaded to reduce the initial JS bundle size
const TrackerPage = lazy(() => import('./pages/TrackerPage').then(m => ({ default: m.TrackerPage })));
const JobsPage    = lazy(() => import('./pages/JobsPage').then(m => ({ default: m.JobsPage })));

function App() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'jobs'>('tracker');
  const [jobs, setJobs] = useLocalStorage<Job[]>('jobtrackr_jobs', []);
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

  return (
    <div className="app-container">
      <Header theme={theme} onThemeChange={setTheme} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} onAddClick={openFormForNew} />

      {/* Show a blank shell while the page chunk loads */}
      <Suspense fallback={<div className="main-content empty-state empty-state--min-h-50" />}>
        {activeTab === 'tracker' ? (
          <TrackerPage
            jobs={jobs}
            onAddClick={openFormForNew}
            onDeleteJob={handleDeleteJob}
            onEditJob={openFormForEdit}
          />
        ) : (
          <JobsPage onSaveJob={handleSaveFromSearch} />
        )}
      </Suspense>

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
