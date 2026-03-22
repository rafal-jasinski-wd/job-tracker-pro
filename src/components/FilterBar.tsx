import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { Job } from '../types/job';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: Job['status'] | 'all';
  onStatusFilterChange: (status: Job['status'] | 'all') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or position..." 
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface)', padding: '0 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <Filter size={18} color="var(--text-muted)" />
        <select 
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as Job['status'] | 'all')}
          style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', padding: '0.5rem', cursor: 'pointer' }}
        >
          <option value="all">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
};
