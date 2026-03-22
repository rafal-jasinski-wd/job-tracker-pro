import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { TrackerPage } from './pages/TrackerPage';
import { JobsPage } from './pages/JobsPage';
import { JobForm } from './components/JobForm';
import { Toast } from './components/Toast';
import type { Job } from './types/job';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'jobs'>('tracker');
  const [jobs, setJobs] = useLocalStorage<Job[]>('jobtrackr_jobs', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useTheme();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveJob = (job: Job) => {
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
    showToast(jobToEdit ? 'Application updated successfully' : 'Application added successfully');
    setJobToEdit(null);
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prevJobs: Job[]) => prevJobs.filter((job: Job) => job.id !== id));
    showToast('Application removed');
  };

  const openFormForNew = () => {
    setJobToEdit(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (job: Job) => {
    setJobToEdit(job);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setJobToEdit(null);
  };

  return (
    <div className="app-container">
      <Header onAddClick={openFormForNew} theme={theme} onThemeChange={setTheme} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'tracker' ? (
        <TrackerPage 
          jobs={jobs} 
          onAddClick={openFormForNew} 
          onDeleteJob={handleDeleteJob}
          onEditJob={openFormForEdit}
        />
      ) : (
        <JobsPage />
      )}

      {isFormOpen && (
        <JobForm 
          key={jobToEdit?.id || 'new'}
          initialData={jobToEdit || undefined}
          onSubmit={handleSaveJob} 
          onCancel={closeForm} 
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default App;
