import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { TrackerPage } from './pages/TrackerPage';
import { JobsPage } from './pages/JobsPage';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'jobs'>('tracker');

  return (
    <div className="app-container">
      <Header />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'tracker' ? <TrackerPage /> : <JobsPage />}
    </div>
  );
}

export default App;
