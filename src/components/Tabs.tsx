import React from 'react';

interface TabsProps {
  activeTab: 'tracker' | 'jobs';
  onTabChange: (tab: 'tracker' | 'jobs') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="nav-tabs">
      <button 
        className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
        onClick={() => onTabChange('tracker')}
      >
        My Tracker
      </button>
      <button 
        className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
        onClick={() => onTabChange('jobs')}
      >
        Find Jobs
      </button>
    </div>
  );
};
