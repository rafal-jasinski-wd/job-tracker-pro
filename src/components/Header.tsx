import { memo } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

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
      <div className="logo">
        <img src="/jobtracker-logo.webp" alt="JobTrackr Pro Logo" className="header-logo" />
        <span>JobTrackr Pro</span>
      </div>
      <div className="header-actions">
        <button onClick={toggleTheme} className="theme-btn" title={`Theme: ${theme}`}>
          {getThemeIcon()}
        </button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
