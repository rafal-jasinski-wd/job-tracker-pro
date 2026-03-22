import React from 'react';
import { Briefcase, Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  onAddClick?: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddClick, theme, onThemeChange }) => {
  const toggleTheme = () => {
    if (theme === 'light') onThemeChange('dark');
    else if (theme === 'dark') onThemeChange('system');
    else onThemeChange('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  return (
    <header className="header">
      <div className="logo">
        <Briefcase size={28} />
        <span>JobTrackr Pro</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={toggleTheme}
          style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.65rem', borderRadius: '50%', transition: 'all 0.2s', backgroundColor: 'var(--surface)' }}
          title={`Theme: ${theme}`}
        >
          {getThemeIcon()}
        </button>
        <button className="btn" onClick={onAddClick}>Add New Job</button>
      </div>
    </header>
  );
};
