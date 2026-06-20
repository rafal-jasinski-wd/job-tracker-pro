import { useState, useEffect, useCallback } from 'react';
import { type Tab, isTab } from '../types/job';

const DEFAULT_TAB: Tab = 'tracker';

const parseHash = (): Tab => {
  const hash = window.location.hash.replace('#', '');
  return isTab(hash) ? hash : DEFAULT_TAB;
};

/**
 * Lightweight hash-based routing hook.
 *
 * Syncs the active tab with the URL hash (e.g. `#jobs`, `#schedule`)
 * so users can:
 *  - Deep-link to a specific tab directly.
 *  - Use browser back/forward to navigate between tabs.
 *  - Share URLs that open on the correct tab.
 *
 * Falls back to `#tracker` for invalid or missing hashes.
 * Zero external dependencies — uses only the native `hashchange` event.
 */
export function useHashRoute(): [Tab, (tab: Tab) => void] {
  const [activeTab, setActiveTab] = useState<Tab>(parseHash);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(parseHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update the URL hash when the tab changes programmatically
  const setTab = useCallback((tab: Tab) => {
    // Use replaceState for the default tab to keep a clean URL,
    // pushState for everything else so back/forward works.
    if (tab === DEFAULT_TAB) {
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      window.history.pushState(null, '', `#${tab}`);
    }
    setActiveTab(tab);
  }, []);

  return [activeTab, setTab];
}
