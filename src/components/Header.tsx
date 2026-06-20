import { memo } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import { JobTrackerLogo } from './JobTrackerLogo';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

/** Memoized — re-renders only when the active theme changes. */
export const Header = memo(({ theme, onThemeChange }: HeaderProps) => {
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
      <h1 className="logo">
        <JobTrackerLogo 
          className="header-logo" 
          width="42"
          height="42"
        />
        <span>JobTrackr Pro</span>
      </h1>
      <div className="header-actions">
        <button onClick={toggleTheme} className="theme-btn" title={`Theme: ${theme}`}>
          {getThemeIcon()}
        </button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
