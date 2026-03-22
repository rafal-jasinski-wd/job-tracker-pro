import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Loader2 } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() && !location.trim()) return;
    
    setIsSearching(true);
    
    // Simulate a network search request
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1200);
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Find Jobs</h1>
      <p className="page-subtitle">Search and discover new career opportunities.</p>
      
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', overflow: 'visible' }}>
        <form 
          onSubmit={handleSearch} 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.25rem', 
            alignItems: 'end' 
          }}
        >
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Keywords</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skills, or company" 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or remote" 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', height: '46px' }}>
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', height: '100%', borderRadius: '10px', padding: '0 1.5rem', fontSize: '1rem' }} 
              disabled={isSearching}
            >
              {isSearching ? <Loader2 size={20} className="spinner" style={{ animation: 'spin 1.5s linear infinite' }} /> : 'Search Jobs'}
            </button>
          </div>
          
        </form>
      </div>
      
      {/* Results Container */}
      <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        {isSearching ? (
          <div className="empty-state" style={{ minHeight: '30vh' }}>
            <Loader2 size={40} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Scanning active job boards...</p>
          </div>
        ) : hasSearched ? (
          <div className="empty-state" style={{ minHeight: '30vh' }}>
            <Briefcase size={48} className="empty-icon" style={{ opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No matching jobs found</h3>
            <p style={{ maxWidth: '400px', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Try adjusting your search criteria, simplifying your keywords, or expanding your location scope.
            </p>
            <button className="btn" onClick={() => { setKeyword(''); setLocation(''); setHasSearched(false); }} style={{ backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="empty-state" style={{ minHeight: '30vh', borderStyle: 'solid', borderColor: 'transparent', backgroundColor: 'transparent' }}>
            <Briefcase size={48} className="empty-icon" style={{ opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Ready to find your next role?</h3>
            <p style={{ maxWidth: '400px', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Enter a keyword or location above to discover jobs tailored to your skills.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
