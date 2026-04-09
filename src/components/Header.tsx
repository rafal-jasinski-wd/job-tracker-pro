import { memo } from 'react';
import { Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

/** Memoized — re-renders only when the active theme changes. */
export const Header = memo(({ theme, onThemeChange }: HeaderProps) => {
  const { user, logout } = useAuth();

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
        <img src="/jobtracker-logo.png" alt="JobTrackr Pro Logo" className="header-logo" />
        <span>JobTrackr Pro</span>
      </div>
      <div className="header-actions">
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '1rem' }}>
            {user.photoURL && (
              <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)' }} />
            )}
            <button 
              onClick={logout} 
              className="theme-btn" 
              title="Sign Out"
              style={{ border: 'none', background: 'transparent' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
        <button onClick={toggleTheme} className="theme-btn" title={`Theme: ${theme}`}>
          {getThemeIcon()}
        </button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
