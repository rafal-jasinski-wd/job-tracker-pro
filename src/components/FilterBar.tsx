import { memo } from 'react';
import { Search, Filter } from 'lucide-react';
import type { Job } from '../types/job';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: Job['status'] | 'all';
  onStatusFilterChange: (status: Job['status'] | 'all') => void;
}

/** Memoized — re-renders only when search query or status filter changes. */
export const FilterBar = memo(({ searchQuery, onSearchChange, statusFilter, onStatusFilterChange }: FilterBarProps) => {
  return (
    <div className="filter-bar">
      <div className="filter-search-wrap">
        <Search size={20} className="filter-search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or position..."
          className="filter-input"
        />
      </div>

      <div className="filter-select-wrap">
        <Filter size={18} color="var(--text-muted)" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as Job['status'] | 'all')}
          className="filter-select"
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
});

FilterBar.displayName = 'FilterBar';
