import { useState, useRef, useEffect } from 'react';
import { Plus, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TabsProps {
  activeTab: 'tracker' | 'jobs' | 'schedule' | 'insights';
  onTabChange: (tab: 'tracker' | 'jobs' | 'schedule' | 'insights') => void;
  onAddClick?: () => void;
}

export const Tabs = ({ activeTab, onTabChange, onAddClick }: TabsProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { user, logout } = useAuth();

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (isMobileMenuOpen && tabsRef.current && event.target instanceof Node && !tabsRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleTabClick = (tab: 'tracker' | 'jobs' | 'schedule' | 'insights') => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="nav-tabs tabs-inner" ref={tabsRef} aria-label="Main navigation">
      <div className="mobile-menu-toggle">
        <button 
          className="btn btn--ghost mobile-toggle-btn" 
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
             e.preventDefault();
             setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          style={{ padding: '0.4rem', border: 'none' }}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`tabs-list ${isMobileMenuOpen ? 'mobile-open' : ''}`} role="tablist" aria-label="Application sections">
        <button
          role="tab"
          aria-selected={activeTab === 'tracker'}
          className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => handleTabClick('tracker')}
        >
          My Tracker
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'jobs'}
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => handleTabClick('jobs')}
        >
          Find Jobs
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'schedule'}
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => handleTabClick('schedule')}
        >
          Schedule
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'insights'}
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => handleTabClick('insights')}
        >
          Insights
        </button>
      </div>

      <div className="tabs-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn tabs-add-btn" onClick={() => { setIsMobileMenuOpen(false); onAddClick?.(); }} title="Add Application">
          <Plus size={16} /><span className="hide-on-mobile">Add Application</span>
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border)' }}>
            {user.photoURL && !avatarError ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="hide-on-mobile" 
                style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border)', objectFit: 'cover' }} 
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div 
                className="hide-on-mobile" 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold', 
                  border: '1px solid var(--border)'
                }}
              >
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <button 
              onClick={(e) => { e.preventDefault(); logout(); }} 
              className="btn btn--ghost" 
              title="Sign Out"
              style={{ padding: '0.4rem', border: 'none' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
