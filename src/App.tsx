import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { TrackerPage } from './pages/TrackerPage';
import { JobsPage } from './pages/JobsPage';
import { JobForm } from './components/JobForm';
import type { Job } from './types/job';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'jobs'>('tracker');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddJob = (job: Job) => {
    setJobs(prevJobs => [job, ...prevJobs]);
    setIsFormOpen(false);
  };

  return (
    <div className="app-container">
      <Header onAddClick={() => setIsFormOpen(true)} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'tracker' ? (
        <TrackerPage jobs={jobs} onAddClick={() => setIsFormOpen(true)} />
      ) : (
        <JobsPage />
      )}

      {isFormOpen && (
        <JobForm 
          onSubmit={handleAddJob} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
