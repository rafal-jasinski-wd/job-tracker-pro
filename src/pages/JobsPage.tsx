import React from 'react';
import { Search, Briefcase, Filter } from 'lucide-react';

export const JobsPage: React.FC = () => {
  return (
    <div className="main-content">
      <h1 className="page-title">Find Jobs</h1>
      <p className="page-subtitle">Discover new opportunities matched to your profile.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search job titles, companies, or keywords..." 
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
          />
        </div>
        <button className="btn" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
          <Filter size={18} />
          Filters
        </button>
        <button className="btn">Search</button>
      </div>
      
      <div className="empty-state">
        <Briefcase size={48} className="empty-icon" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No matching jobs found</h3>
        <p style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>Try adjusting your search criteria or explore trending opportunities in your field.</p>
        <button className="btn">Clear Filters</button>
      </div>
    </div>
  );
};
