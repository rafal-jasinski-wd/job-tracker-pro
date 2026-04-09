import { Plus } from 'lucide-react';

interface TabsProps {
  activeTab: 'tracker' | 'jobs' | 'insights';
  onTabChange: (tab: 'tracker' | 'jobs' | 'insights') => void;
  onAddClick?: () => void;
}

export const Tabs = ({ activeTab, onTabChange, onAddClick }: TabsProps) => {
  return (
    <div className="nav-tabs tabs-inner">
      <div className="tabs-list">
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
        <button
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => onTabChange('insights')}
        >
          Insights
        </button>
      </div>
      <div>
        <button className="btn tabs-add-btn" onClick={onAddClick} title="Add Application">
          <Plus size={16} /> <span className="hide-on-mobile">Add Application</span>
        </button>
      </div>
    </div>
  );
};
